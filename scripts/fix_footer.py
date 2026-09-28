import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('<script src="https://unpkg.com/globe.gl"></script>', '<script src="public/globe.gl.js"></script>')
text = text.replace('Prototipe V2 • peta online: Natural Earth + geoBoundaries (visual cadangan tersedia)', 'Ragantara • Peta interaktif Natural Earth & geoBoundaries')
text = text.replace('Prototype V2 • peta online: Natural Earth + geoBoundaries (fallback visual tersedia)', 'Ragantara • Peta interaktif Natural Earth & geoBoundaries')

# Clean up any leftover mojibake that might be rendered as strange symbols
text = text.replace('Ã¢â‚¬Â¢', '•')
text = text.replace('Ã¢â€šÂ¬Ã¢â€žÂ¢', "'")
text = text.replace('Ã°Å¸Â Å“', '🍜')
text = text.replace('Ã°Å¸â€˜Ëœ', '👘')
text = text.replace('Ã°Å¸â€™Æ’', '💃')
text = text.replace('Ã°Å¸Â Â ', '🏠')
text = text.replace('Ã°Å¸Â¥Â ', '🥁')
text = text.replace('Ã°Å¸â€œâ€“', '📖')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)
