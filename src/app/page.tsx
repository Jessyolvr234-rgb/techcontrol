
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Package,
  ArrowDownToLine,
  ArrowUpFromLine,
  Wallet,
  BarChart3,
  Users,
  Settings,
  Search,
  Bell,
  Menu,
  X,
  TrendingUp,
  Smartphone,
  MoreHorizontal,
  Plus,
  ChevronDown,
  CircleAlert,
  ShoppingBag,
  CalendarDays,
  ArrowUpRight,
  LogOut,
  Boxes,
} from "lucide-react";

// NAVEGAÇÃO PRINCIPAL

const navigation = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Produtos", href: "/produtos", icon: Package },
  { label: "Estoque", href: "/estoque", icon: Boxes },
  { label: "Entradas", href: "/estoque/entradas", icon: ArrowDownToLine },
  { label: "Saídas e vendas", href: "/vendas", icon: ArrowUpFromLine },
  { label: "Caixa", href: "/caixa", icon: Wallet },
  { label: "Relatórios", href: "/relatorios", icon: BarChart3 },
];

// DADOS DEMONSTRATIVOS

const sales: Array<{
  id: string;
  product: string;
  detail: string;
  client: string;
  payment: string;
  value: number;
  status: string;
}> = [];

const stock: Array<{
  name: string;
  variation: string;
  quantity: number;
  minimum: number;
  icon: typeof Smartphone;
}> = [];

const chartData = [
  { day: "Seg", value: 0 },
  { day: "Ter", value: 0 },
  { day: "Qua", value: 0 },
  { day: "Qui", value: 0 },
  { day: "Sex", value: 0 },
  { day: "Sáb", value: 0 },
  { day: "Dom", value: 0 },
];

// FORMATAÇÃO DE MOEDA

function money(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2,
  });
}

// SIDEBAR

