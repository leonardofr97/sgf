"use client";

import { useState } from "react";
import { api } from "@/services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await api.login({ email, password });

    if (res.token) {
      localStorage.setItem("token", res.token);
      window.location.href = "/dashboard";
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="p-10">
      <h1>Login</h1>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input placeholder="Senha" type="password" onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Entrar</button>
    </div>
  );
}