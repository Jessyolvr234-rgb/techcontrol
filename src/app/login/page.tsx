
"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  Smartphone,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

export default function LoginPage() {
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [lembrar, setLembrar] = useState(true);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro("");

    const emailFormatado = email.trim().toLowerCase();

    if (!emailFormatado || !senha) {
      setErro("Preencha seu e-mail e sua senha.");
      return;
    }

    setCarregando(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailFormatado,
        password: senha,
      });

      if (error) {
        console.error("Erro de autenticação Supabase:", {
          message: error.message,
          code: error.code,
          status: error.status,
        });

        switch (error.code) {
          case "invalid_credentials":
            setErro(
              "E-mail ou senha incorretos. Confira os dados cadastrados no Supabase."
            );
            break;

          case "email_not_confirmed":
            setErro(
              "Seu e-mail ainda não foi confirmado. Verifique a confirmação da conta no Supabase."
            );
            break;

          case "user_banned":
            setErro(
              "Esta conta está temporariamente bloqueada. Entre em contato com o administrador."
            );
            break;

          default:
            setErro(
              `Não foi possível entrar: ${error.message}`
            );
        }

        return;
      }

      if (!data.user || !data.session) {
        setErro(
          "O Supabase não retornou uma sessão válida. Tente novamente."
        );
        return;
      }

      router.replace("/dashboard");
      router.refresh();

    } catch (error) {
      console.error("Erro inesperado no login:", error);

      setErro(
        "Não foi possível conectar ao servidor. Verifique sua internet e tente novamente."
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="h-[100svh] overflow-hidden bg-[#101010] text-white flex items-center justify-center">
      <div className="w-full h-full max-w-[1400px] grid grid-cols-1 lg:grid-cols-2">

        {/* PAINEL ESQUERDO */}
        <section className="hidden lg:flex relative overflow-hidden flex-col justify-between p-14 xl:p-20 bg-[#101010]">

          <div className="absolute w-[500px] h-[500px] rounded-full border border-[#c6a15b]/10 -right-64 top-20" />
          <div className="absolute w-[350px] h-[350px] rounded-full border border-[#c6a15b]/10 -left-48 bottom-0" />

          <div className="relative z-10 flex items-center gap-3">
            <div className="p-3 border border-[#c6a15b] rounded-xl">
              <Smartphone size={27} className="text-[#c6a15b]" />
            </div>

            <div>
              <h1 className="text-3xl font-bold">
                Tech<span className="text-[#c6a15b]">Control</span>
              </h1>
              <p className="text-[9px] tracking-[4px] text-gray-500">
                GESTÃO COMERCIAL
              </p>
            </div>
          </div>

          <div className="relative z-10 max-w-lg">
            <span className="text-xs tracking-[4px] text-[#c6a15b]">
              CONTROLE INTELIGENTE
            </span>

            <h2 className="mt-6 text-5xl xl:text-6xl font-bold leading-tight">
              Sua loja.
              <br />
              Seu controle.
              <br />
              <span className="text-[#c6a15b]">
                Seus resultados.
              </span>
            </h2>

            <p className="mt-6 text-gray-400 text-base leading-relaxed max-w-sm">
              Produtos, estoque, vendas e finanças organizados em um só lugar.
            </p>

            <div className="mt-10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl border border-[#c6a15b]/40 flex items-center justify-center">
                <ShieldCheck size={20} className="text-[#c6a15b]" />
              </div>
              <span className="text-sm text-gray-400">
                Gestão simples e organizada para sua loja.
              </span>
            </div>
          </div>

          <p className="relative z-10 text-xs text-gray-600 tracking-widest">
            TECHCONTROL © 2026
          </p>
        </section>

        {/* PAINEL DE LOGIN */}
        <section className="h-full min-h-0 bg-[#f8f8f8] text-[#171717] flex flex-col items-center justify-center px-6 sm:px-12">

          <div className="w-full max-w-[390px]">

            {/* MARCA MOBILE */}
            <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
              <div className="p-2.5 rounded-xl bg-[#171717]">
                <Smartphone size={24} className="text-[#c6a15b]" />
              </div>
              <h1 className="text-2xl font-bold">
                Tech<span className="text-[#b58b45]">Control</span>
              </h1>
            </div>

            <div className="mb-7">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#c6a15b]/10 text-[#a47b35] text-[10px] font-bold tracking-wider mb-4">
                <span className="w-2 h-2 rounded-full bg-[#c6a15b]" />
                ACESSO RESTRITO
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Bem-vindo de volta!
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Entre com seus dados para continuar.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">

              {/* EMAIL */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  E-mail
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="email"
                    autoComplete="email"
                    placeholder="seuemail@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full h-12 rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm outline-none focus:border-[#b58b45] focus:ring-2 focus:ring-[#c6a15b]/15"
                  />
                </div>
              </div>

              {/* SENHA */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Senha
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type={mostrarSenha ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Digite sua senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                    className="w-full h-12 rounded-xl border border-gray-200 bg-white pl-11 pr-12 text-sm outline-none focus:border-[#b58b45] focus:ring-2 focus:ring-[#c6a15b]/15"
                  />

                  <button
                    type="button"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#a47b35]"
                  >
                    {mostrarSenha ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              {/* OPÇÕES */}
              <div className="flex items-center justify-between gap-2 pt-1">

                <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={lembrar}
                    onChange={(e) => setLembrar(e.target.checked)}
                    className="accent-[#b58b45] w-4 h-4"
                  />
                  Lembrar-me
                </label>

                <Link
                  href="/recuperar-senha"
                  className="text-xs font-semibold text-[#a47b35] hover:underline"
                >
                  Esqueci minha senha
                </Link>
              </div>

              {/* ERRO */}
              {erro && (
                <p
                  role="alert"
                  className="text-sm text-red-600 bg-red-50 border border-red-100 p-3 rounded-lg"
                >
                  {erro}
                </p>
              )}

              {/* BOTÃO */}
              <button
                type="submit"
                disabled={carregando}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-[#d8b66f] to-[#a77b35] text-white font-bold text-sm shadow-lg shadow-[#c6a15b]/20 hover:brightness-105 active:scale-[0.99] transition flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {carregando ? "ENTRANDO..." : "ENTRAR"}
                {!carregando && <ArrowRight size={18} />}
              </button>

            </form>

            {/* SEGURANÇA */}
            <div className="mt-7 flex items-center justify-center gap-2 text-gray-400">
              <ShieldCheck size={16} className="text-[#b58b45]" />
              <span className="text-xs">
                Ambiente protegido
              </span>
            </div>

            <p className="text-center text-[10px] text-gray-400 mt-7">
              TechControl © 2026
            </p>

          </div>
        </section>
      </div>
    </main>
  );
}
