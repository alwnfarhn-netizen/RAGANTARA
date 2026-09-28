import re

v = open('index.html', encoding='utf-8').read()

# Fix category grid - add onclick to all cards
old_grid = '''  <div class="category-grid">
    <button class="culture-card" onclick="go(5)">
      <div class="card-visual">\U0001F35C</div><div class="card-bottom"><div><strong>Makanan Khas</strong><small>Rasa, asal, dan cerita</small></div><span class="sound-dot" onclick="event.stopPropagation();playSfx(\'food\')">\U0001F50A</span></div>
    </button>
    <button class="culture-card">
      <div class="card-visual">\U0001F458</div><div class="card-bottom"><div><strong>Pakaian Adat</strong><small>Motif dan filosofi</small></div><span class="sound-dot" onclick="event.stopPropagation();playSfx(\'cloth\')">\U0001F50A</span></div>
    </button>
    <button class="culture-card">
      <div class="card-visual">\U0001F483</div><div class="card-bottom"><div><strong>Tari &amp; Seni</strong><small>Gerak, ritme, makna</small></div><span class="sound-dot" onclick="event.stopPropagation();playSfx(\'dance\')">\U0001F50A</span></div>
    </button>
    <button class="culture-card">
      <div class="card-visual">\U0001F3E0</div><div class="card-bottom"><div><strong>Rumah Adat</strong><small>Ruang dan arsitektur</small></div><span class="sound-dot" onclick="event.stopPropagation();playSfx(\'wood\')">\U0001F50A</span></div>
    </button>
    <button class="culture-card">
      <div class="card-visual">\U0001F941</div><div class="card-bottom"><div><strong>Musik Tradisi</strong><small>Bunyi dan instrumen</small></div><span class="sound-dot" onclick="event.stopPropagation();playSfx(\'music\')">\U0001F50A</span></div>
    </button>
    <button class="culture-card">
      <div class="card-visual">\U0001F4D6</div><div class="card-bottom"><div><strong>Cerita &amp; Tradisi</strong><small>Warisan dan nilai</small></div><span class="sound-dot" onclick="event.stopPropagation();playSfx(\'story\')">\U0001F50A</span></div>
    </button>
  </div>
</section>'''

new_grid = '''  <div class="category-grid">
    <button class="culture-card" onclick="enterCategory('makanan-khas')">
      <div class="card-visual">\U0001F35C</div><div class="card-bottom"><div><strong>Makanan Khas</strong><small>Rasa, asal, dan cerita</small></div><span class="sound-dot" onclick="event.stopPropagation();playSfx('food')">\U0001F50A</span></div>
    </button>
    <button class="culture-card" onclick="enterCategory('pakaian-adat')">
      <div class="card-visual">\U0001F458</div><div class="card-bottom"><div><strong>Pakaian Adat</strong><small>Motif dan filosofi</small></div><span class="sound-dot" onclick="event.stopPropagation();playSfx('cloth')">\U0001F50A</span></div>
    </button>
    <button class="culture-card" onclick="enterCategory('tari-dan-seni')">
      <div class="card-visual">\U0001F483</div><div class="card-bottom"><div><strong>Tari &amp; Seni</strong><small>Gerak, ritme, makna</small></div><span class="sound-dot" onclick="event.stopPropagation();playSfx('dance')">\U0001F50A</span></div>
    </button>
    <button class="culture-card" onclick="enterCategory('rumah-adat')">
      <div class="card-visual">\U0001F3E0</div><div class="card-bottom"><div><strong>Rumah Adat</strong><small>Ruang dan arsitektur</small></div><span class="sound-dot" onclick="event.stopPropagation();playSfx('wood')">\U0001F50A</span></div>
    </button>
    <button class="culture-card" onclick="enterCategory('musik-tradisi')">
      <div class="card-visual">\U0001F941</div><div class="card-bottom"><div><strong>Musik Tradisi</strong><small>Bunyi dan instrumen</small></div><span class="sound-dot" onclick="event.stopPropagation();playSfx('music')">\U0001F50A</span></div>
    </button>
    <button class="culture-card" onclick="enterCategory('cerita-rakyat')">
      <div class="card-visual">\U0001F4D6</div><div class="card-bottom"><div><strong>Cerita Rakyat</strong><small>Warisan dan nilai</small></div><span class="sound-dot" onclick="event.stopPropagation();playSfx('story')">\U0001F50A</span></div>
    </button>
  </div>
</section>'''

# Also fix Screen 3 audio button to be dynamic (remove hardcoded Jawa Timur)
# and fix Screen 1 island selection
v = v.replace("onclick=\"selectIsland('Jawa')\"", "onclick=\"selectIsland('jawa')\"")

# Fix category grid
if old_grid in v:
    v = v.replace(old_grid, new_grid)
    print('Grid replaced successfully')
else:
    print('Grid NOT found - trying partial replace')
    # Try to find and fix just the onclick attributes
    v = v.replace("onclick=\"go(5)\">\n      <div class=\"card-visual\">\U0001F35C", 
                  "onclick=\"enterCategory('makanan-khas')\">\n      <div class=\"card-visual\">\U0001F35C")
    print('Partial fix applied')

# Fix Screen 3 secondary button
v = v.replace("playRegionPreview('Jawa Timur')", "playRegionPreview(ISLAND_LABEL[currentIsland]||'Indonesia')")

# Write back
with open('index.html', 'w', encoding='utf-8', newline='\n') as f:
    f.write(v)

print('Done writing')

# Verify
v2 = open('index.html', encoding='utf-8').read()
print('tari-dan-seni:', "enterCategory('tari-dan-seni')" in v2)
print('musik-tradisi:', "enterCategory('musik-tradisi')" in v2)
print('makanan-khas card:', "enterCategory('makanan-khas')" in v2)
