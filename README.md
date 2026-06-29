# Browser Use — Static Site Clone

Static site modular vanilla JS, dibina mengikut design tokens dari `DESIGN.md`.
Tiada framework, tiada build step, tiada dependency luar. Boleh host terus di
GitHub Pages atau mana-mana static host.

## Struktur

```
/project-root
├── index.html          Skeleton semantic, content kosong (diisi oleh JS)
├── /css
│   └── style.css        Semua design tokens sebagai CSS custom properties
├── /js
│   ├── main.js           Entry point — orchestrate load + render + events
│   ├── data-loader.js    Fetch data.json & tokens.json (Fetch API standard)
│   ├── token-loader.js   Inject tokens.json ke CSS custom properties
│   └── ui-manager.js     Render setiap section dari data.json ke DOM
└── /assets
    ├── data.json         Semua kandungan teks/struktur (single source of truth)
    └── tokens.json       Semua design tokens (warna, font, spacing, dll.)
```

## Run secara lokal

`fetch()` disekat oleh browser untuk fail `file://`, jadi **mesti** guna local
server — tak boleh buka `index.html` terus dengan double-click.

```bash
# Python (paling senang, dah ada dalam kebanyakan sistem)
python3 -m http.server 8000

# Atau Node.js
npx serve .
```

Kemudian buka `http://localhost:8000` dalam browser.

## Deploy ke GitHub Pages

1. Push semua fail ke repo GitHub (root atau folder `/docs`).
2. Repo Settings → Pages → pilih branch & folder.
3. Tunggu beberapa minit, site akan live di `https://<username>.github.io/<repo>/`.

Tiada build step diperlukan — GitHub Pages serve fail static terus.

## Edit kandungan

- **Nak tukar teks/link/section content** → edit `assets/data.json` sahaja.
- **Nak tukar warna/font/spacing** → edit `assets/tokens.json` sahaja
  (atau `:root` dalam `css/style.css` untuk fallback values).
- **Jangan** hardcode teks terus dalam `index.html` — ia akan di-overwrite
  oleh JS semasa render (kecuali label `aria-*` dan struktur skeleton).

## Accessibility checklist (rujuk SKILL.md)

- [x] Skip-to-content link
- [x] Visible focus-visible outline pada semua elemen interaktif
- [x] `aria-expanded` / `aria-controls` pada nav toggle & FAQ accordion
- [x] Keyboard support: Escape tutup mobile nav, Enter/Space toggle FAQ
- [x] `prefers-reduced-motion` dihormati
- [x] Form newsletter guna native Constraint Validation API
- [x] Semua warna teks/background ikut token (kontras AA — sahkan dengan
      alat seperti axe DevTools selepas sebarang tukar warna)

## Nota teknikal

- Semua fungsi guna standard Web API (`fetch`, `Promise`, `customElements`
  tidak digunakan, ES6 modules `import`/`export`). Tiada library luar.
- Setiap `id` dalam `data.json` sepadan terus dengan `id` dalam HTML —
  disahkan secara automatik semasa pembinaan (tiada selector hilang).
- Newsletter form simulate submission (tiada backend) — gantikan
  `window.setTimeout` dalam `main.js` dengan panggilan API sebenar jika perlu.
