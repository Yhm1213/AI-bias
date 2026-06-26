import re

mapping_en_zh = {}
mapping_code_en = {}

with open('components/TileGridMap/world-countries-data.ts', 'r', encoding='utf-8') as f:
    data_content = f.read()

pattern = re.compile(r"'([A-Z]{2})':\s*\{\s*zh:\s*'([^']+)'")
for match in pattern.finditer(data_content):
    mapping_en_zh[match.group(1)] = match.group(2)

with open('components/TileGridMap/world-countries-full.ts', 'r', encoding='utf-8') as f:
    full_content = f.read()

pattern2 = re.compile(r'\{\s*"name":\s*"([^"]+)",\s*"alpha-2":\s*"([A-Z]{2})"([^}]+)\}')
for match in pattern2.finditer(full_content):
    mapping_code_en[match.group(2)] = match.group(1)

print(f"AR in zh: {mapping_en_zh.get('AR')}")
print(f"AR in en: {mapping_code_en.get('AR')}")

