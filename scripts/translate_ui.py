with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Screen 6
text = text.replace('Mulai Cultural Challenge', 'Mulai Tantangan Budaya')

# Screen 7
text = text.replace('<div class="eyebrow">Cultural Challenge</div>', '<div class="eyebrow">Tantangan Budaya</div>')

# Screen 8
text = text.replace('Culture Explorer!', 'Penjelajah Budaya!')
text = text.replace('Kamu berhasil menjelajahi Jawa Timur dan menyelesaikan tantangan budaya.', 'Kamu berhasil menyelesaikan tantangan budaya untuk wilayah ini.')

# JS replacement
text = text.replace('Kamu menjadi Culture Explorer!', 'Kamu menjadi Penjelajah Budaya!')

# Footer
text = text.replace('(fallback visual tersedia)', '(visual cadangan tersedia)')

# JS audio array (optional but good)
text = text.replace("'Metallophone'", "'Metalofon'")
text = text.replace("'Plucked gong'", "'Gong Petik'")
text = text.replace("'Gong rhythm'", "'Ritme Gong'")
text = text.replace("'Interlocking bells'", "'Lonceng Berpadu'")
text = text.replace("'Tifa pulse'", "'Ketukan Tifa'")
text = text.replace("'Archipelago motif'", "'Motif Nusantara'")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("Text translated successfully")
