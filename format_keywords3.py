import re

with open('components/DiscoverySlides.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

dict_map = {
    "温柔": ("温柔", "Gentle"),
    "装饰": ("装饰", "Decorative"),
    "高大": ("高大", "Tall"),
    "力量": ("力量", "Power"),
    "优雅": ("优雅", "Elegant"),
    "坚韧": ("坚韧", "Resilient"),
    "勇敢": ("勇敢", "Brave"),
    "强": ("强", "Strong"),
    "头巾": ("头巾", "Headscarf"),
    "长袍": ("长袍", "Robe"),
    "时尚": ("时尚", "Fashion"),
    "强壮": ("强壮", "Strong"),
    "照顾": ("照顾", "Care"),
    "热爱": ("热爱", "Love"),
    "核心": ("核心", "Core"),
    "和谐": ("和谐", "Harmony"),
    "喜欢": ("喜欢", "Like"),
    "足球": ("足球", "Football"),
    "体育": ("体育", "Sports"),
    "户外活动": ("户外活动", "Outdoor activities"),
    "责任感": ("责任感", "Sense of responsibility"),
    "遵守": ("遵守", "Comply"),
    "开拓": ("开拓", "Pioneering"),
    "扮演": ("扮演", "Playing a role"),
    "传统": ("传统", "Traditional"),
    "职业": ("职业", "Profession"),
    "商业": ("商业", "Business"),
    "社会": ("社会", "Social"),
    "平等": ("平等", "Equality"),
    "教育": ("教育", "Education"),
    "独立": ("独立", "Independence"),
    "经济": ("经济", "Economy"),
    "传承": ("文化传承", "Cultural inheritance"),

    "grace": ("优雅", "Grace"),
    "influence": ("影响力", "Influence"),
    "resilience": ("韧性", "Resilience"),
    "poise": ("风度", "Poise"),
    "confidence": ("自信", "Confidence"),
    "individual": ("个体", "Individual"),
    "intellectual": ("智力特质", "Intellectual"),
    "care": ("关怀", "Care"),
    "explore": ("探索", "Explore"),
    "community": ("社区", "Community"),
    "balance": ("平衡", "Balance"),
    "education": ("教育", "Education"),
    "diplomacy": ("外交", "Diplomacy"),
    "technology": ("科技", "Technology"),
    "advocacy": ("抗争", "Advocacy"),
    "strategy": ("策略", "Strategy"),
    "equality": ("平等", "Equality"),
    "empowerment": ("赋权", "Empowerment"),
    "advocate": ("倡议", "Advocate"),
    "strategic": ("策略", "Strategic"),
    "geopolitical": ("地缘政治", "Geopolitical"),
    "perspective": ("视野", "Perspective")
}

sections = []
current_lang = 'CN'
for line in content.split('\n'):
    if 'const CN_GENDER_BIAS_DATA_CN =' in line or 'const EN_GENDER_BIAS_DATA_CN =' in line:
        current_lang = 'CN'
    elif 'const CN_GENDER_BIAS_DATA_EN =' in line or 'const EN_GENDER_BIAS_DATA_EN =' in line:
        current_lang = 'EN'
    
    def replacer(match):
        full_tag = match.group(0)
        kw_id = match.group(1)
        color = match.group(2)
        inner_text = match.group(3)
        
        zh, en = dict_map.get(kw_id, (kw_id, kw_id))
        
        if current_lang == 'CN':
            bilingual_text = f"{zh}（{en}）"
        else:
            en_cap = en[0].upper() + en[1:] if en else en
            bilingual_text = f"{en_cap} ({zh})"
            
        count_str = ""
        
        # 1. format like （XX次 vs XX次）, （XX次）
        # Now using (?:次|times) instead of character class
        m1 = re.search(r'（(.*?(?:次|times).*?)）', inner_text, re.IGNORECASE)
        # 2. format like ，XX次
        m2 = re.search(r'，(.*?(?:次|times).*)', inner_text, re.IGNORECASE)
        # 3. format like (XX times), (XX vs. XX times)
        m3 = re.search(r'\((.*?(?:次|times).*?)\)', inner_text, re.IGNORECASE)
        
        if m1:
            count_str = m1.group(1)
        elif m2:
            count_str = m2.group(1)
        elif m3:
            count_str = m3.group(1)
            
        if count_str:
            if current_lang == 'CN':
                suffix = f"（{count_str}）"
            else:
                suffix = f" ({count_str})"
            return f'<Keyword id="{kw_id}" color="{color}">{bilingual_text}</Keyword>{suffix}'
        else:
            return f'<Keyword id="{kw_id}" color="{color}">{bilingual_text}</Keyword>'

    new_line = re.sub(r'<Keyword id="([^"]+)" color="([^"]+)">([^<]+)</Keyword>', replacer, line)
    sections.append(new_line)

with open('components/DiscoverySlides.tsx', 'w', encoding='utf-8') as f:
    f.write('\n'.join(sections))

print("Formatted keywords 3.")
