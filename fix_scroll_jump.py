import re
filepath = 'components/DataExplanation.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the fixed toggle
fixed_toggle_regex = r'\s*\{\/\* 语言切换按钮 - 固定在屏幕右下角.*?\*\/\}\n\s*<div className="fixed bottom-8 right-8 z-50 pointer-events-auto">\n\s*<div\n\s*onClick=\{toggleLanguage\}\n\s*className="w-\[146px\] h-\[25px\] cursor-pointer drop-shadow-md hover:scale-105 transition-transform"\n\s*>\n\s*<img\n\s*src=\{language === \'CN\' \? \(import.meta.env.BASE_URL \+ "ICON/language_zh.png"\) : \(import.meta.env.BASE_URL \+ "ICON/language_en.png"\)\}\n\s*alt="Language Switch"\n\s*className="w-full h-full object-contain"\n\s*\/>\n\s*<\/div>\n\s*<\/div>'

content = re.sub(fixed_toggle_regex, '', content, flags=re.DOTALL)

# Insert the smart scrolling toggle at the end of the flow
smart_toggle = """
        {/* 语言切换按钮 - 位于文档流末尾。使用智能滚动保持底部相对位置，防止中英文长度不同导致的跳动 */}
        <div className="w-full flex justify-end mt-12 mr-[-1rem] mb-[-1rem] md:mr-[-2rem] md:mb-[-2rem] z-50 pointer-events-auto">
          <div
            onClick={(e) => {
              const container = document.getElementById('data-explanation-page');
              if (container) {
                // Record the distance from the bottom of the scroll container
                const distanceFromBottom = container.scrollHeight - container.scrollTop;
                toggleLanguage();
                
                // After React re-renders with the new text, restore the distance from the bottom
                // This keeps the button exactly under the user's mouse!
                setTimeout(() => {
                  container.scrollTop = container.scrollHeight - distanceFromBottom;
                }, 0);
              } else {
                toggleLanguage();
              }
            }}
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

content = content.replace('      <style>', smart_toggle + '\n      <style>')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print('Applied smart scroll toggle')
