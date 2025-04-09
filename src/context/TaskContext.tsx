import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { Task } from "../types"
import { useAuth } from "./AuthContext"
import { api } from "../services/api"
import { AxiosError } from "axios"


interface TaskContextType {
  tasks: Task[]
  fetchTasks: () => Promise<void>
  addTask: (title: string) => Promise<void>
  deleteTask: (id: number) => Promise<void>
  toggleTaskCompletion: (task: Task) => Promise<void>
  loading: boolean
  error: string | null
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export const useTask = () => {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error("useTask must be used within a TaskProvider")
  }
  return context
}

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { isAuthenticated } = useAuth()

  const fetchTasks = async () => {
    if (!isAuthenticated) return

    setLoading(true)
    setError(null)
    try {
      const response = await api.get("/api/tasks")
      setTasks(response.data)
    } catch (err: any) {
      if(err instanceof AxiosError){
        setError(err.response?.data)
      }
      setError(err.message || "Failed to fetch tasks")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks()
    } else {
      setTasks([])
    }
  }, [isAuthenticated])

  const addTask = async (title: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.post("/api/tasks", { title })
      setTasks([...tasks, response.data])
    } catch (err: any) {
      setError(err.message || "Failed to add task")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteTask = async (id: number) => {
    setLoading(true)
    setError(null)
    try {
      await api.delete(`/api/tasks/${id}`)
      setTasks(tasks.filter((task) => task.id !== id))
    } catch (err: any) {
      setError(err.message || "Failed to delete task")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const toggleTaskCompletion = async (task: Task) => {
    setLoading(true)
    setError(null)
    try {
      const updatedTask = { ...task, status: task.status === "pending" ? "completed" : "pending" };
     await api.patch(`/api/tasks/tasks/${task.id}/toggle`, updatedTask)

     setTasks((prevTasks) =>
      prevTasks.map((t) => 
        t.id === task.id 
          ? { ...t, status: updatedTask.status as "completed" | "pending" } 
          : t
      )
    );
    
    
    } catch (err: any) {
      setError(err.message || "Failed to update task")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const value = {
    tasks,
    fetchTasks,
    addTask,
    deleteTask,
    toggleTaskCompletion,
    loading,
    error,
  }

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}
