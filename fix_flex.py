import re
with open('components/DataExplanation.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace:
# <div className="whitespace-pre-line">
# with:
# <div className="whitespace-pre-line flex-1 min-w-0">
# But only the one inside the items map!

# We can just do a regex replace for exactly that context
pattern = re.compile(r'(<div className="flex gap-4">\s*<span[^>]*>.*?</span>\s*\{/\* Content \*/\}\s*<div className="whitespace-pre-line)(">)', re.DOTALL)

def replacer(match):
    return match.group(1) + ' flex-1 min-w-0' + match.group(2)

new_content = pattern.sub(replacer, content)

with open('components/DataExplanation.tsx', 'w', encoding='utf-8') as f:
    f.write(new_content)
    
print("Fixed flex overflow")
