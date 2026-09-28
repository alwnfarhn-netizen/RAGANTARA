# 02 — Architecture Document

**Dokumen:** 02 dari 06
**Proyek:** RAGANTARA — Eksplorasi Budaya Nusantara Interaktif
**Dokumen terkait:** 00-AI-Agent-Brief, 01-PRD, 03-SSD, 04-Design, 05-Next-Steps

---

## 1. Gambaran Arsitektur

RAGANTARA MVP dibangun sebagai **static site dengan konten yang di-generate saat build**, bukan aplikasi dengan backend dinamis. Alasan: seluruh konten (36 provinsi) bersifat statis dan sudah lengkap dalam markdown; tidak ada kebutuhan personalisasi server-side di fase MVP (lihat 01-PRD §5.2, §9).

```
┌─────────────────────────────────────────────────────────┐
│  BUILD TIME                                              │
│  6 × ragantara_konten_<wilayah>.md                       │
│          │                                                │
│          ▼                                                │
│  Content Pipeline (parser skrip)                          │
│          │                                                │
│          ▼                                                │
│  content.json (struktur ternormalisasi, lihat 03-SSD §2)  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  RUNTIME (browser)                                        │
│                                                             │
│  App Shell (navigasi, state, layar)                       │
│   ├─ Globe Module (globe.gl + fallback statis)            │
│   ├─ Map Module (SVG dari GeoJSON + fallback offline)     │
│   ├─ Content Module (render dari content.json)            │
│   ├─ Quiz Module (baca content.json → render → skor)      │
│   └─ Audio Module (Web Audio API, motif sintetis)         │
└─────────────────────────────────────────────────────────┘
```

## 2. Keputusan Arsitektur Kunci

| Keputusan | Pilihan | Alasan |
|---|---|---|
| Sumber data runtime | JSON hasil kompilasi dari markdown saat build, bukan fetch markdown di runtime | Parsing markdown di browser tiap load itu boros; kompilasi sekali saat build lebih cepat dan lebih mudah divalidasi (lihat 03-SSD §2) |
| Rendering | Aplikasi client-side (SPA sederhana), boleh dengan framework ringan atau vanilla JS terstruktur | Prototype awal memakai vanilla JS penuh dalam 1 file — untuk 36 provinsi ini **tidak lagi disarankan** karena akan sulit dipelihara; lihat §3 |
| Hosting | Static hosting (mis. Netlify/Vercel/GitHub Pages atau setara) | Tidak ada backend dinamis dibutuhkan |
| Peta | SVG hasil proyeksi dari GeoJSON (mempertahankan pendekatan prototype), dengan fallback offline hardcoded | Sudah terbukti bekerja pada prototype; dipertahankan, bukan dirombak |
| Globe | `globe.gl` via CDN, dengan fallback gambar statis | Sudah terbukti bekerja pada prototype; dipertahankan |
| Audio | Web Audio API sintetis (tanpa file audio eksternal) | Menghindari kebutuhan aset audio besar; sudah terbukti bekerja di prototype; dipertahankan untuk MVP |
| State management | State lokal di level aplikasi (tidak perlu Redux/Zustand dsb. untuk kompleksitas ini) | Alur aplikasi linear (layar-ke-layar) tidak butuh state management berat |
| Penyimpanan progres (V2) | `localStorage`, bukan backend | Tidak ada akun pengguna di MVP; lihat 01-PRD F-17 |

## 3. Mengapa Prototype Satu-File Tidak Dilanjutkan Apa Adanya

Prototype awal (`ragantara.html`) sangat baik sebagai *proof of concept* untuk 1 provinsi, tetapi untuk 36 provinsi × 6 kategori × 650 kartu × 360 soal, pendekatan "semua di satu file HTML dengan JS inline" akan:

- Sulit di-maintain (satu file akan menjadi ribuan baris)
- Sulit divalidasi datanya (tidak ada pemisahan data/tampilan yang jelas)
- Sulit diuji sebagian (mis. menguji modul kuis saja)

**Rekomendasi:** pisahkan menjadi modul-modul dengan tanggung jawab jelas (lihat struktur folder §5), tetapi **pertahankan semua teknik yang sudah terbukti bekerja** dari prototype (proyeksi SVG manual, audio sintetis, fallback offline) — jangan ditulis ulang dari nol tanpa alasan.

## 4. Content Pipeline (Markdown → Data Runtime)

Ini komponen arsitektur paling penting karena ia menjembatani 650 kartu konten yang sudah ada ke aplikasi. Spesifikasi detail skema ada di **03-SSD §2**, tetapi di level arsitektur:

1. **Input:** 6 berkas `.md` dengan struktur konsisten: `## <Provinsi>` → `### <Kategori>` → `#### <Judul Kartu>` → paragraf, ditutup `### Cultural Challenge` dengan 10 soal bernomor.
2. **Proses:** skrip parser (Node.js atau Python, dijalankan saat build, bukan di runtime) yang:
   - Mengenali provinsi, kategori, kartu, dan soal kuis berdasarkan pola heading yang konsisten
   - Menormalisasi ke satu skema JSON per provinsi (lihat 03-SSD §2.3)
   - Memvalidasi bahwa setiap provinsi punya **tepat 6 kategori** dan **tepat 10 soal kuis** (sesuai catatan format di setiap berkas markdown) — gagalkan build jika tidak sesuai, agar kesalahan konten ketahuan sejak awal, bukan saat runtime
