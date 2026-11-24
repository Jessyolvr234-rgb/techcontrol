
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
  TrendingUp,
  Users,
  Wallet,
  X,
  Eye,
  CreditCard,
  Banknote,
  QrCode,
  Smartphone,
  Search,
  Settings,
  ShoppingBag,
  Plus,
  Trash2,
  Loader2,
  Check,
} from "lucide-react";

type Payment = "Pix" | "Cartão" | "Dinheiro";
type SaleStatus = "Concluída" | "Pendente" | "Cancelada";

type Product = {
  id: string;
  name: string;
  code: string;
  price: number;
  cost: number;
  stock: number;
};

type CartItem = {
  productId: string;
  quantity: number;
};

type Sale = {
  id: string;
  customer: string;
  products: string;
  quantity: number;
  total: number;
  subtotal: number;
  discount: number;
  payment: Payment;
  date: string;
  status: SaleStatus;
  notes: string;
};

type SaleRow = {
  id: string;
  cliente_nome: string;
  subtotal: number;
  desconto: number;
  total: number;
  forma_pagamento: Payment;
  status: SaleStatus;
  observacoes: string | null;
  created_at: string;
};

type SaleItemRow = {
  venda_id: string;
  produto_id: string;
  quantidade: number;
};

const supabase = createClient();

