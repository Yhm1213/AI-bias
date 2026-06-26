import re
filepath = 'components/DataExplanation.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Match the toggle we just inserted and remove it from its current position
toggle_regex = r'\s*\{\/\* 语言切换按钮 - 放在内容的最底部右侧，随内容滚动 \*\/\}.*?</div>\n        </div>'
content = re.sub(toggle_regex, '', content, flags=re.DOTALL)

# Now, insert it right before the `<style>` block, so it's a child of the main page wrapper
# We'll use absolute positioning so it aligns perfectly with the home page
new_toggle = """
      {/* 语言切换按钮 - 绝对定位在容器最右下角，跟随页面内容整体滚动 */}
      <div className="absolute bottom-8 right-8 z-50 pointer-events-auto">
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

content = content.replace('      <style>', new_toggle + '\n      <style>')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print('Fixed toggle alignment')
