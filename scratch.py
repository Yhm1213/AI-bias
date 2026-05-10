import re

with open('components/DiscoverySlides.tsx', 'r') as f:
    content = f.read()

# 1. Duplicate GENDER_BIAS_DATA
match_gbd = re.search(r'const GENDER_BIAS_DATA = \[(.*?)\];\n', content, re.DOTALL)
if match_gbd:
    gbd_content = match_gbd.group(1)
    new_gbd = f"const GENDER_BIAS_DATA_CN = [{gbd_content}];\n\n  const GENDER_BIAS_DATA_EN = [{gbd_content}];\n"
    content = content.replace(match_gbd.group(0), new_gbd)

# 2. Duplicate EN_GENDER_BIAS_DATA
match_egbd = re.search(r'const EN_GENDER_BIAS_DATA = \[(.*?)\];\n', content, re.DOTALL)
if match_egbd:
    egbd_content = match_egbd.group(1)
    new_egbd = f"const EN_GENDER_BIAS_DATA_CN = [{egbd_content}];\n\n  const EN_GENDER_BIAS_DATA_EN = [{egbd_content}];\n"
    content = content.replace(match_egbd.group(0), new_egbd)

# 3. Replace usages of GENDER_BIAS_DATA and EN_GENDER_BIAS_DATA
content = content.replace('slides={GENDER_BIAS_DATA}', "slides={language === 'CN' ? GENDER_BIAS_DATA_CN : GENDER_BIAS_DATA_EN}")
content = content.replace('slides={EN_GENDER_BIAS_DATA}', "slides={language === 'CN' ? EN_GENDER_BIAS_DATA_CN : EN_GENDER_BIAS_DATA_EN}")

# 4. Replace PAGE_3_EXIT_CONTENT texts
page3_target = """          <p className="mb-4">
            再来看看英文语境下AI语言中的性别差异。<br />
            我们将chatgpt对于男性和女性的描述分词，经过清洗和筛选后获得756个英文词汇<span
              id="citation-3"
              onClick={() => onGoToData(3)}
              className="inline-flex items-center justify-center bg-[#22c55e] text-[#121212] rounded-full w-4 h-4 text-[10px] font-bold ml-1 transform -translate-y-1 cursor-pointer hover:scale-125 transition-transform"
            >3</span>。我们观察这些词，最终发现了如下差异：
          </p>"""
page3_replace = """          <p className="mb-4">
            {t('discovery.page3_exit.p1_1')}<br />
            {t('discovery.page3_exit.p1_2_before')}<span
              id="citation-3"
              onClick={() => onGoToData(3)}
              className="inline-flex items-center justify-center bg-[#22c55e] text-[#121212] rounded-full w-4 h-4 text-[10px] font-bold ml-1 transform -translate-y-1 cursor-pointer hover:scale-125 transition-transform"
            >3</span>{t('discovery.page3_exit.p1_2_after')}{t('discovery.page3_exit.p1_3')}
          </p>"""
content = content.replace(page3_target, page3_replace)

# 5. Replace Slide 6 text
slide6_target = """            <p className="mb-6 text-left">
              如果说模型中的性别词汇揭示了文化与语言的差异，那么当这些语言落在不同经济体中，又会如何与全球的经济结构产生共鸣与冲突？
            </p>
            <p className="mb-4 text-left">
              为更深入地展开讨论，我们引入了人均GDP（GDP per capita）以交叉分析，这是被广泛用于衡量一国居民平均生活水平提高或恶化的指标
              <span
                id="citation-5"
                onClick={() => onGoToData(5)}
                className="inline-flex items-center justify-center bg-[#22c55e] text-[#121212] rounded-full w-4 h-4 text-[10px] font-bold ml-1 transform -translate-y-1 cursor-pointer hover:scale-125 transition-transform"
              >5</span>
              。我们将2023年各国的人均GDP从低到高排序，把前述196个国家和地区等分为5组（低、低中、中、中高、高）
              <span
                id="citation-6"
                onClick={() => onGoToData(6)}
                className="inline-flex items-center justify-center bg-[#22c55e] text-[#121212] rounded-full w-4 h-4 text-[10px] font-bold ml-1 transform -translate-y-1 cursor-pointer hover:scale-125 transition-transform"
              >6</span>
              ，依照此分组和大模型的描述文本展开交叉分析，探究在不同经济水平下，大语言模型对男性和女性劳动角色与生活方式等多方面的差异化描述。
              <span className="inline-flex items-center ml-4 translate-y-2">
                <img src={import.meta.env.BASE_URL + "ICON/binoculars_wh.png"} alt="binoculars" className="w-12 h-auto object-contain" />
              </span>
            </p>"""
