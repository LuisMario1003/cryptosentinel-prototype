import { useEffect } from 'react';
import { Loader2, X } from 'lucide-react';

const C = {
  green: 'bg-emerald-100 text-emerald-800 ring-emerald-600/20', gray: 'bg-slate-100 text-slate-700 ring-slate-500/20',
  yellow: 'bg-yellow-100 text-yellow-800 ring-yellow-600/20', blue: 'bg-blue-100 text-blue-800 ring-blue-600/20',
  red: 'bg-red-100 text-red-800 ring-red-600/20', orange: 'bg-orange-100 text-orange-800 ring-orange-600/20',
};
const MAP = { ACTIVE: 'green', ARCHIVED: 'gray', PENDING: 'yellow', RUNNING: 'blue', COMPLETED: 'green', FAILED: 'red',
  OPEN: 'red', REVIEWED: 'blue', FALSE_POSITIVE: 'gray', RESOLVED: 'green', EXPIRED: 'orange', REVOKED: 'red',
  HIGH: 'red', MEDIUM: 'orange', LOW: 'yellow', INFO: 'gray', PDF: 'red', HTML: 'blue' };

export const Badge = ({ v }) => (
  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${C[MAP[v]]}`}>
    {v === 'RUNNING' && <Loader2 className="h-3 w-3 animate-spin" aria-hidden />}{v}
  </span>);

export const SEVERITIES = ['HIGH', 'MEDIUM', 'LOW', 'INFO'];
export const FINDING_STATUSES = ['OPEN', 'REVIEWED', 'FALSE_POSITIVE', 'RESOLVED'];
export const fmt = (d) => (d ? new Date(d).toLocaleString('es', { dateStyle: 'short', timeStyle: 'short' }) : '—');
// Oculta parcialmente valores sensibles: conserva 3 caracteres y enmascara el resto.
export const mask = (s) => s.replace(/(["'])([^"']{3})[^"']*\1/g, '$1$2****$1').replace(/(=\s*)([^\s"']{3})[^\s"']*$/, '$1$2****');

export const td = 'px-4 py-2.5 whitespace-nowrap';
export const Table = ({ heads, children }) => (
  <div className="overflow-x-auto"><table className="min-w-full text-sm">
    <thead className="border-b border-slate-200 bg-slate-50"><tr>
      {heads.map((h) => <th key={h} className="whitespace-nowrap px-4 py-2.5 text-left font-medium text-slate-500">{h}</th>)}
    </tr></thead><tbody className="divide-y divide-slate-100">{children}</tbody></table></div>);
export const Empty = ({ text }) => <p className="px-4 py-8 text-center text-sm text-slate-500">{text}</p>;
export const Uuid = ({ id }) => <code title={id} className="font-mono text-xs text-slate-500">{id.slice(0, 8)}…</code>;

export const Card = ({ title, action, children, className = '' }) => (
  <section className={`rounded-lg border border-slate-200 bg-white ${className}`}>
    {title && <header className="flex items-center justify-between gap-2 border-b border-slate-200 px-4 py-3">
      <h2 className="font-semibold text-slate-800">{title}</h2>{action}</header>}
    {children}
  </section>);
export const PageTitle = ({ title, subtitle, action }) => (
  <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
    <div><h1 className="text-2xl font-semibold">{title}</h1>{subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}</div>{action}
  </div>);

const V = { default: 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50', primary: 'border-teal-700 bg-teal-700 text-white hover:bg-teal-800' };
export const Btn = ({ variant = 'default', className = '', ...p }) => (
  <button {...p} className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-600 ${V[variant]} ${className}`} />);

export const Toggle = ({ on, onChange, label }) => (
  <button role="switch" aria-checked={on} aria-label={label} onClick={onChange}
    className={`relative h-6 w-11 rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-600 ${on ? 'bg-teal-600' : 'bg-slate-300'}`}>
    <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${on ? 'translate-x-5' : ''}`} /></button>);

export function Modal({ title, onClose, children, drawer }) {
  useEffect(() => { const k = (e) => e.key === 'Escape' && onClose(); window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k); }, [onClose]);
  return (
    <div className={`fixed inset-0 z-40 flex ${drawer ? 'justify-end' : 'items-center justify-center p-4'}`}>
      <div className="absolute inset-0 bg-slate-900/50" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-label={title}
        className={`relative flex max-h-full flex-col overflow-y-auto bg-white shadow-xl ${drawer ? 'h-full w-full max-w-lg' : 'w-full max-w-md rounded-lg'}`}>
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
          <h2 className="font-semibold">{title}</h2>
          <button onClick={onClose} aria-label="Cerrar" className="rounded p-1 hover:bg-slate-100"><X className="h-5 w-5" /></button>
        </header>
        <div className="p-5">{children}</div>
      </div>
    </div>);
}
