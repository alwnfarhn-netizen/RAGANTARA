with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('<div class="info-box">Jalur demo<b>Jawa Timur</b></div>', '<div class="info-box">Cakupan<b>Seluruh Nusantara</b></div>')
text = text.replace('Pilih Pulau Jawa →', 'Mulai Petualangan →')
text = text.replace('🔊 Dengarkan', '🔊 Audio Nusantara')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("Done")
