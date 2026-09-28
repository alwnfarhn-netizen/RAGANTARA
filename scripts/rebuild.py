import re

# Read clean prototype as UTF-8
src = open('docs/ragantara.html', encoding='utf-8').read()

# Read the current broken index.html as latin-1 to get the JS
cur = open('index.html', encoding='latin-1').read()

# Extract the <script> block from current index.html
script_match = re.search(r'<script>(.*?)</script>', cur, re.DOTALL)
if script_match:
    new_script = script_match.group(1)
    print('Script found, length:', len(new_script))
else:
    print('Script NOT found')
    exit(1)

# Replace old script in prototype with our new script
result = re.sub(r'<script>.*?</script>', lambda m: '<script>' + new_script + '</script>', src, flags=re.DOTALL)

# Fix category card buttons - Screen 1 use correct island slugs
result = result.replace("selectIsland('Jawa')", "selectIsland('jawa')")

# Fix Screen 3 - Mulai Eksplorasi goes to enterExplore()
result = result.replace("onclick=\"go(4)\"", "onclick=\"enterExplore()\"")
result = result.replace("onclick=\"enterEastJava()\"", "onclick=\"enterProvince()\"")

# Fix Screen 4 - first button shortcut to Makanan Khas
result = result.replace("onclick=\"go(5)\"", "onclick=\"enterCategory('makanan-khas')\"", 1)

# Fix category slugs in cards - match the content.json schema
result = result.replace("enterCategory('tari-tradisional')", "enterCategory('tari-dan-seni')")
result = result.replace("enterCategory('musik-tradisional')", "enterCategory('musik-tradisi')")

# Write back as UTF-8
with open('index.html', 'w', encoding='utf-8', newline='\n') as f:
    f.write(result)

print('Done! Written', len(result), 'chars')

# Verify
v = open('index.html', encoding='utf-8').read()
print('Bullet ok:', '\u2022' in v)
print('Noodle emoji ok:', '\U0001F35C' in v)
print('Arrow ok:', '\u2192' in v)
print('Mojibake:', 'â€¢' in v)
print('tari-dan-seni:', "enterCategory('tari-dan-seni')" in v)
print('enterExplore:', 'enterExplore()' in v)