3. **Output:** satu `content.json` (atau satu file JSON per provinsi jika ingin lazy-load — lihat §6) yang menjadi satu-satunya sumber data yang dibaca aplikasi saat runtime.
4. **Pemetaan pulau:** setiap provinsi dipetakan ke salah satu dari 7 kelompok pulau (Jawa, Sumatra, Kalimantan, Sulawesi, Bali-Nusa, Maluku, Papua) — mengikuti pengelompokan yang sudah dipakai prototype (`islandFromCentroid`). **Catatan:** Maluku tidak punya berkas konten terpisah di 6 berkas yang diunggah — lihat 05-Next-Steps §5 sebagai pertanyaan terbuka.

## 5. Struktur Folder yang Disarankan

```
ragantara/
├── content/
│   ├── raw/                        # 6 berkas markdown asli (sumber kebenaran)
│   │   ├── ragantara_konten_jawa.md
│   │   ├── ragantara_konten_sumatra.md
│   │   ├── ragantara_konten_kalimantan.md
│   │   ├── ragantara_konten_sulawesi.md
│   │   ├── ragantara_konten_bali_nusa_tenggara.md
│   │   └── ragantara_konten_papua.md
│   └── compiled/
│       └── content.json            # output pipeline, TIDAK diedit manual
├── scripts/
│   └── build-content.js            # content pipeline (lihat 03-SSD §2)
├── src/
│   ├── app.js                      # app shell: routing antar-layar, state global
│   ├── modules/
│   │   ├── globe.js                # inisialisasi globe.gl + fallback
│   │   ├── map.js                  # render peta SVG dari GeoJSON + fallback
│   │   ├── content.js              # baca content.json, render kartu/kategori
│   │   ├── quiz.js                 # render soal, hitung skor, hasil
│   │   └── audio.js                # Web Audio engine (motif, sfx, narasi)
│   ├── screens/                    # satu berkas per layar, lihat 03-SSD §3
│   └── styles/
│       └── tokens.css              # design tokens, lihat 04-Design
├── public/
│   └── (aset statis, fallback images, dsb.)
├── index.html
└── package.json
```

## 6. Strategi Muat Data (Lazy Loading)

Dengan 650 kartu dan 360 soal, ukuran `content.json` gabungan bisa cukup besar. Dua opsi:

- **Opsi A (MVP sederhana):** satu `content.json` dimuat sekali di awal. Cocok jika ukuran total < ~500KB terkompresi (perlu diukur setelah pipeline jadi).
- **Opsi B (jika terlalu besar):** satu JSON per provinsi (`content/compiled/<provinsi>.json`), dimuat *on-demand* saat pengguna memilih provinsi tersebut.

Rekomendasi: **mulai dengan Opsi A** untuk kesederhanaan MVP (lihat 05-Next-Steps Fase 1), ukur ukurannya, pindah ke Opsi B hanya jika data pengukuran menunjukkan itu perlu. Jangan optimasi prematur.

## 7. Ketergantungan Eksternal (Dependencies)

| Dependency | Peran | Status ketersediaan |
|---|---|---|
| `globe.gl` (via `unpkg.com`) | Render globe 3D | Eksternal CDN — **harus ada fallback** (lihat prototype `globeFallback`) |
| Natural Earth GeoJSON (negara) | Data batas negara untuk globe | Eksternal — fetch runtime, harus di-*guard* dengan try/catch |
| geoBoundaries API (provinsi Indonesia) | Data batas provinsi untuk peta SVG | Eksternal — fetch runtime, harus di-*guard*, fallback ke peta hardcoded (mengikuti pola `renderFallbackIndonesia` di prototype) |
| `three-globe` texture assets (via `unpkg.com`) | Tekstur bumi untuk globe | Eksternal — sama, butuh fallback |
| Web Audio API, SpeechSynthesis API | Audio dan narasi | Built-in browser, tidak perlu dependency eksternal — tetapi harus di-*feature-detect* (tidak semua browser/device mendukung penuh) |

**Prinsip arsitektur:** setiap ketergantungan eksternal **wajib** punya jalur fallback yang sudah terbukti di prototype. Jangan menghapus fallback demi "menyederhanakan kode" — ini kebutuhan non-fungsional eksplisit (01-PRD N-nonfunctional terkait F-12).

## 8. Kompatibilitas Browser & Device

Mengikuti breakpoint yang sudah ada di prototype (950px, 600px). Tidak perlu dukungan browser sangat lawas — target: 2 tahun terakhir versi Chrome/Firefox/Safari/Edge, termasuk versi mobile.

## 9. Keamanan & Privasi

MVP tidak menyimpan data pribadi pengguna (tanpa akun/login). Jika Fase Next-Steps menambahkan `localStorage` untuk progres (F-17), pastikan data yang disimpan hanya progres aplikasi (provinsi selesai, skor), bukan data identitas.

## 10. Deployment

Static build (`npm run build` menghasilkan folder statis siap deploy) → hosting statis apa pun. Tidak ada langkah database migration atau server provisioning yang dibutuhkan untuk MVP.
