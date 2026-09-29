// Datos simulados con UUID y llaves foráneas, alineados con el Modelo de Datos v1.0.
export const u = (n) => `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`;
const d = (daysAgo, h = 10) => new Date(Date.UTC(2026, 8, 29, h) - daysAgo * 864e5).toISOString();
const P1 = '550e8400-e29b-41d4-a716-446655440000';

export const projects = [
  { id: P1, name: 'DemoBank', description: 'Proyecto de prueba de seguridad', status: 'ACTIVE', created_at: d(28), updated_at: d(1) },
  { id: u(102), name: 'Inventario API', description: 'API interna de inventario', status: 'ACTIVE', created_at: d(12), updated_at: d(2) },
  { id: u(103), name: 'Portal Legacy', description: 'Sistema heredado en revisión', status: 'ARCHIVED', created_at: d(60), updated_at: d(20) },
];

const rule = (n, code, name, category, severity, reference, recommendation, description, enabled = true) =>
  ({ id: u(200 + n), code, name, category, severity, description, recommendation, reference, enabled });
export const rules = [
  rule(1, 'CRYPTO-001', 'Potential Hardcoded Secret', 'Secrets Management', 'HIGH', 'OWASP Secrets Management', 'Revisa cómo la aplicación gestiona los secretos; usa variables de entorno o un gestor de secretos.', 'Se detectó un posible secreto directamente en el código fuente.'),
  rule(2, 'CRYPTO-002', 'Potential Weak Password Hashing', 'Password Hashing', 'MEDIUM', 'OWASP Password Storage', 'Usa Argon2id o bcrypt para almacenar contraseñas.', 'Se detectó una función hash que podría usarse para contraseñas.'),
  rule(3, 'CRYPTO-003', 'Cryptographic Configuration Review', 'Crypto Configuration', 'MEDIUM', 'NIST SP 800-131A', 'Verifica la configuración frente a los criterios definidos para el proyecto.', 'Configuración criptográfica que requiere revisión.'),
  rule(4, 'CRYPTO-004', 'Key Size Review', 'Key Management', 'MEDIUM', 'NIST SP 800-57', 'Confirma que el tamaño de clave cumpla las recomendaciones vigentes.', 'Tamaño de clave que requiere revisión.'),
  rule(5, 'CRYPTO-005', 'Potential Insecure Randomness', 'Randomness', 'LOW', 'OWASP Cryptographic Storage', 'Usa un generador criptográficamente seguro para tokens y claves.', 'Generador aleatorio posiblemente no apto para contextos criptográficos.'),
  rule(6, 'CRYPTO-006', 'Potential Exposed Cryptographic Key', 'Key Management', 'HIGH', 'OWASP Key Management', 'Retira la clave del repositorio y rótala si estuvo expuesta.', 'Patrón que podría representar una clave criptográfica expuesta.'),
  rule(7, 'CRYPTO-007', 'TLS Configuration Review', 'TLS', 'LOW', 'IETF RFC 8446', 'Revisa versiones y opciones de TLS habilitadas.', 'Configuración TLS sujeta a revisión.', false),
  rule(8, 'CRYPTO-008', 'Secret in Configuration File', 'Secrets Management', 'HIGH', 'OWASP Secrets Management', 'Mueve el secreto fuera del archivo de configuración versionado.', 'Posible secreto dentro de un archivo de configuración.'),
];

// Ubicación y evidencia de ejemplo por regla (se usa también al simular análisis nuevos).
export const SAMPLES = {
  'CRYPTO-001': ['config.py', 15, 'API_KEY = "demo-secret-key-12345"'],
  'CRYPTO-002': ['auth/users.py', 42, 'digest = md5(password)'],
  'CRYPTO-003': ['settings.yaml', 8, 'cipher_mode: "ECB"'],
  'CRYPTO-004': ['crypto/keys.js', 21, 'generateKeyPair("rsa", { modulusLength: 1024 })'],
  'CRYPTO-005': ['utils/token.js', 7, 'const token = Math.random().toString(36)'],
  'CRYPTO-006': ['keys/private.json', 2, '"private_key": "MIIEvQIBADANBgkqhkiG9w0B"'],
  'CRYPTO-007': ['nginx.conf', 30, 'ssl_protocols TLSv1 TLSv1.1;'],
  'CRYPTO-008': ['.env', 3, 'DB_PASSWORD=SuperSecret2026'],
};

