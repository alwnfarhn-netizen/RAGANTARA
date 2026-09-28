import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

match = re.search(r'<section class="screen" data-step="5">.*?</section>', text, flags=re.DOTALL)
if match:
    print(match.group(0).encode('utf-8'))
