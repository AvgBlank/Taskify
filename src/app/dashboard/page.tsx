"use client";
import { useState, useEffect } from "react";
import checkAuth from "@/lib/is-authenticated";

interface Task {
  id: number;
  title: string;
  priority: string;
  status: string;
}

const Dashboard = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [creatingTask, setCreatingTask] = useState<Task | null>(null);
  const [name, setName] = useState<string>("");
  const [showCompleted, setShowCompleted] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const properties: string[] = ["High", "Medium", "Low"];

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

  if (!userId) return <div>Loading...</div>;

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
    if (editingTask) {
      setEditingTask({ ...editingTask, [e.target.name]: e.target.value });
      setCreatingTask(null);
    } else if (creatingTask) {
      setCreatingTask({ ...creatingTask, [e.target.name]: e.target.value });
      setEditingTask(null);
    }
  };

  const handleSave = async () => {
    if (editingTask) {
      await UpdateTask(editingTask);
      setEditingTask(null);
    } else if (creatingTask) {
      await CreateTask(creatingTask);
      setCreatingTask(null);
    }
  };

  const UpdateTask = async (task: Task) => {
    if (task.title === "") {
      setError("Title is required");
      return;
    }
    setError("");
    await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    GetTasks(userId!).then(setTasks);
  };

  const CreateTask = async (task: Task) => {
    if (task.title === "") {
      setError("Title is required");
      return;
    }
    setError("");
    await fetch(`/api/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...task, userId }),
    });
    GetTasks(userId!).then(setTasks);
  };

  const DeleteTask = async (task: Task) => {
    console.log(task);
    await fetch(`/api/tasks/${task.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    GetTasks(userId!).then(setTasks);
  };

  return (
    <>
      Welcome Name: {name}
      <table>
        <thead>
          <tr>
            <th className="border p-2 border-white">Title</th>
            <th className="border p-2 border-white">Priority</th>
            <th className="border p-2 border-white">Status</th>
            <th className="border p-2 border-white">
              {!creatingTask && (
                <button
                  onClick={() => {
                    setCreatingTask({
                      id: 0,
                      title: "",
                      priority: "Low",
                      status: "Pending",
                    });
                    setEditingTask(null);
                  }}
                  className="bg-green-500 p-1"
                >
                  Create Task
                </button>
              )}
            </th>
          </tr>
        </thead>
        <tbody>
          {creatingTask && (
            <tr>
              <td className="border p-2 border-white">
                <input
                  name="title"
                  value={creatingTask.title}
                  onChange={handleChange}
                  className="text-black"
                />
              </td>
              <td className="border p-2 border-white">
                <select
                  name="priority"
                  value={creatingTask.priority}
                  onChange={handleChange}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </td>
              <td className="border p-2 border-white">
                <select
                  name="status"
                  value={creatingTask.status}
                  onChange={handleChange}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </td>
              <td className="border p-2 border-white">
                <button onClick={handleSave} className="bg-green-500 p-1">
                  Save
                </button>
                <button
                  onClick={() => setCreatingTask(null)}
                  className="bg-gray-500 p-1 ml-2"
                >
                  Cancel
                </button>
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
                <tr key={task.id}>
                  <td className="border p-2 border-white">
                    {editingTask?.id === task.id ? (
                      <input
                        name="title"
                        value={editingTask.title}
                        onChange={handleChange}
                        className="text-black"
                      />
                    ) : (
                      task.title
                    )}
                  </td>
                  <td className="border p-2 border-white">
                    {editingTask?.id === task.id ? (
                      <select
                        name="priority"
                        value={editingTask.priority}
                        onChange={handleChange}
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    ) : (
                      task.priority
                    )}
                  </td>
                  <td className="border p-2 border-white">
                    {editingTask?.id === task.id ? (
                      <select
                        name="status"
                        value={editingTask.status}
                        onChange={handleChange}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    ) : (
                      task.status
                    )}
                  </td>
                  <td className="border p-2 border-white">
                    {editingTask?.id === task.id ? (
                      <>
                        <button
                          onClick={handleSave}
                          className="bg-green-500 p-1"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingTask(null)}
                          className="bg-gray-500 p-1 ml-2"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditingTask(task);
                            setCreatingTask(null);
                          }}
                          className="bg-blue-500 p-1 mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => DeleteTask(task)}
                          className="bg-red-500 p-1"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              )),
          )}
        </tbody>
      </table>
      {error && <div className="text-red-500">{error}</div>}
      <button
        className="bg-orange-800 mt-10 ml-24"
        onClick={() => setShowCompleted(!showCompleted)}
      >
        {showCompleted ? "Hide completed tasks" : "Show completed tasks"}
      </button>
    </>
  );
};

export default Dashboard;
