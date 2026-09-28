with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('<button class="btn secondary" onclick="playRegionPreview(\'Indonesia\')">🔊 Audio Nusantara</button>', '')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("Removed Audio Nusantara button")
