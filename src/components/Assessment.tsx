import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
}

const Assessment: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>()
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<number[]>([])
  const [score, setScore] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    // 模拟加载测评题目
    setTimeout(() => {
      setQuestions([
        {
          id: '1',
          question: 'JavaScript中，以下哪个不是原始数据类型？',
          options: ['Number', 'String', 'Object', 'Boolean'],
          correctAnswer: 2
        },
        {
          id: '2',
          question: 'React中，以下哪个钩子函数用于组件挂载后执行？',
          options: ['useState', 'useEffect', 'useContext', 'useReducer'],
          correctAnswer: 1
        },
        {
          id: '3',
          question: '以下哪个是ES6的新特性？',
          options: ['var', 'let和const', 'function', 'if语句'],
          correctAnswer: 1
        }
      ])
      setAnswers(new Array(3).fill(-1))
      setIsLoading(false)
    }, 500)
  }, [courseId])

  const handleAnswerChange = (questionIndex: number, answer: number) => {
    const newAnswers = [...answers]
    newAnswers[questionIndex] = answer
    setAnswers(newAnswers)
  }

  const submitAssessment = () => {
    if (answers.includes(-1)) {
      alert('请回答所有问题')
      return
    }

    const calculatedScore = questions.reduce((acc, question, index) => {
      return acc + (answers[index] === question.correctAnswer ? 1 : 0)
    }, 0)

    setScore(calculatedScore)
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-6">课程测评</h2>
          
          {score === null ? (
            <>
              {questions.map((question, index) => (
                <div key={question.id} className="mb-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-3">{index + 1}. {question.question}</h3>
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center">
                        <input
                          type="radio"
                          id={`q${index}_o${optionIndex}`}
                          name={`q${index}`}
                          value={optionIndex}
                          checked={answers[index] === optionIndex}
                          onChange={() => handleAnswerChange(index, optionIndex)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                        />
                        <label
                          htmlFor={`q${index}_o${optionIndex}`}
                          className="ml-2 block text-sm text-gray-700"
                        >
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button
                onClick={submitAssessment}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
              >
                提交测评
              </button>
            </>
          ) : (
            <div className="text-center py-8">
              <h3 className="text-xl sm:text-2xl font-bold mb-4">测评结果</h3>
              <p className="text-lg sm:text-xl mb-2">得分: {score} / {questions.length}</p>
              <p className={`text-base sm:text-lg ${score === questions.length ? 'text-green-600' : score >= questions.length * 0.6 ? 'text-yellow-600' : 'text-red-600'}`}>
                {score === questions.length ? '优秀！' : score >= questions.length * 0.6 ? '良好' : '需要加强学习'}
              </p>
              <button
                onClick={() => {
                  setScore(null)
                  setAnswers(new Array(questions.length).fill(-1))
                }}
                className="mt-6 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors w-full sm:w-auto"
              >
                重新测评
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Assessment