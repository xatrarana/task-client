
import type React from "react"

import { useState } from "react"
import { useTask } from "../context/TaskContext"

const TaskForm = () => {
  const [title, setTitle] = useState("")
  const { addTask, loading } = useTask()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    try {
      await addTask(title)
      setTitle("")
    } catch (err) {
      // Error is handled in the context
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new task..."
        className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading || !title.trim()}
        className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:bg-green-300"
      >
        {loading ? "Adding..." : "Add"}
      </button>
    </form>
  )
}

export default TaskForm
