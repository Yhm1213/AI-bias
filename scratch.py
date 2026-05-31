import os

file_path = '/Users/yuhaomiao/Desktop/AI_bias/AI-bias/components/DiscoverySlides.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

def extract_bounds(lines, start_str, end_str):
    start = -1
    end = -1
    for i, line in enumerate(lines):
        if start_str in line and start == -1:
            start = i
        elif end_str in line and start != -1 and end == -1:
            end = i
            break
    return start, end

# Replace GENDER_BIAS_DATA_EN
start1, end1 = extract_bounds(lines, "const GENDER_BIAS_DATA_EN = [", "];")

new_gdp_en = """  const GENDER_BIAS_DATA_EN = [
    {
      titleLeft: <>
        <span className="font-bold text-pink-700 mx-1">"Gentle" & "Decorative"</span>
        <span className="text-xs text-zinc-600">Her vs.</span>
        <span className="font-bold text-green-800 mx-1">"Tall" & "Powerful"</span>
        <span className="text-xs text-zinc-600">Him</span>
      </>,
      content: (
        <>
          <p>
            From the representation of <strong>appearance, temperament, and cultural symbols</strong>, the gender portrait presented by DeepSeek is extremely conservative.
          </p>
          <p>
            In terms of temperament word frequency, women are firmly locked into soft traits such as
            <span className="font-bold text-pink-800">"gentle" (33 times) and "elegant" (47 times)</span>
            , while men are defined by
            <span className="font-bold text-green-900">"resilient" (185 times), "brave" (87 times), and "strong" (137 times)</span>
            . This contrast is almost extreme in physical depictions: descriptions of women often point to visual details and clothing, such as
            <span className="font-bold text-pink-800">"headscarf" (87 times), "robe" (81 times), and "fashion" (63 times)</span>
            ; whereas men are simplified into pure physiological power, such as
            <span className="font-bold text-green-900">"tall" (26 times)</span>
            and
            <span className="font-bold text-green-900">"strong" (67 times)</span>
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
        <span className="font-bold text-pink-700 mx-1">"Caring"</span>
        <span className="text-xs text-zinc-600">Family Woman vs.</span>
        <span className="font-bold text-green-800 mx-1">"Loving"</span>
        <span className="text-xs text-zinc-600">the World Man</span>
      </>,
      content: (
        <>
          <p>
            If the first layer is the shaping of image, the data regarding <strong>behavior and responsibility</strong> reveals deeper inequality.
          </p>
          <p>
            In our statistics, "family" is a high-frequency word for both sides, but the context is entirely different. For women, the keywords are <strong className="text-pink-800">"care" (56 times), "core" (44 times), and "harmony" (62 times)</strong>. They are the lubricants of the family, responsible for specific, repetitive, and maintenance-oriented tasks.
          </p>
          <p>
            In contrast, men’s behavioral verbs are full of <strong className="text-green-900">external exploration</strong>: the objects they <span className="font-bold text-green-900">"love" (147 times) or "like" (297 times)</span> are <span className="font-bold text-green-900">"football" (100 times), "sports" (48 times), or "outdoor activities" (118 times)</span>.
          </p>
          <p>
            When discussing "responsibility," a woman’s <span className="font-bold text-pink-800">"sense of responsibility" (85 times)</span> is often tied to household chores—specific, <strong>unpaid labor</strong>. However, the frequency of a man’s <span className="font-bold text-green-900">"sense of responsibility" (218 times)</span> is 2.5 times higher and usually points to a grand, abstract quality. This implies that in the model's logic, male responsibility is a "social halo," while female responsibility is a "survival routine."
          </p>
        </>
      )
    },
    {
      titleLeft: <>
        <span className="font-bold text-pink-700 mx-1">"Complying"</span>
        <span className="text-xs text-zinc-600">Her vs.</span>
        <span className="font-bold text-green-800 mx-1">"Pioneering"</span>
        <span className="text-xs text-zinc-600">Him</span>
      </>,
      content: (
        <>
          <p>
            When shifting focus from daily life to <strong>social participation</strong>, the data presents an opposition between "discipline" and "expansion."
          </p>
          <p>
            In texts about women, high-frequency words include
            <span className="font-bold text-pink-800">"comply,"</span>
            <span className="font-bold text-pink-800">"playing a role" (307 times),</span>
            and
            <span className="font-bold text-pink-800">"traditional" (785 times)</span>
            , emphasizing their <strong>adaptation and obedience</strong> within established social frameworks. Men's high-frequency words involve
            <span className="font-bold text-green-900">"profession" (25 times),</span>
            <span className="font-bold text-green-900">"business" (30 times),</span>
            and
            <span className="font-bold text-green-900">"social" (109 times)</span>
            status.
          </p>
          <p>
            Even in the shared context of pursuing
            <span className="font-bold text-pink-800">"equality" (48 vs. 43 times)</span>
            , women are more often striving for the right to
            <span className="font-bold text-pink-800">"education" (306 times)</span>
            and
            <span className="font-bold text-pink-800">"independence" (269 times)</span>
            , while men are already dominant in
            <span className="font-bold text-green-900">"economy" (41 times)</span>
            and
            <span className="font-bold text-green-900">"cultural inheritance" (225 times)</span>
            . This confirms sociologist Sylvia Walby’s view: modern narratives still tend to place women as "followers of norms" while reserving control of public resources and the role of "innovator" for men.
          </p>
        </>
      )
    }
  ];
"""

