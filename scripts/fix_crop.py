import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

text = re.sub(r'<div class="credit">.*?</div>', '<div class="credit">Ragantara • Peta interaktif Natural Earth & geoBoundaries</div>', text)
text = text.replace('object-fit:cover;border-radius:25px', 'object-fit:contain;border-radius:25px;transform:scale(1.05)')
text = text.replace('height:360px;', 'height:400px;')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)
print('Done')
