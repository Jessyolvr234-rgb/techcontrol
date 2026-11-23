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
  Menu,
  Package,
  Search,
  Settings,
  ShoppingBag,
  Smartphone,
  TrendingUp,
  Users,
  Wallet,
  X,
  Eye,
  CreditCard,
  Banknote,
  QrCode,
} from "lucide-react";

type Sale = {
  id: number;
  product: string;
  code: string;
  customer: string;
  quantity: number;
  unitPrice: number;
  cost: number;
  total: number;
  payment: "Pix" | "Cartão" | "Dinheiro";
  date: string;
  status: "Concluída" | "Pendente" | "Cancelada";
  notes: string;
};

const products: Array<{ name: string; code: string; price: number; cost: number; stock: number }> = [];

const initialSales: Sale[] = [];

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
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const dateFormat = (date: string) =>
  new Date(`${date}T12:00:00`).toLocaleDateString("pt-BR");

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
          <div className="mb-3 flex items-center gap-2">
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

export default function VendasPage() {
  const [sales, setSales] = useState(initialSales);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Todas");
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [details, setDetails] = useState<Sale | null>(null);
  const [productName, setProductName] = useState("");
  const [customer, setCustomer] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [payment, setPayment] = useState<"Pix" | "Cartão" | "Dinheiro">("Pix");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  const selectedProduct = products.find((product) => product.name === productName);
  const saleTotal = Number(quantity || 0) * Number(selectedProduct?.price || 0);

  const filteredSales = useMemo(() => {
    const term = search.toLowerCase();
    return sales.filter((sale) => {
      const matchesSearch =
        sale.product.toLowerCase().includes(term) ||
        sale.code.toLowerCase().includes(term) ||
        sale.customer.toLowerCase().includes(term) ||
        String(sale.id).includes(term);
      const matchesStatus = status === "Todas" || sale.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [sales, search, status]);

  const validSales = sales.filter((sale) => sale.status !== "Cancelada");
  const revenue = validSales.reduce((sum, sale) => sum + sale.total, 0);
  const profit = validSales.reduce((sum, sale) => sum + sale.total - sale.cost * sale.quantity, 0);
  const unitsSold = validSales.reduce((sum, sale) => sum + sale.quantity, 0);

  function resetForm() {
    setProductName("");
    setCustomer("");
    setQuantity("1");
    setPayment("Pix");
    setDate(new Date().toLocaleDateString("en-CA"));
    setNotes("");
  }

  function saveSale() {
    const qty = Number(quantity);
    if (!selectedProduct || !customer.trim() || !date) {
      alert("Preencha o produto, cliente e data.");
      return;
    }
    if (!Number.isInteger(qty) || qty <= 0 || qty > selectedProduct.stock) {
      alert("Informe uma quantidade válida disponível em estoque.");
      return;
    }

    const newSale: Sale = {
      id: sales.length ? Math.max(...sales.map((sale) => sale.id)) + 1 : 1,
      product: selectedProduct.name,
      code: selectedProduct.code,
      customer: customer.trim(),
      quantity: qty,
      unitPrice: selectedProduct.price,
      cost: selectedProduct.cost,
      total: qty * selectedProduct.price,
      payment,
      date,
      status: "Concluída",
      notes: notes.trim(),
    };
    setSales((current) => [newSale, ...current]);
    setModalOpen(false);
    resetForm();
  }

  function cancelSale(id: number) {
    setSales((current) =>
      current.map((sale) => (sale.id === id ? { ...sale, status: "Cancelada" } : sale))
    );
  }

  const statusClass = (value: Sale["status"]) =>
    value === "Concluída"
      ? "bg-emerald-50 text-emerald-700"
      : value === "Pendente"
        ? "bg-amber-50 text-amber-700"
        : "bg-red-50 text-red-600";

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
                <h2 className="text-[16px] font-bold">Saídas e vendas</h2>
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
                <h1 className="text-2xl font-bold tracking-tight">Saídas e vendas</h1>
                <p className="mt-1 text-sm text-gray-500">Registre vendas e acompanhe o faturamento da loja.</p>
              </div>
              <button onClick={() => { setDate(new Date().toLocaleDateString("en-CA")); setModalOpen(true); }} className="flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800">
                <PlusIcon />
                Nova venda
              </button>
            </div>

            <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Vendas realizadas", value: String(validSales.length), caption: "Pedidos concluídos", icon: ShoppingBag, tone: "bg-gray-100" },
                { label: "Unidades vendidas", value: String(unitsSold), caption: "Produtos comercializados", icon: Package, tone: "bg-emerald-50 text-emerald-600" },
                { label: "Faturamento", value: money(revenue), caption: "Valor bruto das vendas", icon: TrendingUp, tone: "bg-blue-50 text-blue-600" },
                { label: "Lucro estimado", value: money(profit), caption: "Resultado menos custos", icon: Wallet, tone: "bg-violet-50 text-violet-600" },
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

            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <div className="flex flex-col gap-4 border-b border-gray-100 p-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h3 className="font-bold">Histórico de vendas</h3>
                  <p className="mt-1 text-xs text-gray-400">Acompanhe as vendas e suas formas de pagamento.</p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative">
                    <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar venda..." className="h-10 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-black sm:w-56" />
                  </div>
                  <div className="relative">
                    <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-10 w-full appearance-none rounded-xl border border-gray-200 bg-white px-3 pr-9 text-sm outline-none focus:border-black sm:w-40">
                      <option>Todas</option><option>Concluída</option><option>Pendente</option><option>Cancelada</option>
                    </select>
                    <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[920px] text-left">
                  <thead className="bg-gray-50">
                    <tr className="text-[11px] uppercase tracking-wide text-gray-400">
                      <th className="px-5 py-4 font-semibold">Venda</th>
                      <th className="px-5 py-4 font-semibold">Produto</th>
                      <th className="px-5 py-4 font-semibold">Cliente</th>
                      <th className="px-5 py-4 font-semibold">Pagamento</th>
                      <th className="px-5 py-4 font-semibold">Valor</th>
                      <th className="px-5 py-4 font-semibold">Data</th>
                      <th className="px-5 py-4 font-semibold">Situação</th>
                      <th className="px-5 py-4 text-right font-semibold">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredSales.map((sale) => (
                      <tr key={sale.id} className="transition hover:bg-gray-50/70">
                        <td className="px-5 py-4 text-xs font-semibold text-gray-500">#{sale.id}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100"><Smartphone size={19} className="text-gray-500" /></div>
                            <div><p className="text-sm font-semibold">{sale.product}</p><p className="mt-1 text-[11px] text-gray-400">{sale.quantity} un. · {sale.code}</p></div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-500">{sale.customer}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            {sale.payment === "Pix" ? <QrCode size={16} /> : sale.payment === "Cartão" ? <CreditCard size={16} /> : <Banknote size={16} />}
                            {sale.payment}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm font-bold">{money(sale.total)}</td>
                        <td className="px-5 py-4 text-sm text-gray-500">{dateFormat(sale.date)}</td>
                        <td className="px-5 py-4"><span className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${statusClass(sale.status)}`}>{sale.status}</span></td>
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => setDetails(sale)} title="Ver detalhes" className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-100"><Eye size={16} /></button>
                            {sale.status !== "Cancelada" && (
                              <button onClick={() => { if (window.confirm("Deseja cancelar esta venda?")) cancelSale(sale.id); }} title="Cancelar venda" className="rounded-lg border border-gray-200 p-2 text-red-500 hover:bg-red-50"><X size={16} /></button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredSales.length === 0 && (
                  <div className="p-12 text-center">
                    <ShoppingBag size={32} className="mx-auto text-gray-300" />
                    <p className="mt-3 text-sm font-semibold">Nenhuma venda encontrada</p>
                    <p className="mt-1 text-xs text-gray-400">Altere os filtros ou faça uma nova busca.</p>
                  </div>
                )}
              </div>
              <div className="border-t border-gray-100 px-5 py-4 text-xs text-gray-400">Exibindo {filteredSales.length} de {sales.length} registros</div>
            </section>
          </div>
        </main>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">
          <div className="my-auto w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <div><h3 className="text-lg font-bold">Nova venda</h3><p className="mt-1 text-xs text-gray-400">Informe os dados da venda realizada.</p></div>
              <button onClick={() => { setModalOpen(false); resetForm(); }} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"><X size={19} /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-semibold">Produto *</label>
                <select value={productName} onChange={(e) => setProductName(e.target.value)} className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-black">
                  <option value="">Selecione um produto</option>
                  {products.map((product) => <option key={product.code} value={product.name}>{product.name} — {product.code}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold">Cliente *</label>
                <input value={customer} onChange={(e) => setCustomer(e.target.value)} placeholder="Nome do cliente" className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-black" />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-semibold">Quantidade *</label>
                  <input type="number" min="1" step="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-black" />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold">Forma de pagamento *</label>
                  <select value={payment} onChange={(e) => setPayment(e.target.value as typeof payment)} className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-black">
                    <option>Pix</option><option>Cartão</option><option>Dinheiro</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold">Data da venda *</label>
                <div className="relative">
                  <CalendarDays size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-11 w-full rounded-xl border border-gray-200 pl-10 pr-3 text-sm outline-none focus:border-black" />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold">Observações</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Informações adicionais..." rows={3} className="w-full resize-none rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-black" />
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs text-gray-500">Valor total da venda</p>
                <p className="mt-1 text-2xl font-bold">{money(saleTotal)}</p>
                <p className="mt-1 text-[11px] text-gray-400">{quantity || 0} unidades × {money(selectedProduct?.price || 0)}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
              <button onClick={() => { setModalOpen(false); resetForm(); }} className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-semibold hover:bg-gray-50">Cancelar</button>
              <button onClick={saveSale} className="flex-1 rounded-xl bg-black py-3 text-sm font-semibold text-white hover:bg-gray-800">Registrar venda</button>
            </div>
          </div>
        </div>
      )}

      {details && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <div><h3 className="text-lg font-bold">Detalhes da venda</h3><p className="mt-1 text-xs text-gray-400">Venda #{details.id}</p></div>
              <button onClick={() => setDetails(null)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"><X size={19} /></button>
            </div>
            <div className="space-y-4 text-sm">
              <div><p className="text-xs text-gray-400">Produto</p><p className="mt-1 font-semibold">{details.product}</p><p className="text-xs text-gray-400">{details.code}</p></div>
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs text-gray-400">Cliente</p><p className="mt-1 font-medium">{details.customer}</p></div>
                <div><p className="text-xs text-gray-400">Data</p><p className="mt-1 font-medium">{dateFormat(details.date)}</p></div>
                <div><p className="text-xs text-gray-400">Quantidade</p><p className="mt-1 font-medium">{details.quantity} unidades</p></div>
                <div><p className="text-xs text-gray-400">Pagamento</p><p className="mt-1 font-medium">{details.payment}</p></div>
              </div>
              <div className="rounded-xl bg-gray-50 p-4"><p className="text-xs text-gray-400">Valor total</p><p className="mt-1 text-2xl font-bold">{money(details.total)}</p></div>
              <div><p className="text-xs text-gray-400">Observações</p><p className="mt-1 text-gray-600">{details.notes || "Nenhuma observação registrada."}</p></div>
            </div>
            <button onClick={() => setDetails(null)} className="mt-6 w-full rounded-xl bg-black py-3 text-sm font-semibold text-white hover:bg-gray-800">Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}

function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
