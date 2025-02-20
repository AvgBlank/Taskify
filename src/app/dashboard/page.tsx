"use client";

import { useState, useEffect } from "react";
import checkAuth from "@/lib/is-authenticated";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LogOut, Plus } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

interface Task {
  id: number;
  title: string;
  priority: string;
  status: string;
  labels: { id?: string; name: string }[];
}

interface EditingCreatingTask {
  id: number;
  title: string;
  priority: string;
  status: string;
  labels: string[];
}

const Dashboard = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<EditingCreatingTask | null>(
    null,
  );
  const [creatingTask, setCreatingTask] = useState<EditingCreatingTask | null>(
    null,
  );
  const [name, setName] = useState<string>("");
  const [showCompleted, setShowCompleted] = useState<boolean>(false);
  const [notyf, setNotyf] = useState<Notyf | null>(null);
  const properties: string[] = ["High", "Medium", "Low"];

  useEffect(() => {
    setNotyf(new Notyf());
  }, []);

  useEffect(() => {
    checkAuth().then((isAuthenticated) => {
      if (!isAuthenticated[0 as keyof typeof isAuthenticated]) {
        window.location.href = "/login";
      } else {
        setUserId(isAuthenticated[1 as keyof typeof isAuthenticated]);
        setName(isAuthenticated[2 as keyof typeof isAuthenticated]);
      }
    });
  }, []);

  useEffect(() => {
    if (userId !== null) {
      GetTasks(userId).then((data) => {
        setTasks(data);
      });
    }
  }, [userId]);

  const GetTasks = async (userId: string) => {
    const response = await fetch(`/api/tasks?userId=${userId}`, {
      method: "GET",
    });

    if (response.ok) {
      return await response.json();
    } else {
      console.error("Failed to fetch tasks");
      return [];
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const vals =
      e.target.name == "labels" ? e.target.value.split(" ") : e.target.value;

    if (editingTask) {
      setEditingTask({ ...editingTask, [e.target.name]: vals });
      setCreatingTask(null);
    } else if (creatingTask) {
      setCreatingTask({ ...creatingTask, [e.target.name]: vals });
      setEditingTask(null);
    }
  };

  const handleSave = async () => {
    if (editingTask) {
      if (await UpdateTask(editingTask)) {
        setEditingTask(null);
      }
    } else if (creatingTask) {
      if (await CreateTask(creatingTask)) {
        setCreatingTask(null);
      }
    }
  };

  const UpdateTask = async (task: EditingCreatingTask) => {
    if (task.title === "") {
      if (notyf) {
        notyf.error("Title is required");
      }
      return false;
    }

    const payload = {
      ...task,
      labels:
        task.labels?.length > 0 ||
        (task.labels?.length == 1 && task.labels[0] == "")
          ? task.labels
          : [],
    };
    console.log(payload);
    await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    GetTasks(userId!).then(setTasks);
    return true;
  };

  const CreateTask = async (task: EditingCreatingTask) => {
    if (task.title.trim() === "") {
      if (notyf) {
        notyf.error("Title is required");
      }
      return false;
    }

    const payload = {
      ...task,
      labels: task.labels?.length > 0 ? task.labels : [],
      userId,
    };
    await fetch(`/api/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    GetTasks(userId!).then(setTasks);
    return true;
  };

  const DeleteTask = async (task: Task) => {
    await fetch(`/api/tasks/${task.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    GetTasks(userId!).then(setTasks);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    });
    window.location.href = "/login";
  };

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
    );
  }

  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="flex flex-col space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {name}!</h1>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-background dark:hover:bg-red-400 dark:hover:text-background "
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Create Task Button Section */}
        <div className="flex justify-end">
          <Button
            onClick={() => {
              setCreatingTask({
                id: 0,
                title: "",
                priority: "Low",
                status: "Pending",
                labels: [],
              });
              setEditingTask(null);
            }}
            className="w-full sm:w-auto"
          >
            <Plus className="mr-2" />
            Create Task
          </Button>
        </div>

        {/* Rest of the Card component */}
        <Card>
          <CardHeader>
            <CardTitle>Tasks</CardTitle>
            <CardDescription>Manage and track your tasks here.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Labels</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {creatingTask && (
                  <TableRow>
                    <TableCell>
                      <Input
                        name="title"
                        value={creatingTask.title}
                        onChange={handleChange}
                        placeholder="Task title"
                      />
                    </TableCell>
                    <TableCell>
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
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
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
                          <SelectItem value="In Progress">
                            In Progress
                          </SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        name="labels"
                        value={creatingTask.labels.join(" ")}
                        onChange={handleChange}
                        placeholder="Add labels (optional)"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button onClick={handleSave} className="mr-2" size="sm">
                        Save
                      </Button>
                      <Button
                        onClick={() => setCreatingTask(null)}
                        variant="ghost"
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </TableCell>
                  </TableRow>
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
                      <TableRow key={task.id}>
                        {editingTask && editingTask.id === task.id ? (
                          // Editing mode
                          <>
                            <TableCell>
                              <Input
                                name="title"
                                value={editingTask.title}
                                onChange={handleChange}
                                placeholder="Task title"
                              />
                            </TableCell>
                            <TableCell>
                              <Select
                                name="priority"
                                value={editingTask.priority}
                                onValueChange={(value) =>
                                  setEditingTask({
                                    ...editingTask,
                                    priority: value,
                                  })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Low">Low</SelectItem>
                                  <SelectItem value="Medium">Medium</SelectItem>
                                  <SelectItem value="High">High</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Select
                                name="status"
                                value={editingTask.status}
                                onValueChange={(value) =>
                                  setEditingTask({
                                    ...editingTask,
                                    status: value,
                                  })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Pending">
                                    Pending
                                  </SelectItem>
                                  <SelectItem value="In Progress">
                                    In Progress
                                  </SelectItem>
                                  <SelectItem value="Completed">
                                    Completed
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Input
                                name="labels"
                                value={editingTask.labels.join(" ")}
                                onChange={handleChange}
                                placeholder="Add labels (optional)"
                              />
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                onClick={handleSave}
                                className="mr-2"
                                size="sm"
                              >
                                Save
                              </Button>
                              <Button
                                onClick={() => setEditingTask(null)}
                                variant="ghost"
                                size="sm"
                              >
                                Cancel
                              </Button>
                            </TableCell>
                          </>
                        ) : (
                          // View mode
                          <>
                            <TableCell>{task.title}</TableCell>
                            <TableCell>
                              <span
                                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
                                ${
                                  task.priority === "High"
                                    ? "bg-red-100 text-red-700"
                                    : task.priority === "Medium"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-green-100 text-green-700"
                                }`}
                              >
                                {task.priority}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span
                                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
                                ${
                                  task.status === "Completed"
                                    ? "bg-green-100 text-green-700"
                                    : task.status === "In Progress"
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {task.status}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                {task.labels
                                  .filter((val) => val && val.name.trim())
                                  .map((label, index) => (
                                    <span
                                      key={index}
                                      className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700"
                                    >
                                      {label.name}
                                    </span>
                                  ))}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="mr-2"
                                onClick={() => {
                                  setEditingTask({
                                    id: task.id,
                                    title: task.title,
                                    priority: task.priority,
                                    status: task.status,
                                    labels: task.labels.map((l) => l.name),
                                  });
                                  setCreatingTask(null);
                                }}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => DeleteTask(task)}
                              >
                                Delete
                              </Button>
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                    )),
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Button
        variant="outline"
        onClick={() => setShowCompleted(!showCompleted)}
      >
        {showCompleted ? "Hide completed tasks" : "Show completed tasks"}
      </Button>
    </div>
  );
};

export default Dashboard;
