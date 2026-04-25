"use client";

import { useEffect } from "react";

export default function Dashboard() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  return (
    <div className="p-10">
      <h1>Dashboard</h1>
      <p>Bem-vindo ao sistema de gestão familiar</p>
    </div>
  );
}