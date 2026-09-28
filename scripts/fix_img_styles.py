import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix Screen 5 dynamic image style
text = text.replace('style="max-height:250px;border-radius:20px;box-shadow:0 10px 30px rgba(0,0,0,.5);"', 'style="max-height:350px;object-fit:contain;filter:drop-shadow(0 20px 40px rgba(0,0,0,0.5));"')

# Fix Screen 6 detail image style (the scale transform and border radius is no longer needed if there's no frame)
text = text.replace('object-fit:contain;border-radius:25px;transform:scale(1.05)', 'object-fit:contain;filter:drop-shadow(0 20px 50px rgba(0,0,0,0.6));')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)
print('Done fixing image styles')
