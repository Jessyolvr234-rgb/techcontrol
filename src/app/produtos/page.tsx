
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Boxes,
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
  Plus,
  Smartphone,
  Tablet,
  Pencil,
  Trash2,
  Eye,
  Filter,
  ArrowLeft,
  TrendingUp,
} from "lucide-react";

type Product = {
  id: number;
  name: string;
  category: string;
  model: string;
  storage: string;
  color: string;
  condition: string;
  imei: string;
  quantity: number;
  cost: number;
  price: number;
  description: string;
  notes: string;
};

const initialProducts: Product[] = [];

const navigation = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Produtos", href: "/produtos", icon: Package },
  { label: "Estoque", href: "/estoque", icon: Boxes },
  { label: "Entradas", href: "/estoque/entradas", icon: ArrowDownToLine },
  { label: "Saídas e vendas", href: "/vendas", icon: ArrowUpFromLine },
  { label: "Caixa", href: "/caixa", icon: Wallet },
  { label: "Relatórios", href: "/relatorios", icon: BarChart3 },
];

const emptyProduct: Omit<Product, "id"> = {
  name: "",
  category: "iPhone",
  model: "",
  storage: "128GB",
  color: "",
  condition: "Novo",
  imei: "",
  quantity: 1,
  cost: 0,
  price: 0,
  description: "",
  notes: "",
};

function money(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function Sidebar({
  mobile = false,
  onClose,
}: {
  mobile?: boolean;
  onClose?: () => void;
}) {
  return (
    <aside className="flex h-full w-[260px] flex-col bg-[#101010] text-white">
      <div className="flex h-[82px] items-center justify-between border-b border-white/10 px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black">
            <Smartphone size={23} />
          </div>
          <div>
            <h1 className="text-[19px] font-bold">TechControl</h1>
            <p className="text-[9px] font-semibold tracking-[2px] text-gray-500">
              GESTÃO COMERCIAL
            </p>
          </div>
        </Link>

        {mobile && (
          <button onClick={onClose} aria-label="Fechar menu">
            <X size={21} />
          </button>
        )}
      </div>

      <div className="px-4 pt-8">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[1.8px] text-gray-500">
          Menu principal
        </p>

        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = item.href === "/produtos";

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => mobile && onClose?.()}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-medium transition ${
                  active
                    ? "bg-white text-black"
                    : "text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <p className="mb-3 mt-9 px-3 text-[10px] font-bold uppercase tracking-[1.8px] text-gray-500">
          Administração
        </p>

        <nav className="space-y-1">
          <Link
            href="/usuarios"
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] text-gray-400 hover:bg-white/10 hover:text-white"
          >
            <Users size={18} />
            Usuários
          </Link>

          <Link
            href="/configuracoes"
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] text-gray-400 hover:bg-white/10 hover:text-white"
          >
            <Settings size={18} />
            Configurações
          </Link>
        </nav>
      </div>

      <div className="mt-auto p-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <p className="text-xs font-semibold">TechControl Pro</p>
          <p className="mt-2 text-[11px] text-gray-500">
            Gerencie sua loja com praticidade e controle.
          </p>
        </div>

        <div className="mt-4 flex items-center gap-3 border-t border-white/10 pt-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-xs font-bold text-black">
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
    </aside>
  );
}

