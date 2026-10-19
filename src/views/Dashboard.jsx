import { useStore } from '../store.jsx';
import { Activity, AlertTriangle, ArrowUpRight, FolderKanban, Radar, ScanLine, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { Badge, Card, Empty, SEVERITIES, Table, Uuid, fmt, td } from '../components/ui.jsx';

export default function Dashboard() {
  const { db, v, projectName, activeProjectId, setView, setSelectedScanId, setFindingFilters } = useStore();
  const count = (k) => v.findings.filter((f) => f.severity === k).length;
  const scans = [...v.scans].sort((a, b) => b.started_at.localeCompare(a.started_at)).slice(0, 5);
  const activeProjects = db.projects.filter((p) => p.status === 'ACTIVE' && (activeProjectId === 'ALL' || p.id === activeProjectId)).length;
  const highFindings = count('HIGH');
  const mediumFindings = count('MEDIUM');
  const securityScore = Math.max(42, 100 - (highFindings * 12) - (mediumFindings * 5) - (count('LOW') * 2));
  const kpi = [['Proyectos activos', activeProjects], ['Total scans', v.scans.length],
    ['Hallazgos abiertos', v.findings.filter((f) => f.status === 'OPEN').length]];
  const drillIntoFindings = (filters) => { setFindingFilters(filters); setSelectedScanId('ALL'); setView('findings'); };
  const cardActions = [() => setView('projects'), () => setView('scanner'), () => drillIntoFindings({ severity: '', status: 'OPEN' })];
  const cardDestinations = ['Ver proyectos', 'Abrir escáner', 'Revisar hallazgos abiertos'];
  return (
    <>
      <section className="command-hero mb-6 overflow-hidden rounded-2xl text-white">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
        <div className="hero-orbit hero-orbit-two" aria-hidden="true" />
        <div className="hero-content">
          <div className="hero-copy">
            <span className="hero-eyebrow"><Sparkles className="h-3.5 w-3.5" /> CENTRO DE OPERACIONES DE SEGURIDAD</span>
            <h1>Tu código.<br /><span>Bajo vigilancia.</span></h1>
            <p>Detecta secretos expuestos y riesgos antes de que lleguen a producción.</p>
            <button className="hero-cta" onClick={() => setView('scanner')}><ScanLine className="h-4 w-4" /> Iniciar un análisis <ArrowUpRight className="h-4 w-4" /></button>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="hero-ring ring-outer" /><div className="hero-ring ring-middle" /><div className="hero-ring ring-inner" />
            <div className="hero-shield"><ShieldCheck className="h-12 w-12" strokeWidth={1.35} /></div>
            <span className="hero-node node-one" /><span className="hero-node node-two" /><span className="hero-node node-three" />
            <div className="hero-signal"><span className="signal-dot" /><span>SISTEMA PROTEGIDO</span></div>
          </div>
        </div>
        <div className="hero-footer"><span className="hero-footer-label"><span className="live-dot" /> TELEMETRÍA EN VIVO</span><span>CryptoSentinel <b>/</b> Auditoría de código</span><span className="hero-footer-right">{v.scans.length} análisis registrados <Activity className="h-3.5 w-3.5" /></span></div>
      </section>

      <div className="section-heading mb-3"><div><span className="section-kicker">VISTA GENERAL</span><h2>Estado de seguridad</h2></div><span className="section-period">{activeProjectId === 'ALL' ? 'Todos los proyectos' : projectName(activeProjectId)}</span></div>
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpi.map(([l, n], i) => { const Icon = [FolderKanban, ScanLine, AlertTriangle][i]; return <button type="button" key={l} onClick={cardActions[i]} aria-label={`${cardDestinations[i]}: ${n} ${l.toLowerCase()}`} className={`kpi-card kpi-action kpi-card-${i}`}>
          <span className="kpi-card-top"><span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{l}</span><span className={`kpi-icon kpi-${i}`}><Icon className="h-4 w-4" /></span></span>
          <span className="block text-3xl font-semibold tracking-tight text-slate-900">{n}</span><span className="kpi-card-bottom"><span>{i === 2 ? 'Requieren atención' : 'En el espacio de trabajo'}</span><span className="kpi-card-link">{cardDestinations[i]} <ArrowUpRight className="h-3.5 w-3.5" /></span></span>
        </button>})}
        <Card className="kpi-card kpi-severity"><div className="mb-3 flex items-center justify-between"><p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Por severidad</p><span className="kpi-icon kpi-3"><ShieldCheck className="h-4 w-4" /></span></div>
          <div className="severity-list">{SEVERITIES.map((s) => <button type="button" key={s} className="severity-link" aria-label={`Ver hallazgos ${s}: ${count(s)}`} onClick={() => drillIntoFindings({ severity: s, status: '' })}>
            <Badge v={s} /><b className="text-sm text-slate-700">{count(s)}</b><ArrowUpRight className="severity-arrow h-3.5 w-3.5" /></button>)}</div></Card>
      </div>
      <section className="security-lens mb-6">
        <div className="lens-copy"><span className="lens-kicker"><Radar className="h-3.5 w-3.5" /> INTELIGENCIA DE RIESGO</span><h2>Postura de seguridad</h2><p>Una lectura rápida de los hallazgos abiertos y la cobertura de revisión del espacio de trabajo.</p>
          <div className="lens-actions"><button type="button" onClick={() => drillIntoFindings({ severity: 'HIGH', status: 'OPEN' })}><Zap className="h-4 w-4" /> Priorizar riesgos altos</button><span><span className="live-dot" /> Actualización en vivo</span></div>
        </div>
        <div className="score-wrap"><div className="score-ring" style={{ '--score': `${securityScore * 3.6}deg` }}><div className="score-core"><b>{securityScore}</b><span>/ 100</span><small>NIVEL ACTUAL</small></div></div><p>Índice de protección</p></div>
        <div className="risk-stack"><div><span><i className="risk-dot high" /> Críticos para revisar</span><b>{highFindings}</b><em>ALTA</em></div><div><span><i className="risk-dot medium" /> Revisión recomendada</span><b>{mediumFindings}</b><em>MEDIA</em></div><div><span><i className="risk-dot healthy" /> Análisis completados</span><b>{v.scans.filter((s) => s.status === 'COMPLETED').length}</b><em>LISTOS</em></div></div>
      </section>
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
