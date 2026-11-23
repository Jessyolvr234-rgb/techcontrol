"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  BarChart3,
  Bell,
  Boxes,
  Menu,
  Package,
  Settings,
  Smartphone,
  TrendingUp,
  Users,
  Wallet,
  X,
  Building2,
  Store,
  ShieldCheck,
  Download,
  ReceiptText,
  Save,
  Palette,
  Mail,
  LockKeyhole,
} from "lucide-react";

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
        <Link href="/" className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black"><Smartphone size={23} /></div><div><h1 className="text-[19px] font-bold">TechControl</h1><p className="text-[9px] font-semibold tracking-[2px] text-gray-500">GESTÃO COMERCIAL</p></div></Link>
        {mobile && <button onClick={onClose} aria-label="Fechar menu" className="rounded-lg p-2 hover:bg-white/10"><X size={21} /></button>}
      </div>
      <div className="px-4 pt-8">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[1.8px] text-gray-500">Menu principal</p>
        <nav className="space-y-1">
          {navigation.map((item) => { const Icon = item.icon; return <Link key={item.href} href={item.href} onClick={() => mobile && onClose?.()} className="flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-medium text-gray-400 transition hover:bg-white/10 hover:text-white"><Icon size={18} /> {item.label}</Link>; })}
        </nav>
        <p className="mb-3 mt-9 px-3 text-[10px] font-bold uppercase tracking-[1.8px] text-gray-500">Administração</p>
        <nav className="space-y-1">
          <Link href="/usuarios" className="flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-medium text-gray-400 hover:bg-white/10 hover:text-white"><Users size={18} /> Usuários</Link>
          <Link href="/configuracoes" className={`flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-medium ${pathname === "/configuracoes" ? "bg-white text-black" : "text-gray-400 hover:bg-white/10 hover:text-white"}`}><Settings size={18} /> Configurações</Link>
        </nav>
      </div>
      <div className="mt-auto p-4"><div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"><div className="flex items-center gap-2"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-xs font-bold text-black">AD</div><div><p className="text-xs font-semibold">Administrador</p><p className="text-[10px] text-gray-500">Acesso administrativo</p></div></div></div></div>
    </aside>
  );
}

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button type="button" onClick={onChange} className={`relative h-6 w-11 rounded-full transition ${enabled ? "bg-black" : "bg-gray-200"}`} aria-label={enabled ? "Desativar" : "Ativar"}>
      <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${enabled ? "left-6" : "left-1"}`} />
    </button>
  );
}

export default function ConfiguracoesPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [section, setSection] = useState("Empresa");
  const [company, setCompany] = useState("");
  const [document, setDocument] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [storeName, setStoreName] = useState("");
  const [currency, setCurrency] = useState("BRL");
  const [minimumStock, setMinimumStock] = useState("0");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [stockAlert, setStockAlert] = useState(true);
  const [saleAlert, setSaleAlert] = useState(true);
  const [emailAlert, setEmailAlert] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [isInstalled, setIsInstalled] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(display-mode: standalone)").matches
      : false
  );

  async function installPwa() {
    const prompt = window.pwaInstallPrompt;
    if (!prompt) {
      setSaveMessage("Abra o navegador e use a opção Adicionar à tela inicial.");
      return;
    }
    await prompt.prompt();
    const choice = await prompt.userChoice;
    if (choice.outcome === "accepted") setIsInstalled(true);
    window.pwaInstallPrompt = undefined;
  }

  const sections = [
    { label: "Empresa", icon: Building2 },
    { label: "Loja", icon: Store },
    { label: "Notificações", icon: Bell },
    { label: "Segurança", icon: ShieldCheck },
    { label: "Aplicativo", icon: Download },
  ];

  function saveSettings() {
    if (section === "Empresa" && (!company.trim() || !document.trim())) {
      setSaveMessage("Preencha a razão social e o CNPJ.");
      return;
    }

    if (section === "Segurança") {
      if (!currentPassword || !newPassword || !confirmPassword) {
        setSaveMessage("Preencha todos os campos de senha.");
        return;
      }
      if (newPassword.length < 8) {
        setSaveMessage("A nova senha deve ter pelo menos 8 caracteres.");
        return;
      }
      if (newPassword !== confirmPassword) {
        setSaveMessage("As senhas não coincidem.");
        return;
      }
    }

    setSaveMessage("Alterações salvas com sucesso.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  return (
    <div className="min-h-screen bg-[#F7F7F8] text-[#171717]">
      <div className="flex min-h-screen">
        <div className="hidden shrink-0 lg:block"><Sidebar /></div>
        {menuOpen && <div className="fixed inset-0 z-50 lg:hidden"><button onClick={() => setMenuOpen(false)} className="absolute inset-0 bg-black/50" aria-label="Fechar menu" /><div className="relative h-full w-[280px]"><Sidebar mobile onClose={() => setMenuOpen(false)} /></div></div>}

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex h-[68px] items-center justify-between border-b border-gray-200 bg-white/95 px-3 backdrop-blur-md sm:h-[76px] sm:px-7 lg:px-9">
            <div className="flex items-center gap-3"><button onClick={() => setMenuOpen(true)} aria-label="Abrir menu" className="rounded-xl border border-gray-200 p-2.5 lg:hidden"><Menu size={20} /></button><div><p className="text-[10px] text-gray-400">GESTÃO COMERCIAL</p><h2 className="text-[16px] font-bold">Configurações</h2></div></div>
            <div className="flex items-center gap-3"><button aria-label="Notificações" className="rounded-xl border border-gray-200 p-2.5"><Bell size={18} /></button><div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-xs font-bold text-white">AD</div></div>
          </header>

          <div className="mx-auto max-w-[1600px] p-3 sm:p-7 lg:p-9">
            <div className="mb-5 sm:mb-7"><h1 className="text-xl font-bold tracking-tight sm:text-2xl">Configurações do sistema</h1><p className="mt-1 text-xs text-gray-500 sm:text-sm">Personalize dados da empresa, loja e preferências.</p></div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
              <aside className="grid h-fit grid-cols-2 gap-1 rounded-2xl border border-gray-200 bg-white p-2 sm:grid-cols-4 lg:block">
                {sections.map((item) => {
                  const Icon = item.icon;
                  return <button key={item.label} onClick={() => { setSection(item.label); setSaveMessage(""); }} className={`mb-0 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-2 py-2 text-xs font-medium sm:text-sm lg:mb-1 lg:justify-start lg:px-3 lg:py-3 ${section === item.label ? "bg-black text-white" : "text-gray-500 hover:bg-gray-50"}`}><Icon size={17} />{item.label}</button>;
                })}
              </aside>

              <section className="rounded-2xl border border-gray-200 bg-white">
                {section === "Empresa" && (
                  <>
                    <div className="border-b border-gray-100 p-5"><h3 className="font-bold">Dados da empresa</h3><p className="mt-1 text-xs text-gray-400">Informações usadas em documentos e relatórios.</p></div>
                    <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">
                      <div><label className="mb-2 block text-xs font-semibold">Razão social *</label><input value={company} onChange={(e) => setCompany(e.target.value)} className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-black" /></div>
                      <div><label className="mb-2 block text-xs font-semibold">CNPJ *</label><input value={document} onChange={(e) => setDocument(e.target.value)} className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-black" /></div>
                      <div><label className="mb-2 block text-xs font-semibold">E-mail comercial *</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-black" /></div>
                      <div><label className="mb-2 block text-xs font-semibold">Telefone *</label><input value={phone} onChange={(e) => setPhone(e.target.value)} className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-black" /></div>
                      <div className="sm:col-span-2"><label className="mb-2 block text-xs font-semibold">Endereço</label><input value={address} onChange={(e) => setAddress(e.target.value)} className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-black" /></div>
                    </div>
                  </>
                )}

                {section === "Loja" && (
                  <>
                    <div className="border-b border-gray-100 p-5"><h3 className="font-bold">Preferências da loja</h3><p className="mt-1 text-xs text-gray-400">Configurações operacionais e comerciais.</p></div>
                    <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">
                      <div><label className="mb-2 block text-xs font-semibold">Nome da loja</label><input value={storeName} onChange={(e) => setStoreName(e.target.value)} placeholder="Informe o nome da loja" className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-black" /></div>
                      <div><label className="mb-2 block text-xs font-semibold">Moeda</label><select value={currency} onChange={(e) => setCurrency(e.target.value)} className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-black"><option value="BRL">BRL — Real brasileiro</option><option value="USD">USD — Dólar americano</option></select></div>
                      <div><label className="mb-2 block text-xs font-semibold">Estoque mínimo padrão</label><input type="number" min="0" step="1" value={minimumStock} onChange={(e) => setMinimumStock(e.target.value)} placeholder="0" className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-black" /></div>
                      <div><label className="mb-2 block text-xs font-semibold">Cor principal</label><div className="flex h-11 items-center gap-3 rounded-xl border border-gray-200 px-3"><Palette size={17} className="text-gray-400" /><span className="h-5 w-5 rounded-full bg-black" /><span className="text-sm text-gray-500">Preto TechControl</span></div></div>
                    </div>
                  </>
                )}

                {section === "Notificações" && (
                  <>
                    <div className="border-b border-gray-100 p-5"><h3 className="font-bold">Notificações</h3><p className="mt-1 text-xs text-gray-400">Escolha quais alertas deseja receber.</p></div>
                    <div className="divide-y divide-gray-100 px-5">
                      {[
                        { label: "Estoque baixo", description: "Avisar quando um produto estiver próximo do mínimo.", state: stockAlert, action: () => setStockAlert((value) => !value), icon: Package },
                        { label: "Nova venda", description: "Receber alerta ao registrar uma venda.", state: saleAlert, action: () => setSaleAlert((value) => !value), icon: ReceiptText },
                        { label: "Resumo por e-mail", description: "Enviar resumo diário das movimentações.", state: emailAlert, action: () => setEmailAlert((value) => !value), icon: Mail },
                      ].map((item) => { const Icon = item.icon; return <div key={item.label} className="flex items-center justify-between gap-4 py-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100"><Icon size={18} /></div><div><p className="text-sm font-semibold">{item.label}</p><p className="mt-1 text-xs text-gray-400">{item.description}</p></div></div><Toggle enabled={item.state} onChange={item.action} /></div>; })}
                    </div>
                  </>
                )}

                {section === "Segurança" && (
                  <>
                    <div className="border-b border-gray-100 p-5"><h3 className="font-bold">Segurança da conta</h3><p className="mt-1 text-xs text-gray-400">Gerencie senha e proteção do usuário atual.</p></div>
                    <div className="space-y-5 p-5">
                      <div><label className="mb-2 block text-xs font-semibold">Senha atual</label><div className="relative"><LockKeyhole size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" className="h-11 w-full rounded-xl border border-gray-200 pl-10 pr-3 text-sm outline-none focus:border-black" /></div></div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><div><label className="mb-2 block text-xs font-semibold">Nova senha</label><input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Mínimo 8 caracteres" className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-black" /></div><div><label className="mb-2 block text-xs font-semibold">Confirmar senha</label><input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repita a nova senha" className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-black" /></div></div>
                    </div>
                  </>
                )}

                {section === "Aplicativo" && (
                  <>
                    <div className="border-b border-gray-100 p-5"><h3 className="font-bold">Aplicativo instalado</h3><p className="mt-1 text-xs text-gray-400">Instale o TechControl no celular ou computador.</p></div>
                    <div className="p-5">
                      <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-black text-xs font-bold text-white">TC</div>
                          <div>
                            <p className="text-sm font-semibold">TechControl</p>
                            <p className="mt-1 text-xs text-gray-500">{isInstalled ? "O aplicativo já está instalado." : "Acesso rápido, tela exclusiva e funcionamento offline."}</p>
                          </div>
                        </div>
                        {!isInstalled && (
                          <button onClick={installPwa} className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800">
                            <Download size={17} />Instalar aplicativo
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                )}

                <div className="flex flex-col-reverse items-center justify-between gap-3 border-t border-gray-100 p-5 sm:flex-row">
                  {saveMessage && (
                    <p className={`text-xs ${saveMessage.includes("sucesso") ? "text-emerald-600" : "text-red-600"}`} role="status">
                      {saveMessage}
                    </p>
                  )}
                  <button onClick={saveSettings} className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800 sm:w-auto"><Save size={17} />Salvar alterações</button>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
