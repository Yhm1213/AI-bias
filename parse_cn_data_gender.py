import pandas as pd
import json

file_path = "ref/cn_data_20260414.xlsx"

df_woman = pd.read_excel(file_path, sheet_name="2. 女性共现表")
df_woman['gender'] = 'female'

df_man = pd.read_excel(file_path, sheet_name="3. 男性共现表")
df_man['gender'] = 'male'

df_combined = pd.concat([df_woman, df_man], ignore_index=True)

theme_names = ['“温柔”“美丽”的她', '“承担”“家务”的她', '“遵守”“规范”的她']

result = {}

for theme in theme_names:
    theme_data = df_combined[df_combined[theme] == True]
    
    links = []
    for _, row in theme_data.iterrows():
        if pd.isna(row['V1']) or pd.isna(row['V2']):
            continue
            
        link = {
            "Edges": str(row['Edges']),
            "Weight": float(row['Weight']) if not pd.isna(row['Weight']) else 1.0,
            "V1": str(row['V1']),
            "V2": str(row['V2']),
            "V1_deleted": bool(row.get('V1_deleted', False)),
            "V2_deleted": bool(row.get('V2_deleted', False)),
            "gender": row['gender']
        }
        
        for t in theme_names:
            val = row.get(t, False)
            link[t] = bool(val) if not pd.isna(val) else False
            
        links.append(link)
        
    result[theme] = links

with open('data/cn_network.json', 'w', encoding='utf-8') as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print("Saved data/cn_network.json with gender property")
