# Brandify

React + Vite frontend болон Express + PostgreSQL API.

## Фолдерын бүтэц

- `src/pages/` — сайтын болон админы хуудсууд
- `src/components/` — дахин ашиглах компонентууд
- `src/assets/` — кодоос ашигладаг зургууд
- `src/` — үндсэн app, UI, animation, өгөгдөл, CSS
- `public/` — статик SVG файлууд
- `server/routes/` — public болон admin API
- `server/middleware/` — authentication middleware
- `server/scripts/` — админ шинэчлэх скрипт
- `server/uploads/portfolio/` — portfolio зураг, upload

## Ажиллуулах

1. `npm install`
2. `.env.example`-ийн дагуу `.env` тохируулна. Одоо байгаа `.env` хадгалагдсан.
3. PostgreSQL database болон шаардлагатай хүснэгтүүдийг бэлтгэнэ. Энэ төсөлд migration/schema файл одоогоор байхгүй.
4. `npm run dev` — API, порт 4000.
5. Өөр terminal дээр `npm run dev:client` — Vite frontend.

`npm run build` production frontend-ийг `dist/` дотор үүсгэнэ.
`npm run preview` build-ийг локалд харуулна.
`npm start` API ажиллуулна.
`npm run update-admin` админ шинэчлэх скриптийг ажиллуулна.

`.env`, dependencies, build болон шинээр upload хийсэн файлууд Git-д орохгүй.
# brandify

## Vercel production

1. Run `server/migrations/001_initial.sql` in Supabase SQL Editor. It creates missing tables and a public `portfolio` bucket. Existing tables/buckets are preserved; check existing column definitions and bucket settings separately.
2. Use Supabase's PostgreSQL connection string (transaction pooler for serverless) as `DATABASE_URL`. The app uses PostgreSQL directly, not Supabase Auth.
3. Set Vercel Production and Preview environment variables: `DATABASE_URL`, `JWT_SECRET` (long random value), `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `SUPABASE_STORAGE_BUCKET=portfolio`. Set `CLIENT_ORIGIN` to the site origin. `VITE_API_URL=/api` is optional because it is the default. Never prefix secret keys with `VITE_`.
4. Import the repository with root directory `.`, Vite framework, build `npm run build`, output `dist`. `vercel.json` routes `/api/*` to Express and frontend routes to the SPA.
5. For admin creation, set `ADMIN_USERNAME` and `ADMIN_PASSWORD` locally and run `npm run update-admin`. No default password is included.
6. Test a preview: `/api/health`, service listing, admin login, service CRUD, inquiry submission/status, portfolio image upload/replacement/deletion. Then release to production.

Uploads use Supabase Storage with a 4 MiB application limit. Existing bundled uploads are copied to `public/uploads/portfolio/` to preserve their old URLs; new uploads store full Supabase public URLs. The bucket is public for image reads, with writes performed by the backend secret key.

Installation/build could not be verified in the editing environment because registry.npmjs.org DNS was unavailable. Run `npm install` to update package-lock.json, then `npm run build` and commit the updated lockfile before deploying. Database/storage end-to-end checks still require the configured live services.
