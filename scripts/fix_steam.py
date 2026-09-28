import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('<span class="steam">\\u301c \\u301c \\u301c</span>', '${slug==="makanan-khas" ? \'<span class="steam">\\u301c \\u301c \\u301c</span>\' : \'\'}')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)
print('Done removing steam from non-food')
