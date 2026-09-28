# 05 — Next Steps & Roadmap

**Dokumen:** 05 dari 06
**Proyek:** RAGANTARA — Eksplorasi Budaya Nusantara Interaktif
**Cakupan:** Roadmap berfase, risiko, pertanyaan terbuka, checklist rilis
**Dokumen terkait:** 00-AI-Agent-Brief, 01-PRD, 02-Architecture, 03-SSD, 04-Design

---

## 1. Filosofi Roadmap

Jangan bangun 36 provinsi sekaligus di percobaan pertama. Validasi seluruh alur teknis (parsing, navigasi, kuis, fallback) dengan **subset kecil** dahulu, baru scale up ke penuh. Ini mengurangi risiko menemukan bug struktural setelah menulis banyak kode.

## 2. Roadmap Berfase

### Fase 0 — Fondasi Content Pipeline
**Tujuan:** Mengubah 6 markdown menjadi `content.json` yang tervalidasi (03-SSD §2).

- [ ] Tulis skrip parser markdown → JSON sesuai skema 03-SSD §2.3
- [ ] Implementasikan seluruh validasi wajib (03-SSD §2.4)
- [ ] Jalankan pipeline untuk 6 berkas, pastikan lolos validasi: 36 provinsi, 6 kategori/provinsi, 10 soal/provinsi
- [ ] Ukur ukuran `content.json` akhir — putuskan Opsi A vs B (02-Architecture §6) berdasarkan hasil ukur, bukan tebakan

**Selesai jika:** `content.json` valid dihasilkan otomatis dari markdown, dapat di-regenerate kapan saja tanpa intervensi manual.

### Fase 1 — MVP Inti dengan Subset Provinsi
**Tujuan:** Validasi alur S-00 → S-08 (03-SSD §3–4) bekerja end-to-end untuk sejumlah kecil provinsi dari pulau berbeda (mis. Jawa Timur, Bali, Papua — mewakili 3 pulau berbeda).

- [ ] Bangun app shell + routing antar-layar (02-Architecture §5)
- [ ] Sambungkan modul globe & peta dengan fallback (mempertahankan logika prototype, 03-SSD §6)
- [ ] Render kategori & kartu dari `content.json` (bukan hardcode)
- [ ] Render kuis dari `content.json`, skor, dan badge dinamis
- [ ] Uji manual penuh untuk 3 provinsi sampel di 3 breakpoint (desktop, tablet, mobile)

**Selesai jika:** kriteria penerimaan 03-SSD §7 (baris "3 provinsi berbeda") terpenuhi.

### Fase 2 — Scale-Up ke 36 Provinsi Penuh
**Tujuan:** Memastikan seluruh 36 provinsi berfungsi, bukan hanya sampel.

- [ ] Uji navigasi penuh untuk seluruh 36 provinsi (bisa semi-otomatis: skrip yang mengunjungi tiap provinsi dan mengecek elemen kunci render)
- [ ] Spot-check acak 15–20 kartu untuk memastikan teks tidak terpotong dibanding markdown sumber
- [ ] Uji seluruh 360 soal kuis dapat dijawab tanpa error (validasi struktural sudah dari Fase 0, ini uji UI)
- [ ] Uji tampilan nama provinsi terpanjang di semua komponen (04-Design §8)

**Selesai jika:** kriteria penerimaan 03-SSD §7 baris "36 provinsi" terpenuhi. **Ini adalah milestone rilis MVP.**

### Fase 3 — Aksesibilitas Diperluas (Prioritas Tinggi Pasca-MVP)
**Tujuan:** Menutup gap yang diidentifikasi sejak awal diskusi — audio sebagai fitur utama tanpa alternatif visual bagi pengguna tunarungu.

- [ ] F-16 (01-PRD): tambahkan transkrip teks untuk setiap narasi suara (`speakCard`) — tampil sebagai teks yang sudah ada di kartu (body), tetapi pastikan **disinkronkan visual** saat narasi diputar (mis. highlight kalimat berjalan), bukan sekadar "teksnya sudah ada di kartu jadi dianggap cukup"
- [ ] Tambahkan indikator visual untuk efek suara (`playSfx`) — mis. animasi/ikon berdenyut saat suara memainkan, agar pengguna yang tidak mendengar tetap tahu sesuatu terjadi
- [ ] Evaluasi kebutuhan caption untuk motif musik regional (§5 03-SSD) — pertimbangkan indikator visual (equalizer bar, warna berdenyut sesuai motif) sebagai representasi non-audio dari perubahan musik regional
- [ ] Review bersama pakar pendidikan disabilitas rungu (relevan dengan latar belakang profesional pemilik proyek) sebelum finalisasi pendekatan

**Catatan:** Fase ini secara sengaja dipisah dari MVP (bukan berarti tidak penting) agar MVP tidak tertunda oleh scope yang memerlukan riset/desain lebih dalam.

