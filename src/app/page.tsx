
import Link from "next/link";
import { Smartphone, ArrowRight, Package } from "lucide-react";

export default function HomePage() {
  return (
    <main className="h-[100svh] overflow-hidden bg-[#101010] text-white flex flex-col relative">

      {/* DETALHES DO FUNDO */}
      <div className="pointer-events-none absolute -top-40 -right-32 w-[450px] h-[450px] rounded-full border border-[#c6a15b]/10" />
      <div className="pointer-events-none absolute -bottom-64 -left-40 w-[450px] h-[450px] rounded-full border border-[#c6a15b]/10" />

      {/* CABEÇALHO */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-12 py-5 flex items-center justify-between">

        <div className="flex items-center gap-3">
          <div className="border border-[#c6a15b] rounded-xl p-2">
            <Smartphone size={24} className="text-[#c6a15b]" />
          </div>

          <div>
            <h1 className="text-xl md:text-2xl font-bold">
              Tech<span className="text-[#c6a15b]">Control</span>
            </h1>
            <p className="text-[8px] tracking-[4px] text-gray-500">
              GESTÃO COMERCIAL
            </p>
          </div>
        </div>

        <span className="hidden sm:block text-xs tracking-widest text-gray-500">
          GESTÃO INTELIGENTE
        </span>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <section className="relative z-10 flex-1 min-h-0 w-full max-w-6xl mx-auto px-6 md:px-12 flex flex-col lg:grid lg:grid-cols-2 lg:items-center lg:gap-10">

        {/* TEXTO */}
        <div className="flex flex-col justify-center pt-5 lg:pt-0">

          <div className="inline-flex w-fit items-center gap-2 border border-[#c6a15b]/30 bg-[#c6a15b]/5 rounded-full px-3 py-1.5 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#c6a15b]" />
            <span className="text-[10px] tracking-wider text-[#d6b46e]">
              CONTROLE PARA SUA LOJA
            </span>
          </div>

          <h2 className="text-[34px] sm:text-5xl lg:text-6xl font-bold leading-[1.08]">
            Sua loja.
            <br />
            Seu controle.
            <br />
            <span className="text-[#c6a15b]">
              Seus resultados.
            </span>
          </h2>

          <p className="mt-4 max-w-md text-sm md:text-base leading-relaxed text-gray-400">
            Gerencie produtos, estoque e vendas em um só lugar.
            Mais organização para o seu negócio.
          </p>

          <Link
            href="/login"
            className="mt-6 flex w-full sm:w-fit items-center justify-center gap-4 rounded-xl bg-gradient-to-r from-[#d8b66f] to-[#a77b35] px-9 py-4 text-sm font-bold text-[#171717] shadow-lg shadow-[#c6a15b]/10 transition hover:brightness-110 lg:mt-8"
          >
            FAZER LOGIN
            <ArrowRight size={20} />
          </Link>

          <p className="mt-3 text-center sm:text-left text-[10px] text-gray-600">
            Acesse sua conta e gerencie seu negócio.
          </p>
        </div>

        {/* ILUSTRAÇÃO COMPACTA */}
        <div className="relative flex flex-1 min-h-0 items-center justify-center lg:flex-none lg:h-[390px]">

          <div className="absolute w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-full border border-[#c6a15b]/20" />

          <div className="relative z-10 flex items-end gap-3">

            {/* IPHONE */}
            <div className="w-[105px] h-[175px] sm:w-[125px] sm:h-[210px] lg:w-[145px] lg:h-[245px] rounded-[24px] border-[4px] border-[#858585] bg-gradient-to-br from-[#555] to-black p-2 shadow-2xl">
              <div className="mx-auto mb-3 h-2.5 w-10 rounded-full bg-black" />

              <div className="flex h-[130px] sm:h-[160px] lg:h-[195px] flex-col items-center justify-center gap-3 rounded-2xl bg-[#242424]">
                <Smartphone size={35} className="text-[#c6a15b]" />
                <span className="text-[10px] text-gray-400">iPhone</span>
              </div>
            </div>

            {/* IPAD */}
            <div className="w-[135px] h-[155px] sm:w-[165px] sm:h-[185px] lg:w-[195px] lg:h-[220px] rounded-[20px] border-[4px] border-[#b9b9b9] bg-gradient-to-br from-[#777] to-black p-2 shadow-2xl">
              <div className="flex h-full flex-col items-center justify-center gap-3 rounded-xl bg-[#242424]">
                <Package size={42} className="text-[#c6a15b]" />
                <span className="text-[10px] text-gray-400">iPad</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* RODAPÉ DISCRETO */}
      <footer className="relative z-10 border-t border-white/10 px-6 py-3 text-center">
        <p className="text-[10px] text-gray-600">
          TechControl © 2026 — Gestão comercial inteligente.
        </p>
      </footer>

    </main>
  );
}
