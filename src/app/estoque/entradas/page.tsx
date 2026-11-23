
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

    if (!Number.isInteger(qty) || qty <= 0 || !Number.isFinite(cost) || cost <= 0) {
      alert("Informe uma quantidade e um custo válidos.");
      return;
    }

    if (!selectedProduct) return;

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

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-[#202124]">
      <div className="flex min-h-screen">

        {/* SIDEBAR */}
        <aside className="hidden w-[250px] shrink-0 flex-col border-r border-gray-200 bg-white lg:flex">
          <div className="flex h-[78px] items-center gap-3 border-b border-gray-100 px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white">
              <Smartphone size={21} />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">
                TechControl
              </h1>
              <p className="text-[11px] text-gray-400">
                Gestão inteligente
              </p>
            </div>
          </div>

          <div className="px-4 pt-7">
            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[1.5px] text-gray-400">
              Menu principal
            </p>

            <nav className="space-y-1">
              {[
                { label: "Dashboard", icon: LayoutDashboard, href: "/" },
                { label: "Produtos", icon: Package, href: "/produtos" },
                { label: "Estoque", icon: Warehouse, href: "/estoque" },
                { label: "Entradas", icon: ArrowDownToLine, href: "/estoque/entradas" },
                { label: "Saídas e vendas", icon: ArrowUpFromLine, href: "/vendas" },
                { label: "Caixa", icon: Wallet, href: "/caixa" },
                { label: "Relatórios", icon: BarChart3, href: "/relatorios" },
                { label: "Usuários", icon: Users, href: "/usuarios" },
              ].map((item) => {
                const Icon = item.icon;
                const active = item.label === "Entradas";

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-medium transition ${
                      active
                        ? "bg-black text-white"
                        : "text-gray-500 hover:bg-gray-100 hover:text-black"
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </a>
                );
              })}
            </nav>
          </div>

          <div className="mt-auto p-4">
            <a
              href="/configuracoes"
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-500 hover:bg-gray-100"
            >
              <Settings size={18} />
              Configurações
            </a>

            <div className="mt-4 flex items-center gap-3 rounded-xl border border-gray-100 p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-xs font-bold">
                TC
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold">Administrador</p>
                <p className="text-[10px] text-gray-400">TechControl</p>
              </div>
              <MoreHorizontal size={18} className="ml-auto text-gray-400" />
            </div>
          </div>
        </aside>

        {/* CONTEÚDO PRINCIPAL */}
        <main className="min-w-0 flex-1">

          {/* HEADER */}
          <header className="flex h-[78px] items-center justify-between border-b border-gray-200 bg-white px-5 sm:px-8">
            <div>
              <p className="text-xs text-gray-400">Gestão / Entradas</p>
              <h2 className="text-lg font-bold">Entradas</h2>
            </div>

            <div className="flex items-center gap-3">
              <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50">
                <Bell size={18} />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
              </button>

              <div className="hidden items-center gap-2 sm:flex">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-xs font-bold">
                  TC
                </div>
                <div>
                  <p className="text-xs font-semibold">Administrador</p>
                  <p className="text-[10px] text-gray-400">Acesso total</p>
                </div>
              </div>
            </div>
          </header>

          <div className="p-5 sm:p-8">

            {/* TÍTULO */}
            <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Entrada de mercadorias
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Registre compras e acompanhe o recebimento de produtos.
                </p>
              </div>

              <button
                onClick={() => { setDate(new Date().toLocaleDateString("en-CA")); setModalOpen(true); }}
                className="flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                <Plus size={18} />
                Nova entrada
              </button>
            </div>

            {/* INDICADORES */}
            <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

              <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Total de entradas</span>
                  <div className="rounded-xl bg-gray-100 p-2.5">
                    <ClipboardList size={19} />
                  </div>
                </div>
                <h3 className="mt-4 text-3xl font-bold">
                  {entries.length}
                </h3>
                <p className="mt-1 text-xs text-gray-400">
                  Registros realizados
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Unidades recebidas</span>
                  <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
                    <Package size={19} />
                  </div>
                </div>
                <h3 className="mt-4 text-3xl font-bold">
                  {totalUnits}
                </h3>
                <p className="mt-1 text-xs text-gray-400">
                  Unidades registradas
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Valor das entradas</span>
                  <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                    <TrendingUp size={19} />
                  </div>
                </div>
                <h3 className="mt-4 text-2xl font-bold">
                  {money(totalValue)}
                </h3>
                <p className="mt-1 text-xs text-gray-400">
                  Soma dos custos registrados
                </p>
              </div>
            </div>

            {/* HISTÓRICO */}
            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">

              <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-bold">Histórico de entradas</h3>
                  <p className="mt-1 text-xs text-gray-400">
                    Acompanhe as mercadorias recebidas.
                  </p>
                </div>

                <div className="relative">
                  <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar entrada..."
                    className="h-10 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-black sm:w-64"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] text-left">
                  <thead className="bg-gray-50">
                    <tr className="text-[11px] uppercase tracking-wide text-gray-400">
                      <th className="px-5 py-4 font-semibold">Código</th>
                      <th className="px-5 py-4 font-semibold">Produto</th>
                      <th className="px-5 py-4 font-semibold">Fornecedor</th>
                      <th className="px-5 py-4 font-semibold">Quantidade</th>
                      <th className="px-5 py-4 font-semibold">Custo unitário</th>
                      <th className="px-5 py-4 font-semibold">Valor total</th>
                      <th className="px-5 py-4 font-semibold">Data</th>
                      <th className="px-5 py-4 text-right font-semibold">Detalhes</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredEntries.map((entry) => (
                      <tr key={entry.id} className="transition hover:bg-gray-50/70">
                        <td className="px-5 py-4 text-xs font-semibold text-gray-500">
                          #{entry.id.toString().slice(-6)}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                              <Smartphone size={19} className="text-gray-500" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold">{entry.product}</p>
                              <p className="mt-1 text-[11px] text-gray-400">{entry.code}</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-500">
                          {entry.supplier}
                        </td>

                        <td className="px-5 py-4 text-sm font-semibold">
                          {entry.quantity} un.
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-500">
                          {money(entry.unitCost)}
                        </td>

                        <td className="px-5 py-4 text-sm font-bold">
                          {money(entry.total)}
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-500">
                          {dateFormat(entry.date)}
                        </td>

                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() => setDetails(entry)}
                            title="Ver detalhes"
                            className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-100"
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
                    <ClipboardList size={32} className="mx-auto text-gray-300" />
                    <p className="mt-3 text-sm font-semibold">
                      Nenhuma entrada encontrada
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      Tente buscar por outro produto ou fornecedor.
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 px-5 py-4 text-xs text-gray-400">
                Exibindo {filteredEntries.length} de {entries.length} registros
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* MODAL NOVA ENTRADA */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">
          <div className="my-auto w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">

            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Nova entrada</h3>
                <p className="mt-1 text-xs text-gray-400">
                  Informe os dados da mercadoria recebida.
                </p>
              </div>

              <button
                onClick={() => {
                  setModalOpen(false);
                  resetForm();
                }}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
              >
                <X size={19} />
              </button>
            </div>

            <div className="space-y-4">

              <div>
                <label className="mb-2 block text-xs font-semibold">
                  Produto *
                </label>
                <select
                  value={productName}
                  onChange={(e) => handleProductChange(e.target.value)}
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-black"
                >
                  <option value="">Selecione um produto</option>
                  {products.map((product) => (
                    <option key={product.code} value={product.name}>
                      {product.name} — {product.code}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold">
                  Fornecedor *
                </label>
                <div className="relative">
                  <Truck
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
                    placeholder="Nome do fornecedor"
                    className="h-11 w-full rounded-xl border border-gray-200 pl-10 pr-3 text-sm outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-semibold">
                    Quantidade *
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold">
                    Custo unitário (R$) *
                  </label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={unitCost}
                    onChange={(e) => setUnitCost(e.target.value)}
                    placeholder="0,00"
                    className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold">
                  Data da entrada *
                </label>
                <div className="relative">
                  <CalendarDays
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="h-11 w-full rounded-xl border border-gray-200 pl-10 pr-3 text-sm outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold">
                  Observações
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Informações adicionais sobre a entrada..."
                  rows={3}
                  className="w-full resize-none rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-black"
                />
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs text-gray-500">Valor total da entrada</p>
                <p className="mt-1 text-2xl font-bold">{money(total)}</p>
                <p className="mt-1 text-[11px] text-gray-400">
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
                className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-semibold hover:bg-gray-50"
              >
                Cancelar
              </button>

              <button
                onClick={saveEntry}
                className="flex-1 rounded-xl bg-black py-3 text-sm font-semibold text-white hover:bg-gray-800"
              >
                Registrar entrada
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE DETALHES */}
      {details && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Detalhes da entrada</h3>
                <p className="mt-1 text-xs text-gray-400">
                  Registro #{details.id.toString().slice(-6)}
                </p>
              </div>
              <button
                onClick={() => setDetails(null)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
              >
                <X size={19} />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-xs text-gray-400">Produto</p>
                <p className="mt-1 font-semibold">{details.product}</p>
                <p className="text-xs text-gray-400">{details.code}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400">Fornecedor</p>
                  <p className="mt-1 font-medium">{details.supplier}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Data</p>
                  <p className="mt-1 font-medium">{dateFormat(details.date)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Quantidade</p>
                  <p className="mt-1 font-medium">{details.quantity} unidades</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Custo unitário</p>
                  <p className="mt-1 font-medium">{money(details.unitCost)}</p>
                </div>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs text-gray-400">Valor total</p>
                <p className="mt-1 text-2xl font-bold">{money(details.total)}</p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Observações</p>
                <p className="mt-1 text-gray-600">
                  {details.notes || "Nenhuma observação registrada."}
                </p>
              </div>
            </div>

            <button
              onClick={() => setDetails(null)}
              className="mt-6 w-full rounded-xl bg-black py-3 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
