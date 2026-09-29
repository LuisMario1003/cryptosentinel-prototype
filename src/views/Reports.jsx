import { useState } from 'react';
import { Download, FilePlus } from 'lucide-react';
import { useStore } from '../store.jsx';
import { Badge, Btn, Card, Empty, PageTitle, Table, Uuid, fmt, td } from '../components/ui.jsx';

export default function Reports() {
  const { db, v, projectName, generateReport, notify } = useStore();
  const done = v.scans.filter((s) => s.status === 'COMPLETED');
  const [scanId, setScanId] = useState(''); const [format, setFormat] = useState('HTML');
  const target = scanId || done[0]?.id || '';
  const generate = () => { generateReport(target, format); notify(`Reporte ${format} generado.`); };
  const download = (r) => {
    if (r.format === 'PDF') return notify('La descarga de PDF es simulada en este prototipo.');
    const rows = db.findings.filter((f) => f.scan_id === r.scan_id).map((f) => `<li>${f.severity} — ${db.rules.find((x) => x.id === f.rule_id).code} — ${f.file_path}:${f.line_number}</li>`).join('');
    const html = `<!doctype html><meta charset="utf-8"><title>Reporte</title><h1>${projectName(r.project_id)}</h1><p>Scan ${r.scan_id}</p><ul>${rows}</ul>`;
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([html], { type: 'text/html' })), download: `reporte-${r.scan_id.slice(0, 8)}.html` });
    a.click(); URL.revokeObjectURL(a.href);
  };
  const sel = 'rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm';
  return (
    <>
      <PageTitle title="Reportes" />
      <Card className="mb-5 flex flex-wrap items-end gap-3 p-4">
        <label className="text-sm font-medium">Análisis<select value={target} onChange={(e) => setScanId(e.target.value)} className={`${sel} mt-1 block`}>
          {done.map((s) => <option key={s.id} value={s.id}>{projectName(s.project_id)} · {fmt(s.started_at)}</option>)}</select></label>
        <label className="text-sm font-medium">Formato<select value={format} onChange={(e) => setFormat(e.target.value)} className={`${sel} mt-1 block`}><option>HTML</option><option>PDF</option></select></label>
        <Btn variant="primary" disabled={!target} onClick={generate}><FilePlus className="h-4 w-4" />Generar reporte</Btn>
      </Card>
      <Card>{v.reports.length ? <Table heads={['ID', 'Proyecto', 'Scan', 'Formato', 'Generado', 'Ruta', '']}>
        {v.reports.map((r) => <tr key={r.id}><td className={td}><Uuid id={r.id} /></td><td className={td}>{projectName(r.project_id)}</td><td className={td}><Uuid id={r.scan_id} /></td>
          <td className={td}><Badge v={r.format} /></td><td className={td}>{fmt(r.generated_at)}</td><td className={td}><code className="text-xs">{r.file_path}</code></td>
          <td className={td}><Btn onClick={() => download(r)}><Download className="h-4 w-4" />Descargar</Btn></td></tr>)}</Table> : <Empty text="Aún no hay reportes. Genera el primero." />}</Card>
    </>);
}
