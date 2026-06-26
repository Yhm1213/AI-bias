import React, { useRef } from 'react';
import PixelBackground from './PixelBackground';
import ScrollTelescopeSection from './ScrollTelescopeSection';
import { GdpVisualization } from './GdpVisualization';
import { GdpGenderDiscourseSlide } from './GdpGenderDiscourseSlide';
import { ComplexTypewriter } from './ComplexTypewriter';
import { WblGenderDiscourseSlide } from './WblGenderDiscourseSlide';
import FallingBlocksChart from './FallingBlocksChart';
import NetworkScrolly from './NetworkScrolly';

// Data for Scrollytelling
import cnNetworkData from '../data/cn_network.json';
import enNetworkData from '../data/en_network.json';

import { useTranslation } from '../contexts/LanguageContext';

interface DiscoverySlidesProps {
  onBack: () => void;
  onGoToData: (id?: number) => void;
  language: 'CN' | 'EN';
  toggleLanguage: () => void;
  highlightId?: number | null;
  pendingScrollAction?: React.MutableRefObject<'highlight' | 'default' | null>;
  onClearHighlight?: () => void;
}

const DiscoveryContext = React.createContext<{
  language: 'CN' | 'EN';
  setHoveredKeyword: (payload: { id: string, contextGender?: 'female' | 'male' } | null) => void;
}>({
  language: 'CN',
  setHoveredKeyword: () => {},
});

const Keyword = ({ id, enId, color, children }: { id: string, enId?: string, color: string, children: React.ReactNode }) => {
  const { language, setHoveredKeyword } = React.useContext(DiscoveryContext);
  const targetId = language === 'EN' ? (enId || id) : id;
  const [isLocalHovered, setIsLocalHovered] = React.useState(false);
  
  return (
    <span 
      className={`cursor-pointer transition-colors duration-200 mx-[0.25em] px-[0.15em] border-b border-dashed ${isLocalHovered ? 'border-transparent' : 'border-current'}`}
      style={{ 
        backgroundColor: isLocalHovered ? color : 'transparent',
        color: isLocalHovered ? '#ffffff' : 'inherit',
      }}
      onMouseEnter={() => {
        setIsLocalHovered(true);
        const contextGender = (color || '').toLowerCase().includes('f68cb2') ? 'female' : (color || '').toLowerCase().includes('2abb3a') ? 'male' : undefined;
        setHoveredKeyword({ id: targetId, contextGender });
      }}
      onMouseLeave={() => {
        setIsLocalHovered(false);
        setHoveredKeyword(null);
      }}
    >
      {children}
    </span>
  );
};

