import { createContext, useContext, useMemo, useRef, useState } from 'react';
import * as seed from './data/mock.js';

const Ctx = createContext(null);
export const useStore = () => useContext(Ctx);
const now = () => new Date().toISOString();
const uuid = () => crypto.randomUUID();
const sample = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, n);

export function StoreProvider({ children }) {
  const [db, setDb] = useState({ projects: seed.projects, rules: seed.rules, scans: seed.scans, findings: seed.findings,
    keys: seed.keys, events: seed.events, reports: seed.reports });
  const [view, setView] = useState('dashboard');
  const [activeProjectId, setActiveProjectId] = useState('ALL');
  const [selectedScanId, setSelectedScanId] = useState(null);
  const [findingFilters, setFindingFilters] = useState({ severity: '', status: '' });
  const [toast, setToast] = useState(null);
  const ref = useRef(db); ref.current = db;

  const patch = (k, fn) => setDb((d) => ({ ...d, [k]: fn(d[k]) }));
  const log = (event_type, description, project_id, scan_id) =>
    patch('events', (e) => [{ id: uuid(), event_type, description, project_id, scan_id, created_at: now() }, ...e]);
  const notify = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const addProject = (name, description) =>
    patch('projects', (p) => [{ id: uuid(), name, description, status: 'ACTIVE', created_at: now(), updated_at: now() }, ...p]);
  const toggleProject = (id) =>
    patch('projects', (p) => p.map((x) => x.id === id ? { ...x, status: x.status === 'ACTIVE' ? 'ARCHIVED' : 'ACTIVE', updated_at: now() } : x));
  const toggleRule = (id) => patch('rules', (r) => r.map((x) => x.id === id ? { ...x, enabled: !x.enabled } : x));

  // Simula PENDING -> RUNNING -> COMPLETED (o FAILED si no hay reglas activas).
  const startScan = (project_id, fileName) => {
    const id = uuid();
    const upd = (p) => patch('scans', (s) => s.map((x) => x.id === id ? { ...x, ...p } : x));
    patch('scans', (s) => [{ id, project_id, started_at: now(), finished_at: null, status: 'PENDING', files_scanned: 0, findings_count: 0 }, ...s]);
    log('SCAN_STARTED', `Análisis iniciado sobre ${fileName}.`, project_id, id);
    setTimeout(() => upd({ status: 'RUNNING' }), 800);
    setTimeout(() => {
      const enabled = ref.current.rules.filter((r) => r.enabled);
      if (!enabled.length) {
        upd({ status: 'FAILED', finished_at: now() });
        return log('SCAN_FAILED', 'No hay reglas activas para ejecutar.', project_id, id);
      }
      const found = sample(enabled, Math.min(enabled.length, 3 + Math.floor(Math.random() * 3))).map((r) => {
        const [file_path, line_number, evidence] = seed.SAMPLES[r.code];
        return { id: uuid(), scan_id: id, rule_id: r.id, file_path, line_number, evidence, description: r.description,
          severity: r.severity, status: 'OPEN', created_at: now() };
      });
      patch('findings', (f) => [...found, ...f]);
      upd({ status: 'COMPLETED', finished_at: now(), files_scanned: 30 + Math.floor(Math.random() * 90), findings_count: found.length });
      log('FINDING_CREATED', `${found.length} hallazgos generados.`, project_id, id);
      log('SCAN_COMPLETED', 'Análisis completado correctamente.', project_id, id);
    }, 3200);
    return id;
  };

  const setFindingStatus = (id, status) => {
    const fd = db.findings.find((x) => x.id === id);
    const sc = db.scans.find((x) => x.id === fd.scan_id);
    patch('findings', (f) => f.map((x) => x.id === id ? { ...x, status } : x));
    log('FINDING_REVIEWED', `Hallazgo ${db.rules.find((r) => r.id === fd.rule_id).code} marcado como ${status}.`, sc.project_id, sc.id);
  };

  const generateReport = (scan_id, format) => {
    const sc = db.scans.find((x) => x.id === scan_id);
    patch('reports', (r) => [{ id: uuid(), project_id: sc.project_id, scan_id, format, generated_at: now(),
      file_path: `/reports/${scan_id.slice(0, 8)}-${Date.now()}.${format.toLowerCase()}` }, ...r]);
    log('REPORT_GENERATED', `Reporte ${format} generado.`, sc.project_id, scan_id);
  };

  // Vista filtrada por el proyecto activo del Topbar.
  const v = useMemo(() => {
    const all = activeProjectId === 'ALL';
    const by = (list) => (all ? list : list.filter((x) => x.project_id === activeProjectId));
    const scans = by(db.scans);
    const ids = new Set(scans.map((s) => s.id));
    return { scans, findings: db.findings.filter((x) => ids.has(x.scan_id)), keys: by(db.keys), events: by(db.events), reports: by(db.reports) };
  }, [db, activeProjectId]);

  const projectName = (id) => db.projects.find((p) => p.id === id)?.name ?? '—';
  const value = { db, v, view, setView, activeProjectId, setActiveProjectId, selectedScanId, setSelectedScanId, findingFilters, setFindingFilters, toast, notify,
    addProject, toggleProject, toggleRule, startScan, setFindingStatus, generateReport, projectName };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
