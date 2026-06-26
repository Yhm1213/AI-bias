import re
filepath = 'components/DataExplanation.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the inline button at the end of the flow
old_toggle_regex = r'\s*\{\/\* 语言切换按钮 - 在文档流最后.*?\*\/\}\n\s*<div className="w-full flex justify-end mt-12 mr-\[-1rem\] mb-\[-1rem\] md:mr-\[-2rem\] md:mb-\[-2rem\] z-50 pointer-events-auto">\n\s*<div\n\s*onClick=\{toggleLanguage\}\n\s*className="w-\[146px\] h-\[25px\] cursor-pointer drop-shadow-md hover:scale-105 transition-transform"\n\s*>\n\s*<img\n\s*src=\{language === \'CN\' \? \(import.meta.env.BASE_URL \+ "ICON/language_zh.png"\) : \(import.meta.env.BASE_URL \+ "ICON/language_en.png"\)\}\n\s*alt="Language Switch"\n\s*className="w-full h-full object-contain"\n\s*\/>\n\s*<\/div>\n\s*<\/div>'

content = re.sub(old_toggle_regex, '', content, flags=re.DOTALL)

# Insert the fixed button right before <style>
fixed_toggle = """
      {/* 语言切换按钮 - 固定在屏幕右下角，完全脱离文档流，点击时不会因为内容高度变化而发生跳动 */}
      <div className="fixed bottom-8 right-8 z-50 pointer-events-auto">
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

content = content.replace('      <style>', fixed_toggle + '\n      <style>')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print('Applied fixed toggle')