const navigation = [
  { label: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { label: "Produtos", href: "/produtos", icon: Package },
  { label: "Estoque", href: "/estoque", icon: Boxes },
  { label: "Entradas", href: "/estoque/entradas", icon: ArrowDownToLine },
  { label: "Saídas e vendas", href: "/vendas", icon: ArrowUpFromLine },
  { label: "Caixa", href: "/caixa", icon: Wallet },
  { label: "Relatórios", href: "/relatorios", icon: TrendingUp },
];

const money = (value: number) =>
  Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

const dateFormat = (value: string) =>
  new Date(value).toLocaleDateString("pt-BR");

function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-[260px] flex-col bg-[#171717] text-white">
      <div className="flex h-[82px] items-center border-b border-white/10 px-6">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C6A15B] text-black">
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
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[1.8px] text-gray-500">
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
                    ? "bg-[#C6A15B] text-black shadow-lg"
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
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-medium text-gray-400 transition hover:bg-white/10 hover:text-white"
          >
            <Users size={18} />
            Usuários
          </Link>

          <Link
            href="/configuracoes"
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-medium text-gray-400 transition hover:bg-white/10 hover:text-white"
          >
            <Settings size={18} />
            Configurações
          </Link>
        </nav>
      </div>

      <div className="mt-auto p-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C6A15B] text-xs font-bold text-black">
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

export default function VendasPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Todas");
  const [modalOpen, setModalOpen] = useState(false);
  const [details, setDetails] = useState<Sale | null>(null);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [productListOpen, setProductListOpen] = useState(false);

  const [quantity, setQuantity] = useState("1");
  const [customer, setCustomer] = useState("");
  const [payment, setPayment] = useState<Payment>("Pix");
  const [date, setDate] = useState("");
  const [discount, setDiscount] = useState("0");
  const [notes, setNotes] = useState("");

  // CARREGAR PRODUTOS E VENDAS DO SUPABASE

  const loadData = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const [productsResult, salesResult, itemsResult] = await Promise.all([
        supabase
          .from("produtos")
          .select(
            "id,nome,modelo,preco_venda,preco_compra,quantidade,ativo"
          )
          .eq("ativo", true)
          .order("nome", { ascending: true }),

        supabase
          .from("vendas")
          .select("*")
          .order("created_at", { ascending: false }),

        supabase
          .from("itens_venda")
          .select("venda_id,produto_id,quantidade"),
      ]);

      if (productsResult.error) throw productsResult.error;
      if (salesResult.error) throw salesResult.error;
      if (itemsResult.error) throw itemsResult.error;

      const mappedProducts: Product[] = (productsResult.data || []).map(
        (product) => ({
          id: product.id,
          name: product.nome,
          code: product.modelo || product.id.slice(0, 8),
          price: Number(product.preco_venda),
          cost: Number(product.preco_compra),
          stock: Number(product.quantidade),
        })
      );

      setProducts(mappedProducts);

      const productMap = new Map(
        mappedProducts.map((product) => [product.id, product.name])
      );

      const itemsBySale = new Map<string, SaleItemRow[]>();

      ((itemsResult.data || []) as SaleItemRow[]).forEach((item) => {
        const current = itemsBySale.get(item.venda_id) || [];
        current.push(item);
        itemsBySale.set(item.venda_id, current);
      });

      const mappedSales: Sale[] = ((salesResult.data || []) as SaleRow[]).map(
        (sale) => {
          const items = itemsBySale.get(sale.id) || [];

          const names = items.map(
            (item) => productMap.get(item.produto_id) || "Produto"
          );

          const totalQuantity = items.reduce(
            (sum, item) => sum + Number(item.quantidade),
            0
          );

          return {
            id: sale.id,
            customer: sale.cliente_nome,
            products: names.join(", ") || "Venda",
            quantity: totalQuantity,
            total: Number(sale.total),
            subtotal: Number(sale.subtotal),
            discount: Number(sale.desconto),
            payment: sale.forma_pagamento,
            date: sale.created_at,
            status: sale.status,
            notes: sale.observacoes || "",
          };
        }
      );

      setSales(mappedSales);
    } catch (error) {
      console.error("Erro ao carregar vendas:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar os dados."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // PRODUTOS DO CARRINHO

  const cartDetails = useMemo(
    () =>
      cart.map((item) => {
        const product = products.find((p) => p.id === item.productId);

        return {
          ...item,
          product,
          total: (product?.price || 0) * item.quantity,
        };
      }),
    [cart, products]
  );

  // FILTRO DA BUSCA DE PRODUTOS

  const filteredProducts = useMemo(() => {
    const term = productSearch.toLowerCase().trim();

    if (!term) return products;

    return products.filter((product) => {
      return (
        product.name.toLowerCase().includes(term) ||
        product.code.toLowerCase().includes(term) ||
        product.id.toLowerCase().includes(term)
      );
    });
  }, [products, productSearch]);

  const subtotal = cartDetails.reduce(
    (sum, item) => sum + item.total,
    0
  );

  const discountValue = Math.max(0, Number(discount) || 0);
  const saleTotal = Math.max(0, subtotal - discountValue);

  // FILTRO DO HISTÓRICO

  const filteredSales = useMemo(() => {
    const term = search.toLowerCase();

    return sales.filter((sale) => {
      const matchesSearch =
        sale.products.toLowerCase().includes(term) ||
        sale.customer.toLowerCase().includes(term) ||
        sale.id.toLowerCase().includes(term);

      const matchesStatus =
        status === "Todas" || sale.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [sales, search, status]);

  const validSales = sales.filter(
    (sale) => sale.status !== "Cancelada"
  );

  const revenue = validSales.reduce(
    (sum, sale) => sum + sale.total,
    0
  );

  const unitsSold = validSales.reduce(
    (sum, sale) => sum + sale.quantity,
    0
  );

  // LIMPAR FORMULÁRIO

  function resetForm() {
    setCart([]);
    setSelectedProduct("");
    setProductSearch("");
    setProductListOpen(false);
    setQuantity("1");
    setCustomer("");
    setPayment("Pix");
    setDate(new Date().toLocaleDateString("en-CA"));
    setDiscount("0");
    setNotes("");
    setErrorMessage("");
  }

  // SELECIONAR PRODUTO

  function chooseProduct(product: Product) {
    if (product.stock <= 0) {
      setErrorMessage("Este produto está sem estoque disponível.");
      return;
    }

    setSelectedProduct(product.id);
    setProductSearch(product.name);
    setProductListOpen(false);
    setErrorMessage("");
  }

  // ADICIONAR PRODUTO AO CARRINHO

  function addProduct() {
    const product = products.find(
      (item) => item.id === selectedProduct
    );

    const qty = Number(quantity);

    if (!product) {
      setErrorMessage(
        "Digite e selecione um produto da lista antes de adicionar."
      );
      return;
    }

    if (!Number.isInteger(qty) || qty <= 0) {
      setErrorMessage("Informe uma quantidade válida.");
      return;
    }

    const alreadyInCart = cart
      .filter((item) => item.productId === product.id)
      .reduce((sum, item) => sum + item.quantity, 0);

    if (alreadyInCart + qty > product.stock) {
      setErrorMessage(
        `Estoque insuficiente. Disponível: ${product.stock} unidade(s).`
      );
      return;
    }

    setCart((current) => {
      const existing = current.find(
        (item) => item.productId === product.id
      );

      if (existing) {
        return current.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                quantity: item.quantity + qty,
              }
            : item
        );
      }

      return [
        ...current,
        {
          productId: product.id,
          quantity: qty,
        },
      ];
    });

    setSelectedProduct("");
    setProductSearch("");
    setProductListOpen(false);
    setQuantity("1");
    setErrorMessage("");
  }

  // REMOVER PRODUTO DO CARRINHO

  function removeProduct(productId: string) {
    setCart((current) =>
      current.filter((item) => item.productId !== productId)
    );
  }

  // REGISTRAR VENDA

  async function saveSale() {
    if (!customer.trim() || !date || cart.length === 0) {
      setErrorMessage(
        "Informe o cliente, a data e adicione produtos."
      );
      return;
    }

    if (discountValue > subtotal) {
      setErrorMessage(
        "O desconto não pode ser maior que o subtotal."
      );
      return;
    }

    setSaving(true);
    setErrorMessage("");

    try {
      const { data, error } = await supabase.rpc("registrar_venda", {
        p_cliente_nome: customer.trim(),

        p_itens: cart.map((item) => ({
          produto_id: item.productId,
          quantidade: item.quantity,
        })),

        p_forma_pagamento: payment,
        p_desconto: discountValue,
        p_observacoes: notes.trim() || null,
        p_data_venda: date,
      });

      if (error) throw error;

      if (!data) {
        throw new Error(
          "O banco não retornou o registro da venda."
        );
      }

      setModalOpen(false);
      resetForm();

      await loadData();

      alert("Venda registrada com sucesso!");
    } catch (error) {
      console.error("Erro ao registrar venda:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível registrar a venda."
      );
    } finally {
      setSaving(false);
    }
  }

  const statusClass = (value: SaleStatus) =>
    value === "Concluída"
      ? "bg-emerald-50 text-emerald-700"
      : value === "Pendente"
        ? "bg-amber-50 text-amber-700"
        : "bg-red-50 text-red-600";

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#171717]">
      <div className="flex min-h-screen">
        <div className="hidden shrink-0 lg:block">
          <Sidebar />
        </div>

        <main className="min-w-0 flex-1">
          {/* CABEÇALHO */}

          <header className="sticky top-0 z-30 flex min-h-[76px] items-center justify-between border-b border-[#E5E5E5] bg-white/95 px-4 backdrop-blur-md sm:px-7 lg:px-9">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C6A15B] text-black">
                <Smartphone size={22} />
              </div>

              <div>
                <h2 className="text-[17px] font-bold tracking-tight">
                  TechControl
                </h2>
                <p className="text-[9px] font-semibold tracking-[1.8px] text-[#A88948]">
                  GESTÃO COMERCIAL
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                aria-label="Notificações"
                className="rounded-xl border border-[#E5E5E5] p-2.5 text-gray-600 transition hover:border-[#C6A15B] hover:bg-[#FBF8F1]"
              >
                <Bell size={18} />
              </button>

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#171717] text-xs font-bold text-[#D6B873]">
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
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[1.8px] text-[#A88948]">
                  Gestão comercial
                </p>

                <h1 className="text-2xl font-bold tracking-tight">
                  Saídas e vendas
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Registre vendas e acompanhe o faturamento da loja.
                </p>
              </div>

              <button
                onClick={() => {
                  resetForm();
                  setModalOpen(true);
                }}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#C6A15B] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#D6B873]"
              >
                <Plus size={18} />
                Nova venda
              </button>
            </div>

            {errorMessage && !modalOpen && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            )}

            {/* INDICADORES */}

            <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  label: "Vendas realizadas",
                  value: String(validSales.length),
                  caption: "Pedidos não cancelados",
                  icon: ShoppingBag,
                },
                {
                  label: "Unidades vendidas",
                  value: String(unitsSold),
                  caption: "Produtos comercializados",
                  icon: Package,
                },
                {
                  label: "Faturamento",
                  value: money(revenue),
                  caption: "Valor bruto das vendas",
                  icon: TrendingUp,
                },
                {
                  label: "Lucro estimado",
                  value: "Consulte relatórios",
                  caption: "Cálculo detalhado por produto",
                  icon: Wallet,
                },
              ].map((card) => {
                const Icon = card.icon;

                return (
                  <div
                    key={card.label}
                    className="rounded-2xl border border-[#E5E5E5] bg-white p-5 transition hover:border-[#C6A15B]/60"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {card.label}
                      </span>

                      <div className="rounded-xl bg-[#FBF8F1] p-2.5 text-[#A88948]">
                        <Icon size={19} />
                      </div>
                    </div>

                    <h3 className="mt-4 text-2xl font-bold">
                      {card.value}
                    </h3>

                    <p className="mt-1 text-xs text-gray-400">
                      {card.caption}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* HISTÓRICO */}

            <section className="overflow-hidden rounded-2xl border border-[#E5E5E5] bg-white">
              <div className="flex flex-col gap-4 border-b border-gray-100 p-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h3 className="font-bold">Histórico de vendas</h3>

                  <p className="mt-1 text-xs text-gray-400">
                    Acompanhe as vendas e suas formas de pagamento.
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
                      placeholder="Buscar venda..."
                      className="h-10 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-[#C6A15B] sm:w-56"
                    />
                  </div>

                  <div className="relative">
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="h-10 w-full appearance-none rounded-xl border border-gray-200 bg-white px-3 pr-9 text-sm outline-none transition focus:border-[#C6A15B] sm:w-40"
                    >
                      <option value="Todas">Todas</option>
                      <option value="Concluída">Concluída</option>
                      <option value="Pendente">Pendente</option>
                      <option value="Cancelada">Cancelada</option>
                    </select>

                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left">
                  <thead className="bg-[#FAF9F6]">
                    <tr className="text-[11px] uppercase tracking-wide text-gray-400">
                      <th className="px-5 py-4 font-semibold">Venda</th>
                      <th className="px-5 py-4 font-semibold">Produto(s)</th>
                      <th className="px-5 py-4 font-semibold">Cliente</th>
                      <th className="px-5 py-4 font-semibold">Pagamento</th>
                      <th className="px-5 py-4 font-semibold">Valor</th>
                      <th className="px-5 py-4 font-semibold">Data</th>
                      <th className="px-5 py-4 font-semibold">Situação</th>
                      <th className="px-5 py-4 text-right font-semibold">
                        Ações
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {loading ? (
                      <tr>
                        <td
                          colSpan={8}
                          className="px-5 py-12 text-center text-sm text-gray-400"
                        >
                          <Loader2
                            className="mx-auto mb-2 animate-spin"
                            size={22}
                          />
                          Carregando vendas...
                        </td>
                      </tr>
                    ) : (
                      filteredSales.map((sale) => (
                        <tr
                          key={sale.id}
                          className="transition hover:bg-[#FBF9F4]"
                        >
                          <td className="px-5 py-4 text-xs font-semibold text-gray-500">
                            #{sale.id.slice(0, 8)}
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FBF8F1] text-[#A88948]">
                                <Smartphone size={19} />
                              </div>

                              <div>
                                <p className="max-w-[230px] truncate text-sm font-semibold">
                                  {sale.products}
                                </p>

                                <p className="mt-1 text-[11px] text-gray-400">
                                  {sale.quantity} unidade(s)
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4 text-sm text-gray-500">
                            {sale.customer}
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              {sale.payment === "Pix" ? (
                                <QrCode size={16} />
                              ) : sale.payment === "Cartão" ? (
                                <CreditCard size={16} />
                              ) : (
                                <Banknote size={16} />
                              )}
                              {sale.payment}
                            </div>
                          </td>

                          <td className="px-5 py-4 text-sm font-bold">
                            {money(sale.total)}
                          </td>

                          <td className="px-5 py-4 text-sm text-gray-500">
                            {dateFormat(sale.date)}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${statusClass(sale.status)}`}
                            >
                              {sale.status}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex justify-end">
                              <button
                                onClick={() => setDetails(sale)}
                                title="Ver detalhes"
                                className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:border-[#C6A15B] hover:bg-[#FBF8F1] hover:text-[#A88948]"
                              >
                                <Eye size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>

                {!loading && filteredSales.length === 0 && (
                  <div className="p-12 text-center">
                    <ShoppingBag
                      size={32}
                      className="mx-auto text-[#C6A15B]"
                    />

                    <p className="mt-3 text-sm font-semibold">
                      Nenhuma venda encontrada
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Altere os filtros ou registre uma nova venda.
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 px-5 py-4 text-xs text-gray-400">
                Exibindo {filteredSales.length} de {sales.length} registros
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* MODAL DE NOVA VENDA */}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-auto max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#E5E5E5] bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[1.5px] text-[#A88948]">
                  TechControl
                </p>

                <h3 className="text-lg font-bold">Nova venda</h3>

                <p className="mt-1 text-xs text-gray-400">
                  Adicione os produtos e informe os dados da venda.
                </p>
              </div>

              <button
                onClick={() => {
                  setModalOpen(false);
                  resetForm();
                }}
                disabled={saving}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100"
              >
                <X size={19} />
              </button>
            </div>

            <div className="space-y-4">
              {errorMessage && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorMessage}
                </div>
              )}

              {/* CLIENTE */}

              <div>
                <label className="mb-2 block text-xs font-semibold">
                  Cliente *
                </label>

                <input
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  placeholder="Nome do cliente"
                  className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none transition focus:border-[#C6A15B]"
                />
              </div>

              {/* PRODUTOS */}

              <div className="rounded-xl border border-gray-200 p-4">
                <p className="mb-3 text-sm font-bold">
                  Adicionar produtos
                </p>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_110px_auto]">
                  {/* CAMPO DE BUSCA */}

                  <div className="relative min-w-0">
                    <Search
                      size={17}
                      className="absolute left-3 top-1/2 z-10 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="text"
                      value={productSearch}
                      onChange={(e) => {
                        setProductSearch(e.target.value);
                        setSelectedProduct("");
                        setProductListOpen(true);
                        setErrorMessage("");
                      }}
                      onFocus={() => setProductListOpen(true)}
                      onBlur={() => {
                        window.setTimeout(() => {
                          setProductListOpen(false);
                        }, 150);
                      }}
                      placeholder="Digite o nome ou código do produto..."
                      autoComplete="off"
                      className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-[#C6A15B] focus:ring-2 focus:ring-[#C6A15B]/10"
                    />

                    {/* LISTA DE SUGESTÕES */}

                    {productListOpen && (
                      <div className="absolute left-0 right-0 top-full z-40 mt-2 max-h-64 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-xl">
                        {loading ? (
                          <div className="flex items-center justify-center gap-2 p-4 text-xs text-gray-400">
                            <Loader2
                              size={16}
                              className="animate-spin"
                            />
                            Carregando produtos...
                          </div>
                        ) : products.length === 0 ? (
                          <div className="p-4 text-center">
                            <Package
                              size={24}
                              className="mx-auto text-gray-300"
                            />

                            <p className="mt-2 text-xs font-semibold text-gray-600">
                              Nenhum produto disponível
                            </p>

                            <p className="mt-1 text-[11px] text-gray-400">
                              Cadastre um produto ou verifique se ele está ativo no estoque.
                            </p>
                          </div>
                        ) : filteredProducts.length === 0 ? (
                          <div className="p-4 text-center">
                            <Search
                              size={22}
                              className="mx-auto text-gray-300"
                            />

                            <p className="mt-2 text-xs font-semibold text-gray-600">
                              Nenhum produto encontrado
                            </p>

                            <p className="mt-1 text-[11px] text-gray-400">
                              Confira o nome ou o código digitado.
                            </p>
                          </div>
                        ) : (
                          filteredProducts.map((product) => (
                            <button
                              key={product.id}
                              type="button"
                              disabled={product.stock <= 0}
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => chooseProduct(product)}
                              className="flex w-full items-center justify-between gap-3 border-b border-gray-100 px-4 py-3 text-left transition last:border-0 hover:bg-[#FBF8F1] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FBF8F1] text-[#A88948]">
                                  <Smartphone size={18} />
                                </div>

                                <div className="min-w-0">
                                  <p className="truncate text-sm font-semibold text-gray-800">
                                    {product.name}
                                  </p>

                                  <p className="mt-1 text-[11px] text-gray-400">
                                    Código: {product.code}
                                  </p>
                                </div>
                              </div>

                              <div className="shrink-0 text-right">
                                <p className="text-sm font-bold text-[#A88948]">
                                  {money(product.price)}
                                </p>

                                <p
                                  className={`mt-1 text-[10px] font-medium ${
                                    product.stock > 0
                                      ? "text-emerald-600"
                                      : "text-red-500"
                                  }`}
                                >
                                  {product.stock > 0
                                    ? `${product.stock} disponível(is)`
                                    : "Sem estoque"}
                                </p>
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  {/* QUANTIDADE */}

                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-[#C6A15B]"
                    aria-label="Quantidade"
                    placeholder="Qtd."
                  />

                  {/* ADICIONAR */}

                  <button
                    type="button"
                    onClick={addProduct}
                    className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#171717] px-4 text-sm font-semibold text-white transition hover:bg-[#333]"
                  >
                    <Plus size={17} />
                    Adicionar
                  </button>
                </div>

                {/* PRODUTO SELECIONADO */}

                {selectedProduct && (
                  <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                    <Check size={15} />

                    <span>
                      Produto selecionado:{" "}
                      <strong>
                        {
                          products.find(
                            (p) => p.id === selectedProduct
                          )?.name
                        }
                      </strong>
                    </span>
                  </div>
                )}

                {products.length === 0 && !loading && (
                  <p className="mt-3 text-xs text-amber-700">
                    Não há produtos ativos cadastrados para venda.
                  </p>
                )}

                {/* CARRINHO */}

                {cartDetails.length > 0 && (
                  <div className="mt-4 divide-y divide-gray-100">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                        Produtos adicionados
                      </p>

                      <span className="rounded-full bg-[#FBF8F1] px-3 py-1 text-[10px] font-semibold text-[#A88948]">
                        {cart.length} item(ns)
                      </span>
                    </div>

                    {cartDetails.map((item) => (
                      <div
                        key={item.productId}
                        className="flex items-center justify-between gap-3 py-3"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">
                            {item.product?.name}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            {item.quantity} ×{" "}
                            {money(item.product?.price || 0)}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <p className="whitespace-nowrap text-sm font-bold">
                            {money(item.total)}
                          </p>

                          <button
                            type="button"
                            onClick={() =>
                              removeProduct(item.productId)
                            }
                            className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
                            title="Remover produto"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* PAGAMENTO E DATA */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-semibold">
                    Forma de pagamento *
                  </label>

                  <select
                    value={payment}
                    onChange={(e) =>
                      setPayment(e.target.value as Payment)
                    }
                    className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-[#C6A15B]"
                  >
                    <option value="Pix">Pix</option>
                    <option value="Cartão">Cartão</option>
                    <option value="Dinheiro">Dinheiro</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold">
                    Data da venda *
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
                      className="h-11 w-full rounded-xl border border-gray-200 pl-10 pr-3 text-sm outline-none focus:border-[#C6A15B]"
                    />
                  </div>
                </div>
              </div>

              {/* DESCONTO */}

              <div>
                <label className="mb-2 block text-xs font-semibold">
                  Desconto (R$)
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-[#C6A15B]"
                />
              </div>

              {/* OBSERVAÇÕES */}

              <div>
                <label className="mb-2 block text-xs font-semibold">
                  Observações
                </label>

                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Informações adicionais..."
                  rows={3}
                  className="w-full resize-none rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-[#C6A15B]"
                />
              </div>

              {/* RESUMO DA VENDA */}

              <div className="rounded-xl border border-[#E8DFC9] bg-[#FBF8F1] p-4">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span>{money(subtotal)}</span>
                </div>

                <div className="mt-2 flex justify-between text-sm text-gray-500">
                  <span>Desconto</span>
                  <span>- {money(discountValue)}</span>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-[#E8DFC9] pt-3">
                  <span className="text-sm font-semibold">
                    Total da venda
                  </span>

                  <span className="text-2xl font-bold text-[#A88948]">
                    {money(saleTotal)}
                  </span>
                </div>
              </div>
            </div>

            {/* BOTÕES DO MODAL */}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
              <button
                onClick={() => {
                  setModalOpen(false);
                  resetForm();
                }}
                disabled={saving}
                className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-semibold transition hover:bg-gray-50 disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                onClick={saveSale}
                disabled={saving || cart.length === 0}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#C6A15B] py-3 text-sm font-semibold text-black transition hover:bg-[#D6B873] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                    Registrando...
                  </>
                ) : (
                  "Registrar venda"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE DETALHES */}

      {details && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-[#E5E5E5] bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[1.5px] text-[#A88948]">
                  TechControl
                </p>

                <h3 className="text-lg font-bold">
                  Detalhes da venda
                </h3>

                <p className="mt-1 text-xs text-gray-400">
                  Venda #{details.id.slice(0, 8)}
                </p>
              </div>

              <button
                onClick={() => setDetails(null)}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100"
              >
                <X size={19} />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-xs text-gray-400">Produto(s)</p>
                <p className="mt-1 font-semibold">
                  {details.products}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400">Cliente</p>
                  <p className="mt-1 font-medium">
                    {details.customer}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">Data</p>
                  <p className="mt-1 font-medium">
                    {dateFormat(details.date)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">Quantidade</p>
                  <p className="mt-1 font-medium">
                    {details.quantity} unidade(s)
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">Pagamento</p>
                  <p className="mt-1 font-medium">
                    {details.payment}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-[#E8DFC9] bg-[#FBF8F1] p-4">
                <p className="text-xs text-gray-400">
                  Valor total
                </p>

                <p className="mt-1 text-2xl font-bold text-[#A88948]">
                  {money(details.total)}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Observações
                </p>

                <p className="mt-1 text-gray-600">
                  {details.notes ||
                    "Nenhuma observação registrada."}
                </p>
              </div>
            </div>

            <button
              onClick={() => setDetails(null)}
              className="mt-6 w-full rounded-xl bg-[#171717] py-3 text-sm font-semibold text-white transition hover:bg-[#333333]"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
