// Post-deploy check. usage:
//   node smoke-test.mjs <apiBase> <email> <password>
// Example:
//   node smoke-test.mjs https://polyglot-api.you.workers.dev gwyn.ukoha@gmail.com 'secret'

const [, , apiBase, email, password] = process.argv;
if (!apiBase || !email || !password) {
  console.error('usage: node smoke-test.mjs <apiBase> <email> <password>');
  process.exit(1);
}

const base = apiBase.replace(/\/+$/, '');

async function call(label, path, init = {}) {
  const res = await fetch(`${base}${path}`, init);
  const text = await res.text();
  let body = text;
  try {
    body = JSON.stringify(JSON.parse(text)).slice(0, 300);
  } catch {
    /* keep raw */
  }
  console.log(`${label.padEnd(18)} ${res.status}  ${body}`);
  return { res, body };
}

const health = await call('GET /health', '/health');

const login = await call('POST /auth/login', '/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});

let token = null;
try {
  token = JSON.parse(login.body).token ?? null;
} catch {
  /* no token */
}

if (token) {
  const auth = { Authorization: `Bearer ${token}` };
  await call('GET /me', '/me', { headers: auth });
  await call('GET /me/progress', '/me/progress', { headers: auth });
  await call('GET /admin/learners', '/admin/learners', { headers: auth });
} else {
  console.log('\nNo token returned — skipping authenticated checks.');
}

console.log('\nhealth.database must be true; admin/learners must return 200 for a superadmin.');
console.log('If login returns 401, the password or the stored hash is wrong.');