slide6_replace = """            <p className="mb-6 text-left">
              {t('discovery.slide6.p1')}
            </p>
            <p className="mb-4 text-left">
              {t('discovery.slide6.p2_before')}
              <span
                id="citation-5"
                onClick={() => onGoToData(5)}
                className="inline-flex items-center justify-center bg-[#22c55e] text-[#121212] rounded-full w-4 h-4 text-[10px] font-bold ml-1 transform -translate-y-1 cursor-pointer hover:scale-125 transition-transform"
              >5</span>
              {t('discovery.slide6.p2_middle')}
              <span
                id="citation-6"
                onClick={() => onGoToData(6)}
                className="inline-flex items-center justify-center bg-[#22c55e] text-[#121212] rounded-full w-4 h-4 text-[10px] font-bold ml-1 transform -translate-y-1 cursor-pointer hover:scale-125 transition-transform"
              >6</span>
              {t('discovery.slide6.p2_after')}
              <span className="inline-flex items-center ml-4 translate-y-2">
                <img src={import.meta.env.BASE_URL + "ICON/binoculars_wh.png"} alt="binoculars" className="w-12 h-auto object-contain" />
              </span>
            </p>"""
content = content.replace(slide6_target, slide6_replace)

# 6. Replace Interstitial text
inter_target = """            <p className="mb-6 text-left">
              除了利用GDP进行交叉分析之外，我们也从另一个指标——性别平等指数出发，探究大模型在描述不同性别平等指数的地区的男女时，是否存在一定的描述差异。
            </p>
            <p className="mb-6 text-left">
              我们从世界银行官网获取Women, Business and the Law 2.0 Data
              <span
                id="citation-7"
                onClick={() => onGoToData(7)}
                className="inline-flex items-center justify-center bg-[#22c55e] text-[#121212] rounded-full w-4 h-4 text-[10px] font-bold ml-1 transform -translate-y-1 cursor-pointer hover:scale-125 transition-transform"
              >7</span>
              （以下简称WBL）作为国家法律性别平等（Legal gender parities）的度量，其值越大说明该国家不同性别更加平等。我们通过WBL数据的从低到高，将所有国家等分为5个组别
              <span
                id="citation-8"
                onClick={() => onGoToData(8)}
                className="inline-flex items-center justify-center bg-[#22c55e] text-[#121212] rounded-full w-4 h-4 text-[10px] font-bold ml-1 transform -translate-y-1 cursor-pointer hover:scale-125 transition-transform"
              >8</span>
              。
            </p>
            <p className="mb-4 text-left">
              在分析中我们发现，随着WBL指数的提高，语言模型对女性的描述呈现趋势性变化：从传统束缚转向更自主的多元表达。
              <span className="inline-flex items-center ml-4 translate-y-2">
                <img src={import.meta.env.BASE_URL + "ICON/binoculars_wh.png"} alt="binoculars" className="w-12 h-auto object-contain" />
              </span>
            </p>"""
