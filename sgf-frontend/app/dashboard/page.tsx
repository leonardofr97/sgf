"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";

type User = {
  id: number;
  name: string;
  email: string;
};

type Task = {
  id: number;
  title: string;
  description?: string | null;
  status: string;
  priority: string;
  assignees?: User[];
};

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeIds, setAssigneeIds] = useState<number[]>([]);

  const loadTasks = async () => {
    const data = await api.getTasks();
    if (!data.error) setTasks(data);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    const loadInitialData = async () => {
      const [tasksData, usersData] = await Promise.all([
        api.getTasks(),
        api.getUsers()
      ]);

      if (!tasksData.error) setTasks(tasksData);
      if (!usersData.error) setUsers(usersData);
    };

    void loadInitialData();
  }, []);

  const toggleAssignee = (userId: number) => {
    setAssigneeIds(current =>
      current.includes(userId)
        ? current.filter(id => id !== userId)
        : [...current, userId]
    );
  };

  const updateTaskAssignees = async (task: Task, userId: number) => {
    const currentIds = task.assignees?.map(user => user.id) ?? [];
    const nextIds = currentIds.includes(userId)
      ? currentIds.filter(id => id !== userId)
      : [...currentIds, userId];

    const updatedTask = await api.updateTask(task.id, { assigneeIds: nextIds });

    if (updatedTask.error) {
      alert(updatedTask.error);
      return;
    }

    setTasks(current =>
      current.map(item => (item.id === updatedTask.id ? updatedTask : item))
    );
  };

  const completeTask = async (task: Task) => {
    const updatedTask = await api.updateTask(task.id, { status: "concluído" });

    if (updatedTask.error) {
      alert(updatedTask.error);
      return;
    }

    setTasks(current =>
      current.map(item => (item.id === updatedTask.id ? updatedTask : item))
    );
  };

  const handleCreateTask = async () => {
    if (!title) return alert("Título obrigatório");

    const res = await api.createTask({
      title,
      description,
      assigneeIds
    });

    if (res.error) {
      alert(res.error);
    } else {
      setTitle("");
      setDescription("");
      setAssigneeIds([]);
      loadTasks();
    }
  };

  return (
    <main className="mx-auto max-w-4xl p-6 sm:p-10">
      <h1 className="mb-4 text-xl font-bold">Tarefas</h1>

      <section className="mb-6 space-y-3">
        <input
          className="w-full rounded border p-2"
          placeholder="Titulo"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <input
          className="w-full rounded border p-2"
          placeholder="Descricao"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />

        <fieldset className="rounded border p-3">
          <legend className="px-1 text-sm font-medium">Responsaveis</legend>
          {users.length === 0 ? (
            <p className="text-sm text-gray-500">Nenhum usuario encontrado</p>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {users.map(user => (
                <label key={user.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={assigneeIds.includes(user.id)}
                    onChange={() => toggleAssignee(user.id)}
                  />
                  <span className="font-medium">{user.name}</span>
                  <span className="truncate text-gray-500">{user.email}</span>
                </label>
              ))}
            </div>
          )}
        </fieldset>

        <button
          onClick={handleCreateTask}
          className="rounded bg-blue-500 px-4 py-2 text-white"
        >
          Criar tarefa
        </button>
      </section>

      {tasks.length === 0 ? (
        <p>Nenhuma tarefa encontrada</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map(task => (
            <li key={task.id} className="rounded border p-3">
              <h2 className="font-semibold">{task.title}</h2>
              <p>{task.description}</p>
              <p>Status: {task.status}</p>
              <p>Prioridade: {task.priority}</p>
              {task.status === "pendente" && (
                <button
                  onClick={() => completeTask(task)}
                  className="mt-3 rounded bg-green-600 px-3 py-2 text-sm font-medium text-white"
                >
                  Marcar como concluído
                </button>
              )}
              <fieldset className="mt-3 rounded border p-3">
                <legend className="px-1 text-sm font-medium">Responsaveis</legend>
                {users.length === 0 ? (
                  <p className="text-sm text-gray-500">Nenhum usuario encontrado</p>
                ) : (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {users.map(user => (
                      <label key={user.id} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={Boolean(
                            task.assignees?.some(assignee => assignee.id === user.id)
                          )}
                          onChange={() => updateTaskAssignees(task, user.id)}
                        />
                        <span className="font-medium">{user.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </fieldset>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
