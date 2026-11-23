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
} from "lucide-react";

type Movement = {
  id: number;
  type: "Entrada" | "Saída";
  description: string;
  category: string;
  payment: "Pix" | "Cartão" | "Dinheiro" | "Transferência";
  value: number;
  date: string;
  responsible: string;
  notes: string;
};

const initialMovements: Movement[] = [];

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
          <div className="flex items-center gap-2">
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

export default function CaixaPage() {
  const [movements, setMovements] = useState(initialMovements);
  const [search, setSearch] = useState("");
  const [movementType, setMovementType] = useState("Todas");
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [details, setDetails] = useState<Movement | null>(null);
  const [type, setType] = useState<"Entrada" | "Saída">("Entrada");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Venda");
  const [payment, setPayment] = useState<Movement["payment"]>("Dinheiro");
  const [value, setValue] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [openingBalance] = useState(0);

  const filteredMovements = useMemo(() => {
    const term = search.toLowerCase();
    return movements.filter((movement) => {
      const matchesSearch =
        movement.description.toLowerCase().includes(term) ||
        movement.category.toLowerCase().includes(term) ||
        movement.payment.toLowerCase().includes(term) ||
        String(movement.id).includes(term);
      const matchesType = movementType === "Todas" || movement.type === movementType;
      return matchesSearch && matchesType;
    });
  }, [movements, search, movementType]);

  const totalEntries = movements
    .filter((movement) => movement.type === "Entrada")
    .reduce((sum, movement) => sum + movement.value, 0);
  const totalExits = movements
    .filter((movement) => movement.type === "Saída")
    .reduce((sum, movement) => sum + movement.value, 0);
  const balance = openingBalance + totalEntries - totalExits;

  function resetForm() {
    setType("Entrada");
    setDescription("");
    setCategory("Venda");
    setPayment("Dinheiro");
    setValue("");
    setDate(new Date().toLocaleDateString("en-CA"));
    setNotes("");
  }

  function saveMovement() {
    const numericValue = Number(value);
    if (!description.trim() || !date) {
      alert("Preencha a descrição e a data.");
      return;
    }
    if (!Number.isFinite(numericValue) || numericValue <= 0) {
      alert("Informe um valor válido.");
      return;
    }

    const newMovement: Movement = {
      id: movements.length ? Math.max(...movements.map((movement) => movement.id)) + 1 : 1,
      type,
      description: description.trim(),
      category,
      payment,
      value: numericValue,
      date,
      responsible: "Administrador",
      notes: notes.trim(),
    };

    setMovements((current) => [newMovement, ...current]);
    setModalOpen(false);
    resetForm();
  }

  const paymentIcon = (method: Movement["payment"]) => {
    if (method === "Pix") return <QrCode size={16} />;
    if (method === "Cartão") return <CreditCard size={16} />;
    if (method === "Transferência") return <Landmark size={16} />;
    return <Banknote size={16} />;
  };

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
                <h2 className="text-[16px] font-bold">Caixa</h2>
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
                <h1 className="text-2xl font-bold tracking-tight">Controle de caixa</h1>
                <p className="mt-1 text-sm text-gray-500">Acompanhe entradas, saídas e o saldo disponível.</p>
              </div>
              <button onClick={() => { setDate(new Date().toLocaleDateString("en-CA")); setModalOpen(true); }} className="flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800">
                <Plus size={18} /> Nova movimentação
              </button>
            </div>

            <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Saldo atual", value: money(balance), caption: "Disponível no caixa", icon: CircleDollarSign, tone: "bg-black text-white" },
                { label: "Saldo de abertura", value: money(openingBalance), caption: "Iniciado no dia", icon: Landmark, tone: "bg-gray-100" },
                { label: "Entradas", value: money(totalEntries), caption: "Receitas registradas", icon: ArrowDownToLine, tone: "bg-emerald-50 text-emerald-600" },
                { label: "Saídas", value: money(totalExits), caption: "Despesas registradas", icon: ArrowUpFromLine, tone: "bg-red-50 text-red-600" },
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
                  <h3 className="font-bold">Movimentações</h3>
                  <p className="mt-1 text-xs text-gray-400">Extrato geral do caixa.</p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative">
                    <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar movimentação..." className="h-10 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-black sm:w-60" />
                  </div>
                  <div className="relative">
                    <select value={movementType} onChange={(e) => setMovementType(e.target.value)} className="h-10 w-full appearance-none rounded-xl border border-gray-200 bg-white px-3 pr-9 text-sm outline-none focus:border-black sm:w-40">
                      <option>Todas</option><option>Entrada</option><option>Saída</option>
                    </select>
                    <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left">
                  <thead className="bg-gray-50">
                    <tr className="text-[11px] uppercase tracking-wide text-gray-400">
                      <th className="px-5 py-4 font-semibold">Movimentação</th>
                      <th className="px-5 py-4 font-semibold">Categoria</th>
                      <th className="px-5 py-4 font-semibold">Pagamento</th>
                      <th className="px-5 py-4 font-semibold">Responsável</th>
                      <th className="px-5 py-4 font-semibold">Data</th>
                      <th className="px-5 py-4 font-semibold">Valor</th>
                      <th className="px-5 py-4 text-right font-semibold">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredMovements.map((movement) => (
                      <tr key={movement.id} className="transition hover:bg-gray-50/70">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${movement.type === "Entrada" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
                              {movement.type === "Entrada" ? <ArrowDownToLine size={19} /> : <ArrowUpFromLine size={19} />}
                            </div>
                            <div>
                              <p className="text-sm font-semibold">{movement.description}</p>
                              <p className="mt-1 text-[11px] text-gray-400">#{movement.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-500">{movement.category}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">{paymentIcon(movement.payment)}{movement.payment}</div>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-500">{movement.responsible}</td>
                        <td className="px-5 py-4 text-sm text-gray-500">{dateFormat(movement.date)}</td>
                        <td className={`px-5 py-4 text-sm font-bold ${movement.type === "Entrada" ? "text-emerald-600" : "text-red-600"}`}>
                          {movement.type === "Entrada" ? "+" : "-"} {money(movement.value)}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex justify-end">
                            <button onClick={() => setDetails(movement)} title="Ver detalhes" className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-100"><Eye size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredMovements.length === 0 && (
                  <div className="p-12 text-center">
                    <Wallet size={32} className="mx-auto text-gray-300" />
                    <p className="mt-3 text-sm font-semibold">Nenhuma movimentação encontrada</p>
                    <p className="mt-1 text-xs text-gray-400">Altere os filtros ou faça uma nova busca.</p>
                  </div>
                )}
              </div>
              <div className="border-t border-gray-100 px-5 py-4 text-xs text-gray-400">Exibindo {filteredMovements.length} de {movements.length} registros</div>
            </section>
          </div>
        </main>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">
          <div className="my-auto w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <div><h3 className="text-lg font-bold">Nova movimentação</h3><p className="mt-1 text-xs text-gray-400">Registre uma entrada ou saída do caixa.</p></div>
              <button onClick={() => { setModalOpen(false); resetForm(); }} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"><X size={19} /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-semibold">Tipo *</label>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setType("Entrada")} className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold ${type === "Entrada" ? "border-emerald-600 bg-emerald-50 text-emerald-700" : "border-gray-200 text-gray-500"}`}><ArrowDownToLine size={17} />Entrada</button>
                  <button onClick={() => setType("Saída")} className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold ${type === "Saída" ? "border-red-500 bg-red-50 text-red-600" : "border-gray-200 text-gray-500"}`}><ArrowUpFromLine size={17} />Saída</button>
                </div>
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold">Descrição *</label>
                <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ex.: Pagamento de fornecedor" className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-black" />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-semibold">Categoria *</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-black">
                    {type === "Entrada" ? <><option>Venda</option><option>Serviço</option><option>Outros recebimentos</option></> : <><option>Fornecedor</option><option>Despesa</option><option>Retirada</option><option>Outros pagamentos</option></>}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold">Forma de pagamento *</label>
                  <select value={payment} onChange={(e) => setPayment(e.target.value as Movement["payment"])} className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-black">
                    <option>Dinheiro</option><option>Pix</option><option>Cartão</option><option>Transferência</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-semibold">Valor (R$) *</label>
                  <input type="number" min="0.01" step="0.01" value={value} onChange={(e) => setValue(e.target.value)} placeholder="0,00" className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-black" />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold">Data *</label>
                  <div className="relative">
                    <CalendarDays size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-11 w-full rounded-xl border border-gray-200 pl-10 pr-3 text-sm outline-none focus:border-black" />
                  </div>
                </div>
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold">Observações</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Informações adicionais..." rows={3} className="w-full resize-none rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-black" />
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs text-gray-500">Valor da movimentação</p>
                <p className={`mt-1 text-2xl font-bold ${type === "Entrada" ? "text-emerald-600" : "text-red-600"}`}>{type === "Entrada" ? "+" : "-"} {money(Number(value || 0))}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
              <button onClick={() => { setModalOpen(false); resetForm(); }} className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-semibold hover:bg-gray-50">Cancelar</button>
              <button onClick={saveMovement} className="flex-1 rounded-xl bg-black py-3 text-sm font-semibold text-white hover:bg-gray-800">Registrar movimentação</button>
            </div>
          </div>
        </div>
      )}

      {details && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <div><h3 className="text-lg font-bold">Detalhes da movimentação</h3><p className="mt-1 text-xs text-gray-400">Movimentação #{details.id}</p></div>
              <button onClick={() => setDetails(null)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"><X size={19} /></button>
            </div>
            <div className="space-y-4 text-sm">
              <div><p className="text-xs text-gray-400">Descrição</p><p className="mt-1 font-semibold">{details.description}</p></div>
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs text-gray-400">Tipo</p><p className="mt-1 font-medium">{details.type}</p></div>
                <div><p className="text-xs text-gray-400">Categoria</p><p className="mt-1 font-medium">{details.category}</p></div>
                <div><p className="text-xs text-gray-400">Pagamento</p><p className="mt-1 font-medium">{details.payment}</p></div>
                <div><p className="text-xs text-gray-400">Data</p><p className="mt-1 font-medium">{dateFormat(details.date)}</p></div>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs text-gray-400">Valor</p>
                <p className={`mt-1 text-2xl font-bold ${details.type === "Entrada" ? "text-emerald-600" : "text-red-600"}`}>{details.type === "Entrada" ? "+" : "-"} {money(details.value)}</p>
              </div>
              <div><p className="text-xs text-gray-400">Observações</p><p className="mt-1 text-gray-600">{details.notes || "Nenhuma observação registrada."}</p></div>
            </div>
            <button onClick={() => setDetails(null)} className="mt-6 w-full rounded-xl bg-black py-3 text-sm font-semibold text-white hover:bg-gray-800">Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}
