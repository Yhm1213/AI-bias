import re

with open('components/DiscoverySlides.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for line in lines:
    matches = re.finditer(r'<Keyword id="([^"]+)" color="([^"]+)">([^<]+)</Keyword>', line)
    for match in matches:
        print(match.group(1), "||", match.group(3))
