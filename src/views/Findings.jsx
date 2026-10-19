import { useState } from 'react';
import { useStore } from '../store.jsx';
import { Badge, Btn, Card, Empty, FINDING_STATUSES, Modal, PageTitle, SEVERITIES, Table, Toggle, Uuid, fmt, mask, td } from '../components/ui.jsx';

export default function Findings() {
  const { db, v, selectedScanId, setSelectedScanId, findingFilters, setFindingFilters, projectName, setFindingStatus } = useStore();
  const { severity: sev, status: st } = findingFilters;
  const [openId, setOpenId] = useState(null); const [masked, setMasked] = useState(true);
  const scan = selectedScanId === 'ALL' ? null : v.scans.find((s) => s.id === selectedScanId) ?? v.scans[0];
  if (!scan && !v.scans.length) return <><PageTitle title="Resultados & hallazgos" /><Empty text="No hay análisis para el proyecto seleccionado." /></>;
  const ruleOf = (f) => db.rules.find((r) => r.id === f.rule_id);
  const scanOf = (f) => db.scans.find((s) => s.id === f.scan_id);
  const rows = v.findings.filter((f) => (!scan || f.scan_id === scan.id) && (!sev || f.severity === sev) && (!st || f.status === st));
  const tableHeads = scan ? ['ID', 'Regla', 'Archivo', 'Línea', 'Severidad', 'Estado', 'Fecha'] : ['ID', 'Regla', 'Proyecto', 'Archivo', 'Línea', 'Severidad', 'Estado', 'Fecha'];
  const cur = db.findings.find((f) => f.id === openId); const rule = cur && ruleOf(cur);
  const sel = 'rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm';
  const head = scan ? [['Scan', <Uuid id={scan.id} />], ['Proyecto', projectName(scan.project_id)], ['Archivos', scan.files_scanned], ['Hallazgos', scan.findings_count],
    ['Inicio', fmt(scan.started_at)], ['Fin', fmt(scan.finished_at)], ['Estado', <Badge v={scan.status} />]] : [['Análisis', v.scans.length], ['Hallazgos', rows.length],
    ['Abiertos', v.findings.filter((f) => f.status === 'OPEN').length], ['Vista', 'Todos los análisis']];
  return (
    <>
      <PageTitle title="Resultados & hallazgos" action={
        <select aria-label="Seleccionar análisis" value={selectedScanId === 'ALL' ? 'ALL' : scan.id} onChange={(e) => setSelectedScanId(e.target.value)} className={sel}>
          <option value="ALL">Todos los análisis</option>
          {v.scans.map((s) => <option key={s.id} value={s.id}>{projectName(s.project_id)} · {fmt(s.started_at)}</option>)}</select>} />
      <Card className="mb-4 grid gap-4 p-4 sm:grid-cols-4 lg:grid-cols-7">
        {head.map(([l, val]) => <div key={l}><p className="text-xs text-slate-500">{l}</p><div className="text-sm font-medium">{val}</div></div>)}</Card>
      <p className="mb-3 rounded-md border-l-4 border-teal-600 bg-teal-50 px-3 py-2 text-sm">Un hallazgo es un patrón que requiere revisión, no una vulnerabilidad confirmada.</p>
      <div className="mb-3 flex flex-wrap gap-2">
        <select aria-label="Severidad" value={sev} onChange={(e) => setFindingFilters((f) => ({ ...f, severity: e.target.value }))} className={sel}><option value="">Todas las severidades</option>{SEVERITIES.map((s) => <option key={s}>{s}</option>)}</select>
        <select aria-label="Estado" value={st} onChange={(e) => setFindingFilters((f) => ({ ...f, status: e.target.value }))} className={sel}><option value="">Todos los estados</option>{FINDING_STATUSES.map((s) => <option key={s}>{s}</option>)}</select></div>
      <Card>{rows.length ? <Table heads={tableHeads}>
        {rows.map((f) => (
          <tr key={f.id} onClick={() => setOpenId(f.id)} className="cursor-pointer hover:bg-slate-50">
            <td className={td}><Uuid id={f.id} /></td><td className={td}><code className="text-xs">{ruleOf(f).code}</code></td>{!scan && <td className={td}>{projectName(scanOf(f)?.project_id)}</td>}<td className={td}><code className="text-xs">{f.file_path}</code></td>
            <td className={td}>{f.line_number}</td><td className={td}><Badge v={f.severity} /></td><td className={td}><Badge v={f.status} /></td><td className={td}>{fmt(f.created_at)}</td></tr>))}
      </Table> : <Empty text="No hay hallazgos con estos filtros." />}</Card>
      {cur && <Modal drawer title={rule.name} onClose={() => setOpenId(null)}>
        <div className="space-y-4 text-sm">
          <div className="flex gap-2"><Badge v={cur.severity} /><Badge v={cur.status} /><code className="text-xs">{rule.code}</code></div>
          <p><b>Archivo:</b> <code>{cur.file_path}</code> · línea {cur.line_number}</p>
          <div><div className="mb-1 flex items-center justify-between"><b>Evidencia</b>
            <label className="flex items-center gap-2 text-xs">Redactar secreto<Toggle on={masked} label="Redactar secreto" onChange={() => setMasked(!masked)} /></label></div>
            <pre className="overflow-x-auto rounded-md bg-slate-900 p-3 font-mono text-xs text-slate-100"><span className="mr-3 text-slate-500">{cur.line_number}</span>{masked ? mask(cur.evidence) : cur.evidence}</pre></div>
          <p><b>Descripción:</b> {cur.description}</p>
          <p><b>Recomendación:</b> {rule.recommendation}</p>
          <p><b>Referencia:</b> {rule.reference}</p>
          <div><b>Cambiar estado</b><div className="mt-2 flex flex-wrap gap-2">
            {FINDING_STATUSES.map((s) => <Btn key={s} variant={cur.status === s ? 'primary' : 'default'} disabled={cur.status === s} onClick={() => setFindingStatus(cur.id, s)}>{s}</Btn>)}</div></div>
        </div></Modal>}
    </>);
}
