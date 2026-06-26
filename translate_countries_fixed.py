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
    "佛得角": "Cabo Verde",
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
    zh_str_fixed = zh_str.replace("莫桑，比克", "莫桑比克")
    countries = zh_str_fixed.split('，')
    en_countries = []
    missing = []
    
    for c in countries:
        c = c.strip()
        if not c:
            continue
        if c in zh_to_en:
            en_countries.append(zh_to_en[c])
        else:
            missing.append(c)
            en_countries.append(c)
            
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

pattern = re.compile(r'(\[\s*language\s*===\s*\'CN\'\s*\?\s*"[^"]+"\s*:\s*"[^"]+"\s*,\s*)"([^"]+)"(\s*\])')
new_content = pattern.sub(replacer, data_content)

pattern2 = re.compile(r'(\[\s*language\s*===\s*\'CN\'\s*\?\s*"[^"]+"\s*:\s*"[^"]+"\s*,\s*"[^"]+"\s*,\s*)"([^"]+)"(\s*\])')
new_content = pattern2.sub(replacer, new_content)

with open('components/DataExplanation.tsx', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Translation applied.")
aliases.update({
    "乍得": "Chad",
    "科摩罗": "Comoros",
    "基里巴斯": "Kiribati",
    "图瓦卢": "Tuvalu",
    "多米尼克": "Dominica",
    "赤道几内亚": "Equatorial Guinea",
    "格林纳达": "Grenada",
    "马绍尔群岛": "Marshall Islands",
    "瑙鲁": "Nauru",
    "美属萨摩亚": "American Samoa",
    "阿鲁巴": "Aruba",
    "巴巴多斯": "Barbados",
    "库拉索": "Curaçao",
    "法属波利尼西亚": "French Polynesia",
    "圣卢西亚": "St. Lucia",
    "特克斯和凯科斯群岛": "Turks & Caicos Islands",
    "安道尔": "Andorra",
    "百慕大": "Bermuda",
    "开曼群岛": "Cayman Islands",
    "法罗群岛": "Faroe Islands",
    "香港特别行政区": "Hong Kong SAR",
    "澳门特别行政区": "Macao SAR",
    "摩纳哥": "Monaco",
    "新喀里多尼亚": "New Caledonia",
    "波多黎各": "Puerto Rico",
    "圣马丁岛（荷兰部分）": "Sint Maarten (Dutch part)",
    "科索沃": "Kosovo"
})