function Sidebar({
  mobile = false,
  onClose,
}: {
  mobile?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={`flex h-full w-[260px] flex-col bg-[#101010] text-white ${
        mobile ? "shadow-2xl" : ""
      }`}
    >
      {/* LOGO */}

      <div className="flex h-[82px] items-center justify-between border-b border-white/10 px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black">
            <Smartphone size={23} strokeWidth={2.3} />
          </div>

          <div>
            <h1 className="text-[19px] font-bold tracking-tight">
              TechControl
            </h1>
            <p className="text-[9px] font-semibold tracking-[2px] text-gray-500">
              GESTÃO COMERCIAL
            </p>
          </div>
        </div>

        {mobile && (
          <button
            onClick={onClose}
            aria-label="Fechar menu"
            className="rounded-lg p-2 hover:bg-white/10"
          >
            <X size={21} />
          </button>
        )}
      </div>

      {/* MENU PRINCIPAL */}

      <div className="px-4 pt-8">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[1.8px] text-gray-500">
          Menu principal
        </p>

        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => mobile && onClose?.()}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-medium transition ${
                  active
                    ? "bg-white text-black shadow-lg"
                    : "text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={18} />

                {item.label}

                {item.label === "Estoque" && (
                  <span
                    className={`ml-auto rounded-md px-2 py-0.5 text-[10px] ${
                      active
                        ? "bg-gray-100 text-black"
                        : "bg-white/10 text-white"
                    }`}
                  >
                    3
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* ADMINISTRAÇÃO */}

        <p className="mb-3 mt-9 px-3 text-[10px] font-bold uppercase tracking-[1.8px] text-gray-500">
          Administração
        </p>

        <nav className="space-y-1">
          <Link
            href="/usuarios"
            onClick={() => mobile && onClose?.()}
            className={`flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-medium transition ${
              pathname === "/usuarios"
                ? "bg-white text-black"
                : "text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Users size={18} />
            Usuários
          </Link>

          <Link
            href="/configuracoes"
            onClick={() => mobile && onClose?.()}
            className={`flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-medium transition ${
              pathname === "/configuracoes"
                ? "bg-white text-black"
                : "text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Settings size={18} />
            Configurações
          </Link>
        </nav>
      </div>

      {/* RODAPÉ DA SIDEBAR */}

      <div className="mt-auto p-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
              <ShoppingBag size={15} />
            </div>

            <span className="text-xs font-semibold">
              TechControl Pro
            </span>
          </div>

          <p className="text-[11px] leading-relaxed text-gray-500">
            Gerencie sua loja com praticidade e controle.
          </p>
        </div>

        <div className="mt-4 flex items-center gap-3 border-t border-white/10 pt-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-xs font-bold text-black">
            AD
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold">
              Administrador
            </p>
            <p className="text-[10px] text-gray-500">
              Acesso administrativo
            </p>
          </div>

          <LogOut size={17} className="text-gray-500" />
        </div>
      </div>
    </aside>
  );
}

// CARTÕES DE INDICADORES

function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  trend?: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-medium text-gray-500">
          {title}
        </span>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-800">
          <Icon size={19} />
        </div>
      </div>

      <h3 className="mt-4 text-[25px] font-bold tracking-tight text-[#171717] sm:text-[28px]">
        {value}
      </h3>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        {trend && (
          <span className="flex items-center gap-1 rounded-md bg-green-50 px-2 py-1 text-[10px] font-bold text-green-700">
            <TrendingUp size={12} />
            {trend}
          </span>
        )}

        <span className="text-[10px] text-gray-400">
          {description}
        </span>
      </div>
    </div>
  );
}

// DASHBOARD

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredSales = sales.filter((sale) =>
    `${sale.id} ${sale.product} ${sale.client}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F7F7F8] text-[#171717]">
      <div className="flex min-h-screen">

        {/* SIDEBAR DESKTOP */}

        <div className="hidden shrink-0 lg:block">
          <Sidebar />
        </div>

        {/* MENU MOBILE */}

        {menuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              aria-label="Fechar menu"
              onClick={() => setMenuOpen(false)}
              className="absolute inset-0 bg-black/50"
            />

            <div className="relative h-full w-[280px]">
              <Sidebar
                mobile
                onClose={() => setMenuOpen(false)}
              />
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1">

          {/* HEADER */}

          <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-gray-200 bg-white/95 px-4 backdrop-blur-md sm:px-7 lg:px-9">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMenuOpen(true)}
                aria-label="Abrir menu"
                className="rounded-xl border border-gray-200 p-2.5 lg:hidden"
              >
                <Menu size={20} />
              </button>

              <div>
                <p className="text-[10px] font-medium text-gray-400">
                  PÁGINA INICIAL
                </p>
                <h2 className="text-[16px] font-bold">
                  Dashboard
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">

              {/* PESQUISA */}

              <div className="hidden h-10 w-60 items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 md:flex">
                <Search size={16} className="text-gray-400" />

                <input
                  placeholder="Pesquisar..."
                  className="w-full bg-transparent text-xs outline-none placeholder:text-gray-400"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                <span className="rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[9px] text-gray-400">
                  ⌘ K
                </span>
              </div>

              {/* NOTIFICAÇÕES */}

              <button
                aria-label="Notificações"
                className="relative rounded-xl border border-gray-200 p-2.5 hover:bg-gray-50"
              >
                <Bell size={18} />
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-black" />
              </button>

              {/* USUÁRIO */}

              <div className="hidden h-9 w-9 items-center justify-center rounded-full bg-black text-xs font-bold text-white sm:flex">
                AD
              </div>

              <button className="hidden items-center gap-1 text-xs font-semibold sm:flex">
                Admin
                <ChevronDown size={14} />
              </button>
            </div>
          </header>

          {/* CONTEÚDO */}

          <div className="mx-auto max-w-[1600px] p-4 sm:p-7 lg:p-9">

            {/* BOAS-VINDAS */}

            <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm text-gray-500">
                  Bem-vindo de volta, Administrador 👋
                </p>

                <h1 className="mt-1 text-[25px] font-bold tracking-tight sm:text-[30px]">
                  Visão geral da loja
                </h1>

                <p className="mt-1 text-xs text-gray-400">
                  Acompanhe os indicadores e movimentações do seu negócio.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold shadow-sm">
                  <CalendarDays size={15} />
                  Novembro, 2026
                  <ChevronDown size={14} />
                </button>

                <Link
                  href="/produtos"
                  className="flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-gray-800"
                >
                  <Plus size={16} />
                  Novo produto
                </Link>
              </div>
            </div>

            {/* INDICADORES */}

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                title="Faturamento do mês"
                value="R$ 0,00"
                description="em relação ao mês anterior"
                trend="0%"
                icon={Wallet}
              />

              <MetricCard
                title="Vendas realizadas"
                value="0"
                description="em relação ao mês anterior"
                trend="0%"
                icon={ShoppingBag}
              />

              <MetricCard
                title="Lucro bruto estimado"
                value="R$ 0,00"
                description="em relação ao mês anterior"
                trend="0%"
                icon={TrendingUp}
              />

              <MetricCard
                title="Produtos em estoque"
                value="0"
                description="unidades cadastradas"
                icon={Package}
              />
            </div>

            {/* GRÁFICO E RESUMO DO ESTOQUE */}

            <div className="mb-6 grid grid-cols-1 gap-5 xl:grid-cols-[1.65fr_1fr]">

              {/* GRÁFICO */}

              <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold">
                      Desempenho de vendas
                    </h3>

                    <p className="mt-1 text-[11px] text-gray-400">
                      Acompanhamento dos últimos 7 dias
                    </p>
                  </div>

                  <button
                    aria-label="Mais opções do gráfico"
                    className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50"
                  >
                    <MoreHorizontal size={18} />
                  </button>
                </div>

                <div className="mt-7 flex items-end justify-between gap-2 sm:gap-4">
                  {chartData.map((item) => (
                    <div
                      key={item.day}
                      className="flex flex-1 flex-col items-center gap-3"
                    >
                      <span className="text-[9px] text-gray-400">
                        {item.value}k
                      </span>

                      <div className="flex h-[150px] w-full items-end overflow-hidden rounded-t-lg bg-gray-100">
                        <div
                          className={`w-full rounded-t-lg transition-all ${
                            item.day === "Sáb"
                              ? "bg-black"
                              : "bg-gray-300"
                          }`}
                          style={{ height: `${item.value}%` }}
                        />
                      </div>

                      <span className="text-[10px] font-medium text-gray-400">
                        {item.day}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex items-center gap-2 border-t border-gray-100 pt-4">
                  <span className="h-2 w-2 rounded-full bg-black" />
                  <span className="text-[10px] text-gray-500">
                    Vendas por dia
                  </span>
                </div>
              </section>

              {/* RESUMO ESTOQUE */}

              <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold">
                      Resumo do estoque
                    </h3>

                    <p className="mt-1 text-[11px] text-gray-400">
                      Situação dos produtos
                    </p>
                  </div>

                  <Package size={19} className="text-gray-400" />
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-[10px] text-gray-500">
                      Disponíveis
                    </p>

                    <p className="mt-1 text-2xl font-bold">
                      0
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-[10px] text-gray-500">
                      Estoque baixo
                    </p>

                    <p className="mt-1 text-2xl font-bold text-orange-600">
                      0
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="mb-2 flex justify-between text-[10px]">
                    <span className="text-gray-500">
                      Nível de estoque
                    </span>

                    <span className="font-semibold">
                      0%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div className="h-full w-0 rounded-full bg-black" />
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2 rounded-xl border border-orange-100 bg-orange-50 p-3">
                  <CircleAlert
                    size={17}
                    className="shrink-0 text-orange-600"
                  />

                  <p className="text-[10px] leading-relaxed text-orange-800">
                    Nenhum produto precisa de reposição no momento.
                  </p>
                </div>
              </section>
            </div>

            {/* ÚLTIMAS VENDAS E ALERTAS */}

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.65fr_1fr]">

              {/* ÚLTIMAS VENDAS */}

              <section className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold">
                      Últimas vendas
                    </h3>

                    <p className="mt-1 text-[11px] text-gray-400">
                      Movimentações comerciais recentes
                    </p>
                  </div>

                  <Link
                    href="/vendas"
                    className="text-[11px] font-semibold text-gray-600 hover:text-black"
                  >
                    Ver todas{" "}
                    <ArrowUpRight
                      className="ml-1 inline"
                      size={13}
                    />
                  </Link>
                </div>

                {/* PESQUISA MOBILE */}

                <div className="mb-4 md:hidden">
                  <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2">
                    <Search size={15} className="text-gray-400" />

                    <input
                      placeholder="Pesquisar vendas..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px] text-left">
                    <thead>
                      <tr className="border-b border-gray-100 text-[10px] text-gray-400">
                        <th className="pb-3 font-medium">Produto</th>
                        <th className="pb-3 font-medium">Cliente</th>
                        <th className="pb-3 font-medium">Pagamento</th>
                        <th className="pb-3 font-medium">Valor</th>
                        <th className="pb-3 font-medium">Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredSales.map((sale) => (
                        <tr
                          key={sale.id}
                          className="border-b border-gray-50 last:border-0"
                        >
                          <td className="py-4">
                            <p className="text-xs font-semibold">
                              {sale.product}
                            </p>

                            <p className="mt-1 text-[10px] text-gray-400">
                              {sale.detail} · {sale.id}
                            </p>
                          </td>

                          <td className="py-4 text-xs text-gray-600">
                            {sale.client}
                          </td>

                          <td className="py-4 text-xs text-gray-600">
                            {sale.payment}
                          </td>

                          <td className="py-4 text-xs font-bold">
                            {money(sale.value)}
                          </td>

                          <td className="py-4">
                            <span
                              className={`rounded-md px-2 py-1 text-[9px] font-semibold ${
                                sale.status === "Concluída"
                                  ? "bg-green-50 text-green-700"
                                  : "bg-yellow-50 text-yellow-700"
                              }`}
                            >
                              {sale.status}
                            </span>
                          </td>
                        </tr>
                      ))}

                      {filteredSales.length === 0 && (
                        <tr>
                          <td
                            colSpan={5}
                            className="py-8 text-center text-xs text-gray-400"
                          >
                            Nenhuma venda encontrada.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* ATENÇÃO AO ESTOQUE */}

              <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold">
                      Atenção ao estoque
                    </h3>

                    <p className="mt-1 text-[11px] text-gray-400">
                      Produtos abaixo do mínimo
                    </p>
                  </div>

                  <CircleAlert
                    size={18}
                    className="text-orange-500"
                  />
                </div>

                <div className="mt-5 space-y-4">
                  {stock.map((product) => {
                    const Icon = product.icon;

                    return (
                      <div
                        key={product.name}
                        className="flex items-center gap-3 border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                          <Icon size={19} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-semibold">
                            {product.name}
                          </p>

                          <p className="mt-1 truncate text-[10px] text-gray-400">
                            {product.variation}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-bold text-orange-600">
                            {product.quantity}
                          </p>

                          <p className="text-[9px] text-gray-400">
                            Mín. {product.minimum}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Link
                  href="/estoque"
                  className="mt-5 block w-full rounded-xl border border-gray-200 py-3 text-center text-[11px] font-semibold transition hover:bg-gray-50"
                >
                  Gerenciar estoque{" "}
                  <ArrowUpRight
                    size={13}
                    className="ml-1 inline"
                  />
                </Link>
              </section>
            </div>

            {/* RODAPÉ */}

            <footer className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-gray-200 py-5 text-[10px] text-gray-400 sm:flex-row">
              <p>
                © 2026 TechControl. Todos os direitos reservados.
              </p>

              <p>Gestão inteligente para sua loja.</p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
