# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

---

## Catatan update (redesign Beranda + backend diputus)

**Mode backend** — diatur lewat `VITE_USE_MOCK_BACKEND` (lihat `.env.example`, logikanya di `src/config/appConfig.js`).

- `true` (default): tidak ada request ke backend. Semua halaman terbuka tanpa login. Pindah role lewat ikon akun di Navbar
  ("Masuk sebagai Admin" / "Beralih ke Customer") atau tombol "Beralih ke Customer" di sidebar Admin.
- `false`: kembali memakai backend NestJS asli (login, token, dsb. seperti sebelumnya).

**Beranda** — komponen ada di `src/components/landing/`, seluruh teks/foto/warna per menu ada di `src/data/landingData.js`.
Font display: *Bagel Fat One* (Google Fonts, di-import di `src/index.css`).
