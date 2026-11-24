
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

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro("");

    const emailFormatado = email.trim().toLowerCase();

    if (!emailFormatado || !senha) {
      setErro("Preencha seu e-mail e sua senha.");
      return;
    }

    if (carregando) return;

    setCarregando(true);

    try {
      const supabase = createClient();

      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailFormatado,
        password: senha,
      });

      if (error) {
        console.error("Erro de autenticação:", {
          message: error.message,
          code: error.code,
          status: error.status,
          name: error.name,
        });

        const codigo = error.code?.toLowerCase() ?? "";
        const mensagem = error.message.toLowerCase();

        if (
          codigo === "invalid_credentials" ||
          mensagem.includes("invalid login credentials")
        ) {
          setErro(
            "Não foi possível autenticar. Confira se o e-mail está cadastrado em Authentication → Users e se a senha está correta."
          );
        } else if (
          codigo === "email_not_confirmed" ||
          mensagem.includes("email not confirmed")
        ) {
          setErro(
            "Seu e-mail ainda não foi confirmado. Verifique a confirmação da conta no Supabase."
          );
        } else if (
          codigo === "user_banned" ||
          mensagem.includes("banned")
        ) {
          setErro(
            "Esta conta está temporariamente bloqueada. Entre em contato com o administrador."
          );
        } else if (
          mensagem.includes("fetch") ||
          mensagem.includes("network")
        ) {
          setErro(
            "Não foi possível conectar ao Supabase. Verifique sua URL, chave pública e conexão com a internet."
          );
        } else {
          setErro(`Erro do Supabase: ${error.message}`);
        }

        return;
      }

      if (!data.user || !data.session) {
        setErro(
          "O Supabase não retornou uma sessão válida. Tente novamente."
        );
        return;
      }

      console.log("Login realizado com sucesso.");

      router.replace("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Erro inesperado no login:", error);

      const mensagem =
        error instanceof Error
          ? error.message
          : "Erro desconhecido.";

      setErro(
        `Não foi possível entrar: ${mensagem}`
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="flex h-[100svh] items-center justify-center overflow-hidden bg-[#101010] text-white">
      <div className="grid h-full w-full max-w-[1400px] grid-cols-1 lg:grid-cols-2">

        {/* PAINEL ESQUERDO */}
        <section className="relative hidden flex-col justify-between overflow-hidden bg-[#101010] p-14 lg:flex xl:p-20">

          <div className="absolute -right-64 top-20 h-[500px] w-[500px] rounded-full border border-[#c6a15b]/10" />
          <div className="absolute -left-48 bottom-0 h-[350px] w-[350px] rounded-full border border-[#c6a15b]/10" />

          <div className="relative z-10 flex items-center gap-3">
            <div className="rounded-xl border border-[#c6a15b] p-3">
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

            <h2 className="mt-6 text-5xl font-bold leading-tight xl:text-6xl">
              Sua loja.
              <br />
              Seu controle.
              <br />
              <span className="text-[#c6a15b]">
                Seus resultados.
              </span>
            </h2>

            <p className="mt-6 max-w-sm text-base leading-relaxed text-gray-400">
              Produtos, estoque, vendas e finanças organizados em um só lugar.
            </p>

            <div className="mt-10 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#c6a15b]/40">
                <ShieldCheck size={20} className="text-[#c6a15b]" />
              </div>

              <span className="text-sm text-gray-400">
                Gestão simples e organizada para sua loja.
              </span>
            </div>
          </div>

          <p className="relative z-10 text-xs tracking-widest text-gray-600">
            TECHCONTROL © 2026
          </p>
        </section>

        {/* PAINEL DE LOGIN */}
        <section className="flex h-full min-h-0 flex-col items-center justify-center bg-[#f8f8f8] px-6 text-[#171717] sm:px-12">

          <div className="w-full max-w-[390px]">

            {/* MARCA MOBILE */}
            <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
              <div className="rounded-xl bg-[#171717] p-2.5">
                <Smartphone size={24} className="text-[#c6a15b]" />
              </div>

              <h1 className="text-2xl font-bold">
                Tech<span className="text-[#b58b45]">Control</span>
              </h1>
            </div>

            <div className="mb-7">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#c6a15b]/10 px-3 py-1.5 text-[10px] font-bold tracking-wider text-[#a47b35]">
                <span className="h-2 w-2 rounded-full bg-[#c6a15b]" />
                ACESSO RESTRITO
              </div>

              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Bem-vindo de volta!
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Entre com seus dados para continuar.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">

              {/* EMAIL */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
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
                    disabled={carregando}
                    className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm outline-none focus:border-[#b58b45] focus:ring-2 focus:ring-[#c6a15b]/15 disabled:opacity-60"
                  />
                </div>
              </div>

              {/* SENHA */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
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
                    disabled={carregando}
                    className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-12 text-sm outline-none focus:border-[#b58b45] focus:ring-2 focus:ring-[#c6a15b]/15 disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#a47b35]"
                  >
                    {mostrarSenha ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>

              {/* OPÇÕES */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <label className="flex cursor-pointer items-center gap-2 text-xs text-gray-600">
                  <input
                    type="checkbox"
                    checked={lembrar}
                    onChange={(e) => setLembrar(e.target.checked)}
                    className="h-4 w-4 accent-[#b58b45]"
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
                <div
                  role="alert"
                  className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-600"
                >
                  {erro}
                </div>
              )}

              {/* BOTÃO */}
              <button
                type="submit"
                disabled={carregando}
                className="flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#d8b66f] to-[#a77b35] text-sm font-bold text-white shadow-lg shadow-[#c6a15b]/20 transition hover:brightness-105 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
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

            <p className="mt-7 text-center text-[10px] text-gray-400">
              TechControl © 2026
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
