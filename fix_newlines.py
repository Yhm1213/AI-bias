filepath = 'components/DataExplanation.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# I will replace the newlines inside the quotes with actual \n strings
# But wait, the easiest way is to use template literals `...` for the string that has newlines
import re
new_content = re.sub(r'("词语性别差异指数)\n(具体而言.*?)\n(看不懂没有关系.*?")', r'`\1\n\2\n\3`'.replace('"', ''), content)
new_content = re.sub(r'("Word Gender Difference Index)\n(Specifically.*?)\n(Don.*? bias.")', r'`\1\n\2\n\3`'.replace('"', ''), new_content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(new_content)
print('Fixed newlines')
