import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# SCREEN 5 text
text = text.replace('Makanan utama dibuat jauh lebih besar agar menarik perhatian anak. Klik gambar Rawon untuk membuka halaman detail, atau tekan tombol suara untuk efek audio.', 'Pilih salah satu objek budaya di samping untuk melihat cerita, narasi, dan informasi lebih detail tentang warisan ini.')
text = text.replace('<button class="btn" onclick="go(6)">Buka Cerita Rawon →</button>', '')
text = text.replace('<button class="btn secondary" onclick="playSfx(\'food\')">🔊 Efek Makanan</button>', '')

# SCREEN 6 text
fact_grid = """    <div class="fact-grid">
      <div class="fact">Wilayah<b>Jawa Timur</b></div>
      <div class="fact">Ciri kuah<b>Gelap</b></div>
      <div class="fact">Bumbu khas<b>Keluak</b></div>
    </div>"""
text = text.replace(fact_grid, '')

caption = '<p style="font-size:13px;margin:14px 5px 0">Contoh desain objek budaya: ilustrasi utama bergerak, bahan mengambang, efek suara, dan narasi dapat dimainkan langsung.</p>'
text = text.replace(caption, '')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print('Cleaned up hardcoded UI texts in S5 and S6')
