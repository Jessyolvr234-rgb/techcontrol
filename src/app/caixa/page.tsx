
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  BarChart3,
  Bell,
  Boxes,
  CalendarDays,
  ChevronDown,
  Package,
  Plus,
  Search,
  Settings,
  Smartphone,
  TrendingUp,
  Users,
  Wallet,
  X,
  Eye,
  CreditCard,
  Banknote,
  QrCode,
  CircleDollarSign,
  Landmark,
  RefreshCw,
} from "lucide-react";

type Movement = {
  id: string;
  type: "Entrada" | "Saída";
  description: string;
  category: string;
  payment: "Pix" | "Cartão" | "Dinheiro" | "Transferência";
  value: number;
  date: string;
  responsible: string;
  notes: string;
  saleId: string | null;
};

const navigation = [
  { label: "Dashboard", href: "/", icon: BarChart3 },
  { label: "Produtos", href: "/produtos", icon: Package },
  { label: "Estoque", href: "/estoque", icon: Boxes },
  { label: "Entradas", href: "/estoque/entradas", icon: ArrowDownToLine },
  { label: "Saídas e vendas", href: "/vendas", icon: ArrowUpFromLine },
  { label: "Caixa", href: "/caixa", icon: Wallet },
  { label: "Relatórios", href: "/relatorios", icon: TrendingUp },
];

const money = (value: number) =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

function getToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dateFormat(date: string) {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "—";

  return parsed.toLocaleDateString("pt-BR");
}