export default function ProdutosPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<Omit<Product, "id">>(emptyProduct);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        `${product.name} ${product.imei} ${product.color}`
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =
        category === "Todas" || product.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  const totalUnits = products.reduce(
    (total, product) => total + product.quantity,
    0
  );

  const totalCost = products.reduce(
    (total, product) => total + product.cost * product.quantity,
    0
  );

  const estimatedProfit = products.reduce(
    (total, product) =>
      total + (product.price - product.cost) * product.quantity,
    0
  );

  function openNewProduct() {
    setEditingId(null);
    setForm({ ...emptyProduct });
    setModalOpen(true);
  }

  function openEditProduct(product: Product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      category: product.category,
      model: product.model,
      storage: product.storage,
      color: product.color,
      condition: product.condition,
      imei: product.imei,
      quantity: product.quantity,
      cost: product.cost,
      price: product.price,
      description: product.description,
      notes: product.notes,
    });
    setModalOpen(true);
  }

  function saveProduct(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.name.trim() || !form.model.trim()) {
      alert("Preencha o nome e o modelo do produto.");
      return;
    }

    if (form.cost < 0 || form.price < 0 || form.quantity < 0) {
      alert("Os valores não podem ser negativos.");
      return;
    }

    if (editingId !== null) {
      setProducts((current) =>
        current.map((product) =>
          product.id === editingId
            ? { ...form, id: editingId }
            : product
        )
      );
    } else {
      setProducts((current) => [
        ...current,
        { ...form, id: Date.now() },
      ]);
    }

    setModalOpen(false);
    setForm({ ...emptyProduct });
    setEditingId(null);
  }

  function deleteProduct(id: number) {
    if (!window.confirm("Deseja realmente excluir este produto?")) return;

    setProducts((current) =>
      current.filter((product) => product.id !== id)
    );
  }

  const profit = form.price - form.cost;

  return (
    <div className="min-h-screen bg-[#F7F7F8] text-[#171717]">
      <div className="flex min-h-screen">

        {/* SIDEBAR DESKTOP */}
        <div className="hidden shrink-0 lg:block">
          <Sidebar />
        </div>

        {/* SIDEBAR MOBILE */}
        {menuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute inset-0 bg-black/50"
              aria-label="Fechar menu"
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
                <p className="text-[10px] text-gray-400">
                  GESTÃO COMERCIAL
                </p>
                <h2 className="text-[16px] font-bold">Produtos</h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                aria-label="Notificações"
                className="rounded-xl border border-gray-200 p-2.5"
              >
                <Bell size={18} />
              </button>

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
                AD
              </div>
              <span className="hidden text-xs font-semibold sm:block">
                Admin
              </span>
            </div>
          </header>

          <div className="mx-auto max-w-[1600px] p-4 sm:p-7 lg:p-9">

            {/* TÍTULO */}
            <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <Link
                  href="/"
                  className="mb-3 flex items-center gap-2 text-xs text-gray-400 hover:text-black"
                >
                  <ArrowLeft size={14} />
                  Voltar ao Dashboard
                </Link>

                <p className="text-sm text-gray-500">
                  Catálogo e gerenciamento
                </p>

                <h1 className="mt-1 text-3xl font-bold tracking-tight">
                  Produtos
                </h1>

                <p className="mt-1 text-xs text-gray-400">
                  Cadastre, organize e acompanhe os produtos da sua loja.
                </p>
              </div>

              <button
                onClick={openNewProduct}
                className="flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-xs font-semibold text-white transition hover:bg-gray-800"
              >
                <Plus size={17} />
                Novo produto
              </button>
            </div>

            {/* INDICADORES */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Metric
                title="Produtos cadastrados"
                value={String(products.length)}
                icon={Package}
              />

              <Metric
                title="Unidades em estoque"
                value={String(totalUnits)}
                icon={Boxes}
              />

              <Metric
                title="Valor investido"
                value={money(totalCost)}
                icon={Wallet}
              />

              <Metric
                title="Lucro potencial"
                value={money(estimatedProfit)}
                icon={TrendingUp}
              />
            </div>

            {/* FILTROS */}
            <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <h3 className="text-sm font-bold">
                    Todos os produtos
                  </h3>
                  <p className="mt-1 text-[11px] text-gray-400">
                    {filteredProducts.length} produto(s) encontrado(s)
                  </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 sm:w-64">
                    <Search size={16} className="text-gray-400" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Pesquisar produto ou IMEI..."
                      className="w-full bg-transparent text-xs outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3">
                    <Filter size={15} className="text-gray-400" />
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="bg-transparent py-2.5 text-xs outline-none"
                    >
                      <option>Todas</option>
                      <option>iPhone</option>
                      <option>iPad</option>
                      <option>Acessório</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* TABELA */}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] text-left">
                  <thead>
                    <tr className="border-b border-gray-100 text-[10px] text-gray-400">
                      <th className="pb-4 font-medium">Produto</th>
                      <th className="pb-4 font-medium">IMEI / Série</th>
                      <th className="pb-4 font-medium">Condição</th>
                      <th className="pb-4 font-medium">Quantidade</th>
                      <th className="pb-4 font-medium">Custo</th>
                      <th className="pb-4 font-medium">Venda</th>
                      <th className="pb-4 font-medium">Lucro unit.</th>
                      <th className="pb-4 text-right font-medium">Ações</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-gray-50 last:border-0 hover:bg-gray-50/70"
                      >
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                              {product.category === "iPad" ? (
                                <Tablet size={20} />
                              ) : (
                                <Smartphone size={20} />
                              )}
                            </div>
                            <div>
                              <p className="text-xs font-semibold">
                                {product.name}
                              </p>
                              <p className="mt-1 text-[10px] text-gray-400">
                                {product.storage} · {product.color}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 text-xs text-gray-500">
                          {product.imei || "Não informado"}
                        </td>

                        <td className="py-4">
                          <span className="rounded-md bg-gray-100 px-2 py-1 text-[10px]">
                            {product.condition}
                          </span>
                        </td>

                        <td className="py-4 text-xs font-semibold">
                          {product.quantity}
                        </td>

                        <td className="py-4 text-xs text-gray-600">
                          {money(product.cost)}
                        </td>

                        <td className="py-4 text-xs font-semibold">
                          {money(product.price)}
                        </td>

                        <td className="py-4 text-xs font-bold text-green-700">
                          {money(product.price - product.cost)}
                        </td>

                        <td className="py-4">
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => setViewProduct(product)}
                              title="Visualizar"
                              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-black"
                            >
                              <Eye size={16} />
                            </button>

                            <button
                              onClick={() => openEditProduct(product)}
                              title="Editar"
                              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-black"
                            >
                              <Pencil size={16} />
                            </button>

                            <button
                              onClick={() => deleteProduct(product.id)}
                              title="Excluir"
                              className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {filteredProducts.length === 0 && (
                      <tr>
                        <td
                          colSpan={8}
                          className="py-12 text-center text-xs text-gray-400"
                        >
                          Nenhum produto encontrado.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <footer className="mt-8 border-t border-gray-200 py-5 text-center text-[10px] text-gray-400">
              © 2026 TechControl. Todos os direitos reservados.
            </footer>
          </div>
        </main>
      </div>

      {/* MODAL DE CADASTRO / EDIÇÃO */}
      {modalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/50 p-3 sm:p-6">
          <div className="my-auto w-full max-w-3xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 p-5 sm:p-6">
              <div>
                <h2 className="text-lg font-bold">
                  {editingId ? "Editar produto" : "Cadastrar produto"}
                </h2>
                <p className="mt-1 text-xs text-gray-400">
                  Preencha as informações do produto.
                </p>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                aria-label="Fechar"
                className="rounded-lg p-2 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={saveProduct} className="space-y-6 p-5 sm:p-6">
              {/* IDENTIFICAÇÃO */}
              <div>
                <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                  Identificação do produto
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Nome do produto *">
                    <input
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      placeholder="Ex: iPhone 15 Pro Max"
                      className="input"
                    />
                  </Field>

                  <Field label="Categoria">
                    <select
                      value={form.category}
                      onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                      }
                      className="input"
                    >
                      <option>iPhone</option>
                      <option>iPad</option>
                      <option>Acessório</option>
                    </select>
                  </Field>

                  <Field label="Modelo *">
                    <input
                      required
                      value={form.model}
                      onChange={(e) =>
                        setForm({ ...form, model: e.target.value })
                      }
                      placeholder="Ex: 15 Pro Max"
                      className="input"
                    />
                  </Field>

                  <Field label="Armazenamento">
                    <select
                      value={form.storage}
                      onChange={(e) =>
                        setForm({ ...form, storage: e.target.value })
                      }
                      className="input"
                    >
                      <option>64GB</option>
                      <option>128GB</option>
                      <option>256GB</option>
                      <option>512GB</option>
                      <option>1TB</option>
                      <option>2TB</option>
                      <option>Não se aplica</option>
                    </select>
                  </Field>

                  <Field label="Cor">
                    <input
                      value={form.color}
                      onChange={(e) =>
                        setForm({ ...form, color: e.target.value })
                      }
                      placeholder="Ex: Titânio Natural"
                      className="input"
                    />
                  </Field>

                  <Field label="Condição">
                    <select
                      value={form.condition}
                      onChange={(e) =>
                        setForm({ ...form, condition: e.target.value })
                      }
                      className="input"
                    >
                      <option>Novo</option>
                      <option>Seminovo</option>
                      <option>Usado</option>
                    </select>
                  </Field>

                  <Field label="IMEI / Número de série">
                    <input
                      value={form.imei}
                      onChange={(e) =>
                        setForm({ ...form, imei: e.target.value })
                      }
                      placeholder="Identificação individual"
                      className="input"
                    />
                  </Field>

                  <Field label="Quantidade inicial">
                    <input
                      type="number"
                      min="0"
                      value={form.quantity}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          quantity: Number(e.target.value),
                        })
                      }
                      className="input"
                    />
                  </Field>
                </div>
              </div>

              {/* FINANCEIRO */}
              <div className="border-t border-gray-100 pt-5">
                <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                  Informações financeiras
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Preço de aquisição (R$)">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.cost}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          cost: Number(e.target.value),
                        })
                      }
                      className="input"
                    />
                  </Field>

                  <Field label="Preço de venda (R$)">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.price}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          price: Number(e.target.value),
                        })
                      }
                      className="input"
                    />
                  </Field>
                </div>

                <div className="mt-4 rounded-xl bg-gray-50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Lucro bruto estimado por unidade
                    </span>
                    <span
                      className={`text-lg font-bold ${
                        profit >= 0 ? "text-green-700" : "text-red-600"
                      }`}
                    >
                      {money(profit)}
                    </span>
                  </div>
                </div>
              </div>

              {/* OBSERVAÇÕES */}
              <div className="border-t border-gray-100 pt-5">
                <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                  Detalhes adicionais
                </h3>

                <Field label="Descrição">
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    placeholder="Descreva as características do produto..."
                    className="input resize-none"
                  />
                </Field>

                <div className="mt-4">
                  <Field label="Observações internas">
                    <textarea
                      rows={3}
                      value={form.notes}
                      onChange={(e) =>
                        setForm({ ...form, notes: e.target.value })
                      }
                      placeholder="Informações internas sobre o produto..."
                      className="input resize-none"
                    />
                  </Field>
                </div>
              </div>

              {/* AÇÕES */}
              <div className="flex flex-col-reverse justify-end gap-2 border-t border-gray-100 pt-5 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-gray-200 px-5 py-3 text-xs font-semibold hover:bg-gray-50"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-xl bg-black px-6 py-3 text-xs font-semibold text-white hover:bg-gray-800"
                >
                  <Plus size={16} />
                  {editingId ? "Salvar alterações" : "Cadastrar produto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE VISUALIZAÇÃO */}
      {viewProduct && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold">Detalhes do produto</h2>
              <button
                onClick={() => setViewProduct(null)}
                aria-label="Fechar detalhes"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-5 flex items-center gap-3 rounded-xl bg-gray-50 p-4">
              <Smartphone size={28} />
              <div>
                <p className="font-bold">{viewProduct.name}</p>
                <p className="text-xs text-gray-500">
                  {viewProduct.storage} · {viewProduct.color}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <Detail label="Categoria" value={viewProduct.category} />
              <Detail label="Modelo" value={viewProduct.model} />
              <Detail label="IMEI / Série" value={viewProduct.imei} />
              <Detail label="Condição" value={viewProduct.condition} />
              <Detail label="Quantidade" value={String(viewProduct.quantity)} />
              <Detail label="Custo" value={money(viewProduct.cost)} />
              <Detail label="Preço de venda" value={money(viewProduct.price)} />
              <Detail
                label="Lucro unitário"
                value={money(viewProduct.price - viewProduct.cost)}
              />
              <Detail label="Descrição" value={viewProduct.description || "—"} />
              <Detail label="Observações" value={viewProduct.notes || "—"} />
            </div>

            <button
              onClick={() => setViewProduct(null)}
              className="mt-6 w-full rounded-xl bg-black py-3 text-xs font-semibold text-white"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// COMPONENTES AUXILIARES

function Metric({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">{title}</span>
        <div className="rounded-xl bg-gray-100 p-3">
          <Icon size={19} />
        </div>
      </div>
      <p className="mt-4 text-xl font-bold sm:text-2xl">{value}</p>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-semibold text-gray-600">
        {label}
      </span>
      {children}
    </label>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-2">
      <span className="text-gray-500">{label}</span>
      <span className="max-w-[65%] break-words text-right font-semibold">
        {value}
      </span>
    </div>
  );
}
