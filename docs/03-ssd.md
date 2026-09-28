# 03 — System Specification Document (SSD)

**Dokumen:** 03 dari 06
**Proyek:** RAGANTARA — Eksplorasi Budaya Nusantara Interaktif
**Cakupan:** Skema data, spesifikasi per layar, alur navigasi, kriteria penerimaan
**Dokumen terkait:** 00-AI-Agent-Brief, 01-PRD, 02-Architecture, 04-Design, 05-Next-Steps

---

## 1. Ringkasan Data Sumber (Angka Pasti)

Diverifikasi langsung dari 6 berkas markdown yang diunggah — gunakan angka ini untuk validasi pipeline (§2.4):

| Berkas | Wilayah | Jumlah Provinsi | Provinsi |
|---|---|---|---|
| `ragantara_konten_jawa.md` | Jawa | 6 | Banten, DKI Jakarta, Jawa Barat, Jawa Tengah, DI Yogyakarta, Jawa Timur |
| `ragantara_konten_sumatra.md` | Sumatra | 10 | Aceh, Sumatera Utara, Sumatera Barat, Riau, Kepulauan Riau, Jambi, Bengkulu, Sumatera Selatan, Kepulauan Bangka Belitung, Lampung |
| `ragantara_konten_kalimantan.md` | Kalimantan | 5 | Kalimantan Barat, Tengah, Selatan, Timur, Utara |
| `ragantara_konten_sulawesi.md` | Sulawesi | 6 | Sulawesi Utara, Tengah, Selatan, Tenggara, Gorontalo, Sulawesi Barat |
| `ragantara_konten_bali_nusa_tenggara.md` | Bali–Nusa Tenggara | 3 | Bali, Nusa Tenggara Barat, Nusa Tenggara Timur |
| `ragantara_konten_papua.md` | Papua | 6 | Papua, Papua Barat, Papua Barat Daya, Papua Tengah, Papua Pegunungan, Papua Selatan |

**Total: 36 provinsi.** Setiap provinsi memiliki **tepat 6 kategori** (Makanan khas, Pakaian adat, Tari dan seni, Rumah adat, Musik tradisi, Cerita rakyat) dan **tepat 10 soal Cultural Challenge**. Total 650 kartu budaya (`####`), 360 soal kuis.

**Catatan penting:** wilayah "Maluku" ada dalam pengelompokan pulau prototype (`soundNames`, `islandFromCentroid`) tetapi **tidak** memiliki berkas konten pada set 6 berkas ini. Lihat 05-Next-Steps §5 untuk penanganannya.

## 2. Skema Data (Content Pipeline Output)

### 2.1 Pola Markdown Sumber

Setiap berkas mengikuti pola heading yang konsisten dan dapat diparsing dengan regex/heading-walker:

```
# <Judul berkas>
**Format:** ...
**Cakupan:** ...
**Petunjuk integrasi / Cara membaca:** ...
**Catatan kurasi:** <PENTING — simpan utuh, lihat §2.2>

---

## <Nama Provinsi>

**Pengantar:** <teks pengantar provinsi>

### Makanan khas
#### <Judul Kartu 1>
<paragraf isi>
#### <Judul Kartu 2>
...

### Pakaian adat
#### ...

### Tari dan seni
#### ...

### Rumah adat
#### ...

### Musik tradisi
#### ...

### Cerita rakyat
#### ...

### Cultural Challenge — Misi Penjelajah <Provinsi>
1. **Soal:** ... **A.** ... **B.** ... **C.** ... **D.** ... **Kunci:** X. **Umpan balik:** ...
2. ...
(hingga 10)

**Lencana:** Penjelajah <Provinsi>.

**Rujukan terpilih:**
- <sumber 1 dengan link markdown>
- <sumber 2>
...

---
```

### 2.2 Field yang WAJIB Dipertahankan Saat Parsing

Beberapa kartu memiliki kalimat kurasi/disclaimer eksplisit yang **tidak boleh dibuang** saat parsing (mis. "bukan seragam wajib semua laki-laki Banten", "bagian yang menggunakan benda tajam... hanya boleh dipentaskan oleh pelaku yang memahami tata caranya"). Ini bukan noise — ini bagian dari isi kartu itu sendiri (satu paragraf utuh per kartu, jangan dipotong). Parser mengambil **seluruh paragraf** di bawah setiap `####` sebagai satu field `body`, tidak melakukan ekstraksi sebagian.

