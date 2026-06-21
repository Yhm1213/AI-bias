from fontTools.ttLib import TTFont

def has_chars(font_path, text):
    try:
        font = TTFont(font_path)
        has_cmap = False
        for cmap in font['cmap'].tables:
            if cmap.isUnicode():
                has_cmap = True
                missing = []
                for char in text:
                    if ord(char) not in cmap.cmap:
                        missing.append(char)
                if not missing:
                    print(f"Font {font_path} CONTAINS all characters in '{text}'.")
                    return
        print(f"Font {font_path} is MISSING characters: {missing}")
    except Exception as e:
        print(f"Error checking {font_path}: {e}")

text = "我们的初衷"
has_chars("public/Font/quan.ttf", text)
has_chars("public/Font/Lemi.ttf", text)
has_chars("public/Font/diandian.ttf", text)
