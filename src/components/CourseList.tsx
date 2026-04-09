import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface Course {
  id: string
  title: string
  description: string
  lessons: number
}

const CourseList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    // 模拟加载课程列表
    setTimeout(() => {
      setCourses([
        {
          id: '1',
          title: 'JavaScript基础',
          description: '学习JavaScript的基本概念和语法',
          lessons: 10
        },
        {
          id: '2',
          title: 'React入门',
          description: '学习React框架的基本使用',
          lessons: 8
        },
        {
          id: '3',
          title: 'Node.js开发',
          description: '学习Node.js后端开发',
          lessons: 12
        }
      ])
      setIsLoading(false)
    }, 500)
  }, [])

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
        <h1 className="text-3xl font-bold mb-8">课程列表</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course.id} className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-bold mb-2">{course.title}</h2>
              <p className="text-gray-600 mb-4">{course.description}</p>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <span className="text-sm text-gray-500">{course.lessons} 课时</span>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                  <Link
                    to={`/courses/${course.id}`}
                    className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors w-full sm:w-auto text-center"
                  >
                    查看详情
                  </Link>
                  <Link
                    to={`/courses/${course.id}/lessons/1`}
                    className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors w-full sm:w-auto text-center"
                  >
                    开始学习
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CourseList