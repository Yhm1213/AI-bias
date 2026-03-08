import pandas as pd
import json
import math

# Use the correct file path
file_path = "ref/en_data.xlsx"

# Load sheets
df_woman = pd.read_excel(file_path, sheet_name="co-occur-woman")
df_man = pd.read_excel(file_path, sheet_name="co-occur-man")

# Combine them
df_combined = pd.concat([df_woman, df_man], ignore_index=True)

# The themes are the last 3 columns
theme_names = ['优雅的女性', '“care”的她', '“advocacy”的她']

result = {}

for theme in theme_names:
    # Filter rows where the theme is True
    # In some pandas versions, these might be strings like 'True' or booleans or 1/0
    theme_data = df_combined[df_combined[theme] == True]
    
    links = []
    for _, row in theme_data.iterrows():
        # Avoid NaN errors
        if pd.isna(row['V1']) or pd.isna(row['V2']):
            continue
            
        link = {
            "Edges": str(row['Edges']),
            "Weight": float(row['Weight']) if not pd.isna(row['Weight']) else 1.0,
            "V1": str(row['V1']),
            "V2": str(row['V2']),
            "V1_deleted": bool(row.get('V1_deleted', False)),
            "V2_deleted": bool(row.get('V2_deleted', False)),
        }
        
        # Also need to add the theme boolean itself to match NetworkScrolly logic
        for t in theme_names:
            val = row.get(t, False)
            link[t] = bool(val) if not pd.isna(val) else False
            
        links.append(link)
        
    result[theme] = links

# Save to JSON
with open('data/en_network.json', 'w', encoding='utf-8') as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print("Saved data/en_network.json")
