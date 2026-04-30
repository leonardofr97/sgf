"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";

export default function Dashboard() {
  const [tasks, setTasks] = useState<any[]>([]);

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

  return (
    <div className="p-10">
      <h1 className="text-xl font-bold mb-4">Tarefas</h1>

      {tasks.length === 0 ? (
        <p>Nenhuma tarefa encontrada</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map(task => (
            <li key={task.id} className="border p-3 rounded">
              <h2 className="font-semibold">{task.title}</h2>
              <p>Status: {task.status}</p>
              <p>Prioridade: {task.priority}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}