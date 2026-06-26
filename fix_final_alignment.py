import re
filepath = 'components/DataExplanation.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the absolute positioned toggle
toggle_regex = r'\s*\{\/\* 语言切换按钮 - 绝对定位在容器最右下角，跟随页面内容整体滚动 \*\/\}.*?</div>\n      </div>'
content = re.sub(toggle_regex, '', content, flags=re.DOTALL)

# Insert a new toggle at the end of the normal flow, right after the items mapping </div>
new_toggle = """
        {/* 语言切换按钮 - 在文档流最后，通过负边距抵消容器的 padding，使得在 md 以上屏幕距右边缘和底边缘刚好 2rem (对齐首页的 right-8 bottom-8) */}
        <div className="w-full flex justify-end mt-12 mr-[-1rem] mb-[-1rem] md:mr-[-2rem] md:mb-[-2rem] z-50 pointer-events-auto">
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

# The items list is inside <div className="space-y-8">...</div>
# And its parent is <div className="w-full md:w-2/3 md:ml-auto space-y-12 pt-32 md:pt-48 pb-32 px-8 md:px-16">
# We want to put it right at the end of the page, inside `data-explanation-page` but outside the inner container?
# If we put it outside the inner container, its parent is `data-explanation-page` which has `p-8 md:p-16`.
# So we can just put it right before `<style>`
content = content.replace('      <style>', new_toggle + '\n      <style>')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print('Fixed toggle alignment and flow')
