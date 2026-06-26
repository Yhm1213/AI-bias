import re
with open('components/DataExplanation.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace:
# <table className="min-w-[720px] border-collapse text-left">
# with:
# <table className="w-full border-collapse text-left break-words">

new_content = content.replace(
    '<table className="min-w-[720px] border-collapse text-left">',
    '<table className="w-full min-w-full border-collapse text-left break-words">'
)

with open('components/DataExplanation.tsx', 'w', encoding='utf-8') as f:
    f.write(new_content)
print("Fixed table width")