lines = lines[:start1] + [new_gdp_en] + lines[end1+1:]

# Recalculate bounds for EN_GENDER_BIAS_DATA_EN
start2, end2 = extract_bounds(lines, "const EN_GENDER_BIAS_DATA_EN = [", "];")

new_en_en = """  const EN_GENDER_BIAS_DATA_EN = [
    {
      titleLeft: <>
        <span className="font-bold text-pink-700 mx-1">Internalization</span>
        <span className="text-xs text-zinc-600">of "Grace" vs.</span>
        <span className="font-bold text-green-800 mx-1">Expansion</span>
        <span className="text-xs text-zinc-600">of "Influence"</span>
      </>,
      content: (
        <>
          <p>
            In physical descriptions, the English models shift from "external decoration" to "internal traits," but gender boundaries remain clear.
          </p>
          <p>
            Women’s images appear more three-dimensional in ChatGPT’s writing, with keywords moving from simple appearance to
            <span className="font-bold text-pink-800">"Grace" (478 times)</span>
            and
            <span className="font-bold text-pink-800">"Resilience" (1,309 times)</span>
            . Compared to the Chinese model's focus on "body shape," the English model emphasizes a woman's
            <span className="font-bold text-pink-800">"Poise"</span>
            and
            <span className="font-bold text-pink-800">"Confidence."</span>
          </p>
          <p>
            However, male keywords point directly to social power.
            <span className="font-bold text-green-900">"Influence" (1,089 times),</span>
            <span className="font-bold text-green-900">"Individual" (847 times),</span>
            and
            <span className="font-bold text-green-900">"Intellectual"</span>
            traits form the core of the male persona. While the English model grants men a sense of "modernity," this modernity is essentially a synonym for <strong>"rationality and control."</strong> Overall, the Chinese model describes looks, while the English model describes personality—yet the distribution still dictates that women manage beauty and emotion, while men manage logic and the world.
          </p>
        </>
      )
    },
    {
      titleLeft: <>
        <span className="font-bold text-pink-700 mx-1">Multiple Burdens</span>
        <span className="text-xs text-zinc-600">of "Care" vs.</span>
        <span className="font-bold text-green-800 mx-1">Boundless</span>
        <span className="text-xs text-zinc-600">Participation of "Explore"</span>
      </>,
      content: (
        <>
          <p>
            In behavioral logic, the English model shows a significant "spatial gap": women are kept in the community, while men head into the world.
          </p>
          <p>
            Data shows women are highly associated with
            <span className="font-bold text-pink-800">"Community" (1,474 times),</span>
            <span className="font-bold text-pink-800">"Balance" (676 times),</span>
            and
            <span className="font-bold text-pink-800">"Education" (837 times)</span>
            . High-frequency words like "Juggle" and "Manage" reveal the plight of modern women: they must act as a "Caregiver" while proving themselves in the "Professional" sphere.
          </p>
          <p>
            Conversely, male behavior is full of <strong>publicness and fluidity</strong>. Keywords like
            <span className="font-bold text-green-900">"Explore,"</span>
            <span className="font-bold text-green-900">"Diplomacy,"</span>
            and
            <span className="font-bold text-green-900">"Technology"</span>
            position men as global citizens. Unlike the specific physical activities like "fishing/sports" in the Chinese model, male behavior in the English model carries more "intellectual capital." Yet, the constant remains: women are the "Homemakers" and maintainers of relationships, their diligence flavored with <strong>sacrifice and devotion</strong>, while male diligence points toward <strong>professional achievement</strong>.
          </p>
        </>
      )
    },
    {
      titleLeft: <>
        <span className="font-bold text-pink-700 mx-1">Compensation</span>
        <span className="text-xs text-zinc-600">of "Advocacy" vs.</span>
        <span className="font-bold text-green-800 mx-1">Dominance</span>
        <span className="text-xs text-zinc-600">of "Strategy"</span>
      </>,
      content: (
        <>
          <p>
            Regarding social expectations, the English model introduces modern vocabulary about <strong>gender justice</strong>, creating a sharp contrast with the Chinese model.
          </p>
          <p>
            In female word clusters, there is a high frequency of
            <span className="font-bold text-pink-800">"Equality" (495 times),</span>
            <span className="font-bold text-pink-800">"Empowerment" (321 times),</span>
            and
            <span className="font-bold text-pink-800">"Advocate" (319 times)</span>
            . This reflects that in an English context, female identity is often tied to <strong>"Challenging barriers."</strong> In other words, the model believes a woman’s "strength" is manifested in "breaking through" the status quo.
          </p>
          <p>
            Male keywords, however, appear "smooth sailing":
            <span className="font-bold text-green-900">"Strategic,"</span>
            <span className="font-bold text-green-900">"Geopolitical,"</span>
            and
            <span className="font-bold text-green-900">"Perspective" (160 times)</span>
            . Men are preset as the rule-makers and system operators. This reveals a harsh truth: in the English model’s logic, female "progress" is a compensatory narrative requiring <strong>"Striving,"</strong> whereas male "success" is a natural, strategic extension of <strong>"Nature."</strong> The model has learned "politically correct" vocabulary, but subconsciously, it still believes the world is constructed by male strategy, while women are responsible for calling for fairness within it.
          </p>
        </>
      )
    }
  ];
"""

lines = lines[:start2] + [new_en_en] + lines[end2+1:]

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(lines)
