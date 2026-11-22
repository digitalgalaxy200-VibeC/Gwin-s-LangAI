# Polyglot API (Cloudflare Worker)

The only place that holds credentials. The browser gets a session token and
nothing else — no Turso URL, no Turso token, no password hash.

## Secrets

```sh
npx wrangler secret put TURSO_URL            # libsql://<db>.turso.io
npx wrangler secret put TURSO_TOKEN          # database token
npx wrangler secret put SESSION_SECRET       # any long random string
npx wrangler secret put GOOGLE_TRANSLATE_KEY # optional, enables Google quality
```

`ALLOWED_ORIGIN` is a plain variable in `wrangler.toml`.

## Endpoints

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| GET | `/health` | — | `{ ok, database, providers }` |
| POST | `/translate` | — | `{ q, source, target }` → `{ translatedText, provider }` |
| POST | `/auth/register` | — | `{ email, password, name, nativeLang, targetLang }` → `{ user, token }` |
| POST | `/auth/login` | — | `{ email, password }` → `{ user, token }` |
| GET | `/me` | Bearer | Current session payload |
| GET | `/me/progress` | Bearer | `{ completedUnits: string[] }` |
| POST | `/sync/push` | Bearer | `{ items[] }` → `{ pushed }` |
| GET | `/admin/learners` | Bearer + `role=superadmin` | Learner analytics |

`user_id` always comes from the session, never from the request body.

## Deploy

```sh
cd worker
npm install
npx wrangler login
npx wrangler deploy
```

Then point the app at it — **Settings → Builds → Build variables** in Cloudflare,
plus `.env.local` for local work:

```text
VITE_API_URL = https://polyglot-api.<subdomain>.workers.dev
```

## Verify

```sh
node smoke-test.mjs https://polyglot-api.<subdomain>.workers.dev you@example.com 'password'
```

Expect `health.database: true`, a `200` login, and `200` on `/admin/learners`
for the superadmin account.

## Notes on the migration

- **Sessions are new.** Everyone signs in once more; `turso_current_user_v1`
  in an old browser is ignored until then.
- **Legacy hashes are upgraded automatically.** Existing passwords are unsalted
  SHA-256 from the old browser-side code. `/auth/login` still verifies those,
  then re-stores a PBKDF2 hash on the same request.
- **Registering now happens server-side**, so a learner can no longer insert
  arbitrary rows.

## Rate limiting

Use Cloudflare **Security → WAF → Rate limiting rules** on this Worker's routes
(e.g. 30 requests/minute/IP on `/auth/*`, 60 on `/translate`).