inter_replace = """            <p className="mb-6 text-left">
              {t('discovery.slide_interstitial.p1')}
            </p>
            <p className="mb-6 text-left">
              {t('discovery.slide_interstitial.p2_before')}
              <span
                id="citation-7"
                onClick={() => onGoToData(7)}
                className="inline-flex items-center justify-center bg-[#22c55e] text-[#121212] rounded-full w-4 h-4 text-[10px] font-bold ml-1 transform -translate-y-1 cursor-pointer hover:scale-125 transition-transform"
              >7</span>
              {t('discovery.slide_interstitial.p2_middle')}
              <span
                id="citation-8"
                onClick={() => onGoToData(8)}
                className="inline-flex items-center justify-center bg-[#22c55e] text-[#121212] rounded-full w-4 h-4 text-[10px] font-bold ml-1 transform -translate-y-1 cursor-pointer hover:scale-125 transition-transform"
              >8</span>
              {t('discovery.slide_interstitial.p2_after')}
            </p>
            <p className="mb-4 text-left">
              {t('discovery.slide_interstitial.p3')}
              <span className="inline-flex items-center ml-4 translate-y-2">
                <img src={import.meta.env.BASE_URL + "ICON/binoculars_wh.png"} alt="binoculars" className="w-12 h-auto object-contain" />
              </span>
            </p>"""
content = content.replace(inter_target, inter_replace)

# 7. Replace Conclusion text
conc_target = """        <div className="w-full max-w-2xl space-y-6 text-zinc-300 text-left text-[15px] leading-[2.05] font-light tracking-wide">
          <div className="inline-block max-w-full bg-[#6d2741]/88 px-3 py-2">
            AI时代，思考问题时，会不自觉地想知道：AI会如何回答？我们已经在被AI“想象”的答案中塑造自己的答案了。
          </div>

          <div className="inline-block max-w-full bg-[#6d2741]/88 px-3 py-2">
            但这不是一个全然悲观的问题。人从来都是在和社会、语言、文化互动中“建构”出来的，正如波伏娃的思想核心——“成为女人，不是出生如此，而是逐渐形成。”大模型只不过是新的“语言环境”，我们在它的语境中也许能创造“新的自我形象”。更关键的是，我们应该思考，如何有能力在技术中重新谈“自我”。
          </div>

          <div className="inline-block max-w-full bg-[#6d2741]/88 px-3 py-2">
            从上述分析来看：大模型所读取的世界，是一个北半球中心、男性中心的语料堆叠。它继承的是维多利亚式百科、英美新闻体系、男性主导的互联网络。当我们说AI“看到”了什么，其实是在问：谁拥有被记录的权力？谁在历史里说过话？谁的故事从未被写入数据？
          </div>

          <div className="inline-block max-w-full bg-[#6d2741]/88 px-3 py-2">
            我们借分析AI，分析真实世界，也是在借这种分析，表达我身为女性未曾被更多地看见、未曾更多地表达、未曾更多地展现价值的愤怒。这种愤怒，让这篇文章摆在你面前。我们应该承认，在最初请AI续写“男人/女人是”时，我们自带偏见，我希望分析结果能证明AI有偏见的，我希望这篇文章是有影响力的，让更多人能看得见，能让更多人发现：我也应该记录、书写、表达，并借此不断扩大定义的权利。如此，一个更客观、公平的未来也将拥有可能。
          </div>
        </div>"""
conc_replace = """        <div className="w-full max-w-2xl space-y-6 text-zinc-300 text-left text-[15px] leading-[2.05] font-light tracking-wide">
          <div className="inline-block max-w-full bg-[#6d2741]/88 px-3 py-2">
            {t('discovery.conclusion.p1')}
          </div>

          <div className="inline-block max-w-full bg-[#6d2741]/88 px-3 py-2">
            {t('discovery.conclusion.p2')}
          </div>

          <div className="inline-block max-w-full bg-[#6d2741]/88 px-3 py-2">
            {t('discovery.conclusion.p3')}
          </div>

          <div className="inline-block max-w-full bg-[#6d2741]/88 px-3 py-2">
            {t('discovery.conclusion.p4')}
          </div>
        </div>"""
content = content.replace(conc_target, conc_replace)

with open('components/DiscoverySlides.tsx', 'w') as f:
    f.write(content)
print("Done")
