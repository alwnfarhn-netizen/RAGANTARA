# 04 — Design Document

**Dokumen:** 04 dari 06
**Proyek:** RAGANTARA — Eksplorasi Budaya Nusantara Interaktif
**Cakupan:** Sistem desain visual, token, spesifikasi komponen
**Dokumen terkait:** 00-AI-Agent-Brief, 01-PRD, 02-Architecture, 03-SSD, 05-Next-Steps

---

## 1. Prinsip Desain

1. **Pertahankan identitas visual prototype.** Nuansa "galaksi gelap premium" (dark mode, glassmorphism, gradient warna emas-sian-pink) sudah teruji secara visual dan disukai sebagai arah — MVP **melanjutkan**, bukan mendesain ulang dari nol.
2. **Visual besar, ramah anak.** Ikon/emoji besar, animasi lembut (float, breathe, morph) membantu keterbacaan untuk target usia SD–SMP.
3. **Konsisten lintas 36 provinsi.** Karena kini ada puluhan provinsi, konsistensi template kartu/layar jauh lebih penting daripada di prototype 1-provinsi — pengguna harus merasa "pola yang sama, cerita yang beda", bukan 36 desain berbeda.
4. **Kontras dan keterbacaan tidak dikorbankan demi estetika** — lihat §6 Aksesibilitas Visual.

## 2. Design Tokens

Diambil langsung dari `:root` prototype asli — dipertahankan sebagai token resmi:

### 2.1 Warna

| Token | Nilai | Peran |
|---|---|---|
| `--ink` | `#f7fbff` | Teks utama di atas latar gelap |
| `--muted` | `#9fb1c8` | Teks sekunder/deskripsi |
| `--line` | `rgba(255,255,255,.11)` | Garis batas/border tipis |
| `--gold` | `#ffd46b` | Aksen utama, CTA primer |
| `--cyan` | `#63e6d5` | Aksen sekunder, audio/interaktif |
| `--pink` | `#ff8fb3` | Aksen tersier |
| `--blue` | `#5ab2ff` | Aksen atmosfer/globe |
| `--bg0` / `--bg1` / `--bg2` | `#030816` / `#07152c` / `#0d2340` | Lapisan latar gelap |
| `--panel` | `rgba(9,24,45,.72)` | Latar panel/kartu |

**Warna per pulau (dipertahankan dari prototype, dipetakan ke island.id):**

| Pulau | Warna |
|---|---|
| Sumatra | `#5674d8` |
| Jawa | `#f2b74d` |
| Kalimantan | `#41a68e` |
| Sulawesi | `#e47d8f` |
| Bali-Nusa | `#a46be3` |
| Maluku | `#e27b50` |
| Papua | `#5aa7cf` |

### 2.2 Tipografi

- Font: `Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif`
- Skala judul: `h1` clamp(46px, 6.3vw, 86px), `h2` clamp(35px, 4.5vw, 61px), `h3` 25px
- Body: 16px, line-height 1.68, warna `--muted`
- Letter-spacing judul negatif (mengikuti prototype: -3.8px pada h1) untuk kesan tegas/modern

### 2.3 Spacing & Radius

- Radius kartu besar: 26–32px (`.culture-card`, `.result`)
- Radius kartu kecil/tombol: 13–18px
- Shadow standar: `0 28px 80px rgba(0,0,0,.42)` (`--shadow`)

### 2.4 Efek Glass

```css
.glass {
  background: linear-gradient(145deg, rgba(255,255,255,.075), rgba(255,255,255,.025));
  border: 1px solid var(--line);
  box-shadow: var(--shadow);
  backdrop-filter: blur(18px);
}
```
Dipakai konsisten di semua panel konten (peta, kartu detail, hasil kuis).

## 3. Ikonografi

Prototype memakai **emoji besar** sebagai visual utama kartu kategori dan makanan (🍜👘💃🏠🥁📖, dsb.) — pendekatan ini **dipertahankan** karena ringan (tanpa aset gambar), ekspresif, dan konsisten lintas platform. Untuk 36 provinsi:

