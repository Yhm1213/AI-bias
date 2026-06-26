import re
with open('components/DataExplanation.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Current block:
#                 <div className="whitespace-pre-line">
#                   <div>{item.content}</div>
#                   {item.tableHeaders && item.tableRows && (
# ... table block ...
#                   )}
#                   {hoveredIndex === index && (
#                     <span ... BACK ... </span>
#                   )}
#                 </div>

# Replace to:
#                 <div className="whitespace-pre-line">
#                   <span>
#                     {item.content}
#                     {hoveredIndex === index && (
#                       <span ... BACK ... </span>
#                     )}
#                   </span>
#                   {item.tableHeaders && item.tableRows && (
# ... table block ...

pattern = re.compile(
    r'(<div className="whitespace-pre-line">)\s*'
    r'<div>(\{item\.content\})</div>\s*'
    r'(\{item\.tableHeaders && item\.tableRows && \(\s*'
    r'<div id=\{`data-table-scroll-\$\{item\.id\}`\}.*?</div>\s*'
    r'\)\})\s*'
    r'(\{hoveredIndex === index && \(\s*'
    r'<span\s*onClick=\{\(e\) => \{\s*'
    r'e\.stopPropagation\(\);\s*'
    r'onBack\(\);\s*'
    r'\}\}\s*'
    r'className="inline-block ml-3 px-1.5 py-0.5 border border-\[\#22c55e\]/50 text-\[\#22c55e\] text-\[10px\] cursor-pointer hover:bg-\[\#22c55e\] hover:text-\[\#121212\] font-mono uppercase tracking-widest align-middle transition-all select-none"\s*>\s*'
    r'BACK\s*'
    r'</span>\s*'
    r'\)\})', re.DOTALL)

def replacer(match):
    div_start = match.group(1)
    content_expr = match.group(2)
    table_block = match.group(3)
    back_block = match.group(4)
    
    return f"""{div_start}
                  <span>
                    {content_expr}
                    {back_block}
                  </span>
                  {table_block}"""

new_content = pattern.sub(replacer, content)

with open('components/DataExplanation.tsx', 'w', encoding='utf-8') as f:
    f.write(new_content)
    
print("Fixed BACK button layout")
