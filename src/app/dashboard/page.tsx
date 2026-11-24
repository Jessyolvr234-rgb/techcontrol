
"use client";

import { useState } from "react";
import Link from "next/link";

import {
  Package,
  Search,
  Bell,
  Smartphone,
  ChevronDown,
  Plus,
  TrendingUp,
  ShoppingCart,
  AlertTriangle,
  Boxes,
  CalendarDays,
  ArrowRight,
  CircleDollarSign,
} from "lucide-react";

const chartData = [
  { day: "Seg", value: 0 },
  { day: "Ter", value: 0 },
  { day: "Qua", value: 0 },
  { day: "Qui", value: 0 },
  { day: "Sex", value: 0 },
  { day: "Sáb", value: 0 },
  { day: "Dom", value: 0 },
];

const recentSales: {
  id: number;
  product: string;
  customer: string;
  date: string;
  value: string;
  status: string;
}[] = [];

const stockItems: {
  id: number;
  name: string;
  quantity: number;
  status: string;
}[] = [];

/* ========================================
   CARD DOS INDICADORES
======================================== */

function MetricCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <div className="card-animated animate-slide-up flex aspect-square min-w-0 flex-col justify-between overflow-hidden rounded-2xl border border-gray-200 bg-white p-3 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <p className="min-w-0 text-xs font-semibold leading-relaxed text-gray-500 sm:text-sm">
          {title}
        </p>

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#C6A15B]/15 text-[#A6813D] sm:h-11 sm:w-11">
          <Icon size={19} strokeWidth={2} />
        </div>
      </div>

      <div className="min-w-0">
        <h3 className="break-words text-xl font-bold tracking-tight text-[#171717] sm:text-2xl lg:text-3xl">
          {value}
        </h3>

        <p className="mt-2 text-[10px] leading-relaxed text-gray-400 sm:text-xs">
          {description}
        </p>
      </div>

      <div className="h-1 w-full overflow-hidden rounded-full bg-gray-100">
        <div className="h-full w-1/3 rounded-full bg-[#C6A15B]" />
      </div>
    </div>
  );
}

/* ========================================
   DASHBOARD
======================================== */