- 6 ikon kategori tetap sama di semua provinsi (Makanan 🍜, Pakaian 👘, Tari 💃, Rumah 🏠, Musik 🥁, Cerita 📖) — konsistensi ini penting justru karena kontennya berbeda-beda.
- Ikon kartu individual (mis. tiap makanan) sebaiknya dipetakan manual ke emoji yang representatif per kartu (bukan generik), tetapi ini **boleh dilakukan bertahap** — kartu tanpa pemetaan ikon manual memakai ikon default kategori sebagai fallback (lihat 05-Next-Steps).

## 4. Spesifikasi Komponen Utama

### 4.1 Kartu Kategori (`.culture-card`)
- Ukuran minimum tinggi: 214px
- State hover: translateY(-8px), border menyala warna gold
- Berisi: ikon besar (visual), judul kategori, subjudul singkat, tombol suara terpisah (event stop-propagation agar tidak memicu klik kartu)

### 4.2 Kartu Makanan/Showcase (`.big-food` + `.food-mini`)
- Satu kartu ditonjolkan (showcase besar dengan animasi "steam"/mengambang)
- Kartu lain dalam daftar ringkas horizontal (ikon + judul + deskripsi 1 baris)
- **Generalisasi untuk MVP:** pola ini dipakai untuk kartu pertama tiap kategori sebagai showcase, sisanya sebagai daftar — bukan hanya untuk kategori Makanan seperti prototype awal

### 4.3 Peta (`.map-shell`)
- Grid garis halus sebagai latar (`background-size:28px 28px`)
- SVG provinsi dengan warna per-pulau, label mengambang dengan stroke gelap agar terbaca di atas warna apa pun
- Legenda chip di kiri-bawah untuk navigasi cepat antar-kelompok pulau

### 4.4 Kartu Kuis (`.answer`)
- Grid 2 kolom desktop, 1 kolom mobile
- State: default → hover (translateY -3px) → correct (hijau `#63e6b4`) → wrong (merah `#ff8585`)
- Setelah dijawab: opsi terkunci, opsi benar selalu ditandai hijau meskipun pengguna salah pilih

### 4.5 Progress Bar Global
- Menunjukkan posisi dalam 9 layar (S-00 s.d. S-08), gradient cyan→gold→pink
- **Catatan MVP:** karena alur kini bisa bercabang (kembali ke provinsi lain), progress bar ini merepresentasikan *posisi dalam satu sesi eksplorasi provinsi*, bukan progres keseluruhan 36 provinsi. Progres keseluruhan (badge terkumpul) direkomendasikan sebagai elemen terpisah — lihat 05-Next-Steps.

### 4.6 Toast Notifikasi
- Dipertahankan dari prototype (`.toast`), dipakai untuk feedback singkat (nama provinsi ter-hover, mode fallback aktif, dsb.)

## 5. Layar yang Perlu Digeneralisasi dari Hardcode

Ini adalah kontribusi desain terpenting dari dokumen ini: menandai secara eksplisit bagian visual prototype yang **ditulis untuk 1 provinsi** dan cara menggeneralisasinya.

### 5.1 Gerbang Provinsi (`.jatim-orb`)
- Prototype: teks "JAWA TIMUR" hardcode di dalam bentuk organik beranimasi.
- **MVP:** teks di dalam orb menjadi `{province.name}` dinamis, panjang teks provinsi bervariasi (mis. "Kepulauan Bangka Belitung" jauh lebih panjang dari "Bali") — perlu `font-size` responsif terhadap panjang string (clamp atau auto-shrink), bukan ukuran font tetap.

### 5.2 Tombol Aksi Kontekstual
- Prototype: tombol "Jelajahi Jawa Timur →" hardcode di S-02.
- **MVP:** tombol mengikuti provinsi yang sedang di-hover/dipilih terakhir di peta, contoh: "Jelajahi {province.name} →". Jika belum ada provinsi dipilih, tombol nonaktif/tersembunyi sampai ada pilihan (state disabled, bukan mengarah ke default tertentu).