### 2.3 Skema JSON Target

```json
{
  "islands": [
    {
      "id": "jawa",
      "name": "Jawa",
      "provinces": ["banten", "dki-jakarta", "jawa-barat", "jawa-tengah", "diy", "jawa-timur"]
    }
  ],
  "provinces": {
    "jawa-timur": {
      "id": "jawa-timur",
      "name": "Jawa Timur",
      "island": "jawa",
      "intro": "Jawa Timur mencakup tradisi Surabaya, Madiun, ...",
      "categories": {
        "makanan-khas": {
          "label": "Makanan khas",
          "cards": [
            {
              "id": "jawa-timur-makanan-khas-rawon",
              "title": "Rawon",
              "body": "Rawon adalah sup daging sapi berkuah gelap; ..."
            }
          ]
        },
        "pakaian-adat": { "label": "Pakaian adat", "cards": [ "..." ] },
        "tari-dan-seni": { "label": "Tari dan seni", "cards": [ "..." ] },
        "rumah-adat": { "label": "Rumah adat", "cards": [ "..." ] },
        "musik-tradisi": { "label": "Musik tradisi", "cards": [ "..." ] },
        "cerita-rakyat": { "label": "Cerita rakyat", "cards": [ "..." ] }
      },
      "quiz": [
        {
          "id": "jawa-timur-q1",
          "question": "Bumbu yang memberi warna gelap pada kuah rawon adalah apa?",
          "options": [
            { "id": "a", "text": "Kunyit" },
            { "id": "b", "text": "Kluwek yang diolah" },
            { "id": "c", "text": "Gula merah" },
            { "id": "d", "text": "Petis udang" }
          ],
          "correctOptionId": "b",
          "feedback": "Kluwek olahan membentuk warna dan rasa khas rawon."
        }
      ],
      "badge": "Penjelajah Jawa Timur",
      "references": [
        { "text": "Kementerian Pariwisata, ragam kuliner Jawa Timur", "url": "https://..." }
      ]
    }
  }
}
```

### 2.4 Validasi Wajib Saat Build

Pipeline **harus gagal (exit non-zero)** jika salah satu kondisi ini tidak terpenuhi — jangan biarkan data cacat lolos ke runtime:

- [ ] Jumlah provinsi total = 36
- [ ] Setiap provinsi punya tepat 6 kategori dengan slug yang konsisten di semua provinsi (`makanan-khas`, `pakaian-adat`, `tari-dan-seni`, `rumah-adat`, `musik-tradisi`, `cerita-rakyat`)
- [ ] Setiap provinsi punya tepat 10 soal kuis
- [ ] Setiap soal punya tepat 4 opsi dan `correctOptionId` yang valid (cocok dengan salah satu `options[].id`)
- [ ] Setiap kartu punya `title` dan `body` tidak kosong
- [ ] Setiap provinsi punya minimal 1 rujukan

## 3. Spesifikasi Layar (Screen Spec)

Penomoran layar mengikuti struktur `crumbs` pada prototype asli, diperluas untuk mendukung 36 provinsi.

### S-00 — Landing / Globe

- **Tujuan:** Titik masuk, membangun suasana, transisi ke peta Indonesia.
- **Elemen:** Globe 3D berputar otomatis (fallback: gambar bumi statis), tombol "Pilih Pulau Jawa" diganti menjadi tombol generik "Jelajahi Indonesia →", indikator lokasi Indonesia pada globe.
- **Interaksi:** Klik pada polygon Indonesia di globe ATAU tombol CTA → transisi ke S-01.
- **Kriteria penerimaan:** Globe dapat diputar; jika CDN gagal, fallback gambar statis tampil tanpa error di console yang menghentikan render.

### S-01 — Peta Indonesia (Kelompok Pulau)

- **Tujuan:** Pengguna memilih satu dari kelompok pulau.
- **Elemen:** Peta SVG Indonesia berwarna per kelompok pulau, legenda klik-pilih (chip) untuk 7 kelompok: Sumatra, Jawa, Kalimantan, Sulawesi, Bali-Nusa, Maluku, Papua.
- **Data terkait:** `islands[]` dari content.json.
- **Interaksi:** Hover → highlight kelompok pulau; klik pulau/provinsi pada peta ATAU klik chip legenda → S-02 dengan `island` terpilih.
- **Kriteria penerimaan:** Ketujuh kelompok pulau dapat dipilih; kelompok yang datanya tidak lengkap (mis. Maluku, lihat 05-Next-Steps §5) menampilkan pesan yang jujur, bukan halaman kosong/error.

