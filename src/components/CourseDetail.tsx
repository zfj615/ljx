import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

interface Lesson {
  id: string
  title: string
  duration: string
}

interface Course {
  id: string
  title: string
  description: string
  lessons: Lesson[]
  instructor: string
  level: string
  duration: string
}

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [course, setCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    // 模拟加载课程详情
    setTimeout(() => {
      setCourse({
        id: id || '1',
        title: 'JavaScript基础',
        description: '本课程将介绍JavaScript的基本概念和语法，包括变量、函数、条件语句、循环结构等内容。通过本课程的学习，你将掌握JavaScript的核心知识点，为后续的前端开发打下坚实的基础。',
        lessons: [
          { id: '1', title: 'JavaScript简介', duration: '30分钟' },
          { id: '2', title: '变量和数据类型', duration: '45分钟' },
          { id: '3', title: '函数定义和调用', duration: '40分钟' },
          { id: '4', title: '条件语句', duration: '35分钟' },
          { id: '5', title: '循环结构', duration: '30分钟' },
          { id: '6', title: '数组和对象', duration: '45分钟' },
          { id: '7', title: 'DOM操作', duration: '50分钟' },
          { id: '8', title: '事件处理', duration: '40分钟' },
          { id: '9', title: '异步编程', duration: '55分钟' },
          { id: '10', title: '课程总结', duration: '25分钟' }
        ],
        instructor: '张老师',
        level: '初级',
        duration: '6小时30分钟'
      })
      setIsLoading(false)
    }, 500)
  }, [id])

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
        {course && (
          <>
            <div className="bg-white shadow rounded-lg p-6 mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold mb-4">{course.title}</h1>
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="bg-gray-100 text-gray-800 py-1 px-3 rounded-full text-sm">{course.level}</span>
                <span className="bg-gray-100 text-gray-800 py-1 px-3 rounded-full text-sm">{course.duration}</span>
                <span className="bg-gray-100 text-gray-800 py-1 px-3 rounded-full text-sm">{course.instructor}</span>
              </div>
              <p className="text-gray-600 mb-6">{course.description}</p>
              <div className="flex flex-col space-y-3">
                <Link
                  to={`/courses/${course.id}/lessons/1`}
                  className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 transition-colors text-center"
                >
                  开始学习
                </Link>
                <Link
                  to={`/courses/${course.id}/assessment`}
                  className="bg-gray-200 text-gray-800 py-2 px-6 rounded-md hover:bg-gray-300 transition-colors text-center"
                >
                  课程测评
                </Link>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4">课程大纲</h2>
              <div className="space-y-4">
                {course.lessons.map(lesson => (
                  <Link
                    key={lesson.id}
                    to={`/courses/${course.id}/lessons/${lesson.id}`}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors gap-2"
                  >
                    <div>
                      <h3 className="font-semibold">第 {lesson.id} 课: {lesson.title}</h3>
                    </div>
                    <span className="text-gray-500">{lesson.duration}</span>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default CourseDetail