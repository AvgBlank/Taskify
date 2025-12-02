"use client";
import { useParams } from "next/navigation";
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
import { ArrowLeft, LogOut, Plus, RefreshCw, Trash } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import "notyf/notyf.min.css";
import apiFetch from "@/lib/apiFetch";
import { useNotyf } from "@/hooks/useNotyf";
import { useRouter } from "next/navigation";

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

const Project = () => {
  const { projectId } = useParams();

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
  const notyf = useNotyf();
  const router = useRouter();

  // Pagination, Searching, Sorting and Filtering
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [sortOrder, setSortOrder] = useState("desc");
  const [project, setProject] = useState<{ name: string; description: string }>(
    { name: "", description: "" },
  );

  const getTasks = useCallback(
    async (filters: {
      searchQuery?: string;
      status?: string;
      priority?: string;
      order?: "asc" | "desc";
      skip?: number;
      currentPage?: number;
    }) => {
      setLoading(true);
      console.log(filters);
      const params = new URLSearchParams({
        projectId: projectId as string,
        searchQuery: filters.searchQuery ?? "",
        status: filters.status ?? "",
        priority: filters.priority ?? "",
        order: filters.order ?? "desc",
        skip: filters.skip?.toString() ?? "0",
      });

      const response = await apiFetch(`/api/tasks?${params.toString()}`);
      const result = await response.json();

      if (response.ok) {
        setTotalPages(result[1]);
        setLoading(false);
        setTasks(result[0]);
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
          setTasks([]);
        }
      }
    },
    [notyf, projectId],
  );

  const getProject = useCallback(async () => {
    setLoading(true);
    const response = await apiFetch(`/api/projects/${projectId}`);
    const result = await response.json();

    if (response.ok) {
      setProject({ name: result.name, description: result.description });
      setLoading(false);
    } else {
      if (result.err && result.err == "AuthError") {
        if (notyf) {
          notyf.error("Session expired. Please log in again.");
        }
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        console.error("Failed to fetch project");
        setLoading(false);
      }
    }
  }, [notyf, projectId]);

  useEffect(() => {
    (async () => {
      const { valid, name } = await checkAuth();
      if (!valid) {
        window.location.href = "/login";
      } else {
        setName(name);
        getTasks({});
        getProject();
      }
    })();
  }, [getTasks, getProject]);

  useEffect(() => {
    const handler = setTimeout(() => {
      const start = (currentPage - 1) * 10;

      getTasks({
        searchQuery,
        status: filterStatus,
        priority: filterPriority,
        order: sortOrder as "asc" | "desc",
        skip: start,
        currentPage,
      });
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [
    currentPage,
    showCompleted,
    searchQuery,
    filterStatus,
    filterPriority,
    sortOrder,
    getTasks,
  ]);

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
      getTasks({
        searchQuery,
        status: filterStatus,
        priority: filterPriority,
        order: sortOrder as "asc" | "desc",
        skip: 0,
      });
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
      projectId,
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
      getTasks({
        searchQuery,
        status: filterStatus,
        priority: filterPriority,
        order: sortOrder as "asc" | "desc",
        skip: 0,
      });
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
      getTasks({
        searchQuery,
        status: filterStatus,
        priority: filterPriority,
        order: sortOrder as "asc" | "desc",
        skip: 0,
      });
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

  const handleDeleteProject = async (projectId: string) => {
    const response = await apiFetch(`/api/projects/${projectId}`, {
      method: "DELETE",
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
          notyf.error("Failed to delete project");
        }
      }
    } else {
      router.push("/dashboard");
      return true;
    }
  };

  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="flex flex-col space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div className="flex gap-3 items-center">
            <Button
              className="p-2"
              variant="secondary"
              size="icon"
              onClick={() => router.push("/dashboard")}
            >
              <ArrowLeft />
            </Button>
            <h1 className="text-3xl font-bold">Welcome back, {name}!</h1>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2">
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
          {!loading && (
            <Dialog>
              <div className="flex-1 flex flex-col sm:flex-row justify-center sm:justify-end gap-2 sm:gap-3">
                <DialogTrigger asChild>
                  <Button variant="destructive" className="w-full sm:w-auto">
                    <Trash className="sm:mr-2" />
                    Delete Project
                  </Button>
                </DialogTrigger>
                <Button
                  variant="secondary"
                  onClick={() => {
                    getTasks({
                      searchQuery,
                      status: filterStatus,
                      priority: filterPriority,
                      order: sortOrder as "asc" | "desc",
                      skip: 0,
                    });
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
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Project</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete &quot;{project.name}&quot;?
                    This action cannot be undone. All tasks associated with this
                    project will also be deleted.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="ghost" size="sm">
                      Cancel
                    </Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button
                      onClick={() => handleDeleteProject(projectId as string)}
                      className="mr-2"
                      size="sm"
                      variant="destructive"
                    >
                      Delete Project
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
        {/* <div> */}
        {/*   <h2 className="m-0 text-xl">{project.name}</h2> */}
        {/*   <p className="m-0 text-md">{project.description}</p> */}
        {/* </div> */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <CardTitle>{project.name}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </div>
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
                  {tasks.map((task) => (
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

export default Project;
