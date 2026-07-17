import { auth } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Users,
  Eye,
  FileText,
  ClipboardList,
  DollarSign,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  MonitorSmartphone,
  Zap,
  Check,
  TrendingUp,
  Clock,
  ArrowUpRight,
} from "lucide-react";

export default async function HomePage() {
  const session = await auth();

  // If user is already authenticated, redirect directly to dashboard
  if (session && session.user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#fafbfc] font-sans text-slate-600 w-full scroll-smooth">
      {/* 1. HEADER / NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-blue-600 text-white rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 fill-current" />
            </span>
            <span className="text-lg font-bold text-slate-900 tracking-tight">OptiManager</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <a href="#features" className="hover:text-blue-600 transition-colors">Funcionalidades</a>
            <a href="#passos" className="hover:text-blue-600 transition-colors">Como Funciona</a>
            <a href="#preview" className="hover:text-blue-600 transition-colors">Interface</a>
          </nav>

          <div>
            <Link
              href="/login"
              className="btn btn-primary px-5 py-2 text-xs font-bold rounded-lg shadow-sm"
            >
              Entrar no Sistema
            </Link>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="px-6 py-20 md:py-28 border-b border-slate-100 bg-gradient-to-b from-[#f4f7fa] to-[#fafbfc]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left Text Block */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-blue-700 text-xs font-semibold mb-6">
              <span>SaaS de Gestão Óptica</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
              Gestão inteligente para <span className="text-blue-600">óticas modernas</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-500 leading-relaxed max-w-xl mb-8">
              Centralize prontuários de exames refrativos, receitas digitais, ordens de serviço e crediários em uma única plataforma projetada para o dia a dia da sua loja.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link
                href="/login"
                className="btn btn-primary px-7 py-3.5 text-sm font-bold rounded-lg shadow-md shadow-blue-500/20 w-full sm:w-auto flex items-center justify-center gap-2"
              >
                <span>Entrar no Sistema</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#features"
                className="btn btn-secondary px-7 py-3.5 text-sm font-bold rounded-lg w-full sm:w-auto flex items-center justify-center bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 cursor-pointer"
              >
                Conhecer Recursos
              </a>
            </div>
          </div>

          {/* Right Static Mini Dashboard Mockup */}
          <div className="lg:col-span-5 w-full">
            <div className="border border-slate-200 rounded-2xl bg-white shadow-xl p-4 flex flex-col gap-4 aspect-[4/3] w-full min-w-[280px]">
              {/* Window Bar */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-200"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-200"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-200"></span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">painel.optimanager.com</span>
              </div>
              
              {/* Fake Metrics Row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg flex flex-col">
                  <span className="text-[9px] uppercase font-bold text-slate-400">Clientes</span>
                  <span className="text-lg font-bold text-slate-800 mt-1">1.240</span>
                </div>
                <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg flex flex-col">
                  <span className="text-[9px] uppercase font-bold text-slate-400">Consultas</span>
                  <span className="text-lg font-bold text-slate-800 mt-1">3.189</span>
                </div>
              </div>

              {/* Fake Graph */}
              <div className="flex-1 border border-slate-100 rounded-lg p-3 flex flex-col gap-2 bg-slate-50">
                <div className="flex justify-between items-center text-[10px] text-slate-400">
                  <span className="font-semibold text-slate-600">Fluxo Diário</span>
                  <span className="text-green-600 font-bold flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" /> +12%
                  </span>
                </div>
                <div className="flex-1 flex items-end justify-between px-2 pt-2 gap-1.5">
                  <div className="w-full bg-blue-100 rounded-t h-[40%]"></div>
                  <div className="w-full bg-blue-100 rounded-t h-[60%]"></div>
                  <div className="w-full bg-blue-100 rounded-t h-[45%]"></div>
                  <div className="w-full bg-blue-100 rounded-t h-[75%]"></div>
                  <div className="w-full bg-blue-600 rounded-t h-[90%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SEÇÃO PROBLEMA / SOLUÇÃO */}
      <section className="px-6 py-24 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-2">Desafios & Respostas</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Otimize a rotina do balcão de vendas</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
            {/* Problema */}
            <div className="p-8 border border-slate-100 rounded-2xl bg-slate-50/50 flex flex-col gap-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-500" />
                <span>Gestão manual ineficiente</span>
              </h3>
              <ul className="flex flex-col gap-4 text-slate-500 text-sm">
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 font-bold mt-1">&bull;</span>
                  <span>Prontuários e fichas clínicas em papel que se rasuram ou perdem com o tempo.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 font-bold mt-1">&bull;</span>
                  <span>Dificuldade para buscar históricos de receitas passadas e graus antigos no atendimento.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 font-bold mt-1">&bull;</span>
                  <span>Falta de rastreabilidade sobre crediários próprios pendentes e prazos de laboratório.</span>
                </li>
              </ul>
            </div>

            {/* Solução */}
            <div className="p-8 border border-blue-100 rounded-2xl bg-blue-50/10 flex flex-col gap-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-600 border border-blue-200 rounded-full p-0.5" />
                <span>A resposta do OptiManager</span>
              </h3>
              <ul className="flex flex-col gap-4 text-slate-500 text-sm">
                <li className="flex items-start gap-2.5">
                  <span className="text-blue-600 font-bold mt-1">&bull;</span>
                  <span><strong>Centralização Total:</strong> Todo o prontuário de exames e histórico clínico integrado ao cliente.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-blue-600 font-bold mt-1">&bull;</span>
                  <span><strong>Agilidade no Balcão:</strong> Localize cadastros, O.S. ou telefone de clientes em poucos segundos.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-blue-600 font-bold mt-1">&bull;</span>
                  <span><strong>Cobrança Ativa:</strong> Integração com WhatsApp para notificar retirada de lentes ou parcelas em aberto.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FUNCIONALIDADES PRINCIPAIS */}
      <section id="features" className="px-6 py-24 bg-[#fafbfc] border-b border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-2">Recursos</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Desenvolvido sob medida para óticas</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Clientes */}
            <div className="p-6 border border-slate-100 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all duration-200 flex flex-col gap-4">
              <span className="p-2 bg-blue-50 text-blue-600 rounded-lg w-fit">
                <Users className="w-4 h-4" />
              </span>
              <h3 className="font-bold text-slate-900 text-sm">Gestão de Clientes</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Cadastro centralizado de dados pessoais, contatos e histórico clínico de atendimentos da ótica.
              </p>
            </div>

            {/* 2. Consultas */}
            <div className="p-6 border border-slate-100 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all duration-200 flex flex-col gap-4">
              <span className="p-2 bg-blue-50 text-blue-600 rounded-lg w-fit">
                <Eye className="w-4 h-4" />
              </span>
              <h3 className="font-bold text-slate-900 text-sm">Consultas e Graus</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Registro detalhado de esférico, cilíndrico, eixo, DNP e altura para controle refrativo completo.
              </p>
            </div>

            {/* 3. Receitas */}
            <div className="p-6 border border-slate-100 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all duration-200 flex flex-col gap-4">
              <span className="p-2 bg-blue-50 text-blue-600 rounded-lg w-fit">
                <FileText className="w-4 h-4" />
              </span>
              <h3 className="font-bold text-slate-900 text-sm">Receitas e PDFs</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Preenchimento rápido e geração automatizada de PDFs de receitas prontos para impressão ou compartilhamento.
              </p>
            </div>

            {/* 4. O.S. */}
            <div className="p-6 border border-slate-100 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all duration-200 flex flex-col gap-4">
              <span className="p-2 bg-blue-50 text-blue-600 rounded-lg w-fit">
                <ClipboardList className="w-4 h-4" />
              </span>
              <h3 className="font-bold text-slate-900 text-sm">Ordens de Serviço</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Acompanhamento de laboratório de fabricação de lentes e status de montagem de armações.
              </p>
            </div>

            {/* 5. Financeiro */}
            <div className="p-6 border border-slate-100 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all duration-200 flex flex-col gap-4">
              <span className="p-2 bg-blue-50 text-blue-600 rounded-lg w-fit">
                <DollarSign className="w-4 h-4" />
              </span>
              <h3 className="font-bold text-slate-900 text-sm">Controle Financeiro</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Gestão de recebíveis, parcelamentos no crediário da loja e visualização de saldos devedores.
              </p>
            </div>

            {/* 6. WhatsApp */}
            <div className="p-6 border border-slate-100 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all duration-200 flex flex-col gap-4">
              <span className="p-2 bg-blue-50 text-blue-600 rounded-lg w-fit">
                <MessageSquare className="w-4 h-4" />
              </span>
              <h3 className="font-bold text-slate-900 text-sm">Comunicação Direta</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Atalhos rápidos para enviar mensagens de óculos prontos e notificações amigáveis de carnês em aberto.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. DIFERENCIAIS */}
      <section className="px-6 py-24 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
          <div className="flex-1">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-2">Diferenciais</span>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-6">Eficiência para a operação de varejo</h3>
            <p className="text-slate-500 leading-relaxed text-sm mb-8">
              O OptiManager foca na facilidade de uso diário. Desenhamos a interface para evitar menus complexos e formulários redundantes, acelerando o tempo de atendimento por cliente.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs">Controle de Níveis</h4>
                  <p className="text-xs text-slate-400 mt-1">Permissões para Operador e Administrador e restrição multi-inquilino.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg mt-0.5">
                  <MonitorSmartphone className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs">Acesse de Qualquer Lugar</h4>
                  <p className="text-xs text-slate-400 mt-1">Totalmente responsivo para uso rápido em computadores, tablets ou smartphones.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[380px] p-6 border border-slate-200 rounded-2xl bg-slate-50 flex flex-col gap-4 shrink-0">
            <span className="font-bold text-slate-800 text-xs uppercase tracking-wider">Principais Vantagens</span>
            <ul className="flex flex-col gap-3.5 text-slate-500 text-xs">
              <li className="flex gap-2.5 items-center">
                <Check className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Interface limpa e intuitiva para o balcão</span>
              </li>
              <li className="flex gap-2.5 items-center">
                <Check className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Impressão organizada de vias de laboratório</span>
              </li>
              <li className="flex gap-2.5 items-center">
                <Check className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Controle automatizado de inadimplência</span>
              </li>
              <li className="flex gap-2.5 items-center">
                <Check className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Sanitização e atalhos rápidos de contatos</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 6. COMO FUNCIONA */}
      <section id="passos" className="px-6 py-24 bg-[#fafbfc] border-b border-slate-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-2">Simplicidade</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Fluxo de operação em 4 etapas</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col gap-3">
              <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                1
              </span>
              <h4 className="font-bold text-slate-900 text-sm">Ficha do Cliente</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Cadastre o cliente de forma simplificada em poucos segundos no balcão de vendas.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                2
              </span>
              <h4 className="font-bold text-slate-900 text-sm">Consulta e Receita</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Registre os dados de graus do exame refrativo e indicação de lentes sugerida.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                3
              </span>
              <h4 className="font-bold text-slate-900 text-sm">Dados Comerciais</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Gere a Ordem de Serviço da ótica e defina a forma de pagamento e as parcelas.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                4
              </span>
              <h4 className="font-bold text-slate-900 text-sm">Controle Ativo</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Acompanhe indicadores consolidados no painel de administração da sua ótica.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. DASHBOARD PREVIEW (MOCKUP ESTATICO REALISTA) */}
      <section id="preview" className="px-6 py-24 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-2">Painel de Controle</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Uma visualização do painel administrativo</h2>
            <p className="text-slate-500 text-sm mt-3 leading-relaxed">
              Prévia ilustrativa da interface de gerenciamento interno, desenhada para uma navegação fluida.
            </p>
          </div>

          {/* REALISTIC GRAPHICAL CONTAINER */}
          <div className="border border-slate-200 rounded-2xl bg-white shadow-2xl max-w-4xl mx-auto overflow-hidden flex flex-col md:flex-row aspect-[16/10] min-h-[450px]">
            {/* Fake Dashboard Sidebar */}
            <div className="w-full md:w-[180px] bg-slate-900 text-slate-400 p-4 flex flex-col gap-5 border-r border-slate-800 shrink-0">
              <div className="flex items-center gap-2 text-white font-bold text-sm border-b border-slate-800 pb-3">
                <span className="p-1 bg-blue-600 text-white rounded flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                </span>
                <span>OptiManager</span>
              </div>
              <ul className="flex flex-row md:flex-col gap-3 text-[10px] uppercase font-bold tracking-wider">
                <li className="text-white bg-slate-800/80 px-2.5 py-1.5 rounded cursor-default">Dashboard</li>
                <li className="px-2.5 py-1.5 cursor-default hover:text-white transition-colors">Clientes</li>
                <li className="px-2.5 py-1.5 cursor-default hover:text-white transition-colors">Consultas</li>
                <li className="px-2.5 py-1.5 cursor-default hover:text-white transition-colors">Usuários</li>
              </ul>
            </div>

            {/* Fake Dashboard Content Area */}
            <div className="flex-1 bg-slate-50 p-6 flex flex-col gap-5 overflow-hidden">
              {/* Fake Topbar */}
              <div className="flex items-center justify-between border-b border-slate-200/50 pb-3">
                <span className="text-xs font-bold text-slate-700">Visão Geral</span>
                <span className="text-[10px] text-slate-400 font-mono">Modo Demo</span>
              </div>

              {/* Fake Metrics Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white border border-slate-200 p-3 rounded-lg flex flex-col shadow-sm">
                  <span className="text-[8px] uppercase font-bold text-slate-400">Total Clientes</span>
                  <span className="text-base font-bold text-slate-800 mt-0.5">1.240</span>
                </div>
                <div className="bg-white border border-slate-200 p-3 rounded-lg flex flex-col shadow-sm">
                  <span className="text-[8px] uppercase font-bold text-slate-400">Total Consultas</span>
                  <span className="text-base font-bold text-slate-800 mt-0.5">3.189</span>
                </div>
                <div className="bg-white border border-slate-200 p-3 rounded-lg flex flex-col shadow-sm border-l-2 border-l-red-500">
                  <span className="text-[8px] uppercase font-bold text-slate-400">Em Aberto</span>
                  <span className="text-base font-bold text-red-600 mt-0.5">R$ 14.590</span>
                </div>
              </div>

              {/* Fake Graphical Chart & Table Layout */}
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-4 min-h-0">
                {/* Simulated Revenue chart */}
                <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm lg:col-span-3 flex flex-col gap-2 min-h-0">
                  <div className="flex justify-between items-center text-[10px] text-slate-400 pb-1.5 border-b border-slate-100">
                    <span className="font-semibold text-slate-600">Vendas Mensais</span>
                    <span>Semestre</span>
                  </div>
                  <div className="flex-1 flex items-end justify-between px-2 pt-2 gap-1.5 min-h-[100px]">
                    <div className="w-full bg-blue-100 rounded-t h-[40%]"></div>
                    <div className="w-full bg-blue-100 rounded-t h-[55%]"></div>
                    <div className="w-full bg-blue-100 rounded-t h-[45%]"></div>
                    <div className="w-full bg-blue-100 rounded-t h-[70%]"></div>
                    <div className="w-full bg-blue-600 rounded-t h-[85%]"></div>
                    <div className="w-full bg-blue-100 rounded-t h-[60%]"></div>
                  </div>
                </div>

                {/* Simulated Recent Activities */}
                <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm lg:col-span-2 flex flex-col gap-2 min-h-0">
                  <span className="text-[10px] font-bold text-slate-600 border-b border-slate-100 pb-1.5">Últimas Atividades</span>
                  <ul className="flex flex-col gap-2 text-[9px] text-slate-400 flex-1 overflow-hidden justify-between py-1">
                    <li className="flex justify-between items-center border-b border-slate-50 pb-1.5">
                      <span className="font-semibold text-slate-700 truncate max-w-[80px]">João Silva</span>
                      <span className="text-blue-600 font-medium">O.S. 1042</span>
                    </li>
                    <li className="flex justify-between items-center border-b border-slate-50 pb-1.5">
                      <span className="font-semibold text-slate-700 truncate max-w-[80px]">Maria Costa</span>
                      <span className="text-blue-600 font-medium">O.S. 1041</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="font-semibold text-slate-700 truncate max-w-[80px]">Carlos Souza</span>
                      <span className="text-slate-400 italic">Exame</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="bg-slate-900 text-slate-400 px-6 py-16 border-t border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-12 border-b border-slate-800 pb-10 mb-10">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5 mb-3.5">
              <span className="p-1.5 bg-blue-600 text-white rounded flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 fill-current" />
              </span>
              <span className="text-base font-bold text-white tracking-tight">OptiManager</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-500">
              Sistema de gestão de receitas ópticas e prontuários refrativos projetado exclusivamente para a rotina de óticas de varejo.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-12 md:gap-20 text-xs">
            <div>
              <h5 className="font-bold text-slate-200 uppercase tracking-wider mb-4">Navegação</h5>
              <ul className="flex flex-col gap-2.5 text-slate-400">
                <li><a href="#features" className="hover:text-white transition-colors">Funcionalidades</a></li>
                <li><a href="#passos" className="hover:text-white transition-colors">Como Funciona</a></li>
                <li><a href="#preview" className="hover:text-white transition-colors">Interface</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-slate-200 uppercase tracking-wider mb-4">Acesso</h5>
              <ul className="flex flex-col gap-2.5 text-slate-400">
                <li>
                  <Link href="/login" className="hover:text-white transition-colors flex items-center gap-1.5">
                    <span>Entrar no Sistema</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} OptiManager. Todos os direitos reservados.</p>
          <p>
            Desenvolvido por <strong className="text-slate-400">José Everton</strong>
          </p>
        </div>
      </footer>
    </div>
  );
}
