"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { Plus, Pencil, Trash2, LogOut, User } from "lucide-react"
import { Notyf } from "notyf"
import "notyf/notyf.min.css"
import Image from "next/image"
import { useTheme } from "next-themes"
import checkAuth from "@/lib/is-authenticated"

interface Task {
  id: number
  title: string
  priority: string
  status: string
}

export default function Dashboard() {
  const [notyf, setNotyf] = useState<Notyf | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [creatingTask, setCreatingTask] = useState<Task | null>(null)
  const [name, setName] = useState<string>("")
  const [showCompleted, setShowCompleted] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const properties: string[] = ["High", "Medium", "Low"]
  const { resolvedTheme } = useTheme()
  const [user, setUser] = useState<{ image?: string; email?: string } | null>(null)

  useEffect(() => {
    setNotyf(new Notyf())
  }, [])

  useEffect(() => {
    checkAuth().then((isAuthenticated) => {
      if (!isAuthenticated[0 as keyof typeof isAuthenticated]) {
        window.location.href = "/login"
      } else {
        setUserId(isAuthenticated[1 as keyof typeof isAuthenticated])
        setName(isAuthenticated[2 as keyof typeof isAuthenticated])
      }
    })
  }, [])

  useEffect(() => {
    if (userId !== null) {
      GetTasks(userId).then(setTasks)
    }
  }, [userId])

  if (!userId) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="animate-spin fill-black dark:fill-white"
          width="32"
          height="32"
          viewBox="0 0 256 256"
        >
          <path d="M236,128a108,108,0,0,1-216,0c0-42.52,24.73-81.34,63-98.9A12,12,0,1,1,93,50.91C63.24,64.57,44,94.83,44,128a84,84,0,0,0,168,0c0-33.17-19.24-63.43-49-77.09A12,12,0,1,1,173,29.1C211.27,46.66,236,85.48,236,128Z"></path>
        </svg>
      </div>
    )
  }

  const GetTasks = async (userId: string) => {
    try {
      const response = await fetch(`/api/tasks?userId=${userId}`)
      if (!response.ok) throw new Error("Failed to fetch tasks")
      return await response.json()
    } catch (error) {
      if (notyf) {
        notyf.error("Failed to fetch tasks")
      }
      return []
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const task = editingTask || creatingTask
    if (task) {
      const updatedTask = { ...task, [e.target.name]: e.target.value }
      editingTask ? setEditingTask(updatedTask) : setCreatingTask(updatedTask)
    }
  }

  const handleSave = async () => {
    const task = editingTask || creatingTask
    if (!task?.title) {
      if (notyf) {
        notyf.error("Title is required")
      }
      return
    }

    try {
      if (editingTask) {
        await UpdateTask(editingTask)
        setEditingTask(null)
      } else if (creatingTask) {
        await CreateTask(creatingTask)
        setCreatingTask(null)
      }
      if (notyf) {
        notyf.success(`Task ${editingTask ? "updated" : "created"} successfully`)
      }
    } catch (error) {
      if (notyf) {
        notyf.error(`Failed to ${editingTask ? "update" : "create"} task`)
      }
    }
  }

  const UpdateTask = async (task: Task) => {
    const response = await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    })
    if (!response.ok) throw new Error("Failed to update task")
    await GetTasks(userId!).then(setTasks)
  }

  const CreateTask = async (task: Task) => {
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...task, userId }),
    })
    if (!response.ok) throw new Error("Failed to create task")
    await GetTasks(userId!).then(setTasks)
  }

  const DeleteTask = async (task: Task) => {
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      })
      if (!response.ok) throw new Error("Failed to delete task")
      await GetTasks(userId!).then(setTasks)
      if (notyf) {
        notyf.success("Task deleted successfully")
      }
    } catch (error) {
      if (notyf) {
        notyf.error("Failed to delete task")
      }
    }
  }

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })
      
      if (response.ok) {
        window.location.href = '/login'
      } else {
        if (notyf) {
          notyf.error('Failed to logout')
        }
      }
    } catch (error) {
      if (notyf) {
        notyf.error('Failed to logout')
      }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4">
          <Image
            src={resolvedTheme === "dark" ? "/taskify-light.svg" : "/taskify-dark.svg"}
            alt="Taskify Logo"
            width={128}
            height={32}
            priority
          />
          <div className="ml-auto flex items-center space-x-4">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  {user?.image ? (
                    <Image
                      src={user.image}
                      alt={name || ""}
                      fill
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuItem className="flex-col items-start">
                  <div className="text-sm font-medium">{name}</div>
                  <div className="text-xs text-muted-foreground">
                    {user?.email}
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600 dark:text-red-400 cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="container py-8 px-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Tasks</CardTitle>
            {!creatingTask && (
              <Button
                onClick={() => {
                  setCreatingTask({
                    id: 0,
                    title: "",
                    priority: "Low",
                    status: "Pending",
                  })
                  setEditingTask(null)
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-4 text-left font-medium">Title</th>
                    <th className="p-4 text-left font-medium">Priority</th>
                    <th className="p-4 text-left font-medium">Status</th>
                    <th className="p-4 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {creatingTask && (
                    <tr className="border-b">
                      <td className="p-4">
                        <Input
                          name="title"
                          value={creatingTask.title}
                          onChange={handleChange}
                          placeholder="Task title"
                        />
                      </td>
                      <td className="p-4">
                        <Select
                          name="priority"
                          value={creatingTask.priority}
                          onValueChange={(value) =>
                            setCreatingTask({ ...creatingTask, priority: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            {properties.map((priority) => (
                              <SelectItem key={priority} value={priority}>
                                {priority}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-4">
                        <Select
                          name="status"
                          value={creatingTask.status}
                          onValueChange={(value) =>
                            setCreatingTask({ ...creatingTask, status: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <Button onClick={handleSave} variant="default">
                            Save
                          </Button>
                          <Button
                            onClick={() => setCreatingTask(null)}
                            variant="outline"
                          >
                            Cancel
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )}

                  {properties.map((property) =>
                    tasks
                      .filter(
                        (task) =>
                          (showCompleted
                            ? task.status === "Completed"
                            : task.status !== "Completed") &&
                          task.priority === property,
                      )
                      .map((task) => (
                        <tr key={task.id} className="border-b">
                          <td className="p-4">
                            {editingTask?.id === task.id ? (
                              <Input
                                name="title"
                                value={editingTask.title}
                                onChange={handleChange}
                              />
                            ) : (
                              task.title
                            )}
                          </td>
                          <td className="p-4">
                            {editingTask?.id === task.id ? (
                              <Select
                                name="priority"
                                value={editingTask.priority}
                                onValueChange={(value) =>
                                  setEditingTask({ ...editingTask, priority: value })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {properties.map((priority) => (
                                    <SelectItem key={priority} value={priority}>
                                      {priority}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              task.priority
                            )}
                          </td>
                          <td className="p-4">
                            {editingTask?.id === task.id ? (
                              <Select
                                name="status"
                                value={editingTask.status}
                                onValueChange={(value) =>
                                  setEditingTask({ ...editingTask, status: value })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Pending">Pending</SelectItem>
                                  <SelectItem value="In Progress">
                                    In Progress
                                  </SelectItem>
                                  <SelectItem value="Completed">
                                    Completed
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              task.status
                            )}
                          </td>
                          <td className="p-4">
                            {editingTask?.id === task.id ? (
                              <div className="flex space-x-2">
                                <Button onClick={handleSave} variant="default">
                                  Save
                                </Button>
                                <Button
                                  onClick={() => setEditingTask(null)}
                                  variant="outline"
                                >
                                  Cancel
                                </Button>
                              </div>
                            ) : (
                              <div className="flex space-x-2">
                                <Button
                                  onClick={() => {
                                    setEditingTask(task)
                                    setCreatingTask(null)
                                  }}
                                  variant="outline"
                                  size="icon"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  onClick={() => DeleteTask(task)}
                                  variant="destructive"
                                  size="icon"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </td>
                        </tr>
                      )),
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-end">
              <Button
                variant="outline"
                onClick={() => setShowCompleted(!showCompleted)}
              >
                {showCompleted ? "Hide completed tasks" : "Show completed tasks"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