function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full min-h-screen w-[260px] flex-col bg-[#111111] text-white">
      <div className="flex h-[82px] items-center border-b border-white/10 px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C6A15B] text-[#111111]">
            <Smartphone size={23} />
          </div>

          <div>
            <h1 className="text-[19px] font-bold tracking-tight">
              TechControl
            </h1>
            <p className="text-[9px] font-semibold tracking-[2px] text-[#C6A15B]">
              GESTÃO COMERCIAL
            </p>
          </div>
        </Link>
      </div>

      <div className="px-4 pt-8">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[1.8px] text-[#9A9A9A]">
          Menu principal
        </p>

        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-medium transition ${
                  active
                    ? "bg-[#C6A15B] text-[#111111] shadow-lg shadow-[#C6A15B]/10"
                    : "text-gray-400 hover:bg-white/10 hover:text-[#E4D2A8]"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <p className="mb-3 mt-9 px-3 text-[10px] font-bold uppercase tracking-[1.8px] text-[#9A9A9A]">
          Administração
        </p>

        <nav className="space-y-1">
          <Link
            href="/usuarios"
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-medium text-gray-400 transition hover:bg-white/10 hover:text-[#E4D2A8]"
          >
            <Users size={18} /> Usuários
          </Link>

          <Link
            href="/configuracoes"
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-medium text-gray-400 transition hover:bg-white/10 hover:text-[#E4D2A8]"
          >
            <Settings size={18} /> Configurações
          </Link>
        </nav>
      </div>

      <div className="mt-auto p-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C6A15B] text-xs font-bold text-[#111111]">
              AD
            </div>
            <div>
              <p className="text-xs font-semibold">Administrador</p>
              <p className="text-[10px] text-gray-500">
                Acesso administrativo
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default function CaixaPage() {
  const supabase = createClient();

  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [movementType, setMovementType] = useState("Todas");
  const [modalOpen, setModalOpen] = useState(false);
  const [details, setDetails] = useState<Movement | null>(null);

  const [type, setType] = useState<"Entrada" | "Saída">("Entrada");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Outros recebimentos");
  const [payment, setPayment] =
    useState<Movement["payment"]>("Dinheiro");
  const [value, setValue] = useState("");
  const [date, setDate] = useState(getToday());
  const [notes, setNotes] = useState("");

  const loadMovements = useCallback(async () => {
    setLoading(true);
    setError("");

    const { data, error: queryError } = await supabase
      .from("caixa")
      .select(`
        id,
        tipo,
        descricao,
        categoria,
        valor,
        forma_pagamento,
        venda_id,
        usuario_id,
        created_at,
        observacoes,
        usuarios (
          nome
        )
      `)
      .order("created_at", { ascending: false });

    if (queryError) {
      console.error("Erro ao carregar caixa:", queryError);
      setError("Não foi possível carregar as movimentações do caixa.");
      setLoading(false);
      return;
    }

    const formatted: Movement[] = (data ?? []).map((item: any) => ({
      id: String(item.id),
      type: item.tipo === "entrada" ? "Entrada" : "Saída",
      description: item.descricao ?? "Movimentação",
      category: item.categoria ?? "Não informada",
      payment: (
        ["Pix", "Cartão", "Dinheiro", "Transferência"].includes(
          item.forma_pagamento
        )
          ? item.forma_pagamento
          : "Dinheiro"
      ) as Movement["payment"],
      value: Number(item.valor ?? 0),
      date: item.created_at,
      responsible: item.usuarios?.nome ?? "Usuário",
      notes: item.observacoes ?? "",
      saleId: item.venda_id ? String(item.venda_id) : null,
    }));

    setMovements(formatted);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadMovements();
  }, [loadMovements]);

  const filteredMovements = useMemo(() => {
    const term = search.toLowerCase();

    return movements.filter((movement) => {
      const matchesSearch =
        movement.description.toLowerCase().includes(term) ||
        movement.category.toLowerCase().includes(term) ||
        movement.payment.toLowerCase().includes(term) ||
        movement.responsible.toLowerCase().includes(term) ||
        movement.id.toLowerCase().includes(term);

      const matchesType =
        movementType === "Todas" || movement.type === movementType;

      return matchesSearch && matchesType;
    });
  }, [movements, search, movementType]);

  const totalEntries = movements
    .filter((movement) => movement.type === "Entrada")
    .reduce((sum, movement) => sum + movement.value, 0);

  const totalExits = movements
    .filter((movement) => movement.type === "Saída")
    .reduce((sum, movement) => sum + movement.value, 0);

  const openingBalance = 0;
  const balance = openingBalance + totalEntries - totalExits;

  function resetForm() {
    setType("Entrada");
    setDescription("");
    setCategory("Outros recebimentos");
    setPayment("Dinheiro");
    setValue("");
    setDate(getToday());
    setNotes("");
  }

  function openNewMovement() {
    resetForm();
    setModalOpen(true);
  }

  async function saveMovement() {
    if (saving) return;

    const numericValue = Number(value);

    if (!description.trim()) {
      alert("Preencha a descrição da movimentação.");
      return;
    }

    if (!date) {
      alert("Informe a data da movimentação.");
      return;
    }

    if (!Number.isFinite(numericValue) || numericValue <= 0) {
      alert("Informe um valor válido.");
      return;
    }

    setSaving(true);

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error(
          "Sua sessão não foi encontrada. Entre novamente no sistema."
        );
      }

      const movementDate = new Date(
        `${date}T12:00:00`
      ).toISOString();

      const { error: insertError } = await supabase
        .from("caixa")
        .insert({
          tipo: type === "Entrada" ? "entrada" : "saida",
          descricao: description.trim(),
          categoria: category,
          valor: numericValue,
          forma_pagamento: payment,
          usuario_id: user.id,
          venda_id: null,
          created_at: movementDate,
          observacoes: notes.trim() || null,
        });

      if (insertError) {
        console.error("Erro ao registrar movimentação:", insertError);
        throw new Error(insertError.message);
      }

      await loadMovements();

      setModalOpen(false);
      resetForm();
      alert("Movimentação registrada com sucesso!");
    } catch (err: any) {
      console.error(err);
      alert(
        err?.message ??
          "Não foi possível registrar a movimentação."
      );
    } finally {
      setSaving(false);
    }
  }

  const paymentIcon = (method: Movement["payment"]) => {
    if (method === "Pix") return <QrCode size={16} />;
    if (method === "Cartão") return <CreditCard size={16} />;
    if (method === "Transferência") return <Landmark size={16} />;
    return <Banknote size={16} />;
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#171717]">
      <div className="flex min-h-screen">
        <div className="hidden shrink-0 lg:block">
          <Sidebar />
        </div>

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-[#E5E5E5] bg-white/95 px-4 backdrop-blur-md sm:px-7 lg:px-9">
            <div>
              <p className="text-[10px] font-semibold tracking-[1.5px] text-[#A18A5B]">
                GESTÃO COMERCIAL
              </p>
              <h2 className="text-[16px] font-bold">Caixa</h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={loadMovements}
                aria-label="Atualizar movimentações"
                className="rounded-xl border border-[#E5E5E5] p-2.5 transition hover:border-[#C6A15B] hover:bg-[#FBF8F1]"
              >
                <RefreshCw size={17} />
              </button>

              <button
                aria-label="Notificações"
                className="rounded-xl border border-[#E5E5E5] p-2.5 transition hover:border-[#C6A15B] hover:bg-[#FBF8F1]"
              >
                <Bell size={18} />
              </button>

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C6A15B] text-xs font-bold text-[#111111]">
                AD
              </div>

              <span className="hidden text-xs font-semibold sm:block">
                Admin
              </span>
            </div>
          </header>

          <div className="mx-auto max-w-[1600px] p-4 sm:p-7 lg:p-9">
            <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Controle de caixa
                </h1>
                <p className="mt-1 text-sm text-[#777777]">
                  Acompanhe entradas, saídas e o saldo disponível.
                </p>
              </div>

              <button
                onClick={openNewMovement}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#C6A15B] px-5 py-3 text-sm font-bold text-[#111111] transition hover:bg-[#B58F48]"
              >
                <Plus size={18} /> Nova movimentação
              </button>
            </div>

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
                <button
                  onClick={loadMovements}
                  className="ml-2 font-bold underline"
                >
                  Tentar novamente
                </button>
              </div>
            )}

            <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  label: "Saldo atual",
                  value: money(balance),
                  caption: "Entradas menos saídas",
                  icon: CircleDollarSign,
                  tone: "bg-[#111111] text-[#C6A15B]",
                },
                {
                  label: "Saldo de abertura",
                  value: money(openingBalance),
                  caption: "Saldo inicial configurado",
                  icon: Landmark,
                  tone: "bg-[#F1E8D7] text-[#9B7838]",
                },
                {
                  label: "Entradas",
                  value: money(totalEntries),
                  caption: "Receitas registradas",
                  icon: ArrowDownToLine,
                  tone: "bg-[#E4D2A8] text-[#73551E]",
                },
                {
                  label: "Saídas",
                  value: money(totalExits),
                  caption: "Despesas registradas",
                  icon: ArrowUpFromLine,
                  tone: "bg-[#EEEEEE] text-[#555555]",
                },
              ].map((card) => {
                const Icon = card.icon;

                return (
                  <div
                    key={card.label}
                    className="rounded-2xl border border-[#E5E5E5] bg-white p-5 transition hover:border-[#D5C29A] hover:shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#777777]">
                        {card.label}
                      </span>

                      <div className={`rounded-xl p-2.5 ${card.tone}`}>
                        <Icon size={19} />
                      </div>
                    </div>

                    <h3 className="mt-4 text-2xl font-bold">
                      {loading ? "Carregando..." : card.value}
                    </h3>
                    <p className="mt-1 text-xs text-[#999999]">
                      {card.caption}
                    </p>
                  </div>
                );
              })}
            </div>

            <section className="overflow-hidden rounded-2xl border border-[#E5E5E5] bg-white">
              <div className="flex flex-col gap-4 border-b border-[#EEEEEE] p-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h3 className="font-bold">Movimentações</h3>
                  <p className="mt-1 text-xs text-[#999999]">
                    Extrato geral do caixa.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative">
                    <Search
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999]"
                    />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Buscar movimentação..."
                      className="h-10 w-full rounded-xl border border-[#E5E5E5] bg-white pl-10 pr-3 text-sm outline-none transition focus:border-[#C6A15B] sm:w-60"
                    />
                  </div>

                  <div className="relative">
                    <select
                      value={movementType}
                      onChange={(e) => setMovementType(e.target.value)}
                      className="h-10 w-full appearance-none rounded-xl border border-[#E5E5E5] bg-white px-3 pr-9 text-sm outline-none transition focus:border-[#C6A15B] sm:w-40"
                    >
                      <option value="Todas">Todas</option>
                      <option value="Entrada">Entrada</option>
                      <option value="Saída">Saída</option>
                    </select>

                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#999999]"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left">
                  <thead className="bg-[#F8F7F4]">
                    <tr className="text-[11px] uppercase tracking-wide text-[#888888]">
                      <th className="px-5 py-4 font-semibold">Movimentação</th>
                      <th className="px-5 py-4 font-semibold">Categoria</th>
                      <th className="px-5 py-4 font-semibold">Pagamento</th>
                      <th className="px-5 py-4 font-semibold">Responsável</th>
                      <th className="px-5 py-4 font-semibold">Data</th>
                      <th className="px-5 py-4 font-semibold">Valor</th>
                      <th className="px-5 py-4 text-right font-semibold">
                        Ações
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#EEEEEE]">
                    {filteredMovements.map((movement) => (
                      <tr
                        key={movement.id}
                        className="transition hover:bg-[#FBF9F4]"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                                movement.type === "Entrada"
                                  ? "bg-[#F1E8D7] text-[#8A682C]"
                                  : "bg-[#EEEEEE] text-[#555555]"
                              }`}
                            >
                              {movement.type === "Entrada" ? (
                                <ArrowDownToLine size={19} />
                              ) : (
                                <ArrowUpFromLine size={19} />
                              )}
                            </div>

                            <div>
                              <p className="text-sm font-semibold">
                                {movement.description}
                              </p>
                              <p className="mt-1 text-[11px] text-[#999999]">
                                #{movement.id.slice(0, 8)}
                                {movement.saleId && " • Venda"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm text-[#777777]">
                          {movement.category}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 text-sm text-[#666666]">
                            {paymentIcon(movement.payment)}
                            {movement.payment}
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm text-[#777777]">
                          {movement.responsible}
                        </td>

                        <td className="px-5 py-4 text-sm text-[#777777]">
                          {dateFormat(movement.date)}
                        </td>

                        <td
                          className={`px-5 py-4 text-sm font-bold ${
                            movement.type === "Entrada"
                              ? "text-[#94702F]"
                              : "text-[#666666]"
                          }`}
                        >
                          {movement.type === "Entrada" ? "+" : "-"}{" "}
                          {money(movement.value)}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end">
                            <button
                              onClick={() => setDetails(movement)}
                              title="Ver detalhes"
                              className="rounded-lg border border-[#E5E5E5] p-2 text-[#777777] transition hover:border-[#C6A15B] hover:bg-[#FBF8F1] hover:text-[#94702F]"
                            >
                              <Eye size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {loading && (
                  <div className="p-12 text-center text-sm text-[#777777]">
                    Carregando movimentações...
                  </div>
                )}

                {!loading && filteredMovements.length === 0 && (
                  <div className="p-12 text-center">
                    <Wallet
                      size={32}
                      className="mx-auto text-[#C6C6C6]"
                    />
                    <p className="mt-3 text-sm font-semibold">
                      Nenhuma movimentação encontrada
                    </p>
                    <p className="mt-1 text-xs text-[#999999]">
                      Altere os filtros ou faça uma nova busca.
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t border-[#EEEEEE] px-5 py-4 text-xs text-[#999999]">
                Exibindo {filteredMovements.length} de {movements.length}{" "}
                registros
              </div>
            </section>
          </div>
        </main>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4">
          <div className="my-auto w-full max-w-xl rounded-2xl border border-[#E5E5E5] bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">
                  Nova movimentação
                </h3>
                <p className="mt-1 text-xs text-[#999999]">
                  Registre uma entrada ou saída do caixa.
                </p>
              </div>

              <button
                onClick={() => {
                  setModalOpen(false);
                  resetForm();
                }}
                className="rounded-lg p-2 text-[#999999] transition hover:bg-[#F5F5F5] hover:text-black"
              >
                <X size={19} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-semibold">
                  Tipo *
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setType("Entrada");
                      setCategory("Outros recebimentos");
                    }}
                    className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition ${
                      type === "Entrada"
                        ? "border-[#C6A15B] bg-[#F5EEDF] text-[#73551E]"
                        : "border-[#E5E5E5] text-[#777777] hover:border-[#C6A15B]"
                    }`}
                  >
                    <ArrowDownToLine size={17} />
                    Entrada
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setType("Saída");
                      setCategory("Fornecedor");
                    }}
                    className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition ${
                      type === "Saída"
                        ? "border-[#999999] bg-[#EEEEEE] text-[#444444]"
                        : "border-[#E5E5E5] text-[#777777] hover:border-[#C6A15B]"
                    }`}
                  >
                    <ArrowUpFromLine size={17} />
                    Saída
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold">
                  Descrição *
                </label>
                <input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex.: Pagamento de fornecedor"
                  className="h-11 w-full rounded-xl border border-[#E5E5E5] px-3 text-sm outline-none transition focus:border-[#C6A15B]"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-semibold">
                    Categoria *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="h-11 w-full rounded-xl border border-[#E5E5E5] bg-white px-3 text-sm outline-none focus:border-[#C6A15B]"
                  >
                    {type === "Entrada" ? (
                      <>
                        <option>Outros recebimentos</option>
                        <option>Serviço</option>
                        <option>Reembolso</option>
                      </>
                    ) : (
                      <>
                        <option>Fornecedor</option>
                        <option>Despesa</option>
                        <option>Retirada</option>
                        <option>Aluguel</option>
                        <option>Outros pagamentos</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold">
                    Forma de pagamento *
                  </label>
                  <select
                    value={payment}
                    onChange={(e) =>
                      setPayment(e.target.value as Movement["payment"])
                    }
                    className="h-11 w-full rounded-xl border border-[#E5E5E5] bg-white px-3 text-sm outline-none focus:border-[#C6A15B]"
                  >
                    <option>Dinheiro</option>
                    <option>Pix</option>
                    <option>Cartão</option>
                    <option>Transferência</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-semibold">
                    Valor (R$) *
                  </label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="0,00"
                    className="h-11 w-full rounded-xl border border-[#E5E5E5] px-3 text-sm outline-none focus:border-[#C6A15B]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold">
                    Data *
                  </label>
                  <div className="relative">
                    <CalendarDays
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999]"
                    />
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="h-11 w-full rounded-xl border border-[#E5E5E5] pl-10 pr-3 text-sm outline-none focus:border-[#C6A15B]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold">
                  Observações
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Informações adicionais..."
                  rows={3}
                  className="w-full resize-none rounded-xl border border-[#E5E5E5] p-3 text-sm outline-none focus:border-[#C6A15B]"
                />
              </div>

              <div className="rounded-xl border border-[#E9DFC9] bg-[#FBF8F1] p-4">
                <p className="text-xs text-[#777777]">
                  Valor da movimentação
                </p>
                <p
                  className={`mt-1 text-2xl font-bold ${
                    type === "Entrada"
                      ? "text-[#94702F]"
                      : "text-[#555555]"
                  }`}
                >
                  {type === "Entrada" ? "+" : "-"}{" "}
                  {money(Number(value || 0))}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
              <button
                onClick={() => {
                  setModalOpen(false);
                  resetForm();
                }}
                disabled={saving}
                className="flex-1 rounded-xl border border-[#E5E5E5] py-3 text-sm font-semibold transition hover:bg-[#F5F5F5] disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                onClick={saveMovement}
                disabled={saving}
                className="flex-1 rounded-xl bg-[#C6A15B] py-3 text-sm font-bold text-[#111111] transition hover:bg-[#B58F48] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Registrando..." : "Registrar movimentação"}
              </button>
            </div>
          </div>
        </div>
      )}

      {details && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-[#E5E5E5] bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">
                  Detalhes da movimentação
                </h3>
                <p className="mt-1 text-xs text-[#999999]">
                  Movimentação #{details.id.slice(0, 8)}
                </p>
              </div>

              <button
                onClick={() => setDetails(null)}
                className="rounded-lg p-2 text-[#999999] transition hover:bg-[#F5F5F5]"
              >
                <X size={19} />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-xs text-[#999999]">Descrição</p>
                <p className="mt-1 font-semibold">
                  {details.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[#999999]">Tipo</p>
                  <p className="mt-1 font-medium">{details.type}</p>
                </div>
                <div>
                  <p className="text-xs text-[#999999]">Categoria</p>
                  <p className="mt-1 font-medium">{details.category}</p>
                </div>
                <div>
                  <p className="text-xs text-[#999999]">Pagamento</p>
                  <p className="mt-1 font-medium">{details.payment}</p>
                </div>
                <div>
                  <p className="text-xs text-[#999999]">Data</p>
                  <p className="mt-1 font-medium">
                    {dateFormat(details.date)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#999999]">Responsável</p>
                  <p className="mt-1 font-medium">
                    {details.responsible}
                  </p>
                </div>
                {details.saleId && (
                  <div>
                    <p className="text-xs text-[#999999]">Venda vinculada</p>
                    <p className="mt-1 break-all text-xs font-medium">
                      {details.saleId}
                    </p>
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-[#E9DFC9] bg-[#FBF8F1] p-4">
                <p className="text-xs text-[#999999]">Valor</p>
                <p
                  className={`mt-1 text-2xl font-bold ${
                    details.type === "Entrada"
                      ? "text-[#94702F]"
                      : "text-[#555555]"
                  }`}
                >
                  {details.type === "Entrada" ? "+" : "-"}{" "}
                  {money(details.value)}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#999999]">Observações</p>
                <p className="mt-1 text-[#666666]">
                  {details.notes || "Nenhuma observação registrada."}
                </p>
              </div>
            </div>

            <button
              onClick={() => setDetails(null)}
              className="mt-6 w-full rounded-xl bg-[#111111] py-3 text-sm font-semibold text-white transition hover:bg-[#333333]"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