### S-02 — Peta Provinsi (dalam satu Pulau)

- **Tujuan:** Pengguna memilih satu provinsi dari pulau yang dipilih di S-01.
- **Elemen:** Peta SVG provinsi-provinsi dalam pulau tsb, info jumlah provinsi terlihat, tombol audio suasana wilayah.
- **Data terkait:** `provinces` yang termasuk dalam `island.id` terpilih.
- **Interaksi:** Klik provinsi pada peta → S-03 dengan `province` terpilih. **Berbeda dari prototype awal**, tombol khusus "Jelajahi Jawa Timur" digeneralisasi menjadi tombol yang mengikuti provinsi yang di-hover/dipilih terakhir — lihat 04-Design §5.2 untuk variannya.
- **Kriteria penerimaan:** Semua provinsi dalam pulau tsb dapat dipilih dan mengarah ke provinsi yang benar (bukan selalu Jawa Timur seperti prototype awal).

### S-03 — Gerbang Provinsi

- **Tujuan:** Transisi naratif masuk ke provinsi terpilih (menggantikan hardcode "Masuk ke cerita Jawa Timur").
- **Elemen:** Nama provinsi, `intro` dari content.json, ilustrasi/orb bertuliskan nama provinsi (pola `.jatim-orb` digeneralisasi), tombol "Mulai Eksplorasi", tombol audio suasana.
- **Kriteria penerimaan:** Teks pengantar yang tampil adalah `province.intro` dari data, bukan teks hardcode provinsi lain.

### S-04 — Kategori Budaya

- **Tujuan:** Pengguna memilih satu dari 6 kategori budaya provinsi tsb.
- **Elemen:** Grid 6 kartu kategori (Makanan, Pakaian, Tari, Rumah, Musik, Cerita) masing-masing dengan ikon/emoji dan tombol suara singkat (mengikuti pola `playSfx` di prototype).
- **Kriteria penerimaan:** Keenam kategori dapat diklik dan seluruhnya mengarah ke S-05 (bukan hanya "Makanan Khas" yang aktif seperti prototype awal).

### S-05 — Daftar Kartu dalam Kategori

- **Tujuan:** Menampilkan 3–4 kartu budaya dalam kategori terpilih.
- **Elemen:** Satu kartu ditonjolkan besar (showcase, mengikuti pola `.big-food`), sisanya dalam daftar ringkas (mengikuti pola `.food-mini`).
- **Data terkait:** `category.cards[]`.
- **Kriteria penerimaan:** Jumlah kartu yang tampil sama dengan jumlah `####` pada markdown sumber untuk kategori tsb (3 atau 4, bervariasi per kategori/provinsi — jangan hardcode angka 4).

### S-06 — Detail Kartu

- **Tujuan:** Menampilkan isi lengkap satu kartu budaya.
- **Elemen:** Judul kartu, `body` lengkap (paragraf utuh, lihat §2.2), tombol narasi suara (SpeechSynthesis, mengikuti pola `speakRawon` digeneralisasi untuk kartu apa pun), tombol mulai Cultural Challenge.
- **Kriteria penerimaan:** Teks yang tampil adalah `body` utuh tanpa terpotong, termasuk kalimat kurasi/nuansa di dalamnya.

### S-07 — Cultural Challenge (Kuis)

- **Tujuan:** 10 soal pilihan ganda untuk provinsi yang sedang dijelajahi.
- **Elemen:** Progress bar (soal ke-N dari 10), 4 opsi jawaban, umpan balik langsung per soal, penguncian setelah menjawab (mengikuti pola `locked` di prototype).
- **Data terkait:** `province.quiz[]` — **bukan** array `quiz` hardcode 3 soal seperti prototype awal.
- **Kriteria penerimaan:** Tepat 10 soal ditampilkan berurutan untuk provinsi terkait; skor akhir dihitung benar; jawaban salah menampilkan opsi yang benar (mengikuti pola `.correct`/`.wrong`).

### S-08 — Hasil & Badge

