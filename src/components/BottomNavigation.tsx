
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Smartphone,
  ShoppingCart,
  Package,
  MoreHorizontal,
  ArrowDownToLine,
  Wallet,
  ChartNoAxesCombined,
  Users,
  Settings,
  X,
} from "lucide-react";

const principais = [
  { label: "Início", href: "/dashboard", icon: Home },
  { label: "Produtos", href: "/produtos", icon: Smartphone },
  { label: "Vendas", href: "/vendas", icon: ShoppingCart },
  { label: "Estoque", href: "/estoque", icon: Package },
];

const extras = [
  { label: "Entradas", href: "/estoque/entradas", icon: ArrowDownToLine },
  { label: "Caixa", href: "/caixa", icon: Wallet },
  { label: "Relatórios", href: "/relatorios", icon: ChartNoAxesCombined },
  { label: "Usuários", href: "/usuarios", icon: Users },
  { label: "Configurações", href: "/configuracoes", icon: Settings },
];

export default function BottomNavigation() {
  const pathname = usePathname();
  const [maisAberto, setMaisAberto] = useState(false);

  if (
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/cadastro"
  ) {
    return null;
  }

  const extraAtivo = extras.some((item) => pathname === item.href);

  return (
    <>
      {/* MENU MAIS */}
      {maisAberto && (
        <>
          <button
            aria-label="Fechar opções"
            onClick={() => setMaisAberto(false)}
            className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          />

          <div className="fixed bottom-[calc(76px+env(safe-area-inset-bottom))] right-3 z-50 w-56 rounded-2xl border border-gray-200 bg-white p-2 shadow-2xl lg:hidden">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-xs font-bold text-gray-500">
                MAIS OPÇÕES
              </span>

              <button
                onClick={() => setMaisAberto(false)}
                aria-label="Fechar"
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"
              >
                <X size={17} />
              </button>
            </div>

            {extras.map((item) => {
              const Icon = item.icon;
              const ativo = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMaisAberto(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                    ativo
                      ? "bg-[#c6a15b]/10 font-semibold text-[#a47b35]"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </>
      )}

      {/* BARRA INFERIOR */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur-xl pb-[env(safe-area-inset-bottom)] lg:hidden">
        <div className="mx-auto grid h-[68px] max-w-xl grid-cols-5 items-center px-2">
          {principais.map((item) => {
            const Icon = item.icon;
            const ativo =
              pathname === item.href ||
              (item.href === "/estoque" &&
                pathname.startsWith("/estoque"));

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex h-full flex-col items-center justify-center gap-1"
              >
                <Icon
                  size={21}
                  strokeWidth={ativo ? 2.5 : 1.8}
                  className={
                    ativo ? "text-[#b58b45]" : "text-gray-500"
                  }
                />

                <span
                  className={`text-[10px] ${
                    ativo
                      ? "font-bold text-[#a47b35]"
                      : "font-medium text-gray-500"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}

          <button
            onClick={() => setMaisAberto(!maisAberto)}
            className="flex h-full flex-col items-center justify-center gap-1"
          >
            {maisAberto ? (
              <X size={21} className="text-[#b58b45]" />
            ) : (
              <MoreHorizontal
                size={21}
                className={
                  extraAtivo ? "text-[#b58b45]" : "text-gray-500"
                }
              />
            )}

            <span
              className={`text-[10px] ${
                extraAtivo || maisAberto
                  ? "font-bold text-[#a47b35]"
                  : "font-medium text-gray-500"
              }`}
            >
              Mais
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}
