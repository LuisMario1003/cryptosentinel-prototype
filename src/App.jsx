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
    <div className="flex min-h-screen">
      <aside className="hidden w-60 shrink-0 flex-col bg-slate-900 p-4 text-slate-300 md:flex">
        <div className="mb-6 px-2 text-lg font-semibold text-white">CryptoSentinel</div>
        <nav aria-label="Principal" className="flex flex-col gap-1">
          {NAV.map(([id, label, Icon]) => (
            <button key={id} onClick={() => setView(id)} aria-current={view === id ? 'page' : undefined}
              className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm transition-colors ${view === id ? 'bg-teal-700 text-white' : 'hover:bg-slate-800'}`}>
              <Icon className="h-4 w-4" aria-hidden />{label}</button>))}
        </nav>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white px-4 py-3">
          <select aria-label="Navegación" value={view} onChange={(e) => setView(e.target.value)} className="rounded-md border border-slate-300 px-2 py-1.5 text-sm md:hidden">
            {NAV.map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select>
          <label className="flex items-center gap-2 text-sm text-slate-600">Proyecto activo
            <select value={activeProjectId} onChange={(e) => setActiveProjectId(e.target.value)} className="rounded-md border border-slate-300 px-2 py-1.5 text-sm text-slate-900">
              <option value="ALL">Todos los proyectos</option>
              {db.projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
          <div className="ml-auto flex items-center gap-4 text-sm text-slate-600" role="status">
            <span className="flex items-center gap-1.5"><Activity className="h-4 w-4 text-emerald-600" aria-hidden />Sistema operativo</span>
            <span>{running} en ejecución</span><span>{open} hallazgos abiertos</span>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6"><View /></main>
      </div>
      {toast && <div role="status" className="fixed bottom-4 right-4 z-50 rounded-md bg-slate-900 px-4 py-2 text-sm text-white shadow-lg">{toast}</div>}
    </div>);
}
export default function App() { return <StoreProvider><Shell /></StoreProvider>; }
