# 01 — Product Requirements Document (PRD)

**Dokumen:** 01 dari 06
**Proyek:** RAGANTARA — Eksplorasi Budaya Nusantara Interaktif
**Versi target:** MVP → Final
**Dokumen terkait:** 00-AI-Agent-Brief, 02-Architecture, 03-SSD, 04-Design, 05-Next-Steps

---

## 1. Latar Belakang

RAGANTARA lahir sebagai prototype visual (V2) yang menunjukkan konsep: perjalanan eksplorasi budaya Indonesia yang dimulai dari luar angkasa (globe 3D) hingga masuk ke detail satu makanan khas di satu provinsi, ditutup kuis. Prototype ini secara visual dan teknis meyakinkan, tetapi hanya mendemokan **1 dari 36 provinsi** yang datanya sudah tersedia. Sementara itu, enam berkas konten markdown berisi materi budaya yang telah dikurasi secara hati-hati dan lengkap untuk seluruh wilayah Indonesia (Jawa, Sumatra, Kalimantan, Sulawesi, Bali–Nusa Tenggara, Papua).

Kesenjangan antara "kerangka yang sudah jalan" dan "konten yang sudah siap tapi belum tersambung" adalah alasan proyek ini dilanjutkan ke fase build.

## 2. Tujuan Produk

1. Membawa seluruh 36 provinsi (bukan hanya 1) ke dalam pengalaman interaktif yang sama kualitasnya dengan demo Jawa Timur di prototype awal.
2. Menjadikan konten yang sudah dikurasi — nuansa keberagaman dalam satu budaya, bukan generalisasi — benar-benar tersampaikan ke pengguna, bukan hilang dalam proses build.
3. Menjadikan aplikasi ini fondasi yang bisa diperluas ke arah aksesibilitas untuk anak dengan disabilitas rungu di fase pasca-MVP.

## 3. Target Pengguna

**Pengguna utama:** Anak usia sekolah dasar–menengah pertama (kira-kira 8–15 tahun) yang mempelajari budaya Nusantara, baik mandiri di rumah maupun didampingi guru di kelas.

**Pengguna sekunder:**
- Guru/pendidik yang memakai aplikasi sebagai media ajar interaktif
- Pengunjung umum yang ingin eksplorasi budaya Indonesia secara ringan (edutainment)

**Karakteristik penting yang memengaruhi desain:**
- Rentang usia lebar → bahasa dan kompleksitas UI harus tetap sederhana
- Konteks sekolah → perangkat bisa bervariasi (tablet sekolah, laptop lama, HP pribadi) → performa dan fallback penting
- Materi budaya sensitif → kurasi yang sudah ada dalam markdown (menghindari generalisasi, menghormati komunitas adat) **harus dipertahankan**, tidak boleh disederhanakan hingga kehilangan nuansa itu

## 4. Prinsip Produk (Product Principles)

1. **Konten adalah produk.** Kekayaan 650 kartu budaya dan 360 soal kuis adalah nilai inti — teknologi (globe 3D, audio, animasi) adalah pembungkus, bukan tujuan.
2. **Jangan menyamaratakan budaya.** Setiap kartu sudah ditulis dengan catatan kurasi eksplisit (contoh: "bukan seragam wajib", "bukan seluruh warga"). UI dan copy tambahan tidak boleh menghilangkan nuansa ini demi kesederhanaan.
3. **Berjalan meski koneksi lemah.** Sekolah di Indonesia punya keragaman infrastruktur internet — fallback untuk globe/peta (sudah ada di prototype) adalah keharusan, bukan nice-to-have.
4. **Aksesibel secara bertahap.** MVP tidak wajib menyelesaikan aksesibilitas penuh untuk tunarungu, tetapi arsitektur harus tidak menghalangi penambahan itu di fase berikutnya (lihat §7).

## 5. Lingkup (Scope)

### 5.1 Termasuk dalam MVP

- Navigasi penuh: Landing/Globe → Peta Indonesia (7 kelompok pulau) → Peta Provinsi → Gerbang Provinsi → 6 Kategori Budaya → Grid/List Kartu per kategori → Detail Kartu → Cultural Challenge (kuis 10 soal) → Hasil/Badge
- Seluruh 36 provinsi dengan kontennya masing-masing (bukan hardcode 1 provinsi)
- 6 kategori budaya per provinsi: Makanan Khas, Pakaian Adat, Tari & Seni, Rumah Adat, Musik Tradisi, Cerita Rakyat
- Kuis 10 soal per provinsi dengan skor dan hasil ("Culture Explorer")
- Badge/lencana per provinsi yang berhasil diselesaikan
- Audio sintetis (motif regional) dan efek suara seperti pada prototype, dengan disclaimer bahwa ini bukan rekaman tradisional otentik
- Peta interaktif dengan sumber data GeoJSON live + fallback visual offline
- Globe 3D dengan fallback gambar statis
- Referensi/sumber rujukan ditampilkan untuk tiap provinsi (transparansi kurasi)
- Responsif mobile dan desktop

