import re

mapping_en_zh = {} # Code -> zh
mapping_code_en = {} # Code -> en

with open('components/TileGridMap/world-countries-data.ts', 'r', encoding='utf-8') as f:
    data_content = f.read()

pattern = re.compile(r"'([A-Z]{2})':\s*\{\s*zh:\s*'([^']+)'")
for match in pattern.finditer(data_content):
    code, zh = match.groups()
    mapping_en_zh[code] = zh

with open('components/TileGridMap/world-countries-full.ts', 'r', encoding='utf-8') as f:
    full_content = f.read()

pattern2 = re.compile(r'\{\s*"name":\s*"([^"]+)",\s*"alpha-2":\s*"([A-Z]{2})"([^}]+)\}')
for match in pattern2.finditer(full_content):
    en, code, _ = match.groups()
    mapping_code_en[code] = en
    
# Also some countries are manually named, e.g. "Egypt" instead of "Egypt"
# Let's see what "探索8000条回答" uses for country names. 
# It uses the `name` field from world-countries-full.ts.

zh_to_en = {}
for code, zh in mapping_en_zh.items():
    if code in mapping_code_en:
        zh_to_en[zh] = mapping_code_en[code]

print(f"Built mapping dictionary with {len(zh_to_en)} entries.")

# Some names in DataExplanation might not perfectly match the zh in countryNameMap.
# e.g., "埃及阿拉伯共和国" vs "埃及" (Egypt)
# Let's add aliases for missing ones in DataExplanation.tsx
aliases = {
    "埃及阿拉伯共和国": "Egypt",
    "老挝人民民主共和国": "Lao People's Democratic Republic",
    "刚果民主共和国": "Congo (Democratic Republic of the)",
    "刚果共和国": "Congo",
    "斯威士兰": "Swaziland",
    "密克罗尼西亚联邦": "Micronesia (Federated States of)",
    "圣多美和普林西比": "Sao Tome and Principe",
    "东帝汶": "Timor-Leste",
    "文莱达鲁萨兰国": "Brunei Darussalam",
    "西岸和加沙地带": "Palestine, State of",
    "阿联酋": "United Arab Emirates",
    "玻利维亚多民族国": "Bolivia",
    "伊朗伊斯兰共和国": "Iran (Islamic Republic of)",
    "俄罗斯联邦": "Russian Federation",
    "韩国": "South Korea",
    "委内瑞拉玻利瓦尔共和国": "Venezuela",
    "苏里南": "Suriname",
    "南非": "South Africa",
    "科特迪瓦": "Côte d'Ivoire",
    "安提瓜和巴布达": "Antigua & Barbuda",
    "玻利维亚": "Bolivia",
    "佛得角": "Cabo Verde", # in world-countries-full.ts it's Cabo Verde
    "圣基茨和尼维斯": "St. Kitts & Nevis",
    "圣文森特和格林纳丁斯": "St. Vincent & the Grenadines",
    "特立尼达和多巴哥": "Trinidad & Tobago",
    "叙利亚阿拉伯共和国": "Syria",
    "几内亚比绍": "Guinea-Bissau",
    "中非共和国": "Central African Republic",
    "捷克共和国": "Czech Republic",
    "斯洛伐克共和国": "Slovakia",
    "波斯尼亚和黑塞哥维那": "Bosnia & Herzegovina"
}

for zh, en in aliases.items():
    zh_to_en[zh] = en

def translate_list(zh_str):
    countries = zh_str.split('，')
    en_countries = []
    missing = []
    
    # Check for "莫桑，比克" typo in data
    zh_str_fixed = zh_str.replace("莫桑，比克", "莫桑比克")
    countries = zh_str_fixed.split('，')
    
    for c in countries:
        c = c.strip()
        if not c:
            continue
        if c in zh_to_en:
            en_countries.append(zh_to_en[c])
        else:
            missing.append(c)
            en_countries.append(c) # Fallback to zh
            
    if missing:
        print(f"Missing mapping for: {missing}")
    return ', '.join(en_countries)

with open('components/DataExplanation.tsx', 'r', encoding='utf-8') as f:
    data_content = f.read()

def replacer(match):
    prefix = match.group(1)
    zh_list = match.group(2)
    suffix = match.group(3)
    en_list = translate_list(zh_list)
    return f'{prefix}language === \'CN\' ? "{zh_list}" : "{en_list}"{suffix}'

# Match arrays with length 3: [language === 'CN' ? "分组1——低人均GDP组" : "Group 1 - Low GDP per capita", "贝宁，..."]
pattern = re.compile(r'(\[\s*language\s*===\s*\'CN\'\s*\?\s*"[^"]+"\s*:\s*"[^"]+"\s*,\s*)"([^"]+)"(\s*\])')
new_content = pattern.sub(replacer, data_content)

# Match arrays with length 4: [language === 'CN' ? "第一组" : "Group 1", "26.25_65.5", "阿尔及利亚，..."]
pattern2 = re.compile(r'(\[\s*language\s*===\s*\'CN\'\s*\?\s*"[^"]+"\s*:\s*"[^"]+"\s*,\s*"[^"]+"\s*,\s*)"([^"]+)"(\s*\])')
new_content = pattern2.sub(replacer, new_content)

with open('components/DataExplanation.tsx', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Translation applied.")
