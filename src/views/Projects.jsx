import { useState } from 'react';
import { Archive, ArchiveRestore, Plus } from 'lucide-react';
import { useStore } from '../store.jsx';
import { Badge, Btn, Card, Modal, PageTitle, Table, Uuid, fmt, td } from '../components/ui.jsx';

export default function Projects() {
  const { db, addProject, toggleProject, notify } = useStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const submit = (e) => { e.preventDefault(); addProject(form.name.trim(), form.description.trim()); setForm({ name: '', description: '' }); setOpen(false); notify('Proyecto creado.'); };
  return (
    <>
      <PageTitle title="Proyectos" action={<Btn variant="primary" onClick={() => setOpen(true)}><Plus className="h-4 w-4" />Crear proyecto</Btn>} />
      <Card><Table heads={['ID', 'Nombre', 'Descripción', 'Estado', 'Creado', 'Actualizado', '']}>
        {db.projects.map((p) => (
          <tr key={p.id}><td className={td}><Uuid id={p.id} /></td><td className={`${td} font-medium`}>{p.name}</td>
            <td className="px-4 py-2.5 text-slate-600">{p.description}</td><td className={td}><Badge v={p.status} /></td>
            <td className={td}>{fmt(p.created_at)}</td><td className={td}>{fmt(p.updated_at)}</td>
            <td className={td}><Btn onClick={() => toggleProject(p.id)}>
              {p.status === 'ACTIVE' ? <><Archive className="h-4 w-4" />Archivar</> : <><ArchiveRestore className="h-4 w-4" />Reactivar</>}</Btn></td></tr>))}
      </Table></Card>
      {open && <Modal title="Crear proyecto" onClose={() => setOpen(false)}>
        <form onSubmit={submit} className="space-y-4">
          <label className="block text-sm font-medium">Nombre
            <input required maxLength={100} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 font-normal" /></label>
          <label className="block text-sm font-medium">Descripción
            <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 font-normal" /></label>
          <div className="flex justify-end gap-2"><Btn type="button" onClick={() => setOpen(false)}>Cancelar</Btn><Btn variant="primary" type="submit">Crear proyecto</Btn></div>
        </form></Modal>}
    </>);
}
