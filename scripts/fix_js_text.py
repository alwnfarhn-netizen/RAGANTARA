import re

with open('index.html', encoding='utf-8') as f:
    v = f.read()

v = v.replace('Ã¢â‚¬Â¢', '•')
v = v.replace('Jawa Timur • Gerbang Budaya', 'Provinsi • Gerbang Budaya')
v = v.replace('🔊 Suasana Jawa Timur', '🔊 Suasana Wilayah')
v = v.replace('Jawa Timur • Pilih Topik', 'Provinsi • Pilih Topik')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(v)

print('Done')
