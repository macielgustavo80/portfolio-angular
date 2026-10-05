// Localmente usa a porta 3000; no Codespace acompanha a URL encaminhada.
const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
export const API_URL = host.endsWith('.app.github.dev')
  ? `https://${host.replace(/-\d+\.app\.github\.dev$/, '-3000.app.github.dev')}/api`
  : 'http://localhost:3000/api';