### Fase 4 — Peningkatan Pengalaman (Nice-to-have)
- [ ] F-17 (01-PRD): progres tersimpan di `localStorage` — provinsi yang sudah dieksplorasi, skor terbaik per provinsi, koleksi badge
- [ ] Halaman "Koleksi Badge" — ringkasan visual 36 badge, mana yang sudah didapat
- [ ] Optimasi performa berdasarkan data nyata (ukuran bundel, waktu muat) setelah Fase 2 selesai — jangan optimasi sebelum ada data
- [ ] Mode "acak provinsi" — tombol untuk eksplorasi provinsi acak, mendorong pengguna menjelajah di luar pulau yang familiar

### Fase 5 — Eksplorasi Pasca-MVP (Belum Diprioritaskan)
- Mode guru/kelas dengan ringkasan progres siswa
- Multi-bahasa
- Audio budaya otentik (menggantikan motif sintetis) — memerlukan kurasi/izin hak cipta, di luar scope teknis semata
- CMS ringan untuk pembaruan konten tanpa rebuild manual

## 3. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| CDN pihak ketiga (globe.gl, geoBoundaries) berubah/mati sewaktu-waktu | Fitur peta/globe rusak di produksi | Fallback sudah wajib di scope (03-SSD §6); pertimbangkan meng-cache/self-host aset statis di Fase 4 jika masalah berulang |
| Ukuran `content.json` gabungan terlalu besar | Waktu muat awal lambat (melanggar N-01) | Ukur di Fase 0; pindah ke lazy-load per provinsi (Opsi B, 02-Architecture §6) jika perlu |
| Parser markdown rapuh terhadap variasi kecil format antar 6 berkas | Data provinsi tertentu gagal ter-parse diam-diam | Validasi wajib (03-SSD §2.4) yang **menggagalkan build**, bukan hanya warning, adalah mitigasi utama |
| Wilayah Maluku tidak punya berkas konten | Kelompok pulau "Maluku" di peta jadi jalan buntu | Lihat §5 di bawah — perlu keputusan produk, bukan keputusan teknis semata |
| Scope UI 36-provinsi memperlihatkan edge-case yang tidak terlihat di prototype 1-provinsi (nama panjang, dsb.) | Tampilan rusak di provinsi tertentu saja, mudah terlewat saat QA | Fase 2 mewajibkan uji seluruh 36 provinsi, bukan sampel saja |

## 4. Checklist Rilis MVP

Gabungan final sebelum menandai MVP rilis (rujuk detail masing-masing ke dokumen sumber):

- [ ] Semua item 03-SSD §7 tercentang
- [ ] Semua item 04-Design §6 (Aksesibilitas Visual — wajib MVP) tercentang
- [ ] `prefers-reduced-motion` dihormati (04-Design §7)
- [ ] Build statis berhasil dan dapat di-deploy tanpa langkah manual tambahan (02-Architecture §10)
- [ ] Tidak ada data pribadi pengguna tersimpan tanpa sepengetahuan (02-Architecture §9)

## 5. Pertanyaan Terbuka (Perlu Keputusan Manusia)

Ini bukan keputusan teknis yang bisa diambil agent sendiri — butuh keputusan dari pemilik produk:

1. **Wilayah Maluku:** enam berkas konten yang tersedia tidak mencakup Maluku/Maluku Utara, padahal prototype awal sudah menyiapkan slot untuk kelompok pulau ini (`soundNames.Maluku`, `sets.Maluku` di kode fallback). Opsi: (a) sembunyikan kelompok pulau Maluku dari peta sampai kontennya tersedia, (b) tampilkan dengan status "Segera Hadir" yang jujur, atau (c) minta berkas konten Maluku dibuat menyusul sebelum rilis MVP. **Rekomendasi:** opsi (b) — jangan hilangkan dari peta (secara geografis dan edukatif janggal jika Maluku "tidak ada"), tapi jangan pura-pura datanya lengkap.
2. **Motif audio per-provinsi vs per-pulau:** MVP merekomendasikan motif per-pulau (7 motif) demi kesederhanaan (03-SSD §5). Jika pemilik produk menginginkan nuansa lebih personal per provinsi (36 motif), ini perlu keputusan desain/komposisi musik tambahan sebelum diimplementasikan — bukan keputusan default yang bisa diambil sepihak oleh agent.
3. **Ikon kartu individual:** apakah 650 kartu perlu ikon unik satu-per-satu (kerja kurasi visual besar), atau cukup ikon default per kategori (6 ikon total) untuk MVP dengan penyempurnaan bertahap? **Rekomendasi:** mulai dengan ikon kategori (6 ikon) untuk MVP, perhalus bertahap — lihat 04-Design §3.
4. **Prioritas Fase 3 (Aksesibilitas tunarungu):** apakah ini dikerjakan segera setelah MVP rilis (paralel dengan Fase 4), atau menunggu MVP dipakai/diuji dulu oleh pengguna nyata sebelum berinvestasi lebih jauh? Ini keputusan prioritas roadmap, bukan teknis.

---

*Dokumen 00–05 ini adalah satu paket. Jika salah satu direvisi secara substansial (terutama 01-PRD atau 03-SSD), tinjau ulang dokumen lain untuk konsistensi.*
