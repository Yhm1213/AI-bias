from fontTools.ttLib import TTFont
font = TTFont("public/Font/unifont-15.0.06.otf")
for record in font['name'].names:
    if record.nameID == 4:
        print(record.toUnicode())
        break
