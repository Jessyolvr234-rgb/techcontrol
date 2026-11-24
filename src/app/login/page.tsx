
"use client";

import { useState } from "react";
import {
  Smartphone,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  ShieldCheck,
  BarChart3,
  Zap,
  ArrowRight,
} from "lucide-react";

export default function LoginPage() {
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [lembrar, setLembrar] = useState(true);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (!email || !senha) {
      alert("Preencha seu e-mail e sua senha.");
      return;
    }

    alert("Tela pronta! Vamos conectar a autenticação ao Supabase.");
  }

  return (
    <main className="min-h-screen bg-[#f3f3f3] flex items-center justify-center p-0 md:p-5">

      <div className="w-full min-h-screen md:min-h-[850px] max-w-[1450px] bg-white md:rounded-[28px] overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-2">

        {/* PAINEL ESQUERDO */}
        <section className="relative bg-[#111111] text-white px-8 py-10 md:px-14 md:py-14 flex flex-col justify-between overflow-hidden min-h-[390px] lg:min-h-[850px]">

          {/* DETALHES DECORATIVOS */}
          <div className="absolute w-[450px] h-[450px] border border-[#c6a15b]/30 rounded-full -right-60 top-20" />
          <div className="absolute w-[350px] h-[350px] border border-[#c0c0c0]/20 rounded-full -right-40 top-32" />
          <div className="absolute w-[500px] h-[500px] border-[25px] border-[#c6a15b]/10 rounded-full -left-80 bottom-[-200px]" />

          {/* LOGO */}
          <div className="relative z-10 flex items-center gap-4">
            <div className="border-2 border-[#c6a15b] p-3 rounded-2xl">
              <Smartphone size={34} className="text-[#c6a15b]" />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Tech<span className="text-[#c6a15b]">Control</span>
              </h1>
              <p className="text-[10px] tracking-[5px] text-gray-400 mt-1">
                GESTÃO COMERCIAL
              </p>
            </div>
          </div>

          {/* TEXTO PRINCIPAL */}
          <div className="relative z-10 mt-12 lg:mt-0 max-w-lg">

            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              Sua loja de iPhone e iPad,
              <span className="text-[#c6a15b]"> ainda mais organizada.</span>
            </h2>

            <p className="text-gray-300 mt-5 text-base md:text-lg leading-relaxed max-w-md">
              Controle suas vendas, estoque e finanças de forma simples,
              rápida e segura.
            </p>

            {/* BENEFÍCIOS */}
            <div className="mt-9 space-y-6">

              <div className="flex items-center gap-4">
                <div className="border border-[#c6a15b] rounded-full p-3">
                  <BarChart3 className="text-[#c6a15b]" size={22} />
                </div>
                <span className="text-gray-200">Gestão completa da sua loja</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="border border-[#c6a15b] rounded-full p-3">
                  <ShieldCheck className="text-[#c6a15b]" size={22} />
                </div>
                <span className="text-gray-200">Dados protegidos e seguros</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="border border-[#c6a15b] rounded-full p-3">
                  <Zap className="text-[#c6a15b]" size={22} />
                </div>
                <span className="text-gray-200">Acesso de qualquer lugar</span>
              </div>

            </div>
          </div>

          {/* RODAPÉ DO PAINEL */}
          <div className="relative z-10 mt-12 lg:mt-0">
            <div className="h-px bg-gradient-to-r from-[#c6a15b] via-[#c0c0c0]/30 to-transparent mb-5" />
            <p className="text-xs text-gray-500 tracking-wider">
              TECNOLOGIA • CONTROLE • RESULTADOS
            </p>
          </div>

        </section>

        {/* PAINEL DIREITO */}
        <section className="flex items-center justify-center px-6 py-12 md:px-12 lg:px-16 bg-white">

          <div className="w-full max-w-md">

            {/* LOGO MOBILE */}
            <div className="flex lg:hidden flex-col items-center mb-10">
              <Smartphone size={42} className="text-[#c6a15b] mb-2" />
              <h1 className="text-3xl font-bold text-[#171717]">
                Tech<span className="text-[#c6a15b]">Control</span>
              </h1>
              <p className="text-xs tracking-[4px] text-gray-400 mt-1">
                GESTÃO COMERCIAL
              </p>
            </div>

            {/* CABEÇALHO */}
            <div className="mb-9">
              <h2 className="text-3xl font-bold text-[#171717]">
                Bem-vindo de volta!
              </h2>

              <p className="text-gray-500 mt-3">
                Acesse sua conta para continuar.
              </p>
            </div>

            {/* FORMULÁRIO */}
            <form onSubmit={handleLogin} className="space-y-6">

              {/* EMAIL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  E-mail
                </label>

                <div className="relative">
                  <User
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="email"
                    placeholder="seuemail@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-14 border border-gray-200 rounded-2xl pl-12 pr-4 text-sm text-gray-900 outline-none focus:border-[#c6a15b] focus:ring-2 focus:ring-[#c6a15b]/10 transition"
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
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type={mostrarSenha ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="w-full h-14 border border-gray-200 rounded-2xl pl-12 pr-12 text-sm text-gray-900 outline-none focus:border-[#c6a15b] focus:ring-2 focus:ring-[#c6a15b]/10 transition"
                  />

                  <button
                    type="button"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#c6a15b]"
                    aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {mostrarSenha ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              {/* OPÇÕES */}
              <div className="flex items-center justify-between gap-3 flex-wrap">

                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={lembrar}
                    onChange={(e) => setLembrar(e.target.checked)}
                    className="accent-[#c6a15b] w-4 h-4"
                  />
                  Lembrar-me
                </label>

                <a
                  href="/recuperar-senha"
                  className="text-sm font-semibold text-[#a77b32] hover:underline"
                >
                  Esqueci minha senha
                </a>

              </div>

              {/* BOTÃO ENTRAR */}
              <button
                type="submit"
                className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#d7b36a] via-[#b98a3e] to-[#d7b36a] text-white font-bold text-base shadow-lg shadow-[#c6a15b]/20 hover:brightness-105 active:scale-[0.99] transition flex items-center justify-center gap-3"
              >
                Entrar
                <ArrowRight size={21} />
              </button>

            </form>

            {/* DIVISOR */}
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-sm text-gray-400">Acesso seguro</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* SEGURANÇA */}
            <div className="flex justify-center items-center gap-2 text-gray-500">
              <ShieldCheck size={18} className="text-[#b98a3e]" />
              <span className="text-xs">
                Seus dados protegidos com segurança
              </span>
            </div>

            {/* RODAPÉ */}
            <p className="text-center text-xs text-gray-400 mt-12">
              TechControl © 2026 — Todos os direitos reservados.
            </p>

          </div>
        </section>

      </div>
    </main>
  );
}
