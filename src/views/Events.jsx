import { useStore } from '../store.jsx';
import { Card, Empty, PageTitle, Table, Uuid, fmt, td } from '../components/ui.jsx';

export default function Events() {
  const { v, projectName } = useStore();
  return (
    <>
      <PageTitle title="Eventos de seguridad" subtitle="Registro auditable de la actividad del sistema" />
      <Card>{v.events.length ? <Table heads={['ID', 'Tipo', 'Descripción', 'Proyecto', 'Scan', 'Fecha']}>
        {v.events.map((e) => <tr key={e.id}><td className={td}><Uuid id={e.id} /></td><td className={td}><code className="text-xs">{e.event_type}</code></td>
          <td className="px-4 py-2.5">{e.description}</td><td className={td}>{projectName(e.project_id)}</td>
          <td className={td}>{e.scan_id ? <Uuid id={e.scan_id} /> : '—'}</td><td className={td}>{fmt(e.created_at)}</td></tr>)}</Table> : <Empty text="Sin eventos registrados." />}</Card>
    </>);
}
