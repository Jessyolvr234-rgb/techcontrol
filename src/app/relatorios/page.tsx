"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  BarChart3,
  Bell,
  Boxes,
  CalendarDays,
  ChevronDown,
  Download,
  Menu,
  Package,
  Settings,
  Smartphone,
  TrendingUp,
  Users,
  Wallet,
  X,
  CircleDollarSign,
  PieChart,
} from "lucide-react";

const navigation = [
  { label: "Dashboard", href: "/", icon: BarChart3 },
  { label: "Produtos", href: "/produtos", icon: Package },
  { label: "Estoque", href: "/estoque", icon: Boxes },
  { label: "Entradas", href: "/estoque/entradas", icon: ArrowDownToLine },
  { label: "Saídas e vendas", href: "/vendas", icon: ArrowUpFromLine },
  { label: "Caixa", href: "/caixa", icon: Wallet },
  { label: "Relatórios", href: "/relatorios", icon: TrendingUp },
];

const weeklyData = [
  { label: "Seg", revenue: 0, expense: 0 },
  { label: "Ter", revenue: 0, expense: 0 },
  { label: "Qua", revenue: 0, expense: 0 },
  { label: "Qui", revenue: 0, expense: 0 },
  { label: "Sex", revenue: 0, expense: 0 },
  { label: "Sáb", revenue: 0, expense: 0 },
  { label: "Dom", revenue: 0, expense: 0 },
];

const products: Array<{ name: string; code: string; units: number; revenue: number; profit: number }> = [];

const payments: Array<{ name: string; value: number; color: string }> = [];

