
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
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
  id: string;
  name: string;
  category: string;
  model: string;
  storage: string;
  color: string;
  condition: string;
  quantity: number;
  cost: number;
  price: number;
  description: string;
  notes: string;
};

type ProductForm = Omit<Product, "id">;

const navigation = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Produtos", href: "/produtos", icon: Package },
  { label: "Estoque", href: "/estoque", icon: Boxes },
  { label: "Entradas", href: "/estoque/entradas", icon: ArrowDownToLine },
  { label: "Saídas e vendas", href: "/vendas", icon: ArrowUpFromLine },
  { label: "Caixa", href: "/caixa", icon: Wallet },
  { label: "Relatórios", href: "/relatorios", icon: BarChart3 },
];

const emptyProduct: ProductForm = {
  name: "",
  category: "iPhone",
  model: "",
  storage: "128GB",
  color: "",
  condition: "Novo",
  quantity: 1,
  cost: 0,
  price: 0,
  description: "",
  notes: "",
};

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-xs text-[#171717] outline-none transition placeholder:text-gray-400 focus:border-[#C6A15B] focus:ring-2 focus:ring-[#C6A15B]/15";

function money(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function mapProduct(item: any): Product {
  return {
    id: item.id,
    name: item.nome ?? "",
    category: item.categoria ?? "",
    model: item.modelo ?? "",
    storage: item.armazenamento ?? "",
    color: item.cor ?? "",
    condition: item.condicao ?? "Novo",
    quantity: Number(item.quantidade ?? 0),
    cost: Number(item.preco_compra ?? 0),
    price: Number(item.preco_venda ?? 0),
    description: item.descricao ?? "",
    notes: item.observacoes ?? "",
  };
}

function Sidebar() {
  return (
    <aside className="flex h-full w-[260px] flex-col bg-[#171717] text-white">
      <div className="border-b border-white/10 px-6 py-7">
        <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#C6A15B]">
          Menu principal
        </p>
      </div>

      <div className="px-4 pt-6">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = item.href === "/produtos";

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-medium transition ${
                  active
                    ? "bg-[#C6A15B] text-[#171717] shadow-lg shadow-black/10"
                    : "text-gray-400 hover:bg-white/10 hover:text-[#D6B873]"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <p className="mb-3 mt-9 px-3 text-[10px] font-bold uppercase tracking-[1.8px] text-[#C6A15B]">
          Administração
        </p>

        <nav className="space-y-1">
          <Link
            href="/usuarios"
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] text-gray-400 transition hover:bg-white/10 hover:text-[#D6B873]"
          >
            <Users size={18} />
            Usuários
          </Link>

          <Link
            href="/configuracoes"
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] text-gray-400 transition hover:bg-white/10 hover:text-[#D6B873]"
          >
            <Settings size={18} />
            Configurações
          </Link>
        </nav>
      </div>

      <div className="mt-auto p-4">
        <div className="rounded-2xl border border-[#C6A15B]/20 bg-[#C6A15B]/[0.07] p-4">
          <p className="text-xs font-semibold text-[#D6B873]">
            TechControl Pro
          </p>
          <p className="mt-2 text-[11px] leading-relaxed text-gray-400">
            Gerencie sua loja com praticidade e controle.
          </p>
        </div>

        <div className="mt-4 flex items-center gap-3 border-t border-white/10 pt-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C6A15B] text-xs font-bold text-[#171717]">
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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyProduct);

  const [supabase] = useState(() => createClient());

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("produtos")
      .select("*")
      .eq("ativo", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao carregar produtos:", error);
      setErrorMessage(
        `Não foi possível carregar os produtos: ${error.message}`
      );
      setLoading(false);
      return;
    }

    setProducts((data ?? []).map(mapProduct));
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        `${product.name} ${product.color} ${product.model}`
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
    setErrorMessage("");
    setSuccessMessage("");
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
      quantity: product.quantity,
      cost: product.cost,
      price: product.price,
      description: product.description,
      notes: product.notes,
    });
    setErrorMessage("");
    setSuccessMessage("");
    setModalOpen(true);
  }

  async function saveProduct(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.name.trim() || !form.model.trim()) {
      setErrorMessage("Preencha o nome e o modelo do produto.");
      return;
    }

    if (
      form.cost < 0 ||
      form.price < 0 ||
      form.quantity < 0 ||
      !Number.isFinite(form.cost) ||
      !Number.isFinite(form.price) ||
      !Number.isInteger(form.quantity)
    ) {
      setErrorMessage("Confira os valores e a quantidade informados.");
      return;
    }

    setSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    const productData = {
      nome: form.name.trim(),
      categoria: form.category,
      marca: "Apple",
      modelo: form.model.trim(),
      armazenamento: form.storage,
      cor: form.color.trim(),
      condicao: form.condition,
      quantidade: form.quantity,
      preco_compra: form.cost,
      preco_venda: form.price,
      descricao: form.description.trim(),
      observacoes: form.notes.trim(),
      ativo: true,
      updated_at: new Date().toISOString(),
    };

    try {
      if (editingId) {
        const { data, error } = await supabase
          .from("produtos")
          .update(productData)
          .eq("id", editingId)
          .select("*")
          .single();

        if (error) throw error;

        const updatedProduct = mapProduct(data);

        setProducts((current) =>
          current.map((product) =>
            product.id === editingId ? updatedProduct : product
          )
        );

        setSuccessMessage("Produto atualizado com sucesso!");
      } else {
        const { data, error } = await supabase
          .from("produtos")
          .insert(productData)
          .select("*")
          .single();

        if (error) throw error;

        setProducts((current) => [mapProduct(data), ...current]);
        setSuccessMessage("Produto cadastrado com sucesso!");
      }

      setModalOpen(false);
      setForm({ ...emptyProduct });
      setEditingId(null);
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível salvar o produto."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteProduct(id: string) {
    const confirmed = window.confirm(
      "Deseja desativar este produto? O histórico será preservado."
    );

    if (!confirmed) return;

    setDeletingId(id);
    setErrorMessage("");
    setSuccessMessage("");

    const { error } = await supabase
      .from("produtos")
      .update({
        ativo: false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error("Erro ao desativar produto:", error);
      setErrorMessage(`Não foi possível desativar: ${error.message}`);
      setDeletingId(null);
      return;
    }

    setProducts((current) =>
      current.filter((product) => product.id !== id)
    );

    if (viewProduct?.id === id) {
      setViewProduct(null);
    }

    setSuccessMessage("Produto desativado com sucesso.");
    setDeletingId(null);
  }

  const profit = form.price - form.cost;

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#171717]">
      <div className="flex min-h-screen">
        <div className="hidden shrink-0 lg:block">
          <Sidebar />
        </div>

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex min-h-[76px] items-center justify-between border-b border-gray-200 bg-white/95 px-4 backdrop-blur-md sm:px-7 lg:px-9">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#171717] text-[#D6B873]">
                <Smartphone size={24} />
              </div>
              <div>
                <h1 className="text-[19px] font-bold tracking-tight">
                  TechControl
                </h1>
                <p className="text-[9px] font-bold tracking-[2px] text-[#A88948]">
                  GESTÃO COMERCIAL
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <button
                aria-label="Notificações"
                className="rounded-xl border border-gray-200 p-2.5 text-gray-600 transition hover:border-[#C6A15B] hover:bg-[#C6A15B]/10 hover:text-[#A88948]"
              >
                <Bell size={18} />
              </button>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C6A15B] text-xs font-bold text-[#171717]">
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
                <Link
                  href="/dashboard"
                  className="mb-3 flex items-center gap-2 text-xs text-gray-400 transition hover:text-[#A88948]"
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
                className="flex items-center justify-center gap-2 rounded-xl bg-[#171717] px-5 py-3 text-xs font-semibold text-[#D6B873] shadow-sm transition hover:bg-[#292929]"
              >
                <Plus size={17} />
                Novo produto
              </button>
            </div>

            {errorMessage && !modalOpen && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                {errorMessage}
              </div>
            )}

            {successMessage && !modalOpen && (
              <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-3 text-xs text-green-700">
                {successMessage}
              </div>
            )}

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

            <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <h3 className="text-sm font-bold">Todos os produtos</h3>
                  <p className="mt-1 text-[11px] text-gray-400">
                    {filteredProducts.length} produto(s) encontrado(s)
                  </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 transition focus-within:border-[#C6A15B] sm:w-64">
                    <Search size={16} className="text-[#A88948]" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Pesquisar produto..."
                      className="w-full bg-transparent text-xs outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 transition focus-within:border-[#C6A15B]">
                    <Filter size={15} className="text-[#A88948]" />
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

              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left">
                  <thead>
                    <tr className="border-b border-gray-100 text-[10px] text-gray-400">
                      <th className="pb-4 font-medium">Produto</th>
                      <th className="pb-4 font-medium">Condição</th>
                      <th className="pb-4 font-medium">Quantidade</th>
                      <th className="pb-4 font-medium">Custo</th>
                      <th className="pb-4 font-medium">Venda</th>
                      <th className="pb-4 font-medium">Lucro unit.</th>
                      <th className="pb-4 text-right font-medium">Ações</th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading && (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-xs text-gray-400">
                          Carregando produtos...
                        </td>
                      </tr>
                    )}

                    {!loading && filteredProducts.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-gray-50 last:border-0 hover:bg-[#C6A15B]/[0.04]"
                      >
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C6A15B]/15 text-[#A88948]">
                              {product.category === "iPad" ? (
                                <Tablet size={20} />
                              ) : (
                                <Smartphone size={20} />
                              )}
                            </div>
                            <div>
                              <p className="text-xs font-semibold">{product.name}</p>
                              <p className="mt-1 text-[10px] text-gray-400">
                                {product.storage} · {product.color}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-4">
                          <span className="rounded-md border border-[#C6A15B]/20 bg-[#C6A15B]/10 px-2 py-1 text-[10px] text-[#8B713D]">
                            {product.condition}
                          </span>
                        </td>
                        <td className="py-4 text-xs font-semibold">{product.quantity}</td>
                        <td className="py-4 text-xs text-gray-600">{money(product.cost)}</td>
                        <td className="py-4 text-xs font-semibold">{money(product.price)}</td>
                        <td className="py-4 text-xs font-bold text-[#A88948]">
                          {money(product.price - product.cost)}
                        </td>
                        <td className="py-4">
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => setViewProduct(product)}
                              title="Visualizar"
                              className="rounded-lg p-2 text-gray-500 transition hover:bg-[#C6A15B]/15 hover:text-[#A88948]"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => openEditProduct(product)}
                              title="Editar"
                              className="rounded-lg p-2 text-gray-500 transition hover:bg-[#C6A15B]/15 hover:text-[#A88948]"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => deleteProduct(product.id)}
                              disabled={deletingId === product.id}
                              title="Desativar produto"
                              className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {!loading && filteredProducts.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-xs text-gray-400">
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

      {modalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/60 p-3 sm:p-6">
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
                onClick={() => {
                  setModalOpen(false);
                  setErrorMessage("");
                }}
                aria-label="Fechar"
                className="rounded-lg p-2 transition hover:bg-[#C6A15B]/15 hover:text-[#A88948]"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={saveProduct} className="space-y-6 p-5 sm:p-6">
              {errorMessage && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                  {errorMessage}
                </div>
              )}

              <div>
                <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-[#A88948]">
                  Identificação do produto
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Nome do produto *">
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Ex: iPhone 15 Pro Max"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Categoria">
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className={inputClass}
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
                      onChange={(e) => setForm({ ...form, model: e.target.value })}
                      placeholder="Ex: 15 Pro Max"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Armazenamento">
                    <select
                      value={form.storage}
                      onChange={(e) => setForm({ ...form, storage: e.target.value })}
                      className={inputClass}
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
                      onChange={(e) => setForm({ ...form, color: e.target.value })}
                      placeholder="Ex: Titânio Natural"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Condição">
                    <select
                      value={form.condition}
                      onChange={(e) => setForm({ ...form, condition: e.target.value })}
                      className={inputClass}
                    >
                      <option>Novo</option>
                      <option>Seminovo</option>
                      <option>Usado</option>
                    </select>
                  </Field>

                  <Field label="Quantidade inicial">
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={form.quantity}
                      onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
                      className={inputClass}
                    />
                  </Field>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-5">
                <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-[#A88948]">
                  Informações financeiras
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Preço de aquisição (R$)">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.cost}
                      onChange={(e) => setForm({ ...form, cost: Number(e.target.value) })}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Preço de venda (R$)">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                      className={inputClass}
                    />
                  </Field>
                </div>

                <div className="mt-4 rounded-xl border border-[#C6A15B]/20 bg-[#C6A15B]/10 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-gray-600">
                      Lucro bruto estimado por unidade
                    </span>
                    <span className={`text-lg font-bold ${profit >= 0 ? "text-[#A88948]" : "text-red-600"}`}>
                      {money(profit)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-5">
                <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-[#A88948]">
                  Detalhes adicionais
                </h3>
                <Field label="Descrição">
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Descreva as características do produto..."
                    className={`${inputClass} resize-none`}
                  />
                </Field>
                <div className="mt-4">
                  <Field label="Observações internas">
                    <textarea
                      rows={3}
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      placeholder="Informações internas sobre o produto..."
                      className={`${inputClass} resize-none`}
                    />
                  </Field>
                </div>
              </div>

              <div className="flex flex-col-reverse justify-end gap-2 border-t border-gray-100 pt-5 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    setModalOpen(false);
                    setErrorMessage("");
                  }}
                  disabled={saving}
                  className="rounded-xl border border-gray-200 px-5 py-3 text-xs font-semibold transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#171717] px-6 py-3 text-xs font-semibold text-[#D6B873] transition hover:bg-[#292929] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Plus size={16} />
                  {saving
                    ? "Salvando..."
                    : editingId
                      ? "Salvar alterações"
                      : "Cadastrar produto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewProduct && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold">Detalhes do produto</h2>
              <button
                onClick={() => setViewProduct(null)}
                aria-label="Fechar detalhes"
                className="rounded-lg p-2 transition hover:bg-[#C6A15B]/15 hover:text-[#A88948]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-5 flex items-center gap-3 rounded-xl border border-[#C6A15B]/20 bg-[#C6A15B]/10 p-4">
              <Smartphone size={28} className="text-[#A88948]" />
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
              <Detail label="Condição" value={viewProduct.condition} />
              <Detail label="Quantidade" value={String(viewProduct.quantity)} />
              <Detail label="Custo" value={money(viewProduct.cost)} />
              <Detail label="Preço de venda" value={money(viewProduct.price)} />
              <Detail label="Lucro unitário" value={money(viewProduct.price - viewProduct.cost)} />
              <Detail label="Descrição" value={viewProduct.description || "—"} />
              <Detail label="Observações" value={viewProduct.notes || "—"} />
            </div>

            <button
              onClick={() => setViewProduct(null)}
              className="mt-6 w-full rounded-xl bg-[#171717] py-3 text-xs font-semibold text-[#D6B873] transition hover:bg-[#292929]"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

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
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-[#C6A15B]/50">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">{title}</span>
        <div className="rounded-xl border border-[#C6A15B]/20 bg-[#C6A15B]/10 p-3 text-[#A88948]">
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
