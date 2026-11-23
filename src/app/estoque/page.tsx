
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
  MoreHorizontal,
  AlertTriangle,
  TrendingUp,
  Boxes,
  X,
  Smartphone,
  History,
} from "lucide-react";

type Product = {
  id: number;
  name: string;
  code: string;
  category: string;
  quantity: number;
  minimum: number;
  cost: number;
  price: number;
};

const initialProducts: Product[] = [];

const money = (value: number) =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

export default function EstoquePage() {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Todos");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);
  const [movementType, setMovementType] = useState<"entrada" | "saida">(
    "entrada"
  );
  const [movementQuantity, setMovementQuantity] = useState("1");
  const [movementNote, setMovementNote] = useState("");

  const totalUnits = products.reduce(
    (total, product) => total + product.quantity,
    0
  );

  const lowStock = products.filter(
    (product) =>
      product.quantity > 0 &&
      product.quantity <= product.minimum
  ).length;

  const outOfStock = products.filter(
    (product) => product.quantity === 0
  ).length;

  const inventoryValue = products.reduce(
    (total, product) => total + product.quantity * product.cost,
    0
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.code.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "Todos" ||
        (filter === "Disponível" && product.quantity > product.minimum) ||
        (filter === "Estoque baixo" &&
          product.quantity > 0 &&
          product.quantity <= product.minimum) ||
        (filter === "Sem estoque" && product.quantity === 0);

      return matchesSearch && matchesFilter;
    });
  }, [products, search, filter]);

  function openMovement(product: Product, type: "entrada" | "saida") {
    setSelectedProduct(product);
    setMovementType(type);
    setMovementQuantity("1");
    setMovementNote("");
    setModalOpen(true);
  }

  function saveMovement() {
    const quantity = Number(movementQuantity);

    if (!selectedProduct || !Number.isInteger(quantity) || quantity <= 0) {
      alert("Informe uma quantidade válida.");
      return;
    }

    if (
      movementType === "saida" &&
      quantity > selectedProduct.quantity
    ) {
      alert("Não existe quantidade suficiente em estoque.");
      return;
    }

    setProducts((current) =>
      current.map((product) => {
        if (product.id !== selectedProduct.id) return product;

        return {
          ...product,
          quantity:
            movementType === "entrada"
              ? product.quantity + quantity
              : product.quantity - quantity,
        };
      })
    );

    setModalOpen(false);
    setSelectedProduct(null);
  }

  function getStatus(product: Product) {
    if (product.quantity === 0) {
      return {
        label: "Sem estoque",
        className: "bg-red-50 text-red-600",
      };
    }

    if (product.quantity <= product.minimum) {
      return {
        label: "Estoque baixo",
        className: "bg-amber-50 text-amber-700",
      };
    }

    return {
      label: "Disponível",
      className: "bg-emerald-50 text-emerald-700",
    };
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
                const active = item.label === "Estoque";

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

        {/* CONTEÚDO */}
        <main className="min-w-0 flex-1">

          {/* HEADER */}
          <header className="flex h-[78px] items-center justify-between border-b border-gray-200 bg-white px-5 sm:px-8">
            <div>
              <p className="text-xs text-gray-400">Gestão / Estoque</p>
              <h2 className="text-lg font-bold">Estoque</h2>
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
                  Controle de estoque
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Acompanhe os produtos e suas quantidades disponíveis.
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedProduct(null);
                  alert("Selecione um produto na tabela para registrar uma movimentação.");
                }}
                className="flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                <History size={17} />
                Movimentar estoque
              </button>
            </div>

            {/* CARDS */}
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

              <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Total de produtos</span>
                  <div className="rounded-xl bg-gray-100 p-2.5">
                    <Package size={19} />
                  </div>
                </div>
                <h3 className="mt-4 text-3xl font-bold">{products.length}</h3>
                <p className="mt-1 text-xs text-gray-400">Produtos cadastrados</p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Unidades disponíveis</span>
                  <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
                    <Boxes size={19} />
                  </div>
                </div>
                <h3 className="mt-4 text-3xl font-bold">{totalUnits}</h3>
                <p className="mt-1 text-xs text-gray-400">Unidades em estoque</p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Estoque baixo</span>
                  <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600">
                    <AlertTriangle size={19} />
                  </div>
                </div>
                <h3 className="mt-4 text-3xl font-bold">{lowStock}</h3>
                <p className="mt-1 text-xs text-gray-400">Produtos precisam de atenção</p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Sem estoque</span>
                  <div className="rounded-xl bg-red-50 p-2.5 text-red-600">
                    <TrendingUp size={19} />
                  </div>
                </div>
                <h3 className="mt-4 text-3xl font-bold">{outOfStock}</h3>
                <p className="mt-1 text-xs text-gray-400">Produtos indisponíveis</p>
              </div>
            </div>

            {/* VALOR DO ESTOQUE */}
            <div className="mb-7 flex flex-col justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-5 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm text-gray-500">Valor investido no estoque</p>
                <h3 className="mt-1 text-2xl font-bold">{money(inventoryValue)}</h3>
                <p className="mt-1 text-xs text-gray-400">
                  Calculado com base no custo de aquisição cadastrado.
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                <Wallet size={22} />
              </div>
            </div>

            {/* TABELA */}
            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">

              <div className="flex flex-col gap-4 border-b border-gray-100 p-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h3 className="font-bold">Produtos em estoque</h3>
                  <p className="mt-1 text-xs text-gray-400">
                    Gerencie as quantidades e movimentações.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative">
                    <Search
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Buscar produto..."
                      className="h-10 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-black sm:w-56"
                    />
                  </div>

                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-black"
                  >
                    <option>Todos</option>
                    <option>Disponível</option>
                    <option>Estoque baixo</option>
                    <option>Sem estoque</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] text-left">
                  <thead className="bg-gray-50">
                    <tr className="text-[11px] uppercase tracking-wide text-gray-400">
                      <th className="px-5 py-4 font-semibold">Produto</th>
                      <th className="px-5 py-4 font-semibold">Código</th>
                      <th className="px-5 py-4 font-semibold">Categoria</th>
                      <th className="px-5 py-4 font-semibold">Quantidade</th>
                      <th className="px-5 py-4 font-semibold">Estoque mínimo</th>
                      <th className="px-5 py-4 font-semibold">Situação</th>
                      <th className="px-5 py-4 text-right font-semibold">Ações</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredProducts.map((product) => {
                      const status = getStatus(product);

                      return (
                        <tr key={product.id} className="transition hover:bg-gray-50/70">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                                <Smartphone size={19} className="text-gray-500" />
                              </div>
                              <span className="text-sm font-semibold">{product.name}</span>
                            </div>
                          </td>

                          <td className="px-5 py-4 text-xs text-gray-500">
                            {product.code}
                          </td>

                          <td className="px-5 py-4 text-sm text-gray-500">
                            {product.category}
                          </td>

                          <td className="px-5 py-4">
                            <span className="text-sm font-bold">
                              {product.quantity} un.
                            </span>
                          </td>

                          <td className="px-5 py-4 text-sm text-gray-500">
                            {product.minimum} un.
                          </td>

                          <td className="px-5 py-4">
                            <span className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${status.className}`}>
                              {status.label}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => openMovement(product, "entrada")}
                                title="Registrar entrada"
                                className="rounded-lg border border-gray-200 p-2 text-emerald-600 hover:bg-emerald-50"
                              >
                                <ArrowDownToLine size={16} />
                              </button>

                              <button
                                onClick={() => openMovement(product, "saida")}
                                disabled={product.quantity === 0}
                                title="Registrar saída"
                                className="rounded-lg border border-gray-200 p-2 text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-30"
                              >
                                <ArrowUpFromLine size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {filteredProducts.length === 0 && (
                  <div className="p-12 text-center">
                    <Package size={32} className="mx-auto text-gray-300" />
                    <p className="mt-3 text-sm font-semibold">Nenhum produto encontrado</p>
                    <p className="mt-1 text-xs text-gray-400">
                      Tente alterar a pesquisa ou o filtro.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 border-t border-gray-100 px-5 py-4 text-xs text-gray-400 sm:flex-row sm:items-center sm:justify-between">
                <span>Exibindo {filteredProducts.length} de {products.length} produtos</span>
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* MODAL DE MOVIMENTAÇÃO */}
      {modalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Movimentar estoque</h3>
                <p className="mt-1 text-xs text-gray-400">
                  Registre uma entrada ou saída.
                </p>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
              >
                <X size={19} />
              </button>
            </div>

            <div className="mb-5 rounded-xl bg-gray-50 p-4">
              <p className="text-sm font-semibold">{selectedProduct.name}</p>
              <p className="mt-1 text-xs text-gray-400">
                Código: {selectedProduct.code}
              </p>
              <p className="mt-2 text-sm">
                Disponível: <strong>{selectedProduct.quantity} unidades</strong>
              </p>
            </div>

            <div className="mb-5 grid grid-cols-2 gap-3">
              <button
                onClick={() => setMovementType("entrada")}
                className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-semibold ${
                  movementType === "entrada"
                    ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                    : "border-gray-200 text-gray-500"
                }`}
              >
                <ArrowDownToLine size={17} />
                Entrada
              </button>

              <button
                onClick={() => setMovementType("saida")}
                className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-semibold ${
                  movementType === "saida"
                    ? "border-red-500 bg-red-50 text-red-600"
                    : "border-gray-200 text-gray-500"
                }`}
              >
                <ArrowUpFromLine size={17} />
                Saída
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-semibold">
                  Quantidade
                </label>
                <input
                  type="number"
                  min="1"
                  value={movementQuantity}
                  onChange={(e) => setMovementQuantity(e.target.value)}
                  className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold">
                  Observação (opcional)
                </label>
                <textarea
                  value={movementNote}
                  onChange={(e) => setMovementNote(e.target.value)}
                  placeholder="Ex.: Reposição de mercadoria..."
                  rows={3}
                  className="w-full resize-none rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-black"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-semibold hover:bg-gray-50"
              >
                Cancelar
              </button>

              <button
                onClick={saveMovement}
                className="flex-1 rounded-xl bg-black py-3 text-sm font-semibold text-white hover:bg-gray-800"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
