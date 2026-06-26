filepath = 'components/DataExplanation.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

import re

# Remove the fixed toggle div
old_toggle = r'    \{\/\* 语言切换按钮 - 固定在右下角 \*\/\}.*?    </div>\n    </div>'
content = re.sub(old_toggle, '', content, flags=re.DOTALL)

# Insert the toggle inside the content wrapper, right after the items mapping
new_toggle = """
        {/* 语言切换按钮 - 放在内容的最底部右侧，随内容滚动 */}
        <div className="flex justify-end mt-12 pointer-events-auto">
          <div
            onClick={toggleLanguage}
            className="w-[146px] h-[25px] cursor-pointer drop-shadow-md hover:scale-105 transition-transform"
          >
            <img
              src={language === 'CN' ? (import.meta.env.BASE_URL + "ICON/language_zh.png") : (import.meta.env.BASE_URL + "ICON/language_en.png")}
              alt="Language Switch"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
"""

content = content.replace('        </div>\n      </div>\n\n      <style>', new_toggle + '        </div>\n      </div>\n\n      <style>')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print('Fixed toggle position')
