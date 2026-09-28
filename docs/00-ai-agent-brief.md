# 00 — AI Agent Developer Brief

**Dokumen:** 00 dari 06
**Proyek:** RAGANTARA — Eksplorasi Budaya Nusantara Interaktif
**Status:** Siap untuk fase implementasi MVP
**Dokumen terkait:** 01-PRD, 02-Architecture, 03-SSD, 04-Design, 05-Next-Steps

---

## 1. Untuk Siapa Dokumen Ini

Dokumen ini adalah **titik masuk (entry point)** bagi AI coding agent (mis. Claude Code) atau developer manusia yang ditugaskan membangun RAGANTARA. Baca dokumen ini lebih dulu sebelum membuka dokumen lain — ia menjelaskan cara memakai seluruh set dokumen, urutan kerja yang disarankan, batasan proyek, dan definisi "selesai".

## 2. Ringkasan Proyek dalam 3 Kalimat

RAGANTARA adalah aplikasi web edukasi satu-halaman yang membawa pengguna (target utama: anak sekolah dasar–menengah) menjelajahi budaya 36 provinsi Indonesia melalui perjalanan visual: globe 3D → peta pulau → peta provinsi → kartu budaya (makanan, pakaian, tari, rumah, musik, cerita rakyat) → kuis interaktif. Prototype awal (V2, satu file HTML) sudah punya kerangka teknis lengkap (globe.gl, peta SVG dari GeoJSON, audio sintetis Web Audio API) tetapi baru berisi **1 dari 36 provinsi**. Enam berkas konten markdown berisi materi lengkap untuk seluruh 36 provinsi (650 kartu budaya, 360 soal kuis) sudah tersedia dan siap diintegrasikan.

## 3. Urutan Membaca Dokumen

1. **00 (dokumen ini)** — orientasi
2. **01-PRD.md** — apa yang dibangun dan untuk siapa; baca ini untuk memahami *scope* dan prioritas fitur
3. **02-Architecture.md** — bagaimana sistem disusun secara teknis; baca sebelum menulis kode apa pun
4. **03-SSD.md** — spesifikasi rinci per layar, skema data, dan kriteria penerimaan; ini rujukan kerja harian saat implementasi
5. **04-Design.md** — sistem desain visual, token warna/tipografi, spesifikasi komponen
6. **05-Next-Steps.md** — roadmap fase-per-fase, checklist, dan risiko

## 4. Sumber Kebenaran (Source of Truth)

| Jenis | Lokasi | Catatan |
|---|---|---|
| Prototype UI/UX referensi | `ragantara.html` (file asli yang diunggah pengguna) | Jadikan referensi visual & interaksi, BUKAN basis kode final — akan ditulis ulang mengikuti 02-Architecture |
| Konten budaya (36 provinsi) | 6 berkas markdown: `ragantara_konten_jawa.md`, `_sumatra.md`, `_kalimantan.md`, `_sulawesi.md`, `_bali_nusa_tenggara.md`, `_papua.md` | Ini **satu-satunya sumber konten yang sah**. Jangan mengarang, meringkas ulang, atau mengubah fakta budaya di dalamnya. Lihat 03-SSD §2 untuk skema parsing. |
| Spesifikasi produk | 01-PRD.md | Scope dan prioritas |
| Spesifikasi teknis | 02, 03 | Arsitektur dan detail implementasi |
| Spesifikasi visual | 04-Design.md | Look & feel |

## 5. Aturan Kerja untuk Agent

1. **Jangan mengubah isi budaya.** Enam berkas markdown ditulis dan dikurasi dengan hati-hati (lihat catatan kurasi di setiap berkas — mis. penekanan bahwa satu contoh budaya tidak mewakili seluruh komunitas). Tugas agent adalah membuat *pipeline* yang mengubah markdown ini menjadi data terstruktur (lihat 03-SSD §2), bukan menulis ulang isinya.
2. **Konten dan kode dipisah.** Jangan hardcode teks budaya ke dalam komponen. Semua konten harus melalui satu lapisan data (content pipeline) agar mudah diperbarui tanpa menyentuh kode.
3. **Bangun bertahap sesuai 05-Next-Steps.** Jangan mencoba mengimplementasikan 36 provinsi sekaligus di iterasi pertama. Validasi alur inti dengan 1–2 provinsi dahulu (lihat Fase 1), baru scale up.
4. **Ikuti kriteria penerimaan di 03-SSD** untuk setiap fitur sebelum menandainya selesai.
5. **Jika ada konflik antar dokumen**, urutan prioritas: 03-SSD (detail teknis) > 02-Architecture (struktur) > 01-PRD (scope produk) > prototype HTML asli (referensi visual saja).
6. **Aksesibilitas bukan fitur tempelan.** Lihat 01-PRD §7 dan 05-Next-Steps Fase 3 — ini bagian yang disengaja dari roadmap, bukan opsional yang bisa dilupakan.
7. **Jangan menambah dependency berat tanpa alasan kuat.** Lihat 02-Architecture §3 untuk daftar stack yang sudah diputuskan dan alasan pemilihannya.

## 6. Definisi "MVP Selesai"

MVP dianggap selesai ketika (detail lengkap ada di 03-SSD §7 "Kriteria Penerimaan"):

- [ ] Seluruh 36 provinsi dapat diakses dan menampilkan kontennya (bukan hanya Jawa Timur)
- [ ] Alur navigasi penuh berfungsi: Landing → Peta Indonesia → Peta Pulau → Provinsi → 6 Kategori Budaya → Detail Kartu → Kuis (10 soal) → Hasil
- [ ] Konten di-render dari data terstruktur hasil parsing 6 berkas markdown, bukan hardcode
- [ ] Kuis berfungsi penuh untuk setiap provinsi dengan 10 soal aslinya masing-masing
- [ ] Aplikasi tetap dapat dipakai (fallback) ketika CDN peta/globe gagal dimuat
- [ ] Responsif di mobile dan desktop
- [ ] Tidak ada pelanggaran hak akses dasar (kontras warna, navigasi keyboard minimal, alt text)

## 7. Definisi "Final" (Pasca-MVP)

Lihat 05-Next-Steps Fase 3–5: aksesibilitas penuh untuk pengguna tunarungu (caption/transkrip visual untuk semua audio, narasi dengan teks berjalan), penyimpanan progres pengguna, mode guru/kelas, dan peningkatan performa.

## 8. Batasan & Non-Tujuan (Non-Goals) MVP

- **Bukan** aplikasi multi-bahasa (MVP: Bahasa Indonesia saja)
- **Bukan** backend/database berskala besar — MVP bersifat *static site* dengan data lokal (lihat 02-Architecture §4)
- **Bukan** platform dengan akun pengguna/login di fase MVP
- **Bukan** rekaman audio budaya otentik (masih memakai motif sintetis seperti prototype awal, dengan disclaimer eksplisit — ini sudah ada di prototype asli dan dipertahankan)
- **Tidak** mengembangkan CMS penuh di MVP — pembaruan konten tetap lewat edit markdown + rebuild

## 9. Kontak Keputusan

Jika agent menemui ambiguitas yang tidak terjawab di 5 dokumen ini, catat sebagai *open question* di bagian akhir 05-Next-Steps dan lanjutkan dengan asumsi paling konservatif (paling dekat dengan perilaku prototype asli), lalu tandai jelas dalam kode/PR untuk direview manusia.
