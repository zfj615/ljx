import React, { useState } from 'react'

interface Course {
  id: string
  title: string
  description: string
  lessons: number
}

const CourseManagement: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([
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
  const [isAdding, setIsAdding] = useState<boolean>(false)
  const [newCourse, setNewCourse] = useState<Omit<Course, 'id'>>({
    title: '',
    description: '',
    lessons: 0
  })

  const handleAddCourse = () => {
    if (newCourse.title && newCourse.description && newCourse.lessons > 0) {
      const course: Course = {
        id: (courses.length + 1).toString(),
        ...newCourse
      }
      setCourses([...courses, course])
      setNewCourse({ title: '', description: '', lessons: 0 })
      setIsAdding(false)
    }
  }

  const handleDeleteCourse = (id: string) => {
    setCourses(courses.filter(course => course.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">课程管理</h1>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors w-full sm:w-auto text-center"
          >
            {isAdding ? '取消' : '添加课程'}
          </button>
        </div>

        {isAdding && (
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">添加课程</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">课程标题</label>
                <input
                  type="text"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">课程描述</label>
                <textarea
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">课时数</label>
                <input
                  type="number"
                  value={newCourse.lessons}
                  onChange={(e) => setNewCourse({ ...newCourse, lessons: parseInt(e.target.value) })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  min="1"
                />
              </div>
              <button
                onClick={handleAddCourse}
                className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
              >
                保存课程
              </button>
            </div>
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">课程列表</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">课程ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">课程标题</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">描述</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">课时数</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {courses.map(course => (
                  <tr key={course.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{course.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{course.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{course.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.lessons}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseManagement