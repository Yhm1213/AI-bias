import re
filepath = 'components/DiscoverySlides.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace quotes around <Keyword> tags
# Match opening quote
content = re.sub(r'[“"]<Keyword', '<Keyword', content)

# Handle cases where punctuation is inside the quote like </Keyword>,"
content = re.sub(r'</Keyword>([,\.，。、])?["”]', r'</Keyword>\1', content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print('Replaced quotes around Keyword tags in DiscoverySlides.tsx')
