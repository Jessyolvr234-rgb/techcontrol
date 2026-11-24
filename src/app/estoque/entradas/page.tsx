
"use client";

import { useMemo, useState } from "react";
import {
  LayoutDashboard,
  Package,
  Warehouse,
  ArrowDownToLine,
  ArrowUpFromLine,
  Wallet,
  BarChart3,
  Users,
  Settings,
  Search,
  Bell,
  Plus,
  X,
  CalendarDays,
  Truck,
  ClipboardList,
  TrendingUp,
  Smartphone,
  MoreHorizontal,
  Eye,
  Boxes,
  ChevronRight,
} from "lucide-react";

type Entry = {
  id: number;
  product: string;
  code: string;
  supplier: string;
  quantity: number;
  unitCost: number;
  total: number;
  date: string;
  notes: string;
};

const products: Array<{ name: string; code: string; cost: number }> = [];

const initialEntries: Entry[] = [];

const money = (value: number) =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

const dateFormat = (date: string) => {
  if (!date) return "—";
  return new Date(`${date}T12:00:00`).toLocaleDateString("pt-BR");
};

const inputClass =
  "h-11 w-full rounded-xl border border-[#E5E1D8] bg-white px-3 text-sm text-[#222222] outline-none transition placeholder:text-[#A3A3A3] focus:border-[#B89552] focus:ring-2 focus:ring-[#C6A15B]/10";

