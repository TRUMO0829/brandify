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
