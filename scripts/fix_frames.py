import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Remove glass from detail-card
text = text.replace('<div class="detail-card glass">', '<div class="detail-card">')

# Make detail-visual completely transparent, remove overflow:hidden
old_dv = """background:
 radial-gradient(circle at 50% 62%,rgba(255,203,97,.18),transparent 33%),
 linear-gradient(145deg,#142f49,#09192c);overflow:hidden"""
text = text.replace(old_dv, 'background:transparent;overflow:visible')

# Remove glass from big-food
text = text.replace('<div class="big-food glass">', '<div class="big-food">')

# Make big-food background transparent, remove border
old_bf = """background:
 radial-gradient(circle at 50% 42%,rgba(255,190,75,.20),transparent 30%),
 linear-gradient(150deg,rgba(255,255,255,.09),rgba(255,255,255,.025));border:1px solid var(--line)"""
text = text.replace(old_bf, 'background:transparent;border:none')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)
print('Done fixing frames')
