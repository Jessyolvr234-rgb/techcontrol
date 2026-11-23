"use client";

import { FormEvent, useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function getLoginError(message: string) {
  if (message.toLowerCase().includes("invalid login credentials")) {
    return "E-mail ou senha incorretos. Confira os dados e tente novamente.";
  }

  if (message.toLowerCase().includes("email not confirmed")) {
    return "Confirme seu e-mail antes de entrar.";
  }

  return "Não foi possível entrar. Verifique sua conexão e tente novamente.";
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMessage(getLoginError(error.message));
        return;
      }

      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Erro ao entrar no TechControl:", error);
      setErrorMessage(
        error instanceof Error && error.message.startsWith("Configure ")
          ? error.message
          : "Não foi possível entrar. Verifique sua conexão e tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen bg-white">
      <section className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-[#101010] p-12 text-white lg:flex xl:p-16">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full border border-white/[0.06]" />
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full border border-white/[0.08]" />

        <div className="relative flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-black">
            <Smartphone size={24} />
          </div>
          <div>
            <p className="text-lg font-bold">TechControl</p>
            <p className="text-[9px] font-semibold tracking-[2px] text-gray-500">
              GESTÃO COMERCIAL
            </p>
          </div>
        </div>

        <div className="relative max-w-lg">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-gray-300">
            <ShieldCheck size={14} />
            Controle seguro para sua loja
          </span>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
            Sua operação,
            <br />
            <span className="text-gray-400">em um só lugar.</span>
          </h1>
          <p className="mt-5 max-w-md text-sm leading-6 text-gray-400">
            Acesse o painel para acompanhar produtos, estoque, vendas e a gestão
            da sua loja.
          </p>
        </div>

        <p className="relative text-xs text-gray-600">
          TechControl · Gestão comercial
        </p>
      </section>

      <section className="flex min-h-screen w-full items-center justify-center px-5 py-12 sm:px-8 lg:w-1/2">
        <div className="w-full max-w-[420px]">
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#101010] text-white">
              <Smartphone size={22} />
            </div>
            <div>
              <p className="text-base font-bold">TechControl</p>
              <p className="text-[9px] font-semibold tracking-[1.8px] text-gray-400">
                GESTÃO COMERCIAL
              </p>
            </div>
          </div>

          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[1.8px] text-gray-400">
              Bem-vindo de volta
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#171717]">
              Entrar na sua conta
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Informe seus dados para acessar o TechControl.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                E-mail
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="voce@empresa.com"
                  disabled={isSubmitting}
                  className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-[#171717] focus:ring-4 focus:ring-black/[0.04] disabled:bg-gray-50"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Senha
              </label>
              <div className="relative">
                <LockKeyhole
                  size={18}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Digite sua senha"
                  disabled={isSubmitting}
                  className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-12 text-sm outline-none transition focus:border-[#171717] focus:ring-4 focus:ring-black/[0.04] disabled:bg-gray-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  aria-pressed={showPassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-gray-400 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {errorMessage && (
              <p
                role="alert"
                className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#101010] px-4 text-sm font-semibold text-white hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle size={18} className="animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  Entrar
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs leading-5 text-gray-400">
            Use o e-mail e a senha cadastrados para sua conta no sistema.
          </p>
        </div>
      </section>
    </main>
  );
}
