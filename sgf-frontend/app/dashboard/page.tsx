"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";

export default function Dashboard() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    loadTasks();
  }, []);

  const loadTasks = async () => {
    const data = await api.getTasks();
    setTasks(data);
  };

  const handleCreateTask = async () => {
    if (!title) return alert("Título obrigatório");

    const res = await api.createTask({
      title,
      description
    });

    if (res.error) {
      alert(res.error);
    } else {
      setTitle("");
      setDescription("");
      loadTasks();
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-xl font-bold mb-4">Tarefas</h1>

      <div className="mb-6 space-y-2">
        <input
          className="border p-2 w-full"
          placeholder="Título"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          placeholder="Descrição"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <button
          onClick={handleCreateTask}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Criar tarefa
        </button>
      </div>

      {tasks.length === 0 ? (
        <p>Nenhuma tarefa encontrada</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map(task => (
            <li key={task.id} className="border p-3 rounded">
              <h2 className="font-semibold">{task.title}</h2>
              <p>{task.description}</p>
              <p>Status: {task.status}</p>
              <p>Prioridade: {task.priority}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}