### 5.2 Tidak Termasuk MVP (lihat juga 00-Brief §8)

- Multi-bahasa
- Akun pengguna, login, penyimpanan progres lintas perangkat
- Rekaman audio budaya otentik (masih sintetis)
- CMS/admin panel untuk edit konten via UI
- Mode kelas/guru dengan analitik
- Aksesibilitas penuh untuk tunarungu (caption/transkrip visual lengkap) — ini didorong ke fase Next-Steps, tapi arsitektur harus mengakomodasi

## 6. Kebutuhan Fungsional

Diberi ID agar bisa dirujuk dari dokumen SSD (03) dan dilacak progresnya.

| ID | Kebutuhan | Prioritas |
|---|---|---|
| F-01 | Pengguna dapat melihat globe 3D interaktif dan masuk ke peta Indonesia | Wajib |
| F-02 | Pengguna dapat melihat peta Indonesia terbagi 7 kelompok pulau dan memilih satu | Wajib |
| F-03 | Pengguna dapat melihat peta provinsi dalam satu kelompok pulau dan memilih satu provinsi dari **seluruh 36 provinsi yang tersedia** | Wajib |
| F-04 | Pengguna dapat masuk ke gerbang provinsi terpilih dan melihat 6 kategori budaya | Wajib |
| F-05 | Pengguna dapat membuka kategori budaya dan melihat 3–4 kartu di dalamnya | Wajib |
| F-06 | Pengguna dapat membuka detail satu kartu budaya (teks lengkap dari markdown) | Wajib |
| F-07 | Pengguna dapat memicu efek suara/narasi terkait kartu yang dibuka | Wajib |
| F-08 | Pengguna dapat memulai Cultural Challenge (kuis 10 soal) untuk provinsi yang sedang dijelajahi | Wajib |
| F-09 | Sistem menampilkan skor, umpan balik per soal, dan badge di akhir kuis | Wajib |
| F-10 | Pengguna dapat kembali (back) dan berpindah provinsi/pulau lain tanpa reload halaman | Wajib |
| F-11 | Sistem menampilkan rujukan/sumber untuk tiap provinsi (transparansi) | Wajib |
| F-12 | Sistem tetap berfungsi (fallback) saat CDN globe/peta tidak dapat diakses | Wajib |
| F-13 | Musik latar berubah mengikuti lokasi yang sedang dijelajahi, dapat dimatikan | Wajib |
| F-14 | Aplikasi responsif pada layar mobile (≤950px breakpoint mengikuti prototype) | Wajib |
| F-15 | Setiap kartu budaya menampilkan catatan kurasi/nuansa dari markdown asli (tidak dihilangkan saat rendering) | Wajib |
| F-16 (V2) | Alternatif visual/teks untuk konten audio (mendukung pengguna tunarungu) | Direkomendasikan, Next-Steps |
| F-17 (V2) | Progres pengguna tersimpan secara lokal (localStorage) tanpa akun | Direkomendasikan, Next-Steps |

## 7. Kebutuhan Non-Fungsional

| ID | Kebutuhan |
|---|---|
| N-01 | Waktu muat awal (First Contentful Paint) < 3 detik pada koneksi 4G biasa |
| N-02 | Aplikasi dapat dijalankan sebagai *static site* tanpa server backend khusus |
| N-03 | Kontras warna teks-latar memenuhi WCAG AA minimal untuk teks utama |
| N-04 | Navigasi utama dapat dioperasikan dengan keyboard (Tab/Enter) minimal untuk tombol utama |
| N-05 | Ukuran total aset (di luar CDN pihak ketiga) wajar untuk device sekolah — hindari bundel JS/CSS berlebihan |
| N-06 | Kode dan data terpisah sehingga pembaruan konten budaya tidak memerlukan perubahan logika aplikasi |
| N-07 | Aplikasi dapat diuji dan dijalankan secara lokal tanpa kredensial/API key berbayar |

## 8. Metrik Keberhasilan (Kualitatif untuk MVP)

Karena ini bukan produk dengan analitik pengguna riil di fase MVP, metrik keberhasilan bersifat kualitatif/verifikasi manual:

1. Semua 36 provinsi dapat dijelajahi end-to-end tanpa error
2. Semua 360 soal kuis dapat dijawab dan menghasilkan skor yang benar
3. Reviewer (pengguna/dosen) menyatakan nuansa kurasi budaya dari markdown tetap terasa di UI, tidak "hilang" jadi generik
4. Aplikasi tetap dapat digunakan saat disimulasikan tanpa akses ke CDN peta/globe

## 9. Asumsi

- Enam berkas markdown adalah versi final konten untuk MVP (perubahan konten besar berarti revisi PRD)
- Prototype HTML awal adalah referensi arah visual yang disetujui, bukan cetak biru kode
- Tidak ada kebutuhan backend dinamis di fase MVP — semua data bisa dikompilasi saat build

## 10. Pertanyaan Terbuka

Dipindahkan dan dilacak di 05-Next-Steps §5 ("Pertanyaan Terbuka") agar tidak tersebar di banyak dokumen.
