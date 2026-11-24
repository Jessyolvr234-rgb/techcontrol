
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowUpFromLine,
  BarChart3,
  Bell,
  CalendarDays,
  ChevronDown,
  Download,
  Package,
  TrendingUp,
  CircleDollarSign,
  PieChart,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Period = "Esta semana" | "Este mês" | "Últimos 3 meses" | "Este ano";

type Sale = {
  id: string;
  total: number;
  subtotal: number;
  desconto: number;
  forma_pagamento: string | null;
  status: string;
  created_at: string;
};

type CashMovement = {
  id: string;
  tipo: string;
  valor: number;
  descricao: string | null;
  created_at: string;
  venda_id: string | null;
};

type SaleItem = {
  id: string;
  venda_id: string;
  produto_id: string;
  quantidade: number;
  preco_unitario: number;
  custo_unitario: number;
  total: number;
};

type Product = {
  id: string;
  nome: string;
  imei: string | null;
};

type ProductReport = {
  id: string;
  name: string;
  code: string;
  units: number;
  revenue: number;
  cost: number;
  profit: number;
};

type ChartItem = {
  label: string;
  revenue: number;
  expense: number;
};

const money = (value: number) =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

const numberValue = (value: unknown) => Number(value ?? 0) || 0;

function startOfDay(date: Date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

function getDateRange(period: Period) {
  const now = new Date();
  const end = new Date(now);
  end.setDate(end.getDate() + 1);
  end.setHours(0, 0, 0, 0);

  let start = startOfDay(now);

  if (period === "Esta semana") {
    const day = start.getDay();
    const difference = day === 0 ? 6 : day - 1;
    start.setDate(start.getDate() - difference);
  }

  if (period === "Este mês") {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  if (period === "Últimos 3 meses") {
    start = new Date(now.getFullYear(), now.getMonth() - 2, 1);
  }

  if (period === "Este ano") {
    start = new Date(now.getFullYear(), 0, 1);
  }

  return { start, end };
}

function buildChart(
  period: Period,
  sales: Sale[],
  expenses: CashMovement[]
): ChartItem[] {
  const now = new Date();
  const buckets: ChartItem[] = [];

  if (period === "Esta semana") {
    const monday = startOfDay(now);
    const difference =
      monday.getDay() === 0 ? 6 : monday.getDay() - 1;

    monday.setDate(monday.getDate() - difference);

    const labels = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

    for (let i = 0; i < 7; i++) {
      buckets.push({
        label: labels[i],
        revenue: 0,
        expense: 0,
      });
    }

    const getIndex = (value: string) => {
      const date = new Date(value);
      const day = date.getDay();
      return day === 0 ? 6 : day - 1;
    };

    sales.forEach((sale) => {
      buckets[getIndex(sale.created_at)].revenue += numberValue(
        sale.total
      );
    });

    expenses.forEach((item) => {
      buckets[getIndex(item.created_at)].expense += numberValue(
        item.valor
      );
    });

    return buckets;
  }

  if (period === "Este mês") {
    const daysInMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0
    ).getDate();

    const groupCount = Math.ceil(daysInMonth / 7);

    for (let i = 0; i < groupCount; i++) {
      buckets.push({
        label: `Sem. ${i + 1}`,
        revenue: 0,
        expense: 0,
      });
    }

    const getIndex = (value: string) => {
      const day = new Date(value).getDate();
      return Math.floor((day - 1) / 7);
    };

    sales.forEach((sale) => {
      const index = getIndex(sale.created_at);
      if (buckets[index]) {
        buckets[index].revenue += numberValue(sale.total);
      }
    });

    expenses.forEach((item) => {
      const index = getIndex(item.created_at);
      if (buckets[index]) {
        buckets[index].expense += numberValue(item.valor);
      }
    });

    return buckets;
  }

  const months = period === "Este ano" ? 12 : 3;
  const firstMonth = period === "Este ano" ? 0 : now.getMonth() - 2;

  for (let i = 0; i < months; i++) {
    const date = new Date(now.getFullYear(), firstMonth + i, 1);

    buckets.push({
      label: date.toLocaleDateString("pt-BR", {
        month: "short",
      }),
      revenue: 0,
      expense: 0,
    });
  }

  const getIndex = (value: string) => {
    const date = new Date(value);

    return (
      (date.getFullYear() - now.getFullYear()) * 12 +
      date.getMonth() -
      firstMonth
    );
  };

  sales.forEach((sale) => {
    const index = getIndex(sale.created_at);

    if (buckets[index]) {
      buckets[index].revenue += numberValue(sale.total);
    }
  });

  expenses.forEach((item) => {
    const index = getIndex(item.created_at);

    if (buckets[index]) {
      buckets[index].expense += numberValue(item.valor);
    }
  });

  return buckets;
}

export default function RelatoriosPage() {
  const supabase = useMemo(() => createClient(), []);

  const [period, setPeriod] = useState<Period>("Esta semana");
  const [reportType, setReportType] = useState("Visão geral");

  const [sales, setSales] = useState<Sale[]>([]);
  const [cashMovements, setCashMovements] = useState<CashMovement[]>([]);
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReports = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { start, end } = getDateRange(period);

      const startISO = start.toISOString();
      const endISO = end.toISOString();

      const [salesResult, cashResult] = await Promise.all([
        supabase
          .from("vendas")
          .select(
            "id, total, subtotal, desconto, forma_pagamento, status, created_at"
          )
          .eq("status", "concluida")
          .gte("created_at", startISO)
          .lt("created_at", endISO)
          .order("created_at", { ascending: true }),

        supabase
          .from("caixa")
          .select("id, tipo, valor, descricao, created_at, venda_id")
          .eq("tipo", "saida")
          .gte("created_at", startISO)
          .lt("created_at", endISO)
          .order("created_at", { ascending: true }),
      ]);

      if (salesResult.error) throw salesResult.error;
      if (cashResult.error) throw cashResult.error;

      const salesData = (salesResult.data ?? []) as Sale[];
      const cashData = (cashResult.data ?? []) as CashMovement[];

      setSales(salesData);
      setCashMovements(cashData);

      const saleIds = salesData.map((sale) => sale.id);

      if (saleIds.length === 0) {
        setSaleItems([]);
        setProducts([]);
        return;
      }

      const { data: itemsData, error: itemsError } = await supabase
        .from("itens_venda")
        .select(
          "id, venda_id, produto_id, quantidade, preco_unitario, custo_unitario, total"
        )
        .in("venda_id", saleIds);

      if (itemsError) throw itemsError;

      const items = (itemsData ?? []) as SaleItem[];
      setSaleItems(items);

      const productIds = Array.from(
        new Set(items.map((item) => item.produto_id))
      );

      if (productIds.length === 0) {
        setProducts([]);
        return;
      }

      const { data: productsData, error: productsError } = await supabase
        .from("produtos")
        .select("id, nome, imei")
        .in("id", productIds);

      if (productsError) throw productsError;

      setProducts((productsData ?? []) as Product[]);
    } catch (err) {
      console.error("Erro ao carregar relatórios:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível carregar os relatórios."
      );
    } finally {
      setLoading(false);
    }
  }, [period, supabase]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const totals = useMemo(() => {
    const revenue = sales.reduce(
      (sum, sale) => sum + numberValue(sale.total),
      0
    );

    const expense = cashMovements.reduce(
      (sum, item) => sum + numberValue(item.valor),
      0
    );

    const cost = saleItems.reduce(
      (sum, item) =>
        sum +
        numberValue(item.custo_unitario) *
          numberValue(item.quantidade),
      0
    );

    const grossProfit = revenue - cost;
    const netProfit = revenue - cost - expense;

    return {
      revenue,
      expense,
      cost,
      grossProfit,
      netProfit,
      salesCount: sales.length,
      averageTicket: sales.length ? revenue / sales.length : 0,
      margin: revenue ? (netProfit / revenue) * 100 : 0,
    };
  }, [sales, cashMovements, saleItems]);

  const chartData = useMemo(
    () => buildChart(period, sales, cashMovements),
    [period, sales, cashMovements]
  );

  const maxChartValue = Math.max(
    ...chartData.flatMap((item) => [
      item.revenue,
      item.expense,
    ]),
    1
  );

  const paymentData = useMemo(() => {
    const grouped: Record<string, number> = {};

    sales.forEach((sale) => {
      const name = sale.forma_pagamento || "Não informado";

      grouped[name] = (grouped[name] || 0) + numberValue(sale.total);
    });

    const total = Object.values(grouped).reduce(
      (sum, value) => sum + value,
      0
    );

    return Object.entries(grouped)
      .map(([name, amount]) => ({
        name,
        amount,
        value: total ? (amount / total) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [sales]);

  const productRanking = useMemo(() => {
    const productMap = new Map<string, Product>();

    products.forEach((product) => {
      productMap.set(product.id, product);
    });

    const grouped: Record<
      string,
      {
        units: number;
        revenue: number;
        cost: number;
      }
    > = {};

    saleItems.forEach((item) => {
      const id = item.produto_id;

      if (!grouped[id]) {
        grouped[id] = {
          units: 0,
          revenue: 0,
          cost: 0,
        };
      }

      grouped[id].units += numberValue(item.quantidade);
      grouped[id].revenue += numberValue(item.total);
      grouped[id].cost +=
        numberValue(item.custo_unitario) *
        numberValue(item.quantidade);
    });

    return Object.entries(grouped)
      .map(([id, values]): ProductReport => {
        const product = productMap.get(id);

        return {
          id,
          name: product?.nome || "Produto não encontrado",
          code: product?.imei || id.slice(0, 8),
          units: values.units,
          revenue: values.revenue,
          cost: values.cost,
          profit: values.revenue - values.cost,
        };
      })
      .sort((a, b) => b.revenue - a.revenue);
  }, [saleItems, products]);

  const visibleProducts =
    reportType === "Produtos" || reportType === "Visão geral"
      ? productRanking
      : [];

  const cards = [
    {
      label: "Faturamento",
      value: money(totals.revenue),
      caption: `${totals.salesCount} vendas concluídas`,
      icon: TrendingUp,
    },
    {
      label: "Despesas",
      value: money(totals.expense),
      caption: "Saídas registradas no caixa",
      icon: ArrowUpFromLine,
    },
    {
      label: "Lucro líquido",
      value: money(totals.netProfit),
      caption: "Após custos e despesas",
      icon: CircleDollarSign,
    },
    {
      label: "Margem líquida",
      value: `${totals.margin.toFixed(1)}%`,
      caption: "Sobre o faturamento",
      icon: BarChart3,
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#F5F5F5] text-[#171717]">
      <main className="min-w-0 w-full">
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-[#E7E7E7] bg-white/95 px-4 backdrop-blur-md sm:px-7 lg:px-9">
          <div>
            <p className="text-[10px] font-semibold tracking-[1.5px] text-[#A1A1A1]">
              GESTÃO COMERCIAL
            </p>
            <h2 className="text-[16px] font-bold">Relatórios</h2>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              aria-label="Atualizar relatórios"
              onClick={loadReports}
              className="rounded-xl border border-[#E5E5E5] p-2.5 transition hover:border-[#C6A15B] hover:bg-[#F5F5F5]"
            >
              <RefreshCw
                size={18}
                className={loading ? "animate-spin" : ""}
              />
            </button>

            <button
              aria-label="Notificações"
              className="rounded-xl border border-[#E5E5E5] p-2.5"
            >
              <Bell size={18} />
            </button>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#111111] text-xs font-bold text-[#C6A15B]">
              AD
            </div>

            <span className="hidden text-xs font-semibold sm:block">
              Admin
            </span>
          </div>
        </header>

        <div className="mx-auto max-w-[1600px] p-4 pb-28 sm:p-7 sm:pb-28 lg:p-9">
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="h-1 w-8 rounded-full bg-[#C6A15B]" />
                <span className="text-[10px] font-bold uppercase tracking-[1.8px] text-[#A68A51]">
                  Inteligência comercial
                </span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-[#111111]">
                Relatórios gerenciais
              </h1>

              <p className="mt-1 text-sm text-[#777777]">
                Analise o desempenho de vendas, caixa e estoque.
              </p>
            </div>

            <button
              onClick={() => window.print()}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#111111] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-black/10 transition hover:bg-[#292929]"
            >
              <Download size={18} className="text-[#C6A15B]" />
              Exportar relatório
            </button>
          </div>

          <div className="mb-7 flex flex-col gap-3 rounded-2xl border border-[#E8E8E8] bg-white p-4 shadow-sm sm:flex-row">
            <div className="relative flex-1">
              <CalendarDays
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C6A15B]"
              />

              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as Period)}
                className="h-11 w-full appearance-none rounded-xl border border-[#E8E8E8] bg-white pl-10 pr-9 text-sm outline-none transition focus:border-[#C6A15B] focus:ring-2 focus:ring-[#C6A15B]/10"
              >
                <option>Esta semana</option>
                <option>Este mês</option>
                <option>Últimos 3 meses</option>
                <option>Este ano</option>
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#999999]"
              />
            </div>

            <div className="relative flex-1">
              <PieChart
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C6A15B]"
              />

              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="h-11 w-full appearance-none rounded-xl border border-[#E8E8E8] bg-white pl-10 pr-9 text-sm outline-none transition focus:border-[#C6A15B] focus:ring-2 focus:ring-[#C6A15B]/10"
              >
                <option>Visão geral</option>
                <option>Vendas</option>
                <option>Financeiro</option>
                <option>Produtos</option>
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#999999]"
              />
            </div>
          </div>

          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle size={19} className="mt-0.5 shrink-0" />

              <div>
                <p className="font-semibold">
                  Não foi possível carregar os relatórios
                </p>
                <p className="mt-1 break-words text-xs">{error}</p>
              </div>
            </div>
          )}

          <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card, index) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.label}
                  className="group rounded-2xl border border-[#E8E8E8] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#D8C49B] hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#777777]">
                      {card.label}
                    </span>

                    <div
                      className={`rounded-xl p-2.5 ${
                        index === 1
                          ? "bg-[#F5EEEE] text-[#A66A6A]"
                          : "bg-[#F6F0E3] text-[#A68A51]"
                      }`}
                    >
                      <Icon size={19} />
                    </div>
                  </div>

                  <h3 className="mt-4 text-2xl font-bold tracking-tight text-[#111111]">
                    {loading ? "Carregando..." : card.value}
                  </h3>

                  <p className="mt-1 text-xs text-[#A0A0A0]">
                    {card.caption}
                  </p>

                  <div className="mt-4 h-1 overflow-hidden rounded-full bg-[#F0F0F0]">
                    <div className="h-full w-1/3 rounded-full bg-[#C6A15B]" />
                  </div>
                </div>
              );
            })}
          </div>

          {reportType !== "Produtos" && (
            <div className="mb-7 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,.7fr)]">
              <section className="rounded-2xl border border-[#E8E8E8] bg-white p-5 shadow-sm">
                <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-[#111111]">
                      Desempenho financeiro
                    </h3>
                    <p className="mt-1 text-xs text-[#999999]">
                      Receitas e despesas no período
                    </p>
                  </div>

                  <div className="flex gap-4 text-[11px] text-[#777777]">
                    <span className="flex items-center gap-2">
                      <i className="h-2 w-2 rounded-full bg-[#C6A15B]" />
                      Receita
                    </span>

                    <span className="flex items-center gap-2">
                      <i className="h-2 w-2 rounded-full bg-[#C7C7C7]" />
                      Despesa
                    </span>
                  </div>
                </div>

                <div className="flex h-64 items-end gap-3 border-b border-[#EEEEEE] px-2 sm:gap-5">
                  {chartData.map((item) => (
                    <div
                      key={item.label}
                      className="flex h-full flex-1 items-end justify-center gap-1"
                    >
                      <div
                        title={`Receita: ${money(item.revenue)}`}
                        className="w-3 rounded-t-md bg-[#C6A15B] transition-all sm:w-5"
                        style={{
                          height: `${
                            (item.revenue / maxChartValue) * 85
                          }%`,
                        }}
                      />

                      <div
                        title={`Despesa: ${money(item.expense)}`}
                        className="w-3 rounded-t-md bg-[#C7C7C7] transition-all sm:w-5"
                        style={{
                          height: `${
                            (item.expense / maxChartValue) * 85
                          }%`,
                        }}
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex px-2">
                  {chartData.map((item) => (
                    <span
                      key={item.label}
                      className="flex-1 text-center text-[11px] font-medium text-[#999999]"
                    >
                      {item.label}
                    </span>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-[#E8E8E8] bg-white p-5 shadow-sm">
                <div className="mb-6">
                  <h3 className="font-bold text-[#111111]">
                    Formas de pagamento
                  </h3>
                  <p className="mt-1 text-xs text-[#999999]">
                    Participação no faturamento
                  </p>
                </div>

                {paymentData.length > 0 ? (
                  <div className="space-y-5">
                    {paymentData.map((payment) => (
                      <div key={payment.name}>
                        <div className="mb-2 flex items-center justify-between gap-2 text-xs">
                          <span className="truncate text-[#666666]">
                            {payment.name}
                          </span>

                          <span className="font-bold text-[#111111]">
                            {payment.value.toFixed(1)}%
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-[#F0F0F0]">
                          <div
                            className="h-full rounded-full bg-[#C6A15B]"
                            style={{
                              width: `${payment.value}%`,
                            }}
                          />
                        </div>

                        <p className="mt-1 text-[10px] text-[#999999]">
                          {money(payment.amount)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex min-h-[190px] flex-col items-center justify-center text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F6F0E3] text-[#A68A51]">
                      <PieChart size={22} />
                    </div>

                    <p className="text-sm font-semibold text-[#444444]">
                      Sem vendas no período
                    </p>

                    <p className="mt-1 max-w-[210px] text-xs leading-5 text-[#999999]">
                      As formas de pagamento aparecerão aqui quando houver vendas concluídas.
                    </p>
                  </div>
                )}
              </section>
            </div>
          )}

          {reportType === "Financeiro" && (
            <section className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#E8E8E8] bg-white p-5">
                <p className="text-sm text-[#777777]">
                  Custo dos produtos vendidos
                </p>
                <p className="mt-3 text-xl font-bold">
                  {money(totals.cost)}
                </p>
              </div>

              <div className="rounded-2xl border border-[#E8E8E8] bg-white p-5">
                <p className="text-sm text-[#777777]">Lucro bruto</p>
                <p className="mt-3 text-xl font-bold">
                  {money(totals.grossProfit)}
                </p>
              </div>

              <div className="rounded-2xl border border-[#E8E8E8] bg-white p-5">
                <p className="text-sm text-[#777777]">Ticket médio</p>
                <p className="mt-3 text-xl font-bold">
                  {money(totals.averageTicket)}
                </p>
              </div>
            </section>
          )}

          {reportType === "Vendas" && (
            <section className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#E8E8E8] bg-white p-5">
                <p className="text-sm text-[#777777]">
                  Vendas concluídas
                </p>
                <p className="mt-3 text-xl font-bold">
                  {totals.salesCount}
                </p>
              </div>

              <div className="rounded-2xl border border-[#E8E8E8] bg-white p-5">
                <p className="text-sm text-[#777777]">Ticket médio</p>
                <p className="mt-3 text-xl font-bold">
                  {money(totals.averageTicket)}
                </p>
              </div>

              <div className="rounded-2xl border border-[#E8E8E8] bg-white p-5">
                <p className="text-sm text-[#777777]">
                  Descontos concedidos
                </p>
                <p className="mt-3 text-xl font-bold">
                  {money(
                    sales.reduce(
                      (sum, sale) =>
                        sum + numberValue(sale.desconto),
                      0
                    )
                  )}
                </p>
              </div>
            </section>
          )}

          {(reportType === "Produtos" ||
            reportType === "Visão geral") && (
            <section className="overflow-hidden rounded-2xl border border-[#E8E8E8] bg-white shadow-sm">
              <div className="flex flex-col justify-between gap-2 border-b border-[#EEEEEE] p-5 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-5 w-1 rounded-full bg-[#C6A15B]" />
                    <h3 className="font-bold text-[#111111]">
                      Produtos mais vendidos
                    </h3>
                  </div>

                  <p className="mt-2 text-xs text-[#999999]">
                    Ranking por faturamento no período.
                  </p>
                </div>

                <span className="w-fit rounded-lg bg-[#F6F0E3] px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-[#9C8048]">
                  {period}
                </span>
              </div>

              {visibleProducts.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left">
                    <thead className="bg-[#FAFAFA]">
                      <tr className="text-[11px] uppercase tracking-wide text-[#999999]">
                        <th className="px-5 py-4 font-semibold">
                          Produto
                        </th>
                        <th className="px-5 py-4 font-semibold">
                          Unidades
                        </th>
                        <th className="px-5 py-4 font-semibold">
                          Faturamento
                        </th>
                        <th className="px-5 py-4 font-semibold">
                          Lucro
                        </th>
                        <th className="px-5 py-4 text-right font-semibold">
                          Participação
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-[#EEEEEE]">
                      {visibleProducts.map((product, index) => {
                        const share = totals.revenue
                          ? (product.revenue / totals.revenue) * 100
                          : 0;

                        return (
                          <tr
                            key={product.id}
                            className="transition hover:bg-[#FCFAF5]"
                          >
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F6F0E3] text-xs font-bold text-[#9C8048]">
                                  {index + 1}
                                </span>

                                <div>
                                  <p className="text-sm font-semibold text-[#222222]">
                                    {product.name}
                                  </p>

                                  <p className="mt-1 text-[11px] text-[#999999]">
                                    {product.code}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-5 py-4 text-sm font-semibold">
                              {product.units} un.
                            </td>

                            <td className="px-5 py-4 text-sm font-bold text-[#111111]">
                              {money(product.revenue)}
                            </td>

                            <td className="px-5 py-4 text-sm font-semibold text-[#9C8048]">
                              {money(product.profit)}
                            </td>

                            <td className="px-5 py-4 text-right">
                              <span className="rounded-full bg-[#F6F0E3] px-3 py-1.5 text-[11px] font-semibold text-[#9C8048]">
                                {share.toFixed(1)}%
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F6F0E3] text-[#A68A51]">
                    <Package size={25} />
                  </div>

                  <h4 className="text-sm font-semibold text-[#333333]">
                    {loading
                      ? "Carregando produtos..."
                      : "Nenhum produto vendido no período"}
                  </h4>

                  <p className="mt-1 max-w-[300px] text-xs leading-5 text-[#999999]">
                    Os produtos vendidos aparecerão aqui com suas quantidades, faturamento e lucro.
                  </p>
                </div>
              )}

              <div className="border-t border-[#EEEEEE] px-5 py-4 text-xs text-[#999999]">
                Relatório gerado para: {period}
              </div>
            </section>
          )}

          <div className="mt-6 flex flex-col justify-between gap-2 border-t border-[#E5E5E5] pt-5 text-[11px] text-[#999999] sm:flex-row">
            <span>TechControl · Gestão Comercial</span>
            <span>Relatórios gerenciais</span>
          </div>
        </div>
      </main>
    </div>
  );
}
