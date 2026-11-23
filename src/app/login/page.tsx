
"use client";

import { useState } from "react";
import { Smartphone, Eye, EyeOff, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (!email || !senha) {
      alert("Preencha seu e-mail e sua senha.");
      return;
    }

    alert("Tela pronta! Vamos conectar a autenticação ao Supabase.");
  }

  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-5">

      <div className="w-full max-w-md">

        {/* LOGO */}
        <div className="flex flex-col items-center mb-10">

          <div className="bg-black p-4 rounded-2xl mb-4">
            <Smartphone size={35} color="white" />
          </div>

          <h1 className="text-3xl font-bold text-black tracking-tight">
            TechControl
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Sistema de Gestão de Vendas
          </p>

          <p className="text-gray-500 text-sm mt-2">
            GESTÃO COMERCIAL
          </p>

        </div>

        {/* FORMULÁRIO */}
        <div className="border border-gray-200 rounded-2xl p-7 shadow-sm">

          <h2 className="text-2xl font-bold text-gray-900">
            Bem-vindo de volta!
          </h2>

          <p className="text-gray-500 text-sm mt-2 mb-8">
            Entre na sua conta para continuar.
          </p>

          <form onSubmit={handleLogin} className="space-y-5">

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                E-mail
              </label>

              <div className="relative">
                <Mail
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="email"
                  placeholder="seuemail@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 border border-gray-300 rounded-xl pl-12 pr-4 text-sm outline-none focus:border-black transition"
                />
              </div>
            </div>

            {/* SENHA */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Senha
              </label>

              <div className="relative">
                <Lock
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type={mostrarSenha ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full h-12 border border-gray-300 rounded-xl pl-12 pr-12 text-sm outline-none focus:border-black transition"
                />

                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {mostrarSenha ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {/* RECUPERAR SENHA */}
            <div className="flex justify-end">
              <a
                href="/recuperar-senha"
                className="text-sm font-semibold text-black hover:underline"
              >
                Esqueci minha senha
              </a>
            </div>

            {/* BOTÃO */}
            <button
              type="submit"
              className="w-full h-12 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition"
            >
              Entrar na minha conta
            </button>

          </form>

        </div>

        {/* RODAPÉ */}
        <p className="text-center text-xs text-gray-400 mt-8">
          TechControl © 2026 — Todos os direitos reservados.
        </p>

      </div>

    </main>
  );
}