- **Tujuan:** Menampilkan skor akhir dan lencana provinsi.
- **Elemen:** Skor `X/10`, badge dengan nama `province.badge`, tombol "Jelajahi Lagi" dan "Pilih Provinsi Lain" (bukan hanya "Pilih Budaya Lain" dalam provinsi yang sama seperti prototype awal — MVP perlu jalur balik ke S-02 atau S-01).
- **Kriteria penerimaan:** Badge yang tampil sesuai provinsi yang baru diselesaikan, bukan hardcode "Culture Explorer" generik tanpa nama provinsi.

## 4. Diagram Alur Navigasi

```
S-00 (Globe)
  └─▶ S-01 (Peta Pulau)
        └─▶ S-02 (Peta Provinsi dalam Pulau)
              └─▶ S-03 (Gerbang Provinsi)
                    └─▶ S-04 (6 Kategori Budaya)
                          └─▶ S-05 (Daftar Kartu Kategori)
                                └─▶ S-06 (Detail Kartu)
                                      └─▶ S-07 (Kuis 10 Soal)
                                            └─▶ S-08 (Hasil & Badge)
                                                  ├─▶ kembali ke S-04 (kategori lain, provinsi sama)
                                                  └─▶ kembali ke S-02 (provinsi lain)
```

Tombol "Kembali" (back) tersedia di semua layar kecuali S-00, mundur satu langkah dalam alur di atas — mengikuti pola `back()`/`current` pada prototype.

## 5. Spesifikasi Modul Audio

Mengikuti arsitektur `AudioContext` + `tone()`/`noise()` sintetis pada prototype, digeneralisasi:

- Setiap `island.id` memiliki motif nada (array frekuensi) sendiri — 7 motif untuk 7 kelompok pulau (sudah ada polanya di prototype: `motifs{}` dan `soundNames{}`), **tambahkan motif untuk provinsi yang belum ada** jika desain menginginkan motif per-provinsi, atau **pertahankan motif per-pulau** untuk MVP demi kesederhanaan (rekomendasi: per-pulau untuk MVP, lihat 05-Next-Steps).
- Efek suara kategori (`food`, `cloth`, `dance`, `wood`, `music`, `story`) dipertahankan apa adanya dari prototype — sudah general per kategori, bukan per provinsi.
- Narasi (`speakRawon` → generalisasi menjadi `speakCard(cardBody)`) memakai `SpeechSynthesis`, `lang='id-ID'`, harus mengecek dukungan browser sebelum dipanggil (`if ('speechSynthesis' in window)`).

## 6. Spesifikasi Modul Peta & Globe

Pertahankan sepenuhnya pendekatan teknis dari prototype (lihat kode asli untuk detail implementasi persis):

- `centroid()`, `islandFromCentroid()`, `projectPath()`, `bboxOf()` — logika proyeksi GeoJSON→SVG manual, terbukti bekerja, **jangan ditulis ulang**.
- Fallback offline (`renderFallbackIndonesia`, `renderFallbackIsland`) — **wajib dipertahankan** dan diperluas agar `renderFallbackIsland` bekerja untuk seluruh 7 kelompok pulau (sudah ada `sets{}` untuk semuanya di prototype — tinggal disambungkan ke provinsi asli dari content.json, bukan nama generik).

## 7. Kriteria Penerimaan MVP (Ringkasan Executable)

Checklist ini adalah superset dari 00-Brief §6, dirinci per-fitur untuk QA:

- [ ] `npm run build:content` (atau setara) menghasilkan `content.json` yang lolos seluruh validasi §2.4
- [ ] Navigasi S-00 → S-08 dapat dilakukan untuk **minimal 3 provinsi berbeda dari 3 pulau berbeda** tanpa error (uji sampel representatif sebelum uji penuh 36)
- [ ] Navigasi S-00 → S-08 dapat dilakukan untuk **seluruh 36 provinsi** (uji penuh sebelum rilis)
- [ ] Setiap kuis menampilkan tepat 10 soal milik provinsi yang benar
- [ ] Fallback peta & globe teruji dengan cara memblokir domain CDN terkait (mis. lewat DevTools network blocking) dan memastikan aplikasi tetap dapat dipakai
- [ ] Tampilan mobile (lebar ≤950px) diuji untuk minimal S-00, S-02, S-05, S-07
- [ ] Tidak ada teks kartu yang terpotong dibanding sumber markdown aslinya (spot-check acak 10 kartu)
