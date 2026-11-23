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
  Pencil,
  Trash2,
  ShieldCheck,
  UserRound,
} from "lucide-react";

type User = {
  id: number;
  name: string;
  email: string;
  role: "Administrador" | "Gerente" | "Vendedor";
  status: "Ativo" | "Inativo";
  lastAccess: string;
};

const initialUsers: User[] = [];

const navigation = [
  { label: "Dashboard", href: "/", icon: BarChart3 },
  { label: "Produtos", href: "/produtos", icon: Package },
  { label: "Estoque", href: "/estoque", icon: Boxes },
  { label: "Entradas", href: "/estoque/entradas", icon: ArrowDownToLine },
  { label: "Saídas e vendas", href: "/vendas", icon: ArrowUpFromLine },
  { label: "Caixa", href: "/caixa", icon: Wallet },
  { label: "Relatórios", href: "/relatorios", icon: TrendingUp },
];

function Sidebar({ mobile = false, onClose }: { mobile?: boolean; onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <aside className={`flex h-full w-[260px] flex-col bg-[#101010] text-white ${mobile ? "shadow-2xl" : ""}`}>
      <div className="flex h-[82px] items-center justify-between border-b border-white/10 px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black"><Smartphone size={23} /></div>
          <div>
            <h1 className="text-[19px] font-bold">TechControl</h1>
            <p className="text-[9px] font-semibold tracking-[2px] text-gray-500">GESTÃO COMERCIAL</p>
          </div>
        </Link>
        {mobile && <button onClick={onClose} aria-label="Fechar menu" className="rounded-lg p-2 hover:bg-white/10"><X size={21} /></button>}
      </div>

      <div className="px-4 pt-8">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[1.8px] text-gray-500">Menu principal</p>
        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} onClick={() => mobile && onClose?.()} className="flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-medium text-gray-400 transition hover:bg-white/10 hover:text-white">
                <Icon size={18} /> {item.label}
              </Link>
            );
          })}
        </nav>
        <p className="mb-3 mt-9 px-3 text-[10px] font-bold uppercase tracking-[1.8px] text-gray-500">Administração</p>
        <nav className="space-y-1">
          <Link href="/usuarios" onClick={() => mobile && onClose?.()} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-medium ${pathname === "/usuarios" ? "bg-white text-black" : "text-gray-400 hover:bg-white/10 hover:text-white"}`}>
            <Users size={18} /> Usuários
          </Link>
          <Link href="/configuracoes" onClick={() => mobile && onClose?.()} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-medium ${pathname === "/configuracoes" ? "bg-white text-black" : "text-gray-400 hover:bg-white/10 hover:text-white"}`}>
            <Settings size={18} /> Configurações
          </Link>
        </nav>
      </div>

      <div className="mt-auto p-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-xs font-bold text-black">AD</div>
            <div><p className="text-xs font-semibold">Administrador</p><p className="text-[10px] text-gray-500">Acesso administrativo</p></div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default function UsuariosPage() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("Todos");
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [details, setDetails] = useState<User | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState<User["role"]>("Vendedor");
  const [selectedStatus, setSelectedStatus] = useState<User["status"]>("Ativo");

  const filteredUsers = useMemo(() => {
    const term = search.toLowerCase();
    return users.filter((user) =>
      (user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term)) &&
      (role === "Todos" || user.role === role)
    );
  }, [users, search, role]);

  function openNew() {
    setEditingId(null);
    setName("");
    setEmail("");
    setSelectedRole("Vendedor");
    setSelectedStatus("Ativo");
    setModalOpen(true);
  }

  function openEdit(user: User) {
    setEditingId(user.id);
    setName(user.name);
    setEmail(user.email);
    setSelectedRole(user.role);
    setSelectedStatus(user.status);
    setModalOpen(true);
  }

  function saveUser() {
    if (!name.trim() || !email.trim()) {
      alert("Preencha nome e e-mail.");
      return;
    }
    if (editingId) {
      setUsers((current) => current.map((user) => user.id === editingId ? { ...user, name: name.trim(), email: email.trim(), role: selectedRole, status: selectedStatus } : user));
    } else {
      setUsers((current) => [...current, { id: Date.now(), name: name.trim(), email: email.trim(), role: selectedRole, status: selectedStatus, lastAccess: "Nunca acessou" }]);
    }
    setModalOpen(false);
  }

  function deleteUser(id: number) {
    if (window.confirm("Deseja excluir este usuário?")) {
      setUsers((current) => current.filter((user) => user.id !== id));
    }
  }

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
              <button onClick={() => setMenuOpen(true)} aria-label="Abrir menu" className="rounded-xl border border-gray-200 p-2.5 lg:hidden"><Menu size={20} /></button>
              <div><p className="text-[10px] text-gray-400">GESTÃO COMERCIAL</p><h2 className="text-[16px] font-bold">Usuários</h2></div>
            </div>
            <div className="flex items-center gap-3">
              <button aria-label="Notificações" className="rounded-xl border border-gray-200 p-2.5"><Bell size={18} /></button>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-xs font-bold text-white">AD</div>
            </div>
          </header>

          <div className="mx-auto max-w-[1600px] p-4 sm:p-7 lg:p-9">
            <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div><h1 className="text-2xl font-bold tracking-tight">Gestão de usuários</h1><p className="mt-1 text-sm text-gray-500">Controle acessos e permissões da equipe.</p></div>
              <button onClick={openNew} className="flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"><Plus size={18} /> Novo usuário</button>
            </div>

            <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { label: "Usuários cadastrados", value: users.length, icon: Users, tone: "bg-gray-100" },
                { label: "Usuários ativos", value: users.filter((user) => user.status === "Ativo").length, icon: ShieldCheck, tone: "bg-emerald-50 text-emerald-600" },
                { label: "Administradores", value: users.filter((user) => user.role === "Administrador").length, icon: UserRound, tone: "bg-violet-50 text-violet-600" },
              ].map((card) => {
                const Icon = card.icon;
                return (
                  <div key={card.label} className="rounded-2xl border border-gray-200 bg-white p-5">
                    <div className="flex items-center justify-between"><span className="text-sm text-gray-500">{card.label}</span><div className={`rounded-xl p-2.5 ${card.tone}`}><Icon size={19} /></div></div>
                    <h3 className="mt-4 text-3xl font-bold">{card.value}</h3>
                  </div>
                );
              })}
            </div>

            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div><h3 className="font-bold">Equipe</h3><p className="mt-1 text-xs text-gray-400">Usuários com acesso ao sistema.</p></div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative"><Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar usuário..." className="h-10 w-full rounded-xl border border-gray-200 pl-10 pr-3 text-sm outline-none focus:border-black sm:w-56" /></div>
                  <div className="relative"><select value={role} onChange={(e) => setRole(e.target.value)} className="h-10 w-full appearance-none rounded-xl border border-gray-200 px-3 pr-9 text-sm outline-none focus:border-black sm:w-40"><option>Todos</option><option>Administrador</option><option>Gerente</option><option>Vendedor</option></select><ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" /></div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] text-left">
                  <thead className="bg-gray-50"><tr className="text-[11px] uppercase tracking-wide text-gray-400"><th className="px-5 py-4 font-semibold">Usuário</th><th className="px-5 py-4 font-semibold">Perfil</th><th className="px-5 py-4 font-semibold">Último acesso</th><th className="px-5 py-4 font-semibold">Situação</th><th className="px-5 py-4 text-right font-semibold">Ações</th></tr></thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50/70">
                        <td className="px-5 py-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-xs font-bold">{user.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</div><div><p className="text-sm font-semibold">{user.name}</p><p className="mt-1 text-[11px] text-gray-400">{user.email}</p></div></div></td>
                        <td className="px-5 py-4"><span className="rounded-full bg-gray-100 px-3 py-1.5 text-[11px] font-semibold">{user.role}</span></td>
                        <td className="px-5 py-4 text-sm text-gray-500">{user.lastAccess}</td>
                        <td className="px-5 py-4"><span className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${user.status === "Ativo" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>{user.status}</span></td>
                        <td className="px-5 py-4"><div className="flex justify-end gap-2"><button onClick={() => setDetails(user)} title="Ver detalhes" className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-100"><Eye size={16} /></button><button onClick={() => openEdit(user)} title="Editar" className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-100"><Pencil size={16} /></button><button onClick={() => deleteUser(user.id)} title="Excluir" className="rounded-lg border border-gray-200 p-2 text-red-500 hover:bg-red-50"><Trash2 size={16} /></button></div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredUsers.length === 0 && <div className="p-12 text-center"><Users size={32} className="mx-auto text-gray-300" /><p className="mt-3 text-sm font-semibold">Nenhum usuário encontrado</p></div>}
              </div>
            </section>
          </div>
        </main>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between"><div><h3 className="text-lg font-bold">{editingId ? "Editar usuário" : "Novo usuário"}</h3><p className="mt-1 text-xs text-gray-400">Defina os dados e o nível de acesso.</p></div><button onClick={() => setModalOpen(false)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"><X size={19} /></button></div>
            <div className="space-y-4">
              <div><label className="mb-2 block text-xs font-semibold">Nome completo *</label><input value={name} onChange={(e) => setName(e.target.value)} className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-black" /></div>
              <div><label className="mb-2 block text-xs font-semibold">E-mail *</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-black" /></div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><div><label className="mb-2 block text-xs font-semibold">Perfil *</label><select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value as User["role"])} className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-black"><option>Administrador</option><option>Gerente</option><option>Vendedor</option></select></div><div><label className="mb-2 block text-xs font-semibold">Situação *</label><select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value as User["status"])} className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-black"><option>Ativo</option><option>Inativo</option></select></div></div>
            </div>
            <div className="mt-6 flex gap-3"><button onClick={() => setModalOpen(false)} className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-semibold hover:bg-gray-50">Cancelar</button><button onClick={saveUser} className="flex-1 rounded-xl bg-black py-3 text-sm font-semibold text-white hover:bg-gray-800">Salvar usuário</button></div>
          </div>
        </div>
      )}

      {details && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between"><div><h3 className="text-lg font-bold">Detalhes do usuário</h3><p className="mt-1 text-xs text-gray-400">Acesso #{details.id}</p></div><button onClick={() => setDetails(null)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"><X size={19} /></button></div>
            <div className="space-y-4 text-sm"><div><p className="text-xs text-gray-400">Nome</p><p className="mt-1 font-semibold">{details.name}</p></div><div><p className="text-xs text-gray-400">E-mail</p><p className="mt-1">{details.email}</p></div><div className="grid grid-cols-2 gap-4"><div><p className="text-xs text-gray-400">Perfil</p><p className="mt-1">{details.role}</p></div><div><p className="text-xs text-gray-400">Situação</p><p className="mt-1">{details.status}</p></div></div></div>
            <button onClick={() => setDetails(null)} className="mt-6 w-full rounded-xl bg-black py-3 text-sm font-semibold text-white">Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}