const money = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function Sidebar({ mobile = false, onClose }: { mobile?: boolean; onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <aside className={`flex h-full w-[260px] flex-col bg-[#101010] text-white ${mobile ? "shadow-2xl" : ""}`}>
      <div className="flex h-[82px] items-center justify-between border-b border-white/10 px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black">
            <Smartphone size={23} />
          </div>
          <div>
            <h1 className="text-[19px] font-bold">TechControl</h1>
            <p className="text-[9px] font-semibold tracking-[2px] text-gray-500">GESTÃO COMERCIAL</p>
          </div>
        </Link>
        {mobile && (
          <button onClick={onClose} aria-label="Fechar menu" className="rounded-lg p-2 hover:bg-white/10">
            <X size={21} />
          </button>
        )}
      </div>

      <div className="px-4 pt-8">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[1.8px] text-gray-500">Menu principal</p>
        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => mobile && onClose?.()}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-medium transition ${
                  active ? "bg-white text-black shadow-lg" : "text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <p className="mb-3 mt-9 px-3 text-[10px] font-bold uppercase tracking-[1.8px] text-gray-500">Administração</p>
        <nav className="space-y-1">
          <Link href="/usuarios" className="flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-medium text-gray-400 hover:bg-white/10 hover:text-white">
            <Users size={18} /> Usuários
          </Link>
          <Link href="/configuracoes" className="flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-medium text-gray-400 hover:bg-white/10 hover:text-white">
            <Settings size={18} /> Configurações
          </Link>
        </nav>
      </div>

      <div className="mt-auto p-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-xs font-bold text-black">AD</div>
            <div>
              <p className="text-xs font-semibold">Administrador</p>
              <p className="text-[10px] text-gray-500">Acesso administrativo</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default function RelatoriosPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [period, setPeriod] = useState("Esta semana");
  const [reportType, setReportType] = useState("Visão geral");

  const totals = useMemo(() => ({
    revenue: weeklyData.reduce((sum, item) => sum + item.revenue, 0),
    expense: weeklyData.reduce((sum, item) => sum + item.expense, 0),
  }), []);

  const profit = totals.revenue - totals.expense;

  return (
    <div className="min-h-screen bg-[#F7F7F8] text-[#171717]">
      <div className="flex min-h-screen">
        <div className="hidden shrink-0 lg:block"><Sidebar /></div>

        {menuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button onClick={() => setMenuOpen(false)} className="absolute inset-0 bg-black/50" aria-label="Fechar menu" />
            <div className="relative h-full w-[280px]"><Sidebar mobile onClose={() => setMenuOpen(false)} /></div>
          </div>
        )}

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-gray-200 bg-white/95 px-4 backdrop-blur-md sm:px-7 lg:px-9">
            <div className="flex items-center gap-3">
              <button onClick={() => setMenuOpen(true)} aria-label="Abrir menu" className="rounded-xl border border-gray-200 p-2.5 lg:hidden">
                <Menu size={20} />
              </button>
              <div>
                <p className="text-[10px] text-gray-400">GESTÃO COMERCIAL</p>
                <h2 className="text-[16px] font-bold">Relatórios</h2>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button aria-label="Notificações" className="rounded-xl border border-gray-200 p-2.5">
                <Bell size={18} />
              </button>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-xs font-bold text-white">AD</div>
              <span className="hidden text-xs font-semibold sm:block">Admin</span>
            </div>
          </header>

          <div className="mx-auto max-w-[1600px] p-4 sm:p-7 lg:p-9">
            <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Relatórios gerenciais</h1>
                <p className="mt-1 text-sm text-gray-500">Analise o desempenho de vendas, caixa e estoque.</p>
              </div>
              <button onClick={() => window.print()} className="flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800">
                <Download size={18} /> Exportar relatório
              </button>
            </div>

            <div className="mb-7 flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 sm:flex-row">
              <div className="relative flex-1">
                <CalendarDays size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select value={period} onChange={(e) => setPeriod(e.target.value)} className="h-11 w-full appearance-none rounded-xl border border-gray-200 bg-white pl-10 pr-9 text-sm outline-none focus:border-black">
                  <option>Esta semana</option>
                  <option>Este mês</option>
                  <option>Últimos 3 meses</option>
                  <option>Este ano</option>
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              <div className="relative flex-1">
                <PieChart size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="h-11 w-full appearance-none rounded-xl border border-gray-200 bg-white pl-10 pr-9 text-sm outline-none focus:border-black">
                  <option>Visão geral</option>
                  <option>Vendas</option>
                  <option>Financeiro</option>
                  <option>Produtos</option>
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Faturamento", value: money(totals.revenue), caption: period, icon: TrendingUp, tone: "bg-emerald-50 text-emerald-600" },
                { label: "Despesas", value: money(totals.expense), caption: "Custos e saídas", icon: ArrowUpFromLine, tone: "bg-red-50 text-red-600" },
                { label: "Lucro líquido", value: money(profit), caption: "Após despesas", icon: CircleDollarSign, tone: "bg-blue-50 text-blue-600" },
                { label: "Margem líquida", value: `${totals.revenue ? ((profit / totals.revenue) * 100).toFixed(1) : "0.0"}%`, caption: "Sobre o faturamento", icon: BarChart3, tone: "bg-violet-50 text-violet-600" },
              ].map((card) => {
                const Icon = card.icon;
                return (
                  <div key={card.label} className="rounded-2xl border border-gray-200 bg-white p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{card.label}</span>
                      <div className={`rounded-xl p-2.5 ${card.tone}`}><Icon size={19} /></div>
                    </div>
                    <h3 className="mt-4 text-2xl font-bold">{card.value}</h3>
                    <p className="mt-1 text-xs text-gray-400">{card.caption}</p>
                  </div>
                );
              })}
            </div>

            <div className="mb-7 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,.7fr)]">
              <section className="rounded-2xl border border-gray-200 bg-white p-5">
                <div className="mb-6 flex items-start justify-between">
                  <div>
                    <h3 className="font-bold">Desempenho financeiro</h3>
                    <p className="mt-1 text-xs text-gray-400">Receitas e despesas por dia</p>
                  </div>
                  <div className="flex gap-4 text-[11px] text-gray-500">
                    <span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-black" /> Receita</span>
                    <span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-gray-300" /> Despesa</span>
                  </div>
                </div>

                <div className="flex h-64 items-end gap-3 border-b border-gray-100 px-2 sm:gap-5">
                  {weeklyData.map((item) => (
                    <div key={item.label} className="flex flex-1 items-end justify-center gap-1">
                      <div title={money(item.revenue)} className="w-3 rounded-t-md bg-black sm:w-5" style={{ height: `${(item.revenue / 10000) * 100}%` }} />
                      <div title={money(item.expense)} className="w-3 rounded-t-md bg-gray-300 sm:w-5" style={{ height: `${(item.expense / 10000) * 100}%` }} />
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex px-2">
                  {weeklyData.map((item) => (
                    <span key={item.label} className="flex-1 text-center text-[11px] text-gray-400">{item.label}</span>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-gray-200 bg-white p-5">
                <div className="mb-6">
                  <h3 className="font-bold">Formas de pagamento</h3>
                  <p className="mt-1 text-xs text-gray-400">Participação nas vendas</p>
                </div>
                <div className="space-y-5">
                  {payments.map((payment) => (
                    <div key={payment.name}>
                      <div className="mb-2 flex items-center justify-between text-xs">
                        <span className="text-gray-600">{payment.name}</span>
                        <span className="font-bold">{payment.value}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                        <div className={`h-full rounded-full ${payment.color}`} style={{ width: `${payment.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <div className="border-b border-gray-100 p-5">
                <h3 className="font-bold">Produtos mais vendidos</h3>
                <p className="mt-1 text-xs text-gray-400">Ranking por faturamento no período.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left">
                  <thead className="bg-gray-50">
                    <tr className="text-[11px] uppercase tracking-wide text-gray-400">
                      <th className="px-5 py-4 font-semibold">Produto</th>
                      <th className="px-5 py-4 font-semibold">Unidades</th>
                      <th className="px-5 py-4 font-semibold">Faturamento</th>
                      <th className="px-5 py-4 font-semibold">Lucro</th>
                      <th className="px-5 py-4 text-right font-semibold">Participação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map((product, index) => {
                      const share = totals.revenue ? (product.revenue / totals.revenue) * 100 : 0;
                      return (
                        <tr key={product.code} className="transition hover:bg-gray-50/70">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-xs font-bold">{index + 1}</span>
                              <div>
                                <p className="text-sm font-semibold">{product.name}</p>
                                <p className="mt-1 text-[11px] text-gray-400">{product.code}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-sm font-semibold">{product.units} un.</td>
                          <td className="px-5 py-4 text-sm font-bold">{money(product.revenue)}</td>
                          <td className="px-5 py-4 text-sm font-semibold text-emerald-600">{money(product.profit)}</td>
                          <td className="px-5 py-4 text-right">
                            <span className="rounded-full bg-gray-100 px-3 py-1.5 text-[11px] font-semibold">{share.toFixed(1)}%</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-gray-100 px-5 py-4 text-xs text-gray-400">Relatório gerado para: {period}</div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