### 5.3 Warna Orb per Pulau
- Prototype: warna coklat-emas (`.jatim-orb` gradient) khusus nuansa Jawa Timur.
- **MVP:** gradient orb mengikuti warna pulau (§2.1) agar pengguna dapat mengasosiasikan warna dengan pulau secara konsisten di seluruh navigasi (peta, orb, badge).

## 6. Aksesibilitas Visual (Wajib untuk MVP)

Bagian ini **wajib**, berbeda dari aksesibilitas pendengaran/tunarungu yang didorong ke Next-Steps (lihat 01-PRD §7, 05-Next-Steps Fase 3):

- Kontras teks `--ink` (#f7fbff) di atas `--bg0` (#030816) dan sejenisnya sudah sangat tinggi (baik) — pertahankan, jangan gunakan `--muted` untuk teks yang perlu dibaca dengan mudah oleh semua pengguna (gunakan hanya untuk teks sekunder betulan).
- Semua elemen SVG interaktif (path provinsi, chip legenda) memiliki `aria-label` (prototype sudah mulai ini pada elemen `<svg>` level, perlu diperluas ke tiap `<path>`/tombol).
- Tombol ikon-saja (mis. tombol suara 🔊) wajib punya `aria-label` teks (mis. "Dengarkan efek suara makanan"), tidak hanya emoji.
- Elemen dapat difokus dan dioperasikan lewat keyboard: tombol utama (CTA), kartu kategori, opsi kuis (lihat 01-PRD N-04).

## 7. Motion & Animasi

Semua animasi dari prototype dipertahankan (bintang berjalan, orb "morph", kartu "float", dishFloat, dsb.) — ini bagian dari identitas visual. **Satu penambahan wajib untuk MVP:** hormati preferensi sistem `prefers-reduced-motion` — kurangi/nonaktifkan animasi non-esensial (starDrift, shoot, breathe) bagi pengguna yang mengaktifkan pengaturan ini di sistem operasinya, sembari mempertahankan animasi fungsional minimal (transisi antar-layar tetap ada tapi lebih singkat/tanpa efek berlebih).

## 8. Skala untuk 36 Provinsi — Catatan Desain Khusus

Beberapa isu visual baru yang tidak muncul saat hanya 1 provinsi didemokan, harus diantisipasi desainnya:

- **Nama provinsi panjang** ("Kepulauan Bangka Belitung", "Daerah Istimewa Yogyakarta", "Papua Barat Daya") — semua komponen yang menampilkan nama provinsi (judul h2, orb, badge, tombol) harus diuji dengan string terpanjang ini, bukan hanya "Jawa Timur"/"Bali" yang pendek.
- **Legenda peta dengan 7 kelompok pulau** sudah dirancang di prototype (`buildLegend`) — pastikan tetap muat rapi di layar sempit (mobile) tanpa overflow horizontal yang mengganggu.
- **Badge 36 provinsi** — jika ke depannya ditampilkan koleksi badge (Next-Steps), rancang grid badge yang scalable (mis. grid wrap otomatis), jangan asumsikan jumlah kecil seperti 1 badge di prototype.

## 9. Referensi & Rujukan (Elemen UI Baru)

Prototype awal tidak punya elemen UI untuk menampilkan daftar rujukan/sumber per provinsi (ini ada di markdown tapi belum di UI). Untuk MVP (F-11 di 01-PRD), tambahkan elemen baru:

- Ditempatkan di S-08 (Hasil) atau sebagai panel collapsible di S-03 (Gerbang Provinsi)
- Gaya visual: teks kecil (`.mini-note` styling), list rujukan dengan link keluar (`target="_blank"`, `rel="noopener"`)
- Tujuan: transparansi kurasi — biarkan pengguna/guru tahu dari mana informasi budaya ini berasal
