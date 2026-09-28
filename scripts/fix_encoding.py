
# Fix mojibake in index.html - re-encode from latin-1 to UTF-8
# and replace all broken HTML content with clean HTML entities

with open('index.html', 'rb') as f:
    raw = f.read()

# The file was saved as latin-1/windows-1252, decode it as such
try:
    text = raw.decode('utf-8')
    # Check if it still has mojibake
    if 'â€¢' in text or 'ðŸœ' in text:
        # Re-decode as latin-1
        text = raw.decode('latin-1')
except:
    text = raw.decode('latin-1')

# Fix all broken characters
fixes = [
    ('â€¢', '\u2022'),
    ('â†'', '\u2192'),
    ('â†»', '\u21bb'),
    ('â†', '\u2190'),
    ('ðŸœ', '\U0001F35C'),
    ('ðŸ\x9c\x9c', '\U0001F35C'),
    ('ðŸ\x91\x98', '\U0001F458'),
    ('ðŸ\x91\x83', '\U0001F483'),
    ('ðŸ ', '\U0001F3E0'),
    ('ðŸ\xa0', '\U0001F3E0'),
    ('ðŸ¥', '\U0001F941'),
    ('ðŸ\xa5\x81', '\U0001F941'),
    ('ðŸ\x94\x96', '\U0001F4D6'),
    ('ðŸ\x94\x8a', '\U0001F50A'),
    ('ðŸ\x94\x8b', '\U0001F50B'),
    ('ðŸ\x94\x88', '\U0001F508'),
    ('ðŸ²', '\U0001F372'),
    ('ðŸ\xb2', '\U0001F372'),
    ('ðŸ\xa5\x97', '\U0001F957'),
    ('ðŸ\x9b', '\U0001F35B'),
    ('ðŸ\xa5\xa3', '\U0001F963'),
    ('ðŸ\x8c\xbf', '\U0001F33F'),
    ('ðŸ\x8c\xb6\xef\xb8\x8f', '\U0001F336\uFE0F'),
    ('ðŸ\x8c\xb6', '\U0001F336'),
    ('ðŸ\xab\x98', '\U0001FAD8'),
    ('ðŸ\x92\x98', '\U0001F498'),
    ('ðŸ\x92\x83', '\U0001F483'),
    ('ã\x80\xb0', '\u3030'),
    # Also fix \u escape sequences that were not processed
]

for bad, good in fixes:
    text = text.replace(bad, good)

# Write as proper UTF-8
with open('index.html', 'w', encoding='utf-8', newline='') as f:
    f.write(text)

print('Done - fixed encoding')

# Verify
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()
    
print('Has bullet:', '\u2022' in content)
print('Has arrow:', '\u2192' in content)
print('Has noodle emoji:', '\U0001F35C' in content)
print('Still has mojibake:', 'â€¢' in content or 'ðŸœ' in content)
