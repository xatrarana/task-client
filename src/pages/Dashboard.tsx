import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useTask } from "../context/TaskContext"
import TaskForm from "../components/TaskForm"
import TaskItem from "../components/TaskItem"


const Dashboard = () => {
  const { user, logout } = useAuth()
  const { tasks, fetchTasks, loading, error } = useTask()

  const navigate = useNavigate()
  

  useEffect(() => {
    fetchTasks()
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Tasky</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">Welcome, {user?.username}</span>
            <button
              onClick={handleLogout}
              className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium leading-6 text-gray-900">Tasks</h2>
              <div className="mt-4">
                <TaskForm />
              </div>
              <div className="mt-6">
                {loading ? (
                  <p className="text-gray-500">Loading tasks...</p>
                ) : error ? (
                  <p className="text-red-500">{error}</p>
                ) : (tasks && tasks.length === 0) ? (
                  <p className="text-gray-500">No tasks yet. Add one above!</p>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {tasks && tasks.length > 0 && tasks.map((task) => (
                      <TaskItem key={task.id} task={task} />
                    ))}
                  </ul>
                )}
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
