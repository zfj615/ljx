import { AuthProvider } from './AuthContext'
import { useAuth } from './useAuth'
import Auth from './Auth'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import CourseList from './components/CourseList'
import { useState, lazy, Suspense } from 'react'

// 动态导入组件以减少初始加载时间
const CourseDetail = lazy(() => import('./components/CourseDetail'))
const CourseManagement = lazy(() => import('./components/CourseManagement'))
const LearningPage = lazy(() => import('./components/LearningPage'))
const Assessment = lazy(() => import('./components/Assessment'))
const AchievementPage = lazy(() => import('./components/AchievementPage'))

const AppContent = () => {
  const { user, loading, signOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return <Auth />
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* 导航栏 */}
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="text-xl font-bold text-indigo-600">课程平台</Link>
                <div className="hidden md:ml-10 md:flex md:space-x-8">
                  <Link to="/" className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                    课程列表
                  </Link>
                  <Link to="/management" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                    课程管理
                  </Link>
                  <Link to="/achievements" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                    成就徽章
                  </Link>
                </div>
              </div>
              <div className="flex items-center">
                <div className="md:hidden">
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                  >
                    <span className="sr-only">打开菜单</span>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
                <div className="hidden md:block">
                  <button
                    onClick={signOut}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    退出登录
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 移动端菜单 */}
          {mobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>
                  课程列表
                </Link>
                <Link to="/management" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>
                  课程管理
                </Link>
                <Link to="/achievements" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>
                  成就徽章
                </Link>
                <button
                  onClick={() => {
                    signOut()
                    setMobileMenuOpen(false)
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100"
                >
                  退出登录
                </button>
              </div>
            </div>
          )}
        </nav>

        {/* 路由内容 */}
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-2xl font-bold">加载中...</div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<CourseList />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/courses/:courseId/lessons/:lessonId" element={<LearningPage />} />
            <Route path="/courses/:courseId/assessment" element={<Assessment />} />
            <Route path="/management" element={<CourseManagement />} />
            <Route path="/achievements" element={<AchievementPage />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