const scan = (n, project_id, daysAgo, status, files) => ({
  id: u(300 + n), project_id, status, files_scanned: files, findings_count: 0,
  started_at: d(daysAgo, 14), finished_at: status === 'COMPLETED' || status === 'FAILED' ? d(daysAgo, 14).replace(':00:00.', ':02:15.') : null,
});
export const scans = [
  scan(1, P1, 6, 'COMPLETED', 84), scan(2, P1, 1, 'COMPLETED', 91),
  scan(3, u(102), 3, 'COMPLETED', 47), scan(4, u(102), 2, 'FAILED', 12), scan(5, u(103), 20, 'COMPLETED', 30),
];

const f = (n, scanN, code, status, daysAgo) => {
  const r = rules.find((x) => x.code === code);
  const [file_path, line_number, evidence] = SAMPLES[code];
  return { id: u(400 + n), scan_id: u(300 + scanN), rule_id: r.id, file_path, line_number, evidence,
    description: r.description, severity: r.severity, status, created_at: d(daysAgo, 14) };
};
export const findings = [
  f(1, 1, 'CRYPTO-001', 'OPEN', 6), f(2, 1, 'CRYPTO-002', 'REVIEWED', 6), f(3, 1, 'CRYPTO-003', 'OPEN', 6),
  f(4, 1, 'CRYPTO-005', 'FALSE_POSITIVE', 6), f(5, 1, 'CRYPTO-007', 'RESOLVED', 6),
  f(6, 2, 'CRYPTO-001', 'OPEN', 1), f(7, 2, 'CRYPTO-008', 'OPEN', 1),
  f(8, 3, 'CRYPTO-004', 'OPEN', 3), f(9, 3, 'CRYPTO-006', 'OPEN', 3), f(10, 3, 'CRYPTO-008', 'REVIEWED', 3),
  f(11, 5, 'CRYPTO-002', 'RESOLVED', 20),
];
scans.forEach((s) => { s.findings_count = findings.filter((x) => x.scan_id === s.id).length; });

export const keys = [
  { id: u(500), project_id: P1, key_identifier: 'KEY-001', algorithm: 'AES', key_size: 256, purpose: 'Data Encryption', status: 'ACTIVE', created_at: '2026-09-01T00:00:00Z', expires_at: '2027-09-01T00:00:00Z' },
  { id: u(501), project_id: P1, key_identifier: 'KEY-002', algorithm: 'RSA', key_size: 2048, purpose: 'Signing', status: 'ACTIVE', created_at: '2026-03-10T00:00:00Z', expires_at: '2027-03-10T00:00:00Z' },
  { id: u(502), project_id: u(102), key_identifier: 'KEY-003', algorithm: 'RSA', key_size: 1024, purpose: 'TLS', status: 'EXPIRED', created_at: '2024-01-15T00:00:00Z', expires_at: '2025-01-15T00:00:00Z' },
  { id: u(503), project_id: u(102), key_identifier: 'KEY-004', algorithm: 'AES', key_size: 128, purpose: 'Session Tokens', status: 'REVOKED', created_at: '2025-05-20T00:00:00Z', expires_at: '2026-05-20T00:00:00Z' },
];

let en = 600;
const ev = (event_type, description, s, at) => ({ id: u(en++), event_type, description, project_id: s.project_id, scan_id: s.id, created_at: at });
export const events = scans.flatMap((s) => s.status === 'FAILED'
  ? [ev('SCAN_STARTED', 'Análisis iniciado.', s, s.started_at), ev('SCAN_FAILED', 'No se pudo extraer el archivo ZIP.', s, s.finished_at)]
  : [ev('SCAN_STARTED', 'Análisis iniciado.', s, s.started_at), ev('FINDING_CREATED', `${s.findings_count} hallazgos generados.`, s, s.finished_at), ev('SCAN_COMPLETED', 'Análisis completado correctamente.', s, s.finished_at)]
).concat([ev('FINDING_REVIEWED', 'Hallazgo CRYPTO-002 marcado como REVIEWED.', scans[0], d(5))])
  .sort((a, b) => b.created_at.localeCompare(a.created_at));

export const reports = [
  { id: u(700), project_id: P1, scan_id: u(301), format: 'HTML', generated_at: d(5), file_path: '/reports/00000000-301.html' },
  { id: u(701), project_id: u(102), scan_id: u(303), format: 'PDF', generated_at: d(2), file_path: '/reports/00000000-303.pdf' },
];
