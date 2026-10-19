import { Activity, FileText, FolderKanban, KeyRound, LayoutDashboard, ListChecks, ScanSearch, ScrollText, ShieldAlert } from 'lucide-react';
import { StoreProvider, useStore } from './store.jsx';
import Dashboard from './views/Dashboard.jsx';
import Projects from './views/Projects.jsx';
import Scanner from './views/Scanner.jsx';
import Rules from './views/Rules.jsx';
import Findings from './views/Findings.jsx';
import Keys from './views/Keys.jsx';
import Events from './views/Events.jsx';
import Reports from './views/Reports.jsx';

const NAV = [
  ['dashboard', 'Dashboard', LayoutDashboard, Dashboard], ['projects', 'Proyectos', FolderKanban, Projects],
  ['scanner', 'Escáner & Carga', ScanSearch, Scanner], ['rules', 'Catálogo de Reglas', ListChecks, Rules],
  ['findings', 'Resultados & Hallazgos', ShieldAlert, Findings], ['keys', 'Gestión de Claves', KeyRound, Keys],
  ['events', 'Eventos de Seguridad', ScrollText, Events], ['reports', 'Reportes', FileText, Reports],
];

function Shell() {
  const { view, setView, db, activeProjectId, setActiveProjectId, toast } = useStore();
  const View = NAV.find((n) => n[0] === view)[3];
  const running = db.scans.filter((s) => s.status === 'RUNNING' || s.status === 'PENDING').length;
  const open = db.findings.filter((f) => f.status === 'OPEN').length;

  return (
    <div className="app-shell flex min-h-screen">
      <aside className="sidebar hidden w-64 shrink-0 flex-col p-4 text-slate-300 md:flex">
        <div className="brand mb-8 flex items-center gap-3 px-2">
          <span className="brand-mark"><ShieldAlert className="h-5 w-5" aria-hidden /></span>
          <span><span className="block text-base font-semibold tracking-tight text-white">CryptoSentinel</span><span className="block text-[10px] font-semibold uppercase tracking-[.2em] text-slate-500">Security platform</span></span>
        </div>
        <p className="nav-caption px-3 pb-2 text-[10px] font-semibold uppercase tracking-[.18em] text-slate-500">Workspace</p>
        <nav aria-label="Principal" className="flex flex-col gap-1">
          {NAV.map(([id, label, Icon]) => (
            <button key={id} onClick={() => setView(id)} aria-current={view === id ? 'page' : undefined}
              className={`nav-item flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] transition-colors ${view === id ? 'is-active' : ''}`}>
              <Icon className="h-[17px] w-[17px]" aria-hidden />{label}{id === 'findings' && open > 0 && <span className="ml-auto rounded-full bg-rose-500/15 px-2 py-0.5 text-[10px] font-semibold text-rose-300">{open}</span>}</button>))}
        </nav>
        <div className="sidebar-foot mt-auto rounded-xl p-3"><div className="mb-2 flex items-center gap-2 text-xs font-medium text-white"><span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />Protección activa</div><p className="text-[11px] leading-relaxed text-slate-400">Monitoreo de secretos y vulnerabilidades en tiempo real.</p></div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="topbar flex flex-wrap items-center gap-3 px-4 py-3 md:px-7">
          <select aria-label="Navegación" value={view} onChange={(e) => setView(e.target.value)} className="rounded-md border border-slate-300 px-2 py-1.5 text-sm md:hidden">
            {NAV.map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select>
          <label className="flex items-center gap-2 text-sm text-slate-600">Proyecto activo
            <select value={activeProjectId} onChange={(e) => setActiveProjectId(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm">
              <option value="ALL">Todos los proyectos</option>
              {db.projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
          <div className="ml-auto flex items-center gap-4 text-sm text-slate-600" role="status">
            <span className="flex items-center gap-1.5"><Activity className="h-4 w-4 text-emerald-600" aria-hidden />Sistema operativo</span>
            <span>{running} en ejecución</span><span>{open} hallazgos abiertos</span>
          </div>
        </header>
        <main className="main-content flex-1 p-4 md:px-7 md:py-7"><View /></main>
      </div>
      {toast && <div role="status" className="fixed bottom-4 right-4 z-50 rounded-md bg-slate-900 px-4 py-2 text-sm text-white shadow-lg">{toast}</div>}
    </div>);
}
export default function App() { return <StoreProvider><Shell /></StoreProvider>; }
