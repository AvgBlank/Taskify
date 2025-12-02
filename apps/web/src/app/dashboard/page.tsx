"use client";
import { useState, useEffect, useCallback } from "react";
import checkAuth from "@/lib/isAuthenticated";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { Edit, LogOut, Plus, RefreshCw } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import "notyf/notyf.min.css";
import apiFetch from "../../lib/apiFetch";
import { useNotyf } from "@/hooks/useNotyf";
import { useRouter } from "next/navigation";

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
  const [name, setName] = useState<string>("");
  const notyf = useNotyf();
  const router = useRouter();

  // Projects
  const [loading, setLoading] = useState<boolean>(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [createProject, setCreateProject] = useState<CreateProject>({
    name: "",
    description: "",
  });
  const [editProject, setEditProject] = useState<CreateProject>({
    name: "",
    description: "",
  });

  // Searching
  const [searchQuery, setSearchQuery] = useState("");

  const getProjects = useCallback(
    async (searchQuery: string) => {
      setLoading(true);
      const response = await apiFetch(
        `/api/projects?searchQuery=${searchQuery}`,
      );
      const result = await response.json();

      if (response.ok) {
        setLoading(false);
        setProjects(result);
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
          setLoading(false);
          setProjects([]);
        }
      }
    },
    [notyf],
  );

  useEffect(() => {
    (async () => {
      const { valid, name } = await checkAuth();
      if (!valid) {
        window.location.href = "/login";
      } else {
        setName(name);
        getProjects("");
      }
    })();
  }, [getProjects]);

  useEffect(() => {
    const handler = setTimeout(() => {
      getProjects(searchQuery.trim());
    }, 250);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery, getProjects]);

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
      getProjects(searchQuery);
      return true;
    }
  };

  const handleEditProject = async (
    projectId: string,
    project: CreateProject,
  ) => {
    if (project.name.trim() === "") {
      if (notyf) {
        notyf.error("Project name is required");
      }
      return false;
    }

    const response = await apiFetch(`/api/projects/${projectId}`, {
      method: "PATCH",
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
          notyf.error("Failed to update project");
        }
      }
    } else {
      getProjects(searchQuery);
      return true;
    }
  };

  const handleLogout = async () => {
    await apiFetch("/api/auth/logout", {
      method: "DELETE",
    });
    window.location.href = "/login";
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

        <Dialog>
          <div className="flex flex-col lg:flex-row gap-5 justify-between items-center">
            <div className="grid grid-cols-2 sm:flex gap-2">
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>
            {!loading && (
              <div className="flex-1 flex flex-col sm:flex-row justify-center sm:justify-end gap-2 sm:gap-3">
                <Button
                  variant="secondary"
                  onClick={() => {
                    getProjects(searchQuery);
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

          <Card className="w-full">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <CardTitle>Projects</CardTitle>
                  <CardDescription>Manage your projects here.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="w-full">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 w-full">
                  {projects?.map((project, idx) => (
                    <Card
                      key={idx}
                      onClick={() => {
                        router.push(`/dashboard/${project.id}`);
                      }}
                      className="hover:bg-muted/50 cursor-pointer"
                    >
                      <Dialog>
                        <CardHeader className="">
                          <CardTitle className="flex justify-between truncate">
                            <p>{project.name}</p>
                            <DialogTrigger asChild>
                              <Edit
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditProject({
                                    name: project.name,
                                    description: project.description ?? "",
                                  });
                                }}
                                className="h-5 w-5"
                              />
                            </DialogTrigger>
                          </CardTitle>
                          <CardDescription className="truncate">
                            {project.description ?? "‎"}
                          </CardDescription>

                          <DialogContent onClick={(e) => e.stopPropagation()}>
                            <DialogHeader>
                              <DialogTitle>Edit Project</DialogTitle>
                              <DialogDescription>
                                Update the details for your project.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-col gap-3">
                              <div className="grid gap-2">
                                <label htmlFor="name">Project Name</label>
                                <Input
                                  name="name"
                                  id="name"
                                  value={editProject.name}
                                  onChange={(e) =>
                                    setEditProject({
                                      ...editProject,
                                      name: e.target.value,
                                    })
                                  }
                                  placeholder="Project Name"
                                />
                              </div>
                              <div className="grid gap-2">
                                <label htmlFor="description">
                                  Project Description
                                </label>
                                <Input
                                  name="description"
                                  id="description"
                                  value={editProject.description}
                                  onChange={(e) =>
                                    setEditProject({
                                      ...editProject,
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
                                  onClick={() =>
                                    handleEditProject(project.id, editProject)
                                  }
                                  className="mr-2"
                                  size="sm"
                                >
                                  Save Changes
                                </Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </CardHeader>
                      </Dialog>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </Dialog>
      </div>
    </div>
  );
};

export default Dashboard;
