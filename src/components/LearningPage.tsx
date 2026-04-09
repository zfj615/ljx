import React, { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { Controlled as CodeMirror } from 'react-codemirror2'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/monokai.css'
import 'codemirror/mode/javascript/javascript'
import { useAuth } from '../useAuth'
import { supabase } from '../supabase'

const LearningPage: React.FC = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>()
  const { user } = useAuth()
  const [lessonContent, setLessonContent] = useState<string>('')
  const [code, setCode] = useState<string>('')
  const [exercise, setExercise] = useState<{
    id: string
    description: string
    solution: string
    tests: string[]
  } | null>(null)
  const [feedback, setFeedback] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const fetchProgress = useCallback(async () => {
    if (!user || !courseId || !lessonId) return

    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .eq('lesson_id', lessonId)
        .single()

      if (error) {
        console.error('获取进度失败:', error)
        setIsLoading(false)
        return
      }

      console.log('进度获取成功:', data)
      if (data.code_submission) {
        setCode(data.code_submission)
      }
      if (data.test_results !== null) {
        setFeedback(data.test_results ? '✅ 所有测试通过！' : '❌ 部分测试未通过，请检查代码。')
      }
    } catch (error) {
      console.error('获取进度时出错:', error)
    } finally {
      setIsLoading(false)
    }
  }, [user, courseId, lessonId])

  const handleCodeChange = (_editor: unknown, _data: unknown, value: string) => {
    setCode(value)
  }

  useEffect(() => {
    // 模拟加载课程内容和练习
    setTimeout(() => {
      setLessonContent(`# 课程 ${courseId} - 第 ${lessonId} 课\n\n这是课程内容，包含理论知识和示例代码。\n\n## 知识点\n\n- 变量声明\n- 函数定义\n- 条件语句\n- 循环结构`)
      setExercise({
        id: '1',
        description: '编写一个函数，计算两个数的和并返回结果。',
        solution: 'function add(a, b) { return a + b; }',
        tests: [
          'add(1, 2) === 3',
          'add(5, 5) === 10',
          'add(-1, 1) === 0'
        ]
      })
      
      // 获取用户进度
      if (user && courseId && lessonId) {
        fetchProgress()
      } else {
        setIsLoading(false)
      }
    }, 500)
  }, [courseId, lessonId, user, fetchProgress])

  const runTests = () => {
    try {
      // 模拟测试运行
      const userFunction = new Function(code + '\nreturn add;')()
      const results = exercise?.tests.map((test) => {
        const testFunction = new Function('add', `return ${test}`)
        return testFunction(userFunction)
      })

      const allPassed = results?.every(result => result) || false
      if (allPassed) {
        setFeedback('✅ 所有测试通过！')
      } else {
        setFeedback('❌ 部分测试未通过，请检查代码。')
      }
      
      // 保存进度
      saveProgress(allPassed)
    } catch (error) {
      setFeedback('❌ 代码执行出错：' + (error as Error).message)
      // 保存进度（测试失败）
      saveProgress(false)
    }
  }

  const saveProgress = async (testResults: boolean) => {
    if (!user || !courseId || !lessonId) return

    try {
      const { data, error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          course_id: courseId,
          lesson_id: lessonId,
          completed: testResults,
          last_accessed: new Date().toISOString(),
          code_submission: code,
          test_results: testResults
        })
        .select()
        .single()

      if (error) {
        console.error('保存进度失败:', error)
        return
      }

      console.log('进度保存成功:', data)

      // 如果测试通过，检查徽章和成就
      if (testResults) {
        await checkBadgesAndAchievements()
      }
    } catch (error) {
      console.error('保存进度时出错:', error)
    }
  }

  const checkBadgesAndAchievements = async () => {
    if (!user) return

    try {
      // 计算用户已完成的课时数
      const { data: completedLessons } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('completed', true)

      const lessonsCompleted = completedLessons?.length || 0

      // 计算用户已完成的课程数
      const { data: completedCourses } = await supabase
        .rpc('get_completed_courses', { user_id_param: user.id })

      const coursesCompleted = completedCourses?.length || 0

      // 检查连续学习天数（简化版，实际项目中可能需要更复杂的逻辑）
      const streakDays = 1 // 简化处理，实际项目中需要计算连续天数

      // 检查徽章
      const { data: badges } = await supabase
        .from('badges')
        .select('*')

      if (badges) {
        for (const badge of badges) {
          let conditionMet = false

          switch (badge.condition_type) {
            case 'lessons_completed':
              conditionMet = lessonsCompleted >= badge.condition_value
              break
            case 'courses_completed':
              conditionMet = coursesCompleted >= badge.condition_value
              break
            case 'streak_days':
              conditionMet = streakDays >= badge.condition_value
              break
          }

          if (conditionMet) {
            // 检查用户是否已经获得该徽章
            const { data: existingBadge } = await supabase
              .from('user_badges')
              .select('*')
              .eq('user_id', user.id)
              .eq('badge_id', badge.id)
              .single()

            if (!existingBadge) {
              // 授予徽章
              await supabase
                .from('user_badges')
                .insert({
                  user_id: user.id,
                  badge_id: badge.id
                })
            }
          }
        }
      }

      // 检查成就
      const { data: achievements } = await supabase
        .from('achievements')
        .select('*')

      if (achievements) {
        for (const achievement of achievements) {
          let conditionMet = false

          // 根据成就名称判断条件
          switch (achievement.name) {
            case '第一个课时':
              conditionMet = lessonsCompleted >= 1
              break
            case '第一个课程':
              conditionMet = coursesCompleted >= 1
              break
            case '学习里程碑':
              conditionMet = lessonsCompleted >= 50
              break
            case '课程收集者':
              conditionMet = coursesCompleted >= 3
              break
            case '连续学习一周':
              conditionMet = streakDays >= 7
              break
            case '知识渊博':
              conditionMet = lessonsCompleted >= 100
              break
            case '课程大师':
              conditionMet = coursesCompleted >= 5
              break
            case '学习习惯':
              conditionMet = streakDays >= 30
              break
            case '学习专家':
              conditionMet = lessonsCompleted >= 200
              break
            case '终身学习者':
              conditionMet = streakDays >= 100
              break
          }

          if (conditionMet) {
            // 检查用户是否已经解锁该成就
            const { data: existingAchievement } = await supabase
              .from('user_achievements')
              .select('*')
              .eq('user_id', user.id)
              .eq('achievement_id', achievement.id)
              .single()

            if (!existingAchievement) {
              // 解锁成就
              await supabase
                .from('user_achievements')
                .insert({
                  user_id: user.id,
                  achievement_id: achievement.id
                })

              // 更新用户积分
              const { data: userPoints } = await supabase
                .from('user_points')
                .select('*')
                .eq('user_id', user.id)
                .single()

              if (userPoints) {
                await supabase
                  .from('user_points')
                  .update({
                    points: userPoints.points + achievement.points,
                    last_updated: new Date().toISOString()
                  })
                  .eq('user_id', user.id)
              } else {
                await supabase
                  .from('user_points')
                  .insert({
                    user_id: user.id,
                    points: achievement.points
                  })
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('检查徽章和成就时出错:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold">加载中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* 课程内容 */}
          <div>
            <div className="bg-white shadow rounded-lg p-6">
              <div className="prose max-w-none">
                {lessonContent.split('\n').map((line, index) => {
                  if (line.startsWith('# ')) {
                    return <h1 key={index}>{line.substring(2)}</h1>
                  } else if (line.startsWith('## ')) {
                    return <h2 key={index}>{line.substring(3)}</h2>
                  } else if (line.startsWith('- ')) {
                    return <li key={index}>{line.substring(2)}</li>
                  } else {
                    return <p key={index}>{line}</p>
                  }
                })}
              </div>
            </div>
          </div>

          {/* 代码练习 */}
          <div>
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">代码练习</h3>
              <p className="mb-4">{exercise?.description}</p>
              <div className="mb-4">
                <CodeMirror
                  value={code}
                  options={{
                    mode: 'javascript',
                    theme: 'monokai',
                    lineNumbers: true,
                    lineWrapping: true
                  }}
                  onBeforeChange={handleCodeChange}
                />
              </div>
              <button
                onClick={runTests}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
              >
                运行测试
              </button>
              {feedback && (
                <div className="mt-4 p-3 rounded-md bg-gray-100">
                  {feedback}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LearningPage