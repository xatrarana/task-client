export interface Task {
    id: number
    title: string
    status: "completed" | "pending"
    userId: number
    createdAt: Date
    updatedAt: Date
  }
  
  export interface User {
    id: number
    username: string
  }
  