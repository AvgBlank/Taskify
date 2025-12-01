"use client";
import { useState, useEffect, useCallback } from "react";
import checkAuth from "@/lib/isAuthenticated";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LogOut, Plus, RefreshCw } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import "notyf/notyf.min.css";
import apiFetch from "../../lib/apiFetch";
import { useNotyf } from "@/hooks/useNotyf";
import Link from "next/link";

interface Task {
  id: string;
  title: string;
  priority: string;
  status: string;
  labels: { id?: string; name: string }[];
  createdAt: Date;
  updatedAt: Date;
}

interface EditingCreatingTask {
  id: string;
  title: string;
  priority: string;
  status: string;
  labels: string[];
}

interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateProject {
  name: string;
  description?: string;
}

const Dashboard = () => {
  // Tasks
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<EditingCreatingTask | null>(
    null,
  );
  const [creatingTask, setCreatingTask] = useState<EditingCreatingTask | null>(
    null,
  );
  const [name, setName] = useState<string>("");
  const [showCompleted, setShowCompleted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const notyf = useNotyf();

  // Pagination, Searching, Sorting and Filtering
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [sortOrder, setSortOrder] = useState("desc");

  // Projects
  const [projectsLoading, setProjectsLoading] = useState<boolean>(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [createProject, setCreateProject] = useState<CreateProject>({
    name: "",
    description: "",
  });

  const GetProjects = useCallback(async () => {
    setProjectsLoading(true);
    const response = await apiFetch("/api/projects");
    const result = await response.json();

    if (response.ok) {
      setProjectsLoading(false);
      return result;
    } else {
      if (result.err && result.err == "AuthError") {
        if (notyf) {
          notyf.error("Session expired. Please log in again.");
        }
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        console.error("Failed to fetch tasks");
        setProjectsLoading(false);
        return [];
      }
    }
  }, [notyf]);

  const GetTasks = useCallback(async () => {
    setLoading(true);
    setCurrentPage(1);
    const response = await apiFetch("/api/tasks");
    const result = await response.json();

    if (response.ok) {
      setTotalPages(Math.ceil(result.length / 10));
      setLoading(false);
      return result;
    } else {
      if (result.err && result.err == "AuthError") {
        if (notyf) {
          notyf.error("Session expired. Please log in again.");
        }
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        console.error("Failed to fetch tasks");
        setTotalPages(0);
        setLoading(false);
        return [];
      }
    }
  }, [notyf]);

  useEffect(() => {
    (async () => {
      const { valid, name } = await checkAuth();
      if (!valid) {
        window.location.href = "/login";
      } else {
        setName(name);
        GetTasks().then((data) => {
          setTasks(data);
        });
        GetProjects().then((data) => {
          setProjects(data);
        });
      }
    })();
  }, [GetTasks, GetProjects]);

  useEffect(() => {
    let data = [...tasks];

    if (searchQuery.trim()) {
      data = data.filter((t) =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    if (filterPriority !== "All") {
      data = data.filter((t) => t.priority === filterPriority);
    }
    if (filterStatus !== "All") {
      data = data.filter((t) => t.status === filterStatus);
    }
    data.sort((a, b) => {
      if (sortOrder === "asc") {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    Promise.resolve().then(() => {
      const pages = Math.ceil(data.length / 10);
      setTotalPages(pages);
      if (currentPage > pages && pages > 0) {
        setCurrentPage(1);
        return;
      }
      const start = (currentPage - 1) * 10;
      const end = start + 10;
      const paginated = data.slice(start, end);

      setFilteredTasks(paginated);
    });
  }, [
    tasks,
    currentPage,
    showCompleted,
    searchQuery,
    filterStatus,
    filterPriority,
    sortOrder,
  ]);

  const handleCreateProject = async (project: CreateProject) => {
    if (project.name.trim() === "") {
      if (notyf) {
        notyf.error("Project name is required");
      }
      return false;
    }

    const response = await apiFetch(`/api/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(project),
    });
    if (!response.ok) {
      const result = await response.json();
      if (result.err && result.err == "AuthError") {
        if (notyf) {
          notyf.error("Session expired. Please log in again.");
        }
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        if (notyf) {
          notyf.error("Failed to create project");
        }
      }
    } else {
      GetProjects().then(setProjects);
      return true;
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
    if (task.title.trim() === "") {
      if (notyf) {
        notyf.error("Task title is required");
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
    const response = await apiFetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const result = await response.json();
      if (result.err && result.err == "AuthError") {
        if (notyf) {
          notyf.error("Session expired. Please log in again.");
        }
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        if (notyf) {
          notyf.error("Failed to update task");
        }
      }
    } else {
      GetTasks().then(setTasks);
      return true;
    }
  };

  const CreateTask = async (task: EditingCreatingTask) => {
    if (task.title.trim() === "") {
      if (notyf) {
        notyf.error("Task title is required");
      }
      return false;
    }

    const payload = {
      ...task,
      labels: task.labels?.length > 0 ? task.labels : [],
    };
    const response = await apiFetch(`/api/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const result = await response.json();
      if (result.err && result.err == "AuthError") {
        if (notyf) {
          notyf.error("Session expired. Please log in again.");
        }
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        if (notyf) {
          notyf.error("Failed to create task");
        }
      }
    } else {
      GetTasks().then(setTasks);
      return true;
    }
  };

  const DeleteTask = async (task: Task) => {
    const response = await apiFetch(`/api/tasks/${task.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      const result = await response.json();
      if (result.err && result.err == "AuthError") {
        if (notyf) {
          notyf.error("Session expired. Please log in again.");
        }
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        if (notyf) {
          notyf.error("Failed to delete task");
        }
      }
    } else {
      GetTasks().then(setTasks);
    }
  };

  const handleLogout = async () => {
    await apiFetch("/api/auth/logout", {
      method: "DELETE",
    });
    window.location.href = "/login";
  };

  const getVisiblePages = (currentPage: number, totalPages: number) => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always show first page and last page.
    const pages = [1];

    // Window around the current page
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    if (start > 2) pages.push(0);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) pages.push(0);

    pages.push(totalPages);

    return pages;
  };

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

        <div className="flex flex-col lg:flex-row gap-5 justify-between items-center">
          <div className="grid grid-cols-2 sm:flex gap-2">
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-auto">
                <SelectValue placeholder="Filter Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">Priority</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-auto">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-auto">
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card className="w-full">
          <Dialog>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <CardTitle>Projects</CardTitle>
                  <CardDescription>Manage your projects here.</CardDescription>
                </div>
                {!projectsLoading && (
                  <div className="flex-1 flex flex-col sm:flex-row justify-center sm:justify-end gap-2 sm:gap-3">
                    <Button
                      variant="secondary"
                      onClick={() => {
                        GetProjects().then(setProjects);
                      }}
                      className="w-full sm:w-auto"
                    >
                      <RefreshCw className="sm:mr-2" />
                      Refresh Projects
                    </Button>
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => {
                          setCreateProject({ name: "", description: "" });
                        }}
                        className="w-full sm:w-auto"
                      >
                        <Plus className="sm:mr-2" />
                        Create Project
                      </Button>
                    </DialogTrigger>
                  </div>
                )}
              </div>
            </CardHeader>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Project</DialogTitle>
                <DialogDescription>
                  Enter the details for your new project. You can edit these
                  later.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-3">
                <div className="grid gap-2">
                  <label htmlFor="name">Project Name</label>
                  <Input
                    name="name"
                    id="name"
                    value={createProject.name}
                    onChange={(e) =>
                      setCreateProject({
                        ...createProject,
                        name: e.target.value,
                      })
                    }
                    placeholder="Project Name"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="description">Project Description</label>
                  <Input
                    name="description"
                    id="description"
                    value={createProject.description}
                    onChange={(e) =>
                      setCreateProject({
                        ...createProject,
                        description: e.target.value,
                      })
                    }
                    placeholder="Project Description (optional)"
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="ghost" size="sm">
                    Cancel
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button
                    onClick={() => handleCreateProject(createProject)}
                    className="mr-2"
                    size="sm"
                  >
                    Save Project
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <CardContent className="w-full">
            {projectsLoading ? (
              <div className="w-full flex items-center justify-center">
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
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 w-full">
                {projects?.map((project, idx) => (
                  <Link key={idx} href={`/projects/${project.id}`}>
                    <Card className="hover:bg-muted/50">
                      <CardHeader className="">
                        <CardTitle className="truncate">
                          {project.name}
                        </CardTitle>
                        <CardDescription className="truncate">
                          {project.description ?? "‎"}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <CardTitle>Tasks</CardTitle>
                <CardDescription>
                  Manage and track your tasks here.
                </CardDescription>
              </div>
              {!loading && (
                <div className="flex-1 flex flex-col sm:flex-row justify-center sm:justify-end gap-2 sm:gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      GetTasks().then(setTasks);
                    }}
                    className="w-full sm:w-auto"
                  >
                    <RefreshCw className="sm:mr-2" />
                    Refresh Tasks
                  </Button>
                  <Button
                    onClick={() => {
                      setCreatingTask({
                        id: "",
                        title: "",
                        priority: "Low",
                        status: "Pending",
                        labels: [],
                      });
                      setEditingTask(null);
                    }}
                    className="w-full sm:w-auto"
                  >
                    <Plus className="sm:mr-2" />
                    Create Task
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="w-full flex items-center justify-center">
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
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[25%]">Title</TableHead>
                    <TableHead className="w-[10%]">Priority</TableHead>
                    <TableHead className="w-[10%]">Status</TableHead>
                    <TableHead className="w-[25%]">Labels</TableHead>
                    <TableHead className="w-[15%] whitespace-nowrap">
                      Created At
                    </TableHead>
                    <TableHead className="w-[15%] text-right">
                      Actions
                    </TableHead>
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
                            setCreatingTask({
                              ...creatingTask,
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
                      <TableCell></TableCell>
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
                  {filteredTasks.map((task) => (
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
                                <SelectItem value="Pending">Pending</SelectItem>
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
                          <TableCell>
                            {new Date(task.createdAt).toLocaleString()}
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
                              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium border
                                ${
                                  task.priority === "High"
                                    ? "bg-red-100 text-red-700 border-red-800"
                                    : task.priority === "Medium"
                                      ? "bg-yellow-100 text-yellow-700 border-yellow-800"
                                      : "bg-green-100 text-green-700 border-green-800"
                                }`}
                            >
                              {task.priority}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium border
                                ${
                                  task.status === "Completed"
                                    ? "bg-green-100 text-green-700 border-green-800"
                                    : task.status === "In Progress"
                                      ? "bg-blue-100 text-blue-700 border-blue-800"
                                      : "bg-gray-100 text-gray-700 border-gray-800"
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
                                    className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 border border-blue-800"
                                  >
                                    {label.name}
                                  </span>
                                ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(task.createdAt).toLocaleString()}
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
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="w-full flex flex-col sm:flex-row justify-between">
        <Button
          variant="outline"
          onClick={() => setShowCompleted(!showCompleted)}
        >
          {showCompleted ? "Hide completed tasks" : "Show completed tasks"}
        </Button>

        <Pagination className="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem aria-disabled={currentPage === 1}>
              <PaginationPrevious
                onClick={() =>
                  currentPage > 1 && setCurrentPage(currentPage - 1)
                }
              >
                Previous
              </PaginationPrevious>
            </PaginationItem>
            <div className="hidden sm:flex">
              {getVisiblePages(currentPage, totalPages!).map((p, idx) => {
                if (p === 0) {
                  return (
                    <PaginationItem key={`ellipsis-${idx}`}>
                      <span className="px-2">…</span>
                    </PaginationItem>
                  );
                }

                return (
                  <PaginationItem key={p}>
                    <PaginationLink
                      isActive={currentPage === p}
                      onClick={() => setCurrentPage(p)}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
            </div>
            <div className="flex sm:hidden">
              <PaginationItem>
                <PaginationLink isActive={true}>{currentPage}</PaginationLink>
              </PaginationItem>
            </div>
            <PaginationItem aria-disabled={currentPage === totalPages}>
              <PaginationNext
                onClick={() =>
                  currentPage < totalPages! && setCurrentPage(currentPage + 1)
                }
              >
                Previous
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default Dashboard;
