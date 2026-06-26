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

zh_to_en = {}
for code, zh in mapping_en_zh.items():
    if code in mapping_code_en:
        zh_to_en[zh] = mapping_code_en[code]

print(f"zh_to_en length: {len(zh_to_en)}")
print(f"Is 阿根廷 in zh_to_en? {'阿根廷' in zh_to_en}")
print(zh_to_en.get('阿根廷'))

