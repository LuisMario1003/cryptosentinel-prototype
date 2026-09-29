import { useState } from 'react';
import { FileArchive, Play, UploadCloud } from 'lucide-react';
import { useStore } from '../store.jsx';
import { Badge, Btn, Card, Empty, PageTitle, Table, Uuid, fmt, td } from '../components/ui.jsx';

const EXT = ['.py', '.js', '.ts', '.json', '.yaml', '.yml', '.env', '.conf', '.config'];

export default function Scanner() {
  const { db, activeProjectId, startScan, notify, projectName } = useStore();
  const active = db.projects.filter((p) => p.status === 'ACTIVE');
  const [pid, setPid] = useState(active.find((p) => p.id === activeProjectId)?.id ?? active[0]?.id ?? '');
  const [file, setFile] = useState(null);
  const [drag, setDrag] = useState(false);
  const [err, setErr] = useState('');
  const accept = (f) => { if (!f) return; if (!f.name.toLowerCase().endsWith('.zip')) { setErr('Solo se aceptan archivos .zip.'); return; } setErr(''); setFile(f); };
  const start = () => { startScan(pid, file.name); notify('Análisis iniciado.'); setFile(null); };
  const scans = db.scans.filter((s) => s.project_id === pid);
  return (
    <>
      <PageTitle title="Escáner & Carga" subtitle="Sube un proyecto en ZIP e inicia el análisis" />
      <Card className="mb-5 space-y-4 p-4">
        <label className="block text-sm font-medium">Proyecto destino
          <select value={pid} onChange={(e) => setPid(e.target.value)} className="mt-1 block w-full max-w-sm rounded-md border border-slate-300 px-3 py-2 font-normal">
            {active.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
        <label onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); accept(e.dataTransfer.files[0]); }}
          className={`flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed p-8 text-center ${drag ? 'border-teal-600 bg-teal-50' : 'border-slate-300'}`}>
          {file ? <FileArchive className="h-8 w-8 text-teal-700" aria-hidden /> : <UploadCloud className="h-8 w-8 text-slate-400" aria-hidden />}
          <span className="text-sm">{file ? file.name : 'Arrastra tu .zip aquí o haz clic para seleccionarlo'}</span>
          <input type="file" accept=".zip" className="sr-only" onChange={(e) => accept(e.target.files[0])} /></label>
        {err && <p role="alert" className="text-sm text-red-700">{err}</p>}
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">Se analizan:
          {EXT.map((x) => <code key={x} className="rounded bg-slate-100 px-1.5 py-0.5">{x}</code>)}</div>
        <Btn variant="primary" disabled={!file || !pid} onClick={start}><Play className="h-4 w-4" />Iniciar análisis</Btn>
      </Card>
      <Card title={`Análisis de ${projectName(pid)}`}>
        {scans.length ? <Table heads={['ID', 'Inicio', 'Fin', 'Archivos', 'Hallazgos', 'Estado']}>
          {scans.map((s) => <tr key={s.id}><td className={td}><Uuid id={s.id} /></td><td className={td}>{fmt(s.started_at)}</td><td className={td}>{fmt(s.finished_at)}</td>
            <td className={td}>{s.files_scanned}</td><td className={td}>{s.findings_count}</td><td className={td}><Badge v={s.status} /></td></tr>)}</Table>
          : <Empty text="Este proyecto aún no tiene análisis." />}
      </Card>
    </>);
}
