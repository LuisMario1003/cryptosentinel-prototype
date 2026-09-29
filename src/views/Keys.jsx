import { ShieldCheck } from 'lucide-react';
import { useStore } from '../store.jsx';
import { Badge, Card, Empty, PageTitle, Table, td } from '../components/ui.jsx';

export default function Keys() {
  const { v, projectName } = useStore();
  const day = (d) => d.slice(0, 10);
  return (
    <>
      <PageTitle title="Gestión de claves" />
      <p className="mb-4 flex items-start gap-2 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />Aviso: esta sección únicamente administra metadatos. No se almacenan claves secretas reales en texto plano.</p>
      <Card>{v.keys.length ? <Table heads={['Key ID', 'Proyecto', 'Algoritmo', 'Tamaño', 'Propósito', 'Estado', 'Creada', 'Expira']}>
        {v.keys.map((k) => <tr key={k.id}><td className={td}><code className="text-xs">{k.key_identifier}</code></td><td className={td}>{projectName(k.project_id)}</td>
          <td className={td}>{k.algorithm}</td><td className={td}>{k.key_size} bits</td><td className={td}>{k.purpose}</td><td className={td}><Badge v={k.status} /></td>
          <td className={td}>{day(k.created_at)}</td><td className={td}>{day(k.expires_at)}</td></tr>)}</Table> : <Empty text="No hay claves registradas." />}</Card>
    </>);
}
