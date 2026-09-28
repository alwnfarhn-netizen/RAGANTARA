v = open('index.html', encoding='utf-8').read()

# Find and fix each category card one by one
# Replace the 5 cards that have no onclick with correct ones

categories = [
    ('pakaian-adat', 'cloth'),
    ('tari-dan-seni', 'dance'),
    ('rumah-adat', 'wood'),
    ('musik-tradisi', 'music'),
    ('cerita-rakyat', 'story'),
]

# Replace each empty culture-card button with the correct onclick
# The pattern is: <button class="culture-card"> (no onclick)
# We'll do it sequentially by finding each one

import re

# Get all the culture-card buttons in the category grid section
# Find the category-grid div
grid_start = v.find('<div class="category-grid">')
grid_end = v.find('</div>\n</section>', grid_start) + len('</div>\n</section>')
grid_section = v[grid_start:grid_end]

print("Grid section found:", len(grid_section), "chars")

# Fix each empty button
for slug, sound in categories:
    old = '<button class="culture-card">'
    new = f'<button class="culture-card" onclick="enterCategory(\'{slug}\')">'
    if old in grid_section:
        grid_section = grid_section.replace(old, new, 1)
        print(f"Fixed {slug}")
    else:
        print(f"NOT FOUND: {slug}")

# Put it back
v = v[:grid_start] + grid_section + v[grid_end:]

with open('index.html', 'w', encoding='utf-8', newline='\n') as f:
    f.write(v)

print('\nVerification:')
v2 = open('index.html', encoding='utf-8').read()
for slug, _ in categories:
    print(f"  {slug}:", f"enterCategory('{slug}')" in v2)
