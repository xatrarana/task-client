
import { useState } from "react"
import type { Task } from "../types"
import { useTask } from "../context/TaskContext"
import { CheckCircle, Circle, Trash2 } from "react-feather"

interface TaskItemProps {
  task: Task
}

const TaskItem = ({ task }: TaskItemProps) => {
  const { deleteTask, toggleTaskCompletion } = useTask()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isToggling, setIsToggling] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteTask(task.id)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleToggle = async () => {
    setIsToggling(true)
    try {
      await toggleTaskCompletion(task)
    } finally {
      setIsToggling(false)
    }
  }

  return (
    <li className="py-4 flex items-center justify-between">
      <div className="flex items-center">
      <button
  onClick={handleToggle}
  disabled={isToggling}
  className="mr-3 flex-shrink-0 text-gray-400 hover:text-green-500 focus:outline-none"
>
  {task.status === "completed" ? (
    <CheckCircle className="h-5 w-5 text-green-500" />
  ) : (
    <Circle className="h-5 w-5" />
  )}
</button>
<span className={`text-sm ${task.status === "completed" ? "line-through text-gray-500" : "text-gray-900"}`}>
  {task.title}
</span>

      </div>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="ml-2 text-gray-400 hover:text-red-500 focus:outline-none"
      >
        <Trash2 className="h-5 w-5" />
        <span className="sr-only">Delete task</span>
      </button>
    </li>
  )
}

export default TaskItem