export default function Home() {
  const [search, setSearch] = useState("");

  const maxValue = Math.max(
    ...chartData.map((item) => item.value),
    1
  );

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <main className="min-h-screen w-full">
        {/* CABEÇALHO */}

        <header className="sticky top-0 z-30 flex min-h-[82px] items-center justify-between border-b border-gray-200 bg-white/95 px-4 backdrop-blur-md sm:px-7 lg:px-9">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#C6A15B] text-[#171717]">
              <Smartphone size={25} strokeWidth={2.3} />
            </div>

            <div>
              <h1 className="text-[19px] font-bold tracking-tight text-[#171717]">
                TechControl
              </h1>

              <p className="text-[9px] font-bold tracking-[2px] text-[#A6813D]">
                GESTÃO COMERCIAL
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden h-10 w-60 items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 md:flex">
              <Search size={16} className="text-gray-400" />

              <input
                placeholder="Pesquisar..."
                className="w-full bg-transparent text-xs outline-none placeholder:text-gray-400"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <button
              aria-label="Notificações"
              className="relative rounded-xl border border-gray-200 p-2.5 transition hover:border-[#C6A15B] hover:bg-[#C6A15B]/10"
            >
              <Bell size={18} />

              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#C6A15B]" />
            </button>

            <div className="hidden h-9 w-9 items-center justify-center rounded-full bg-[#171717] text-xs font-bold text-[#C6A15B] sm:flex">
              AD
            </div>

            <button className="hidden items-center gap-1 text-xs font-semibold sm:flex">
              Admin
              <ChevronDown size={14} />
            </button>
          </div>
        </header>

        {/* CONTEÚDO */}

        <div className="px-4 py-7 sm:px-7 lg:px-9">
          {/* TÍTULO E AÇÕES */}

          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[2px] text-[#A6813D]">
                Visão geral
              </p>

              <h2 className="mt-1 text-2xl font-bold text-[#171717]">
                Dashboard
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Acompanhe o desempenho da sua loja.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600">
                <CalendarDays size={17} className="text-[#A6813D]" />
                Novembro, 2026
              </div>

              <Link
                href="/produtos"
                className="flex items-center justify-center gap-2 rounded-xl bg-[#C6A15B] px-5 py-3 text-sm font-bold text-[#171717] shadow-sm transition hover:bg-[#B18C49]"
              >
                <Plus size={18} />
                Novo produto
              </Link>
            </div>
          </div>

          {/* INDICADORES QUADRADOS */}

          <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
            <MetricCard
              title="Faturamento"
              value="R$ 0,00"
              description="Total de vendas realizadas"
              icon={CircleDollarSign}
            />

            <MetricCard
              title="Vendas"
              value="0"
              description="Vendas realizadas no período"
              icon={ShoppingCart}
            />

            <MetricCard
              title="Lucro"
              value="R$ 0,00"
              description="Lucro estimado das vendas"
              icon={TrendingUp}
            />

            <MetricCard
              title="Produtos em estoque"
              value="0"
              description="Produtos cadastrados"
              icon={Package}
            />
          </div>

          {/* GRÁFICO E ESTOQUE */}

          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
            <section className="card-animated rounded-2xl border border-gray-200 bg-white p-5 shadow-sm xl:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-[#171717]">
                    Visão de vendas
                  </h3>

                  <p className="mt-1 text-xs text-gray-400">
                    Acompanhamento dos últimos sete dias
                  </p>
                </div>

                <span className="rounded-lg bg-[#C6A15B]/15 px-3 py-2 text-xs font-semibold text-[#A6813D]">
                  Últimos 7 dias
                </span>
              </div>

              <div className="mt-8 flex h-[210px] items-end justify-between gap-3 border-b border-l border-gray-100 px-2">
                {chartData.map((item) => (
                  <div
                    key={item.day}
                    className="flex h-full flex-1 flex-col items-center justify-end gap-3"
                  >
                    <div className="flex h-full w-full items-end justify-center">
                      <div
                        className="w-full max-w-[38px] rounded-t-lg bg-[#C6A15B] transition-all duration-300"
                        style={{
                          height: `${Math.max(
                            (item.value / maxValue) * 100,
                            3
                          )}%`,
                        }}
                      />
                    </div>

                    <span className="pb-2 text-xs text-gray-400">
                      {item.day}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  Total de vendas no período
                </span>

                <span className="font-bold text-[#171717]">
                  R$ 0,00
                </span>
              </div>
            </section>

            {/* SITUAÇÃO DO ESTOQUE */}

            <section className="card-animated rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-[#171717]">
                    Situação do estoque
                  </h3>

                  <p className="mt-1 text-xs text-gray-400">
                    Resumo dos produtos
                  </p>
                </div>

                <Boxes size={20} className="text-[#A6813D]" />
              </div>

              <div className="mt-7 space-y-5">
                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-gray-500">
                      Disponíveis
                    </span>

                    <strong className="text-[#171717]">0</strong>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div className="h-full w-0 rounded-full bg-[#C6A15B]" />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-gray-500">
                      Estoque baixo
                    </span>

                    <strong className="text-[#171717]">0</strong>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div className="h-full w-0 rounded-full bg-[#C0C0C0]" />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-gray-500">
                      Sem estoque
                    </span>

                    <strong className="text-[#171717]">0</strong>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div className="h-full w-0 rounded-full bg-gray-400" />
                  </div>
                </div>
              </div>

              <Link
                href="/estoque"
                className="mt-8 flex items-center justify-between border-t border-gray-100 pt-4 text-sm font-semibold text-[#A6813D] hover:text-[#171717]"
              >
                Consultar estoque
                <ArrowRight size={17} />
              </Link>
            </section>
          </div>

          {/* VENDAS RECENTES */}

          <section className="card-animated mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 p-5">
              <div>
                <h3 className="font-bold text-[#171717]">
                  Vendas recentes
                </h3>

                <p className="mt-1 text-xs text-gray-400">
                  Últimas movimentações da loja
                </p>
              </div>

              <Link
                href="/vendas"
                className="flex items-center gap-2 text-xs font-semibold text-[#A6813D] hover:text-[#171717]"
              >
                Ver todas
                <ArrowRight size={15} />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left">
                <thead className="bg-gray-50 text-xs text-gray-500">
                  <tr>
                    <th className="px-5 py-4 font-semibold">
                      Produto
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Cliente
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Data
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Valor
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {recentSales.length > 0 ? (
                    recentSales.map((sale) => (
                      <tr
                        key={sale.id}
                        className="border-t border-gray-100 text-sm"
                      >
                        <td className="px-5 py-4 font-semibold text-[#171717]">
                          {sale.product}
                        </td>

                        <td className="px-5 py-4 text-gray-500">
                          {sale.customer}
                        </td>

                        <td className="px-5 py-4 text-gray-500">
                          {sale.date}
                        </td>

                        <td className="px-5 py-4 font-semibold text-[#171717]">
                          {sale.value}
                        </td>

                        <td className="px-5 py-4">
                          <span className="rounded-full bg-[#C6A15B]/15 px-3 py-1 text-xs font-semibold text-[#A6813D]">
                            {sale.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-5 py-12 text-center text-sm text-gray-400"
                      >
                        Nenhuma venda registrada ainda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* ATENÇÃO NO ESTOQUE */}

          <section className="card-animated mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C6A15B]/15 text-[#A6813D]">
                  <AlertTriangle size={20} />
                </div>

                <div>
                  <h3 className="font-bold text-[#171717]">
                    Atenção ao estoque
                  </h3>

                  <p className="mt-1 text-xs text-gray-400">
                    Produtos que precisam de acompanhamento
                  </p>
                </div>
              </div>

              <Link
                href="/estoque"
                className="text-xs font-semibold text-[#A6813D] hover:text-[#171717]"
              >
                Ver estoque
              </Link>
            </div>

            {stockItems.length > 0 ? (
              <div className="mt-5 divide-y divide-gray-100">
                {stockItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-4"
                  >
                    <div>
                      <p className="text-sm font-semibold text-[#171717]">
                        {item.name}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        Quantidade: {item.quantity}
                      </p>
                    </div>

                    <span className="rounded-full bg-[#C6A15B]/15 px-3 py-1 text-xs font-semibold text-[#A6813D]">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-sm text-gray-400">
                Nenhum produto precisa de atenção no momento.
              </p>
            )}
          </section>

          {/* RODAPÉ */}

          <footer className="mt-8 border-t border-gray-200 py-6 text-center text-xs text-gray-400">
            TechControl © 2026 — Gestão Comercial
          </footer>
        </div>
      </main>
    </div>
  );
}
