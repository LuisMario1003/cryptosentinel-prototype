import { useStore } from '../store.jsx';
import { Activity, AlertTriangle, FolderKanban, ScanLine } from 'lucide-react';
import { Badge, Card, Empty, PageTitle, SEVERITIES, Table, Uuid, fmt, td } from '../components/ui.jsx';

export default function Dashboard() {
  const { db, v, projectName, setView, setSelectedScanId } = useStore();
  const count = (k) => v.findings.filter((f) => f.severity === k).length;
  const scans = [...v.scans].sort((a, b) => b.started_at.localeCompare(a.started_at)).slice(0, 5);
  const kpi = [['Proyectos activos', db.projects.filter((p) => p.status === 'ACTIVE').length], ['Total scans', v.scans.length],
    ['Hallazgos abiertos', v.findings.filter((f) => f.status === 'OPEN').length]];
  return (
    <>
      <PageTitle title="Dashboard" subtitle="Resumen de la actividad de auditoría" action={<span className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700"><Activity className="h-3.5 w-3.5" />Monitoreo activo</span>} />
      <div className="mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpi.map(([l, n], i) => { const Icon = [FolderKanban, ScanLine, AlertTriangle][i]; return <Card key={l} className="kpi-card p-4"><div className="mb-3 flex items-center justify-between"><p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{l}</p><span className={`kpi-icon kpi-${i}`}><Icon className="h-4 w-4" /></span></div><p className="text-3xl font-semibold tracking-tight text-slate-900">{n}</p><p className="mt-1 text-xs text-slate-400">{i === 2 ? 'Requieren atención' : 'En el espacio de trabajo'}</p></Card>})}
        <Card className="kpi-card p-4"><p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Por severidad</p>
          <div className="grid grid-cols-2 gap-1">{SEVERITIES.map((s) => <div key={s} className="flex items-center gap-2"><Badge v={s} /><b>{count(s)}</b></div>)}</div></Card>
      </div>
      <Card title="Últimos análisis ejecutados" action={<span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-500">ÚLTIMOS 5</span>} className="mb-5">
        {scans.length ? <Table heads={['ID', 'Proyecto', 'Inicio', 'Fin', 'Archivos', 'Hallazgos', 'Estado']}>
          {scans.map((s) => (
            <tr key={s.id} onClick={() => { setSelectedScanId(s.id); setView('findings'); }} className="cursor-pointer hover:bg-slate-50">
              <td className={td}><Uuid id={s.id} /></td><td className={td}>{projectName(s.project_id)}</td><td className={td}>{fmt(s.started_at)}</td>
              <td className={td}>{fmt(s.finished_at)}</td><td className={td}>{s.files_scanned}</td><td className={td}>{s.findings_count}</td>
              <td className={td}><Badge v={s.status} /></td></tr>))}</Table> : <Empty text="No hay análisis para este proyecto." />}
      </Card>
      <Card title="Eventos de seguridad recientes">
        {v.events.length ? <Table heads={['Fecha', 'Tipo', 'Descripción']}>
          {v.events.slice(0, 6).map((e) => <tr key={e.id}><td className={td}>{fmt(e.created_at)}</td>
            <td className={td}><code className="text-xs">{e.event_type}</code></td><td className={td}>{e.description}</td></tr>)}</Table> : <Empty text="Sin eventos." />}
      </Card>
    </>);
}
