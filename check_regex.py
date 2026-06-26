import re
with open('components/TileGridMap/world-countries-full.ts', 'r', encoding='utf-8') as f:
    full_content = f.read()

pattern2 = re.compile(r'\{\s*"name":\s*"([^"]+)",\s*"alpha-2":\s*"([A-Z]{2})"([^}]+)\}')
matches = list(pattern2.finditer(full_content))
print(f"Matched {len(matches)} in full_content")

with open('components/TileGridMap/world-countries-data.ts', 'r', encoding='utf-8') as f:
    data_content = f.read()

pattern = re.compile(r"'([A-Z]{2})':\s*\{\s*zh:\s*'([^']+)'")
matches1 = list(pattern.finditer(data_content))
print(f"Matched {len(matches1)} in data_content")
