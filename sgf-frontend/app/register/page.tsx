"use client";

import { useState } from "react";
import { api } from "@/services/api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");

  const handleRegister = async () => {
    const res = await api.register({
      name,
      email,
      password,
      inviteCode: inviteCode || undefined
    });

    if (!res.error) {
      alert("Usuário criado!");
      window.location.href = "/login";
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="p-10">
      <h1>Registro</h1>
      <input placeholder="Nome" onChange={e => setName(e.target.value)} />
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input placeholder="Senha" type="password" onChange={e => setPassword(e.target.value)} />
      <input placeholder="Código de convite (opcional)" onChange={e => setInviteCode(e.target.value)} />
      <button onClick={handleRegister}>Cadastrar</button>
    </div>
  );
}