const DiscoverySlides: React.FC<DiscoverySlidesProps> = ({ onBack, onGoToData, language, toggleLanguage, highlightId, pendingScrollAction, onClearHighlight }) => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredData, setHoveredData] = React.useState<'CN' | 'EN' | null>(null);
  const [hoveredKeyword, setHoveredKeyword] = React.useState<{ id: string, contextGender?: 'female' | 'male' } | null>(null);

  React.useLayoutEffect(() => {
    if (pendingScrollAction?.current === 'highlight') {
      let targetElementId = `citation-${highlightId}`;
      let scrollBlock: ScrollLogicalPosition = 'center';

      if (highlightId === 3) {
        targetElementId = 'gender-bias-exit-snap';
        scrollBlock = 'start'; // block start maps it exactly to top matching the vh logic
      } else if (highlightId === 4) {
        targetElementId = 'page-4-duplicate-exit-snap';
        scrollBlock = 'start'; // block start maps it exactly to top matching the vh logic
      }

      const element = document.getElementById(targetElementId);
      if (element && containerRef.current) {
        
        // temporarily disable smooth scrolling if present, so we "jump" instantly without triggering intermediate animations
        const hasSmooth = containerRef.current.classList.contains('scroll-smooth');
        if (hasSmooth) {
          containerRef.current.classList.remove('scroll-smooth');
        }

        const origSnap = containerRef.current.style.scrollSnapType;
        containerRef.current.style.scrollSnapType = 'none';
        
        // Type case to bypass TS complaining about 'instant' (which is the modern standard for jumping)
        // while falling back to 'auto' with scroll-smooth disabled.
        element.scrollIntoView({ behavior: 'instant' as ScrollBehavior, block: scrollBlock });
        if (hasSmooth) {
          element.scrollIntoView({ behavior: 'auto', block: scrollBlock }); // Fallback for older browsers
        }

        containerRef.current.style.scrollSnapType = origSnap;
        
        if (hasSmooth) {
          setTimeout(() => {
            if (containerRef.current) {
              containerRef.current.classList.add('scroll-smooth');
            }
          }, 50);
        }
      }
      if (onClearHighlight) onClearHighlight();
    } else if (pendingScrollAction?.current === 'default') {
      if (onClearHighlight) onClearHighlight();
    }
  }, [highlightId, pendingScrollAction, onClearHighlight]);

  const GENDER_BIAS_DATA_CN = [
    {
      titleLeft: <>
        <span className="mx-1"><Keyword id="温柔" color="#F68CB2">温柔</Keyword>与<Keyword id="装饰" color="#F68CB2">装饰</Keyword></span>
        <span>的她，对比</span>
        <span className="mx-1"><Keyword id="高大" color="#2ABB3A">高大</Keyword>与<Keyword id="力量" color="#2ABB3A">力量</Keyword></span>
        <span>的他</span>
      </>,
      content: (
        <>
          <p>
            从<strong>外貌、气质与文化符号</strong>的表征来看，DeepSeek 展现出的性别画像极其保守。
          </p>
          <p>
            在气质词频上，女性被牢牢锁定在
            <Keyword id="温柔" color="#F68CB2">温柔（33次）</Keyword><Keyword id="优雅" color="#F68CB2">优雅（47次）</Keyword>
            等柔性特质中；而男性则由
            <Keyword id="坚韧" color="#2ABB3A">坚韧（185次）</Keyword><Keyword id="勇敢" color="#2ABB3A">勇敢（87次）</Keyword><Keyword id="强" color="#2ABB3A">强（137次）</Keyword>
            定义。这种对比在身体刻画上近乎极端：女性的描写往往指向视觉细节与服饰，如
            <Keyword id="头巾" color="#F68CB2">头巾（87次）</Keyword><Keyword id="长袍" color="#F68CB2">长袍（81次）</Keyword><Keyword id="时尚" color="#F68CB2">时尚（63次）</Keyword>
            ；而男性则被简化为纯粹的生理力量，如
            <Keyword id="高大" color="#2ABB3A">高大（26次）</Keyword>
            与
            <Keyword id="强壮" color="#2ABB3A">强壮（67次）</Keyword>
            。
          </p>
          <p>
            这种叙事路径泾渭分明：女性被<strong>“客体化”</strong>为一种视觉存在，而男性则被<strong>“功能化”</strong>为一种力量符号。正如英美文化中的“Boys don't cry”，这种刻板印象在中文模型中依然稳固，甚至对近年来涌现的“中性化”或“角色倒置”新认知反应迟钝，模型似乎仍在一个“发胶与肌肉”、“丝绸与温柔”的传统世界里徘徊。
          </p>
        </>
      )
    },
    {
      titleLeft: <>
        <span className="mx-1"><Keyword id="照顾" color="#F68CB2">照顾</Keyword>家庭</span>
        <span>的她，对比</span>
        <span className="mx-1"><Keyword id="热爱" color="#2ABB3A">热爱</Keyword>世界</span>
        <span>的他</span>
      </>,
      content: (
        <>
          <p>
            如果说第一层是形象的塑造，那么<strong>行为与职责指向</strong>的数据则揭示了深层的不平等。
          </p>
          <p>
            在统计中，“家庭”是双方共同的高频词，但语境完全不同。女性的关键词是<Keyword id="照顾" color="#F68CB2">照顾（56次）</Keyword>、<Keyword id="核心" color="#F68CB2">核心（44次）</Keyword>、<Keyword id="和谐" color="#F68CB2">和谐（62次）</Keyword>。她们是家庭的润滑剂，负责具体的、重复的、维系性的事务。
          </p>
          <p>
            相比之下，男性的行为动词充满了<strong>外部探索性</strong>：他们<Keyword id="热爱" color="#2ABB3A">热爱（147次）</Keyword>、<Keyword id="喜欢" color="#2ABB3A">喜欢（297次）</Keyword>的对象是<Keyword id="足球" color="#2ABB3A">足球（100次）</Keyword>、<Keyword id="体育" color="#2ABB3A">体育（48次）</Keyword>或<Keyword id="户外活动" color="#2ABB3A">户外活动（118次）</Keyword>。
          </p>
          <p>
            同样是谈论“责任”，女性的<Keyword id="责任感" color="#F68CB2">责任感（85次）</Keyword>往往与家务琐事捆绑，是具体的<strong>无偿劳动</strong>；而男性的<Keyword id="责任感" color="#2ABB3A">责任感（218次）</Keyword>频次是女性的 2.5 倍，通常指向一种宏大的抽象品质。这意味着在模型的逻辑里，男性的责任是一种“社会光环”，而女性的责任则是一种“生存定式”。
          </p>
        </>
      )
    },
    {
      titleLeft: <>
        <span className="mx-1"><Keyword id="遵守" color="#F68CB2">遵守</Keyword>规范</span>
        <span>的她，对比</span>
        <span className="mx-1"><Keyword id="开拓" color="#2ABB3A">开拓</Keyword>疆域</span>
        <span>的他</span>
      </>,
      content: (
        <>
          <p>
            当我们将目光从生活琐事转向<strong>社会参与</strong>，数据呈现出一种“规训”与“扩张”的对立。
          </p>
          <p>
            在女性的文本中，高频词包括
            <Keyword id="遵守" color="#F68CB2">遵守</Keyword>、
            <Keyword id="扮演" color="#F68CB2">扮演着（307次）</Keyword>、
            <Keyword id="传统" color="#F68CB2">传统（785次）</Keyword>
            ，强调她们在既定社会框架内的<strong>适应与服从</strong>。而男性的高频词则更多涉及
            <Keyword id="职业" color="#2ABB3A">职业（25次）</Keyword>、
            <Keyword id="商业" color="#2ABB3A">商业（30次）</Keyword>
            以及
            <Keyword id="社会" color="#2ABB3A">社会（109次）</Keyword>
            地位。
          </p>
          <p>
            即便在同样追求
            <Keyword id="平等" color="#F68CB2">平等（48次 vs 43次）</Keyword>
            的语境下，女性更多是在争取
            <Keyword id="教育" color="#F68CB2">教育（306次）</Keyword>
            和
            <Keyword id="独立" color="#F68CB2">独立（269次）</Keyword>
            的权利，而男性则早已在
            <Keyword id="经济" color="#2ABB3A">经济（41次）</Keyword>
            与
            <Keyword id="传承" color="#2ABB3A">文化传承（225次）</Keyword>
            中占据主导。这种差异印证了社会学家西尔维娅·沃尔比的观点：现代叙事依然倾向于将女性置于“规范的追随者”地位，而将公共资源的控制权与变革的“创新者”角色留给男性。
          </p>
        </>
      )
    }
  ];

  const GENDER_BIAS_DATA_EN = [
    {
      titleLeft: <>
        <span className="mx-1"><Keyword id="温柔" color="#F68CB2">Gentle</Keyword> & <Keyword id="装饰" color="#F68CB2">Decorative</Keyword></span>
        <span>Her vs.</span>
        <span className="mx-1"><Keyword id="高大" color="#2ABB3A">Tall</Keyword> & <Keyword id="力量" color="#2ABB3A">Powerful</Keyword></span>
        <span>Him</span>
      </>,
      content: (
        <>
          <p>
            From the representation of <strong>appearance, temperament, and cultural symbols</strong>, the gender portrait presented by DeepSeek is extremely conservative.
          </p>
          <p>
            In terms of temperament word frequency, women are firmly locked into soft traits such as
            <Keyword id="温柔" color="#F68CB2">gentle (33 times)</Keyword> and <Keyword id="优雅" color="#F68CB2">elegant (47 times)</Keyword>
            , while men are defined by
            <Keyword id="坚韧" color="#2ABB3A">resilient (185 times)</Keyword>, <Keyword id="勇敢" color="#2ABB3A">brave (87 times)</Keyword>, and <Keyword id="强" color="#2ABB3A">strong (137 times)</Keyword>
            . This contrast is almost extreme in physical depictions: descriptions of women often point to visual details and clothing, such as
            <Keyword id="头巾" color="#F68CB2">headscarf (87 times)</Keyword>, <Keyword id="长袍" color="#F68CB2">robe (81 times)</Keyword>, and <Keyword id="时尚" color="#F68CB2">fashion (63 times)</Keyword>
            ; whereas men are simplified into pure physiological power, such as
            <Keyword id="高大" color="#2ABB3A">tall (26 times)</Keyword>
            and
            <Keyword id="强壮" color="#2ABB3A">strong (67 times)</Keyword>
            .
          </p>
          <p>
            This narrative path is distinct: women are <strong>"objectified"</strong> as a visual presence, while men are <strong>"functionalized"</strong> as a symbol of power. Much like the "Boys don't cry" trope in Anglo-American culture, this stereotype remains solid in Chinese models, showing a slow reaction to recent trends of "androgyny" or "role reversal." The model seems to linger in a traditional world of "hair gel and muscles" vs. "silk and tenderness."
          </p>
        </>
      )
    },
    {
      titleLeft: <>
        <span className="mx-1"><Keyword id="照顾" color="#F68CB2">Caring</Keyword></span>
        <span>Family Woman vs.</span>
        <span className="mx-1"><Keyword id="热爱" color="#2ABB3A">Loving</Keyword></span>
        <span>the World Man</span>
      </>,
      content: (
        <>
          <p>
            If the first layer is the shaping of image, the data regarding <strong>behavior and responsibility</strong> reveals deeper inequality.
          </p>
          <p>
            In our statistics, "family" is a high-frequency word for both sides, but the context is entirely different. For women, the keywords are <strong><Keyword id="照顾" color="#F68CB2">care (56 times)</Keyword>, <Keyword id="核心" color="#F68CB2">core (44 times)</Keyword>, and <Keyword id="和谐" color="#F68CB2">harmony (62 times)</Keyword></strong>. They are the lubricants of the family, responsible for specific, repetitive, and maintenance-oriented tasks.
          </p>
          <p>
            In contrast, men’s behavioral verbs are full of <strong>external exploration</strong>: the objects they <Keyword id="热爱" color="#2ABB3A">love (147 times)</Keyword> or <Keyword id="喜欢" color="#2ABB3A">like (297 times)</Keyword> are <Keyword id="足球" color="#2ABB3A">football (100 times)</Keyword>, <Keyword id="体育" color="#2ABB3A">sports (48 times)</Keyword>, or <Keyword id="户外活动" color="#2ABB3A">outdoor activities (118 times)</Keyword>.
          </p>
          <p>
            When discussing "responsibility," a woman’s <Keyword id="责任感" color="#F68CB2">sense of responsibility (85 times)</Keyword> is often tied to household chores—specific, <strong>unpaid labor</strong>. However, the frequency of a man’s <Keyword id="责任感" color="#2ABB3A">sense of responsibility (218 times)</Keyword> is 2.5 times higher and usually points to a grand, abstract quality. This implies that in the model's logic, male responsibility is a "social halo," while female responsibility is a "survival routine."
          </p>
        </>
      )
    },
    {
      titleLeft: <>
        <span className="mx-1"><Keyword id="遵守" color="#F68CB2">Complying</Keyword></span>
        <span>Her vs.</span>
        <span className="mx-1"><Keyword id="开拓" color="#2ABB3A">Pioneering</Keyword></span>
        <span>Him</span>
      </>,
      content: (
        <>
          <p>
            When shifting focus from daily life to <strong>social participation</strong>, the data presents an opposition between "discipline" and "expansion."
          </p>
          <p>
            In texts about women, high-frequency words include
            <Keyword id="遵守" color="#F68CB2">comply</Keyword>,
            <Keyword id="扮演" color="#F68CB2">playing a role (307 times)</Keyword>,
            and
            <Keyword id="传统" color="#F68CB2">traditional (785 times)</Keyword>
            , emphasizing their <strong>adaptation and obedience</strong> within established social frameworks. Men's high-frequency words involve
            <Keyword id="职业" color="#2ABB3A">profession (25 times)</Keyword>,
            <Keyword id="商业" color="#2ABB3A">business (30 times)</Keyword>,
            and
            <Keyword id="社会" color="#2ABB3A">social (109 times)</Keyword>
            status.
          </p>
          <p>
            Even in the shared context of pursuing
            <Keyword id="平等" color="#F68CB2">equality (48 vs. 43 times)</Keyword>
            , women are more often striving for the right to
            <Keyword id="教育" color="#F68CB2">education (306 times)</Keyword>
            and
            <Keyword id="独立" color="#F68CB2">independence (269 times)</Keyword>
            , while men are already dominant in
            <Keyword id="经济" color="#2ABB3A">economy (41 times)</Keyword>
            and
            <Keyword id="传承" color="#2ABB3A">cultural inheritance (225 times)</Keyword>
            . This confirms sociologist Sylvia Walby’s view: modern narratives still tend to place women as "followers of norms" while reserving control of public resources and the role of "innovator" for men.
          </p>
        </>
      )
    }
  ];

  const EN_GENDER_BIAS_DATA_CN = [
    {
      titleLeft: <>
        <span className="mx-1"><Keyword id="grace" color="#F68CB2">优雅（Grace）</Keyword></span>
        <span className="text-zinc-600">的内在化，对比</span>
        <span className="mx-1"><Keyword id="influence" color="#2ABB3A">影响力（Influence）</Keyword></span>
        <span className="text-zinc-600">的扩张</span>
      </>,
      content: (
        <>
          <p>
            在形象描述上，英文模型完成了一次从“外在修饰”向“内在特质”的转移，但性别边界依然清晰。
          </p>
          <p>
            女性的形象在 ChatGPT 笔下显得更为立体，关键词从简单的外貌转向了
            <Keyword id="grace" color="#F68CB2">优雅（Grace，478次）</Keyword>
            与
            <Keyword id="resilience" color="#F68CB2">韧性（Resilience，1309次）</Keyword>
            。相比中文模型对“身材”的关注，英文模型更强调女性的
            <Keyword id="poise" color="#F68CB2">风度（Poise）</Keyword>
            与
            <Keyword id="confidence" color="#F68CB2">自信（Confidence）</Keyword>
            。
          </p>
          <p>
            然而，男性的关键词则直接指向社会权力。
            <Keyword id="influence" color="#2ABB3A">影响力（Influence，1089次）</Keyword>、
            <Keyword id="individual" color="#2ABB3A">个体（Individual，847次）</Keyword>
            以及
            <Keyword id="intellectual" color="#2ABB3A">智力特质（Intellectual）</Keyword>
            构成了男性的核心。虽然英文模型赋予了男性“现代感”，但这种“现代感”本质上仍是<strong>“理性与掌控力”</strong>的代名词。总体看下来，中文模型是在描述长相，而英文模型是在描述人格。但这种人格分配依然遵循：女性负责美与情感，男性负责逻辑与世界。
          </p>
        </>
      )
    },
    {
      titleLeft: <>
        <span className="mx-1"><Keyword id="care" color="#F68CB2">关怀（Care）</Keyword></span>
        <span className="text-zinc-600">的多重重担，对比</span>
        <span className="mx-1"><Keyword id="explore" color="#2ABB3A">探索（Explore）</Keyword></span>
        <span className="text-zinc-600">的无界参与</span>
      </>,
      content: (
        <>
          <p>
            在行为逻辑中，英文模型展现了一个非常显著的“空间差”：女性被留在社区，男性走向世界。
          </p>
          <p>
            数据显示，女性与
            <Keyword id="community" color="#F68CB2">社区（Community，1474次）</Keyword>、
            <Keyword id="balance" color="#F68CB2">平衡（Balance，676次）</Keyword>、
            <Keyword id="education" color="#F68CB2">教育（Education，837次）</Keyword>
            高度关联。高频词如“Juggle”和“Manage”揭示了现代女性的困境：她们不仅要作为“Caregiver（照顾者）”，还要在“Professional（职业的）”领域证明自己。
          </p>
          <p>
            反观男性，他们的行为充满了<strong>公共性与流动性</strong>。关键词如
            <Keyword id="explore" color="#2ABB3A">探索（Explore）</Keyword>、
            <Keyword id="diplomacy" color="#2ABB3A">外交（Diplomacy）</Keyword>、
            <Keyword id="technology" color="#2ABB3A">科技（Technology）</Keyword>
            将男性定位为全球公民。不同于中文模型中“捕鱼/运动”这种具体体力活动，英文模型中的男性行为更具“脑力资本”色彩。但不变的是，女性依然是“家庭与关系的维系者（Homemaker）”，她们的勤奋往往带有<strong>牺牲与奉献</strong>的色彩，而男性的勤奋则指向<strong>职业成就</strong>。
          </p>
        </>
      )
    },
    {
      titleLeft: <>
        <span className="mx-1"><Keyword id="advocacy" color="#F68CB2">抗争（Advocacy）</Keyword></span>
        <span className="text-zinc-600">的补偿，对比</span>
        <span className="mx-1"><Keyword id="strategy" color="#2ABB3A">策略（Strategy）</Keyword></span>
        <span className="text-zinc-600">的主导</span>
      </>,
      content: (
        <>
          <p>
            在社会角色的期待上，英文模型引入了大量关于<strong>性别正义</strong>的现代词汇，这与中文模型形成了鲜明对比。
          </p>
          <p>
            在女性的词簇中，出现了大量
            <Keyword id="equality" color="#F68CB2">平等（Equality，495次）</Keyword>、
            <Keyword id="empowerment" color="#F68CB2">赋权（Empowerment，321次）</Keyword>
            和
            <Keyword id="advocate" color="#F68CB2">倡议（Advocate，319次）</Keyword>
            。这反映出英文语境下，女性的身份往往与<strong>“挑战障碍（Challenge / Barrier）”</strong>捆绑在一起。换句话说，模型认为女性的“力量”体现在对现状的“突破”上。
          </p>
          <p>
            而男性的关键词则显得“顺风顺水”：
            <Keyword id="strategic" color="#2ABB3A">策略（Strategic）</Keyword>、
            <Keyword id="geopolitical" color="#2ABB3A">地缘政治（Geopolitical）</Keyword>、
            <Keyword id="perspective" color="#2ABB3A">视野（Perspective，160次）</Keyword>
            。男性被预设为规则的制定者和体系的操盘手。这揭示了一个残酷的真相，在英文模型的逻辑里，女性的“进步”是需要<strong>“Strive（奋斗/争取）”</strong>的补偿性叙事，而男性的“成功”则是<strong>“Nature（天生/自然）”</strong>的战略延展。模型虽然学会了“政治正确”的词汇，但在潜意识里，它依然认为世界是由男性的战略构建的，而女性则负责在其中呼吁公平。
          </p>
        </>
      )
    }
  ];

  const EN_GENDER_BIAS_DATA_EN = [
    {
      titleLeft: <>
        <span className="mx-1">Internalization of <Keyword id="grace" color="#F68CB2">Grace</Keyword> vs.</span>
        <span className="mx-1">Expansion of <Keyword id="influence" color="#2ABB3A">Influence</Keyword></span>
      </>,
      content: (
        <>
          <p>
            In physical descriptions, the English models shift from "external decoration" to "internal traits," but gender boundaries remain clear.
          </p>
          <p>
            Women’s images appear more three-dimensional in ChatGPT’s writing, with keywords moving from simple appearance to
            <Keyword id="grace" color="#F68CB2">Grace (478 times)</Keyword>
            and
            <Keyword id="resilience" color="#F68CB2">Resilience (1,309 times)</Keyword>
            . Compared to the Chinese model's focus on "body shape," the English model emphasizes a woman's
            <Keyword id="poise" color="#F68CB2">Poise</Keyword>
            and
            <Keyword id="confidence" color="#F68CB2">Confidence</Keyword>.
          </p>
          <p>
            However, male keywords point directly to social power.
            <Keyword id="influence" color="#2ABB3A">Influence (1,089 times)</Keyword>,
            <Keyword id="individual" color="#2ABB3A">Individual (847 times)</Keyword>,
            and
            <Keyword id="intellectual" color="#2ABB3A">Intellectual</Keyword>
            traits form the core of the male persona. While the English model grants men a sense of "modernity," this modernity is essentially a synonym for <strong>"rationality and control."</strong> Overall, the Chinese model describes looks, while the English model describes personality—yet the distribution still dictates that women manage beauty and emotion, while men manage logic and the world.
          </p>
        </>
      )
    },
    {
      titleLeft: <>
        <span className="mx-1">Multiple Burdens of <Keyword id="care" color="#F68CB2">Care</Keyword> vs.</span>
        <span className="mx-1">Boundless Participation of <Keyword id="explore" color="#2ABB3A">Explore</Keyword></span>
      </>,
      content: (
        <>
          <p>
            In behavioral logic, the English model shows a significant "spatial gap": women are kept in the community, while men head into the world.
          </p>
          <p>
            Data shows women are highly associated with
            <Keyword id="community" color="#F68CB2">Community (1,474 times)</Keyword>,
            <Keyword id="balance" color="#F68CB2">Balance (676 times)</Keyword>,
            and
            <Keyword id="education" color="#F68CB2">Education (837 times)</Keyword>
            . High-frequency words like "Juggle" and "Manage" reveal the plight of modern women: they must act as a "Caregiver" while proving themselves in the "Professional" sphere.
          </p>
          <p>
            Conversely, male behavior is full of <strong>publicness and fluidity</strong>. Keywords like
            <Keyword id="explore" color="#2ABB3A">Explore</Keyword>,
            <Keyword id="diplomacy" color="#2ABB3A">Diplomacy</Keyword>,
            and
            <Keyword id="technology" color="#2ABB3A">Technology</Keyword>
            position men as global citizens. Unlike the specific physical activities like "fishing/sports" in the Chinese model, male behavior in the English model carries more "intellectual capital." Yet, the constant remains: women are the "Homemakers" and maintainers of relationships, their diligence flavored with <strong>sacrifice and devotion</strong>, while male diligence points toward <strong>professional achievement</strong>.
          </p>
        </>
      )
    },
    {
      titleLeft: <>
        <span className="mx-1">Compensation of <Keyword id="advocacy" color="#F68CB2">Advocacy</Keyword> vs.</span>
        <span className="mx-1">Dominance of <Keyword id="strategy" color="#2ABB3A">Strategy</Keyword></span>
      </>,
      content: (
        <>
          <p>
            Regarding social expectations, the English model introduces modern vocabulary about <strong>gender justice</strong>, creating a sharp contrast with the Chinese model.
          </p>
          <p>
            In female word clusters, there is a high frequency of
            <Keyword id="equality" color="#F68CB2">Equality (495 times)</Keyword>,
            <Keyword id="empowerment" color="#F68CB2">Empowerment (321 times)</Keyword>,
            and
            <Keyword id="advocate" color="#F68CB2">Advocate (319 times)</Keyword>
            . This reflects that in an English context, female identity is often tied to <strong>"Challenging barriers."</strong> In other words, the model believes a woman’s "strength" is manifested in "breaking through" the status quo.
          </p>
          <p>
            Male keywords, however, appear "smooth sailing":
            <Keyword id="strategic" color="#2ABB3A">Strategic</Keyword>,
            <Keyword id="geopolitical" color="#2ABB3A">Geopolitical</Keyword>,
            and
            <Keyword id="perspective" color="#2ABB3A">Perspective (160 times)</Keyword>
            . Men are preset as the rule-makers and system operators. This reveals a harsh truth: in the English model’s logic, female "progress" is a compensatory narrative requiring <strong>"Striving,"</strong> whereas male "success" is a natural, strategic extension of <strong>"Nature."</strong> The model has learned "politically correct" vocabulary, but subconsciously, it still believes the world is constructed by male strategy, while women are responsible for calling for fairness within it.
          </p>
        </>
      )
    }
  ];

  const PAGE_3_EXIT_CONTENT = (
    <>
      <div className="w-full max-w-3xl px-6 text-center">
        <div className="text-zinc-300 text-sm md:text-[15px] leading-[2.4] font-light tracking-widest text-left">
          <p className="mb-4 whitespace-pre-wrap">
            <ComplexTypewriter items={[
              t('discovery.page3_exit.p1_1'),
              <br key="br1" />,
              t('discovery.page3_exit.p1_2_before'),
              <span
                key="citation-3"
                id="citation-3"
                onClick={() => onGoToData(3)}
                className="inline-flex items-center justify-center bg-[#22c55e] text-[#121212] rounded-full w-4 h-4 text-[10px] font-bold mx-1 transform -translate-y-1 cursor-pointer hover:scale-125 transition-transform"
              >3</span>,
              t('discovery.page3_exit.p1_2_after') + t('discovery.page3_exit.p1_3')
            ]} />
          </p>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-pulse z-10 pointer-events-none flex flex-col items-center">
        <img 
          src={`${import.meta.env.BASE_URL}ICON/cursor_pink.png`} 
          alt="Scroll down" 
          className="w-8 h-auto object-contain opacity-80 drop-shadow-lg" 
        />
      </div>
    </>
  );

  // 第4页的出口内容 (Dark Text for Light Background - 词语性别差异指数可视化)
  const PAGE_4_EXIT_CONTENT_LIGHT = (
    <div className="w-full max-w-6xl px-8 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
      {/* 左侧：叠加图表 */}
      <div className="relative w-full md:w-1/2 max-w-[500px]">
        {/* 框线层 (最底层) */}
        <img
          src={import.meta.env.BASE_URL + "pic/kuangxian.png"}
          alt="Chart Frame"
          className="w-full h-auto object-contain object-left-bottom"
        />
        {/* 中文数据层 - Falling Blocks Animation */}
        <div className={`absolute bottom-0 left-0 w-full h-full transition-opacity duration-300 ${hoveredData === 'EN' ? 'opacity-0' : 'opacity-100'}`}>
          <FallingBlocksChart
            src={import.meta.env.BASE_URL + "pic/CN.png"}
            alt="Chinese Data"
            className="w-full h-full object-left-bottom" // alignment is handled by wrapper mostly, but pass visual styles
            rows={12}
            cols={12}
            delay={0}
          />
        </div>

        {/* 英文数据层 - Falling Blocks Animation */}
        <div className={`absolute bottom-0 left-0 w-full h-full transition-opacity duration-300 ${hoveredData === 'CN' ? 'opacity-0' : 'opacity-100'}`}>
          <FallingBlocksChart
            src={import.meta.env.BASE_URL + "pic/EN.png"}
            alt="English Data"
            className="w-full h-full object-left-bottom"
            rows={12}
            cols={12}
            delay={500} // Start slightly later
          />
        </div>
        {/* 表注 - Adjusted to left side of chart */}
        <div className="absolute top-1/2 -left-8 -translate-y-1/2 flex flex-col gap-3 font-quan text-[13px] md:text-[15px] font-bold">
          <div 
            className="flex items-center gap-2 cursor-pointer transition-all duration-300 hover:scale-110"
            onMouseEnter={() => setHoveredData('CN')}
            onMouseLeave={() => setHoveredData(null)}
          >
            <span className="w-3 h-3 rounded-full bg-[#2ABB3A]"></span>
            <span className="text-[#2ABB3A] tracking-wider">{language === 'EN' ? 'ZH' : '中文'}</span>
          </div>
          <div 
            className="flex items-center gap-2 cursor-pointer transition-all duration-300 hover:scale-110"
            onMouseEnter={() => setHoveredData('EN')}
            onMouseLeave={() => setHoveredData(null)}
          >
            <span className="w-3 h-3 rounded-full bg-[#F68CB2]"></span>
            <span className="text-[#F68CB2] tracking-wider">{language === 'EN' ? 'EN' : '英文'}</span>
          </div>
        </div>
      </div>

      {/* 右侧：文字说明 - Scrollable with visible scrollbar */}
      <div id="page4-exit-scroll" className="w-full md:w-1/2 max-w-md text-left h-[400px] overflow-y-scroll pr-2">
        <p className="text-zinc-800 text-sm md:text-[15px] leading-[2.2] font-light tracking-wide mb-6">
          {t('discovery.page4_exit.p1_1')}<span className="font-bold text-zinc-900">{t('discovery.page4_exit.p1_2')}</span><span
            id="citation-4"
            onClick={() => onGoToData(4)}
            className="inline-flex items-center justify-center bg-[#22c55e] text-[#121212] rounded-full w-4 h-4 text-[10px] font-bold ml-1 transform -translate-y-1 cursor-pointer hover:scale-125 transition-transform"
          >4</span>{t('discovery.page4_exit.p1_3')}
        </p>
        <p className="text-zinc-800 text-sm md:text-[15px] leading-[2.2] font-light tracking-wide mb-6">
          {t('discovery.page4_exit.p2')}
        </p>
        <p className="text-zinc-800 text-sm md:text-[15px] leading-[2.2] font-light tracking-wide mb-6">
          {t('discovery.page4_exit.p3')}
        </p>
        <p className="text-zinc-800 text-sm md:text-[15px] leading-[2.2] font-light tracking-wide mb-6">
          {t('discovery.page4_exit.p4')}
        </p>
        <p className="text-zinc-800 text-sm md:text-[15px] leading-[2.2] font-light tracking-wide mb-6">
          {t('discovery.page4_exit.p5')}
        </p>
        <p className="text-zinc-800 text-sm md:text-[15px] leading-[2.2] font-light tracking-wide mb-6">
          {t('discovery.page4_exit.p6')}
        </p>
        <p className="text-zinc-800 text-sm md:text-[15px] leading-[2.2] font-light tracking-wide mb-6">
          {t('discovery.page4_exit.p7')}
        </p>
      </div>
    </div>
  );

  return (
    <DiscoveryContext.Provider value={{ language, setHoveredKeyword }}>
    <div
      ref={containerRef}
      className="h-screen overflow-y-auto snap-y snap-mandatory bg-[#121212] selection:bg-[#ff4d94]/30 relative scroll-smooth"
    >
      {/* 这里的 PixelBackground 会被 Page 2/4 的黑色遮罩覆盖，并在 Exit 时透出 */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <PixelBackground />
      </div>

      {/* 返回首页按钮 - 固定在左下角 */}
      <div className="fixed bottom-4 left-4 md:bottom-8 md:left-8 z-50 pointer-events-auto">
        <button
          onClick={onBack}
          className="hover:scale-105 transition-transform duration-300 flex items-center justify-center p-1"
        >
          <img 
            src={import.meta.env.BASE_URL + "ICON/HOME.png"} 
            alt={t('discovery.back')} 
            className="h-10 w-auto object-contain drop-shadow-md" 
          />
        </button>
      </div>

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

      {/* 第一屏：首屏内容 */}
      <section className="min-h-screen w-full snap-start snap-always relative flex flex-col items-center justify-center px-6 py-20 z-20 bg-transparent text-left">
        {/* 注意：bg-transparent 让它透出下面的 PixelBackground */}
        <div className="w-full max-w-2xl z-10 flex flex-col justify-center">
          <div className="text-zinc-300 text-sm md:text-[15px] leading-[2.4] font-light tracking-widest max-w-xl">
            <p className="mb-4 text-left whitespace-pre-wrap">
              <ComplexTypewriter items={[
                t('discovery.slide1.p1_before'),
                <span
                  key="citation-2"
                  id="citation-2"
                  onClick={() => onGoToData(2)}
                  className="inline-flex items-center justify-center bg-[#22c55e] text-[#121212] rounded-full w-4 h-4 text-[10px] font-bold mx-1 transform -translate-y-1 cursor-pointer hover:scale-125 transition-transform"
                >
                  2
                </span>,
                t('discovery.slide1.p1_after')
              ]} />
            </p>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-pulse z-10 pointer-events-none flex flex-col items-center">
          <img 
            src={`${import.meta.env.BASE_URL}ICON/cursor_pink.png`} 
            alt="Scroll down" 
            className="w-8 h-auto object-contain opacity-80 drop-shadow-lg" 
          />
        </div>
      </section>

      {/* 第二屏：望远镜视角 (Gender Bias) -> Page 3 (Deep Dive Intro) */}
      <ScrollTelescopeSection
        id="gender-bias"
        slides={language === 'CN' ? GENDER_BIAS_DATA_CN : GENDER_BIAS_DATA_EN}
        exitContent={PAGE_3_EXIT_CONTENT}
        renderVisualZone={(subPage, isVisible) => (
          <div className="w-full h-[80%] my-auto relative">
            <NetworkScrolly data={cnNetworkData} activePage={subPage} isVisible={isVisible} externalHovered={hoveredKeyword} />
          </div>
        )}
      />

      <ScrollTelescopeSection
        id="page-4-duplicate"
        slides={language === 'CN' ? EN_GENDER_BIAS_DATA_CN : EN_GENDER_BIAS_DATA_EN}
        mode="inverse"
        exitContent={PAGE_4_EXIT_CONTENT_LIGHT}
        renderVisualZone={(subPage, isVisible) => (
          <div className="w-full h-[80%] my-auto relative">
            <NetworkScrolly data={enNetworkData as any} activePage={subPage} isVisible={isVisible} externalHovered={hoveredKeyword} />
          </div>
        )}
      />

      {/* 第六屏：过渡屏 (Page 6) */}
      <section className="min-h-screen w-full snap-start snap-always relative flex flex-col items-center justify-center px-6 py-20 z-20 bg-transparent text-left">
        <div className="w-full max-w-2xl z-10 flex flex-col justify-center">
          <h2 className="text-[#22c55e] text-xl md:text-2xl font-bold tracking-[0.3em] mb-12 leading-relaxed whitespace-pre-wrap">
            {t('discovery.slide6.title')}
          </h2>
          <div className="text-zinc-300 text-sm md:text-[15px] leading-[2.4] font-light tracking-widest max-w-xl">
            <p className="mb-6 text-left">
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
            </p>
          </div>
          <div className="mt-20 opacity-10">
            <div className="w-[1px] h-12 bg-white"></div>
          </div>
        </div>
      </section>



      {/* 第八屏：GDP Gender Discourse Visualization */}
      <section className="h-screen w-full snap-start snap-always relative z-20">
        <GdpGenderDiscourseSlide language={language} toggleLanguage={toggleLanguage} />
      </section>

      {/* 补充过渡屏：放在两个数据洞察页面之间 */}
      <section className="min-h-screen w-full snap-start snap-always relative flex flex-col items-center justify-center px-6 py-20 z-20 bg-transparent text-left">
        <div className="w-full max-w-2xl z-10 flex flex-col justify-center">
          <h2 className="text-[#22c55e] text-xl md:text-2xl font-bold tracking-[0.3em] mb-12 leading-relaxed whitespace-pre-wrap">
            {t('discovery.slide_interstitial.title')}
          </h2>
          <div className="text-zinc-300 text-sm md:text-[15px] leading-[2.4] font-light tracking-widest max-w-xl">
            <p className="mb-6 text-left">
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
            </p>
          </div>
          <div className="mt-20 opacity-10">
            <div className="w-[1px] h-12 bg-white"></div>
          </div>
        </div>
      </section>

      {/* 第九屏：WBL Gender Discourse Visualization */}
      <section className="h-screen w-full snap-start snap-always relative z-20">
        <WblGenderDiscourseSlide language={language} toggleLanguage={toggleLanguage} />
      </section>

      {/* 结尾页 */}
      <section className="min-h-screen w-full snap-start snap-always relative flex flex-col items-center justify-center px-6 py-20 z-20 bg-transparent">
        <div className="w-full max-w-2xl space-y-6 text-zinc-300 text-left text-[15px] leading-[2.05] font-light tracking-wide">
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

          {/* 项目成员介绍 - 图片版本 */}
          <div className="w-full flex justify-center pt-24 pb-12 animate-fade-in relative z-50">
            <div className="flex justify-center w-full max-w-[500px]">
              <img 
                src={import.meta.env.BASE_URL + (language === 'CN' ? "pic/stafflist_zh.png" : "pic/stafflist_en.png")} 
                alt="Project Members" 
                className="w-full h-auto object-contain drop-shadow-2xl opacity-90 hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
        </div>
      </section>

    </div>

      <style>{`
        #page4-exit-scroll::-webkit-scrollbar {
            -webkit-appearance: none !important;
            display: block !important;
            width: 4px !important;
        }
        #page4-exit-scroll::-webkit-scrollbar-track {
            background: transparent !important;
            margin: 15px 0 !important;
        }
        #page4-exit-scroll::-webkit-scrollbar-thumb {
            background-color: rgba(0, 0, 0, 0.12) !important;
            border-radius: 4px !important;
        }
        #page4-exit-scroll:hover::-webkit-scrollbar-thumb {
            background-color: rgba(0, 0, 0, 0.25) !important;
        }
      `}</style>
    </DiscoveryContext.Provider>
  );
};

export default DiscoverySlides;
