import { useStore } from '../store.jsx';
import { Badge, Card, PageTitle, Table, Toggle, td } from '../components/ui.jsx';

export default function Rules() {
  const { db, toggleRule } = useStore();
  return (
    <>
      <PageTitle title="Catálogo de reglas" subtitle="Las reglas desactivadas no se ejecutan en nuevos análisis" />
      <Card><Table heads={['Código', 'Nombre', 'Categoría', 'Severidad', 'Referencia', 'Activa']}>
        {db.rules.map((r) => (
          <tr key={r.id}><td className={td}><code className="text-xs">{r.code}</code></td><td className={`${td} font-medium`}>{r.name}</td><td className={td}>{r.category}</td>
            <td className={td}><Badge v={r.severity} /></td><td className={td}>{r.reference}</td>
            <td className={td}><Toggle on={r.enabled} label={`Activar ${r.code}`} onChange={() => toggleRule(r.id)} /></td></tr>))}
      </Table></Card>
    </>);
}
