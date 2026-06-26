filepath = 'components/DataExplanation.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

import re

# Remove the old custom div language toggle
old_toggle = r'    \{\/\* Language Toggle Button - Fixed at top right \*\/\}.*?    </div>\n    </div>'
content = re.sub(old_toggle, '', content, flags=re.DOTALL)

# Insert the new language toggle from DiscoverySlides at the same position, which is before the final </>
new_toggle = """
    {/* 语言切换按钮 - 固定在右下角 */}
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 pointer-events-auto">
      <div
        onClick={toggleLanguage}
        className="w-[146px] h-[25px] cursor-pointer drop-shadow-md"
      >
        <img
          src={language === 'CN' ? (import.meta.env.BASE_URL + "ICON/language_zh.png") : (import.meta.env.BASE_URL + "ICON/language_en.png")}
          alt="Language Switch"
          className="w-full h-full object-contain"
        />
      </div>
    </div>
"""

content = content.replace('    </>\n  );\n};\n\nexport default DataExplanation;', new_toggle + '    </>\n  );\n};\n\nexport default DataExplanation;')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print('Fixed language toggle button')