export default function EntradasPage() {
  const [entries, setEntries] = useState<Entry[]>(initialEntries);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [details, setDetails] = useState<Entry | null>(null);

  const [productName, setProductName] = useState("");
  const [supplier, setSupplier] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [unitCost, setUnitCost] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  const selectedProduct = products.find(
    (product) => product.name === productName
  );

  const total = Number(quantity || 0) * Number(unitCost || 0);

  const totalUnits = entries.reduce(
    (sum, entry) => sum + entry.quantity,
    0
  );

  const totalValue = entries.reduce(
    (sum, entry) => sum + entry.total,
    0
  );

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const term = search.toLowerCase();

      return (
        entry.product.toLowerCase().includes(term) ||
        entry.code.toLowerCase().includes(term) ||
        entry.supplier.toLowerCase().includes(term) ||
        String(entry.id).includes(term)
      );
    });
  }, [entries, search]);

  function resetForm() {
    setProductName("");
    setSupplier("");
    setQuantity("1");
    setUnitCost("");
    setDate(new Date().toLocaleDateString("en-CA"));
    setNotes("");
  }

  function handleProductChange(name: string) {
    setProductName(name);

    const product = products.find((item) => item.name === name);

    if (product) {
      setUnitCost(String(product.cost));
    }
  }

  function saveEntry() {
    const qty = Number(quantity);
    const cost = Number(unitCost);

    if (!productName || !supplier.trim() || !date) {
      alert("Preencha o produto, fornecedor e data.");
      return;
    }

    if (
      !Number.isInteger(qty) ||
      qty <= 0 ||
      !Number.isFinite(cost) ||
      cost <= 0
    ) {
      alert("Informe uma quantidade e um custo válidos.");
      return;
    }

    if (!selectedProduct) {
      alert("Selecione um produto válido.");
      return;
    }

    const newEntry: Entry = {
      id: Date.now(),
      product: selectedProduct.name,
      code: selectedProduct.code,
      supplier: supplier.trim(),
      quantity: qty,
      unitCost: cost,
      total: qty * cost,
      date,
      notes: notes.trim(),
    };

    setEntries((current) => [newEntry, ...current]);
    setModalOpen(false);
    resetForm();
  }

  const navigation = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/" },
    { label: "Produtos", icon: Package, href: "/produtos" },
    { label: "Estoque", icon: Warehouse, href: "/estoque" },
    {
      label: "Entradas",
      icon: ArrowDownToLine,
      href: "/estoque/entradas",
    },
    {
      label: "Saídas e vendas",
      icon: ArrowUpFromLine,
      href: "/vendas",
    },
    { label: "Caixa", icon: Wallet, href: "/caixa" },
    { label: "Relatórios", icon: BarChart3, href: "/relatorios" },
    { label: "Usuários", icon: Users, href: "/usuarios" },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#222222]">
      <div className="flex min-h-screen">

        {/* SIDEBAR */}
        <aside className="hidden w-[250px] shrink-0 flex-col border-r border-[#292929] bg-[#111111] lg:flex">
          <div className="flex h-[78px] items-center gap-3 border-b border-white/10 px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C6A15B] text-[#111111]">
              <Smartphone size={21} strokeWidth={2.2} />
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">
                Tech<span className="text-[#D6B979]">Control</span>
              </h1>
              <p className="text-[10px] font-medium tracking-[1.4px] text-[#929292]">
                GESTÃO COMERCIAL
              </p>
            </div>
          </div>

          <div className="px-4 pt-7">
            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[1.5px] text-[#777777]">
              Menu principal
            </p>

            <nav className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = item.label === "Entradas";

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-medium transition ${
                      active
                        ? "border border-[#C6A15B]/30 bg-[#C6A15B]/10 text-[#E1C78E]"
                        : "text-[#A5A5A5] hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon
                      size={18}
                      className={
                        active
                          ? "text-[#D6B979]"
                          : "text-[#858585] group-hover:text-[#D6B979]"
                      }
                    />
                    {item.label}

                    {active && (
                      <ChevronRight
                        size={15}
                        className="ml-auto text-[#C6A15B]"
                      />
                    )}
                  </a>
                );
              })}
            </nav>
          </div>

          <div className="mt-auto p-4">
            <a
              href="/configuracoes"
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-[#A5A5A5] transition hover:bg-white/5 hover:text-white"
            >
              <Settings size={18} />
              Configurações
            </a>

            <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C6A15B]/40 bg-[#C6A15B]/10 text-xs font-bold text-[#D6B979]">
                TC
              </div>

              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-white">
                  Administrador
                </p>
                <p className="text-[10px] text-[#888888]">
                  TechControl
                </p>
              </div>

              <MoreHorizontal
                size={18}
                className="ml-auto text-[#888888]"
              />
            </div>
          </div>
        </aside>

        {/* CONTEÚDO PRINCIPAL */}
        <main className="min-w-0 flex-1">

          {/* HEADER */}
          <header className="flex h-[78px] items-center justify-between border-b border-[#E7E3DB] bg-white px-5 sm:px-8">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#999999]">
                <span>Gestão</span>
                <ChevronRight size={13} />
                <span className="font-medium text-[#A98749]">
                  Entradas
                </span>
              </div>

              <h2 className="mt-1 text-lg font-bold tracking-tight text-[#222222]">
                Entradas
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#E7E3DB] text-[#777777] transition hover:border-[#C6A15B] hover:bg-[#F9F6EF]">
                <Bell size={18} />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#C6A15B]" />
              </button>

              <div className="hidden items-center gap-2 sm:flex">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F4EFE4] text-xs font-bold text-[#A98749]">
                  TC
                </div>

                <div>
                  <p className="text-xs font-semibold text-[#222222]">
                    Administrador
                  </p>
                  <p className="text-[10px] text-[#999999]">
                    Acesso total
                  </p>
                </div>
              </div>
            </div>
          </header>

          <div className="p-5 sm:p-8">

            {/* TÍTULO */}
            <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="h-1 w-7 rounded-full bg-[#C6A15B]" />
                  <p className="text-[10px] font-bold uppercase tracking-[1.8px] text-[#A98749]">
                    Controle de mercadorias
                  </p>
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-[#191919] sm:text-3xl">
                  Entrada de mercadorias
                </h1>

                <p className="mt-1 text-sm text-[#888888]">
                  Registre compras e acompanhe o recebimento de produtos.
                </p>
              </div>

              <button
                onClick={() => {
                  setDate(new Date().toLocaleDateString("en-CA"));
                  setModalOpen(true);
                }}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#111111] px-5 py-3 text-sm font-semibold text-[#E4D2A8] shadow-sm transition hover:bg-[#292929]"
              >
                <Plus size={18} />
                Nova entrada
              </button>
            </div>

            {/* INDICADORES */}
            <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

              {/* TOTAL */}
              <div className="rounded-2xl border border-[#E7E3DB] bg-white p-5 transition hover:border-[#C6A15B]/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#777777]">
                    Total de entradas
                  </span>

                  <div className="rounded-xl bg-[#F5F1E8] p-2.5 text-[#A98749]">
                    <ClipboardList size={19} />
                  </div>
                </div>

                <h3 className="mt-4 text-3xl font-bold tracking-tight text-[#222222]">
                  {entries.length}
                </h3>

                <p className="mt-1 text-xs text-[#A0A0A0]">
                  Registros realizados
                </p>
              </div>

              {/* UNIDADES */}
              <div className="rounded-2xl border border-[#E7E3DB] bg-white p-5 transition hover:border-[#C6A15B]/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#777777]">
                    Unidades recebidas
                  </span>

                  <div className="rounded-xl bg-[#F1F1F1] p-2.5 text-[#777777]">
                    <Boxes size={19} />
                  </div>
                </div>

                <h3 className="mt-4 text-3xl font-bold tracking-tight text-[#222222]">
                  {totalUnits}
                </h3>

                <p className="mt-1 text-xs text-[#A0A0A0]">
                  Unidades registradas
                </p>
              </div>

              {/* VALOR */}
              <div className="rounded-2xl border border-[#E7E3DB] bg-white p-5 transition hover:border-[#C6A15B]/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#777777]">
                    Valor das entradas
                  </span>

                  <div className="rounded-xl bg-[#F5F1E8] p-2.5 text-[#A98749]">
                    <TrendingUp size={19} />
                  </div>
                </div>

                <h3 className="mt-4 text-2xl font-bold tracking-tight text-[#222222]">
                  {money(totalValue)}
                </h3>

                <p className="mt-1 text-xs text-[#A0A0A0]">
                  Soma dos custos registrados
                </p>
              </div>
            </div>

            {/* HISTÓRICO */}
            <section className="overflow-hidden rounded-2xl border border-[#E7E3DB] bg-white shadow-sm">

              <div className="flex flex-col gap-4 border-b border-[#EEEAE2] p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-bold text-[#222222]">
                    Histórico de entradas
                  </h3>

                  <p className="mt-1 text-xs text-[#999999]">
                    Acompanhe as mercadorias recebidas.
                  </p>
                </div>

                <div className="relative">
                  <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0A0A0]"
                  />

                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar entrada..."
                    className="h-10 w-full rounded-xl border border-[#E7E3DB] bg-[#FAFAFA] pl-10 pr-3 text-sm outline-none transition focus:border-[#C6A15B] sm:w-64"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] text-left">
                  <thead className="bg-[#F8F7F4]">
                    <tr className="text-[10px] uppercase tracking-[1px] text-[#929292]">
                      <th className="px-5 py-4 font-bold">Código</th>
                      <th className="px-5 py-4 font-bold">Produto</th>
                      <th className="px-5 py-4 font-bold">Fornecedor</th>
                      <th className="px-5 py-4 font-bold">Quantidade</th>
                      <th className="px-5 py-4 font-bold">Custo unitário</th>
                      <th className="px-5 py-4 font-bold">Valor total</th>
                      <th className="px-5 py-4 font-bold">Data</th>
                      <th className="px-5 py-4 text-right font-bold">Detalhes</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#F0EDE7]">
                    {filteredEntries.map((entry) => (
                      <tr
                        key={entry.id}
                        className="transition hover:bg-[#FCFBF8]"
                      >
                        <td className="px-5 py-4 text-xs font-semibold text-[#A98749]">
                          #{entry.id.toString().slice(-6)}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5F1E8] text-[#A98749]">
                              <Smartphone size={19} />
                            </div>

                            <div>
                              <p className="text-sm font-semibold text-[#292929]">
                                {entry.product}
                              </p>

                              <p className="mt-1 text-[11px] text-[#A0A0A0]">
                                {entry.code}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm text-[#777777]">
                          {entry.supplier}
                        </td>

                        <td className="px-5 py-4 text-sm font-semibold text-[#292929]">
                          {entry.quantity} un.
                        </td>

                        <td className="px-5 py-4 text-sm text-[#777777]">
                          {money(entry.unitCost)}
                        </td>

                        <td className="px-5 py-4 text-sm font-bold text-[#292929]">
                          {money(entry.total)}
                        </td>

                        <td className="px-5 py-4 text-sm text-[#777777]">
                          {dateFormat(entry.date)}
                        </td>

                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() => setDetails(entry)}
                            title="Ver detalhes"
                            className="rounded-lg border border-[#E7E3DB] p-2 text-[#A98749] transition hover:border-[#C6A15B] hover:bg-[#F8F4EA]"
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredEntries.length === 0 && (
                  <div className="p-12 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F5F1E8] text-[#B89552]">
                      <ClipboardList size={27} />
                    </div>

                    <p className="mt-4 text-sm font-semibold text-[#333333]">
                      Nenhuma entrada encontrada
                    </p>

                    <p className="mt-1 text-xs text-[#999999]">
                      Tente buscar por outro produto ou fornecedor.
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t border-[#EEEAE2] px-5 py-4 text-xs text-[#999999]">
                Exibindo {filteredEntries.length} de {entries.length} registros
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* MODAL NOVA ENTRADA */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-[2px]">
          <div className="my-auto w-full max-w-xl rounded-2xl border border-[#E7E3DB] bg-white p-6 shadow-2xl">

            <div className="mb-6 flex items-center justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="h-1 w-6 rounded-full bg-[#C6A15B]" />
                  <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#A98749]">
                    Movimentação de estoque
                  </p>
                </div>

                <h3 className="text-lg font-bold text-[#222222]">
                  Nova entrada
                </h3>

                <p className="mt-1 text-xs text-[#999999]">
                  Informe os dados da mercadoria recebida.
                </p>
              </div>

              <button
                onClick={() => {
                  setModalOpen(false);
                  resetForm();
                }}
                className="rounded-lg p-2 text-[#999999] transition hover:bg-[#F5F5F5] hover:text-[#222222]"
              >
                <X size={19} />
              </button>
            </div>

            <div className="space-y-4">

              <div>
                <label className="mb-2 block text-xs font-semibold text-[#444444]">
                  Produto *
                </label>

                <select
                  value={productName}
                  onChange={(e) => handleProductChange(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Selecione um produto</option>

                  {products.map((product) => (
                    <option key={product.code} value={product.name}>
                      {product.name} — {product.code}
                    </option>
                  ))}
                </select>

                {products.length === 0 && (
                  <p className="mt-2 text-[11px] text-[#A98749]">
                    Nenhum produto cadastrado na lista local.
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-[#444444]">
                  Fornecedor *
                </label>

                <div className="relative">
                  <Truck
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A98749]"
                  />

                  <input
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
                    placeholder="Nome do fornecedor"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-semibold text-[#444444]">
                    Quantidade *
                  </label>

                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-[#444444]">
                    Custo unitário (R$) *
                  </label>

                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={unitCost}
                    onChange={(e) => setUnitCost(e.target.value)}
                    placeholder="0,00"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-[#444444]">
                  Data da entrada *
                </label>

                <div className="relative">
                  <CalendarDays
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A98749]"
                  />

                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-[#444444]">
                  Observações
                </label>

                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Informações adicionais sobre a entrada..."
                  rows={3}
                  className="w-full resize-none rounded-xl border border-[#E5E1D8] bg-white p-3 text-sm text-[#222222] outline-none transition placeholder:text-[#A3A3A3] focus:border-[#B89552] focus:ring-2 focus:ring-[#C6A15B]/10"
                />
              </div>

              {/* RESUMO */}
              <div className="rounded-xl border border-[#E6D9BC] bg-[#FAF7F0] p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-[#777777]">
                    Valor total da entrada
                  </p>

                  <TrendingUp size={17} className="text-[#A98749]" />
                </div>

                <p className="mt-2 text-2xl font-bold text-[#292929]">
                  {money(total)}
                </p>

                <p className="mt-1 text-[11px] text-[#999999]">
                  {quantity || 0} unidades × {money(Number(unitCost || 0))}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
              <button
                onClick={() => {
                  setModalOpen(false);
                  resetForm();
                }}
                className="flex-1 rounded-xl border border-[#E5E1D8] py-3 text-sm font-semibold text-[#666666] transition hover:bg-[#F7F7F7]"
              >
                Cancelar
              </button>

              <button
                onClick={saveEntry}
                className="flex-1 rounded-xl bg-[#111111] py-3 text-sm font-semibold text-[#E4D2A8] transition hover:bg-[#292929]"
              >
                Registrar entrada
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE DETALHES */}
      {details && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-md rounded-2xl border border-[#E7E3DB] bg-white p-6 shadow-2xl">

            <div className="mb-5 flex items-center justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="h-1 w-6 rounded-full bg-[#C6A15B]" />
                  <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#A98749]">
                    Histórico
                  </p>
                </div>

                <h3 className="text-lg font-bold text-[#222222]">
                  Detalhes da entrada
                </h3>

                <p className="mt-1 text-xs text-[#999999]">
                  Registro #{details.id.toString().slice(-6)}
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
                <p className="text-xs text-[#999999]">Produto</p>
                <p className="mt-1 font-semibold text-[#292929]">
                  {details.product}
                </p>
                <p className="text-xs text-[#A98749]">
                  {details.code}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[#999999]">Fornecedor</p>
                  <p className="mt-1 font-medium text-[#333333]">
                    {details.supplier}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#999999]">Data</p>
                  <p className="mt-1 font-medium text-[#333333]">
                    {dateFormat(details.date)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#999999]">Quantidade</p>
                  <p className="mt-1 font-medium text-[#333333]">
                    {details.quantity} unidades
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#999999]">Custo unitário</p>
                  <p className="mt-1 font-medium text-[#333333]">
                    {money(details.unitCost)}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-[#E6D9BC] bg-[#FAF7F0] p-4">
                <p className="text-xs text-[#888888]">Valor total</p>
                <p className="mt-1 text-2xl font-bold text-[#292929]">
                  {money(details.total)}
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
              className="mt-6 w-full rounded-xl bg-[#111111] py-3 text-sm font-semibold text-[#E4D2A8] transition hover:bg-[#292929]"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
