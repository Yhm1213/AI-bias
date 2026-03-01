import { origDataCn, origDataEn } from './completion-data';
import { worldCountriesData } from './world-countries-full';


// 世界国家数据和中文映射
export const countryNameMap: Record<string, { zh: string; flag: string }> = {
    'AF': { zh: '阿富汗', flag: '🇦🇫' },
    'AL': { zh: '阿尔巴尼亚', flag: '🇦🇱' },
    'DZ': { zh: '阿尔及利亚', flag: '🇩🇿' },
    'AD': { zh: '安道尔', flag: '🇦🇩' },
    'AO': { zh: '安哥拉', flag: '🇦🇴' },
    'AR': { zh: '阿根廷', flag: '🇦��' },
    'AM': { zh: '亚美尼亚', flag: '🇦🇲' },
    'AU': { zh: '澳大利亚', flag: '🇦🇺' },
    'AT': { zh: '奥地利', flag: '🇦🇹' },
    'AZ': { zh: '阿塞拜疆', flag: '🇦🇿' },
    'BS': { zh: '巴哈马', flag: '🇧🇸' },
    'BH': { zh: '巴林', flag: '🇧🇭' },
    'BD': { zh: '孟加拉国', flag: '🇧🇩' },
    'BY': { zh: '白俄罗斯', flag: '🇧🇾' },
    'BE': { zh: '比利时', flag: '🇧🇪' },
    'BZ': { zh: '伯利兹', flag: '🇧🇿' },
    'BJ': { zh: '贝宁', flag: '🇧🇯' },
    'BO': { zh: '玻利维亚', flag: '🇧🇴' },
    'BA': { zh: '波斯尼亚和黑塞哥维那', flag: '🇧🇦' },
    'BW': { zh: '博茨瓦纳', flag: '🇧🇼' },
    'BR': { zh: '巴西', flag: '🇧🇷' },
    'BN': { zh: '文莱', flag: '🇧🇳' },
    'BG': { zh: '保加利亚', flag: '🇧🇬' },
    'BF': { zh: '布基纳法索', flag: '🇧🇫' },
    'BI': { zh: '布隆迪', flag: '🇧🇮' },
    'KH': { zh: '柬埔寨', flag: '🇰🇭' },
    'CM': { zh: '喀麦隆', flag: '🇨🇲' },
    'CA': { zh: '加拿大', flag: '🇨🇦' },
    'CL': { zh: '智利', flag: '🇨🇱' },
    'CN': { zh: '中国', flag: '🇨🇳' },
    'CO': { zh: '哥伦比亚', flag: '🇨🇴' },
    'CR': { zh: '哥斯达黎加', flag: '🇨🇷' },
    'HR': { zh: '克罗地亚', flag: '🇭🇷' },
    'CU': { zh: '古巴', flag: '🇨🇺' },
    'CY': { zh: '塞浦路斯', flag: '🇨🇾' },
    'CZ': { zh: '捷克', flag: '🇨🇿' },
    'DK': { zh: '丹麦', flag: '🇩🇰' },
    'DJ': { zh: '吉布提', flag: '🇩🇯' },
    'DO': { zh: '多米尼加共和国', flag: '🇩🇴' },
    'EC': { zh: '厄瓜多尔', flag: '🇪🇨' },
    'EG': { zh: '埃及', flag: '🇪🇬' },
    'SV': { zh: '萨尔瓦多', flag: '🇸🇻' },
    'EE': { zh: '爱沙尼亚', flag: '🇪🇪' },
    'ET': { zh: '埃塞俄比亚', flag: '🇪🇹' },
    'FJ': { zh: '斐济', flag: '🇫🇯' },
    'FI': { zh: '芬兰', flag: '🇫🇮' },
    'FR': { zh: '法国', flag: '🇫🇷' },
    'GA': { zh: '加蓬', flag: '🇬🇦' },
    'GM': { zh: '冈比亚', flag: '🇬🇲' },
    'GE': { zh: '格鲁吉亚', flag: '🇬🇪' },
    'DE': { zh: '德国', flag: '🇩🇪' },
    'GH': { zh: '加纳', flag: '🇬🇭' },
    'GR': { zh: '希腊', flag: '🇬🇷' },
    'GT': { zh: '危地马拉', flag: '🇬🇹' },
    'GN': { zh: '几内亚', flag: '🇬🇳' },
    'GY': { zh: '圭亚那', flag: '🇬🇾' },
    'HT': { zh: '海地', flag: '🇭🇹' },
    'HN': { zh: '洪都拉斯', flag: '🇭🇳' },
    'HK': { zh: '香港', flag: '🇭🇰' },
    'HU': { zh: '匈牙利', flag: '🇭🇺' },
    'IS': { zh: '冰岛', flag: '🇮🇸' },
    'IN': { zh: '印度', flag: '🇮🇳' },
    'ID': { zh: '印度尼西亚', flag: '🇮🇩' },
    'IR': { zh: '伊朗', flag: '🇮🇷' },
    'IQ': { zh: '伊拉克', flag: '🇮🇶' },
    'IE': { zh: '爱尔兰', flag: '🇮🇪' },
    'IL': { zh: '以色列', flag: '🇮🇱' },
    'IT': { zh: '意大利', flag: '🇮🇹' },
    'JM': { zh: '牙买加', flag: '🇯🇲' },
    'JP': { zh: '日本', flag: '🇯🇵' },
    'JO': { zh: '约旦', flag: '🇯🇴' },
    'KZ': { zh: '哈萨克斯坦', flag: '🇰🇿' },
    'KE': { zh: '肯尼亚', flag: '🇰🇪' },
    'KP': { zh: '朝鲜', flag: '🇰🇵' },
    'KR': { zh: '韩国', flag: '🇰🇷' },
    'KW': { zh: '科威特', flag: '🇰🇼' },
    'KG': { zh: '吉尔吉斯斯坦', flag: '🇰🇬' },
    'LA': { zh: '老挝', flag: '🇱🇦' },
    'LV': { zh: '拉脱维亚', flag: '🇱🇻' },
    'LB': { zh: '黎巴嫩', flag: '🇱🇧' },
    'LS': { zh: '莱索托', flag: '🇱🇸' },
    'LR': { zh: '利比里亚', flag: '🇱🇷' },
    'LY': { zh: '利比亚', flag: '🇱🇾' },
    'LI': { zh: '列支敦士登', flag: '🇱🇮' },
    'LT': { zh: '立陶宛', flag: '🇱🇹' },
    'LU': { zh: '卢森堡', flag: '🇱🇺' },
    'MO': { zh: '澳门', flag: '🇲🇴' },
    'MK': { zh: '北马其顿', flag: '🇲🇰' },
    'MG': { zh: '马达加斯加', flag: '🇲🇬' },
    'MW': { zh: '马拉维', flag: '🇲🇼' },
    'MY': { zh: '马来西亚', flag: '🇲🇾' },
    'MV': { zh: '马尔代夫', flag: '🇲🇻' },
    'ML': { zh: '马里', flag: '🇲🇱' },
    'MT': { zh: '马耳他', flag: '🇲🇹' },
    'MR': { zh: '毛里塔尼亚', flag: '🇲🇷' },
    'MU': { zh: '毛里求斯', flag: '🇲🇺' },
    'MX': { zh: '墨西哥', flag: '🇲🇽' },
    'MD': { zh: '摩尔多瓦', flag: '🇲🇩' },
    'MC': { zh: '摩纳哥', flag: '��🇨' },
    'MN': { zh: '蒙古', flag: '🇲🇳' },
    'ME': { zh: '黑山', flag: '🇲🇪' },
    'MA': { zh: '摩洛哥', flag: '🇲🇦' },
    'MZ': { zh: '莫桑比克', flag: '🇲🇿' },
    'MM': { zh: '缅甸', flag: '🇲🇲' },
    'NA': { zh: '纳米比亚', flag: '🇳🇦' },
    'NP': { zh: '尼泊尔', flag: '🇳🇵' },
    'NL': { zh: '荷兰', flag: '🇳🇱' },
    'NZ': { zh: '新西兰', flag: '🇳🇿' },
    'NI': { zh: '尼加拉瓜', flag: '🇳🇮' },
    'NE': { zh: '尼日尔', flag: '🇳🇪' },
    'NG': { zh: '尼日利亚', flag: '🇳🇬' },
    'NO': { zh: '挪威', flag: '🇳🇴' },
    'OM': { zh: '阿曼', flag: '🇴🇲' },
    'PK': { zh: '巴基斯坦', flag: '🇵🇰' },
    'PA': { zh: '巴拿马', flag: '🇵🇦' },
    'PG': { zh: '巴布亚新几内亚', flag: '🇵🇬' },
    'PY': { zh: '巴拉圭', flag: '🇵🇾' },
    'PE': { zh: '秘鲁', flag: '🇵🇪' },
    'PH': { zh: '菲律宾', flag: '🇵🇭' },
    'PL': { zh: '波兰', flag: '🇵🇱' },
    'PT': { zh: '葡萄牙', flag: '🇵🇹' },
    'QA': { zh: '卡塔尔', flag: '🇶��' },
    'RO': { zh: '罗马尼亚', flag: '🇷🇴' },
    'RU': { zh: '俄罗斯', flag: '🇷🇺' },
    'RW': { zh: '卢旺达', flag: '🇷🇼' },
    'WS': { zh: '萨摩亚', flag: '🇼🇸' },
    'SM': { zh: '圣马力诺', flag: '🇸🇲' },
    'ST': { zh: '圣多美和普林西比', flag: '🇸🇹' },
    'SA': { zh: '沙特阿拉伯', flag: '🇸🇦' },
    'SN': { zh: '塞内加尔', flag: '🇸🇳' },
    'RS': { zh: '塞尔维亚', flag: '🇷🇸' },
    'SC': { zh: '塞舌尔', flag: '🇸🇨' },
    'SL': { zh: '塞拉利昂', flag: '🇸🇱' },
    'SG': { zh: '新加坡', flag: '🇸🇬' },
    'SK': { zh: '斯洛伐克', flag: '🇸🇰' },
    'SI': { zh: '斯洛文尼亚', flag: '🇸🇮' },
    'SB': { zh: '所罗门群岛', flag: '��🇧' },
    'SO': { zh: '索马里', flag: '🇸🇴' },
    'ZA': { zh: '南非', flag: '🇿🇦' },
    'SS': { zh: '南苏丹', flag: '🇸🇸' },
    'ES': { zh: '西班牙', flag: '🇪🇸' },
    'LK': { zh: '斯里兰卡', flag: '🇱🇰' },
    'SD': { zh: '苏丹', flag: '🇸🇩' },
    'SR': { zh: '苏里南', flag: '🇸🇷' },
    'SZ': { zh: '斯威士兰', flag: '🇸🇿' },
    'SE': { zh: '瑞典', flag: '��🇪' },
    'CH': { zh: '瑞士', flag: '🇨🇭' },
    'SY': { zh: '叙利亚', flag: '🇸🇾' },
    'TW': { zh: '台湾', flag: '🇹🇼' },
    'TJ': { zh: '塔吉克斯坦', flag: '🇹🇯' },
    'TZ': { zh: '坦桑尼亚', flag: '🇹🇿' },
    'TH': { zh: '泰国', flag: '🇹🇭' },
    'TL': { zh: '东帝汶', flag: '🇹🇱' },
    'TG': { zh: '多哥', flag: '🇹🇬' },
    'TO': { zh: '汤加', flag: '🇹🇴' },
    'TT': { zh: '特立尼达和多巴哥', flag: '🇹🇹' },
    'TN': { zh: '突尼斯', flag: '🇹🇳' },
    'TR': { zh: '土耳其', flag: '🇹🇷' },
    'TM': { zh: '土库曼斯坦', flag: '🇹🇲' },
    'UG': { zh: '乌干达', flag: '🇺🇬' },
    'UA': { zh: '乌克兰', flag: '🇺🇦' },
    'AE': { zh: '阿拉伯联合酋长国', flag: '🇦🇪' },
    'GB': { zh: '英国', flag: '🇬🇧' },
    'US': { zh: '美国', flag: '🇺🇸' },
    'UY': { zh: '乌拉圭', flag: '🇺🇾' },
    'UZ': { zh: '乌兹别克斯坦', flag: '🇺🇿' },
    'VU': { zh: '瓦努阿图', flag: '🇻🇺' },
    'VE': { zh: '委内瑞拉', flag: '🇻🇪' },
    'VN': { zh: '越南', flag: '🇻🇳' },
    'YE': { zh: '也门', flag: '🇾🇪' },
    'ZM': { zh: '赞比亚', flag: '🇿🇲' },
    'ZW': { zh: '津巴布韦', flag: '🇿🇼' }
};

// 中文名称统一：优先本地映射 → 别名 → Intl 区域显示名 → 英文名
const countryNameAliasByCode = {
    // 常见缺失或写法差异（确保 192 个代码都有中文名）
    'AQ': '南极洲',
    'AG': '安提瓜和巴布达',
    'BB': '巴巴多斯',
    'BT': '不丹',
    'CV': '佛得角',
    'CF': '中非共和国',
    'TD': '乍得',
    'KM': '科摩罗',
    'CG': '刚果共和国',
    'CD': '刚果民主共和国',
    'CI': '科特迪瓦',
    'GQ': '赤道几内亚',
    'ER': '厄立特里亚',
    'FM': '密克罗尼西亚联邦',
    'MH': '马绍尔群岛',
    'PW': '帕劳',
    'NR': '瑙鲁',
    'TV': '图瓦卢',
    'KI': '基里巴斯',
    'TO': '汤加',
    'WS': '萨摩亚',
    'GL': '格陵兰',
    'GD': '格林纳达',
    'KN': '圣基茨和尼维斯',
    'LC': '圣卢西亚',
    'VC': '圣文森特和格林纳丁斯',
    'GW': '几内亚比绍',

    'XK': '科索沃',
    // 用户指定的官方全称/常用简称覆盖
    'EG': '埃及阿拉伯共和国',
    'AE': '阿联酋',
    'IR': '伊朗伊斯兰共和国',
    'RU': '俄罗斯联邦',
    'LA': '老挝人民民主共和国',
    'BN': '文莱达鲁萨兰国',
};

const zhRegionDisplay = (typeof Intl !== 'undefined' && typeof Intl.DisplayNames !== 'undefined')
    ? new Intl.DisplayNames(['zh-CN'], { type: 'region' })
    : null;
const enRegionDisplay = (typeof Intl !== 'undefined' && typeof Intl.DisplayNames !== 'undefined')
    ? new Intl.DisplayNames(['en'], { type: 'region' })
    : null;

function resolveChineseName(code, englishName) {
    // 别名优先（用户覆盖）→ 内置映射 → Intl → 英文名
    if (countryNameAliasByCode[code]) return countryNameAliasByCode[code];
    if (countryNameMap[code] && countryNameMap[code].zh) return countryNameMap[code].zh;
    const intlName = zhRegionDisplay ? zhRegionDisplay.of(code) : null;
    return intlName || englishName;
}

// 英文名称覆盖（以你的 orig_data_en.json 为主进行对齐的常见差异）
const englishNameAliasByCode = {
    // Explicit canonical names from your list
    GB: 'United Kingdom',
    US: 'United States',
    RU: 'Russian Federation',
    IR: 'Islamic Republic of Iran',
    EG: 'Arab Republic of Egypt',
    LA: "Lao People's Democratic Republic",
    BN: 'Brunei Darussalam',
    CI: "Côte d'Ivoire",
    CD: 'Democratic Republic of the Congo',
    CG: 'Republic of the Congo',
    KR: 'South Korea',
    KP: 'North Korea',
    MK: 'North Macedonia',
    TZ: 'Tanzania',
    VN: 'Vietnam',
    SY: 'Syria',
    CZ: 'Czech Republic',
    SK: 'Slovak Republic',
    BS: 'The Bahamas',
    GM: 'The Gambia',
    TL: 'Timor-Leste',
    TT: 'Trinidad and Tobago',
    AE: 'United Arab Emirates',
    PS: 'West Bank and Gaza Strip',
    HK: 'Hong Kong Special Administrative Region',
    MO: 'Macao Special Administrative Region',
    CW: 'Curacao',
    FM: 'Federated States of Micronesia',
    FO: 'Faroe Islands',
    PF: 'French Polynesia',
    XK: 'Kosovo',
    SX: 'Sint Maarten (Dutch part)',
    TC: 'Turks and Caicos Islands',
    KY: 'Cayman Islands',
    PR: 'Puerto Rico',
    NC: 'New Caledonia',
    AS: 'American Samoa',
    EU: 'European Union',
    EZ: 'Eurozone',
    CV: 'Cape Verde',
    SZ: 'Eswatini',
    ST: 'Sao Tome and Principe',
    WS: 'Samoa'
};

function resolveEnglishName(code, fallbackEnglishName) {
    if (englishNameAliasByCode[code]) return englishNameAliasByCode[code];
    // 优先内置英文（worldCountriesData 的 name），再退回 Intl 英文显示名，最后回退原英文
    const intl = enRegionDisplay ? enRegionDisplay.of(code) : null;
    return fallbackEnglishName || intl || fallbackEnglishName;
}

function buildCnNameSetFromOrigDataCn() {
    try {
        if (typeof origDataCn !== 'undefined' && Array.isArray(origDataCn)) {
            const set = new Set();
            for (const item of origDataCn) {
                const cn = item && item.Country;
                if (cn && typeof cn === 'string') set.add(cn.trim());
            }
            return set;
        }
    } catch (e) { }
    return null;
}
function buildEnNameSetFromOrigDataEn() {
    try {
        if (typeof origDataEn !== 'undefined' && Array.isArray(origDataEn)) {
            const set = new Set();
            for (const item of origDataEn) {
                const en = item && item.Country;
                if (en && typeof en === 'string') set.add(en.trim());
            }
            return set;
        }
    } catch (e) { }
    return null;
}

function reconcileEnglishNamesWithOrigEn(processed) {
    const enSet = buildEnNameSetFromOrigDataEn();
    if (!enSet) return processed;
    return processed.map(c => {
        const current = c.name;
        if (!enSet.has(current)) {
            const alias = englishNameAliasByCode[c.code];
            const intl = enRegionDisplay ? enRegionDisplay.of(c.code) : null;
            const candidates = [alias, intl].filter(Boolean);
            for (const cand of candidates) {
                if (enSet.has(cand)) {
                    return { ...c, name: cand };
                }
            }
        }
        return c;
    });
}

// Canonical English names provided by you (authoritative for UI display)
const englishCanonicalNameSet = new Set([
    'Albania', 'Algeria', 'American Samoa', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Arab Republic of Egypt', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei Darussalam', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Cayman Islands', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Costa Rica', 'Croatia', 'Curacao', 'Cyprus', 'Czech Republic', "Côte d'Ivoire", 'Democratic Republic of the Congo', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'El Salvador', 'Equatorial Guinea', 'Estonia', 'Eswatini', 'Ethiopia', 'European Union', 'Eurozone', 'Faroe Islands', 'Federated States of Micronesia', 'Fiji', 'Finland', 'France', 'French Polynesia', 'Gabon', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hong Kong Special Administrative Region', 'Hungary', 'Iceland', 'India', 'Iraq', 'Ireland', 'Islamic Republic of Iran', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kosovo', 'Kuwait', 'Kyrgyzstan', "Lao People's Democratic Republic", 'Latvia', 'Lesotho', 'Liberia', 'Libya', 'Lithuania', 'Luxembourg', 'Macao Special Administrative Region', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Republic of the Congo', 'Romania', 'Russian Federation', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Sint Maarten (Dutch part)', 'Slovak Republic', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Tajikistan', 'Tanzania', 'Thailand', 'The Bahamas', 'The Gambia', 'Timor-Leste', 'Togo', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Turks and Caicos Islands', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vietnam', 'West Bank and Gaza Strip', 'Yemen', 'Zambia', 'Zimbabwe'
]);

function reconcileEnglishNamesWithCanonical(processed) {
    return processed.map(c => {
        const current = c.name;
        if (englishCanonicalNameSet.has(current)) return c;
        const alias = englishNameAliasByCode[c.code];
        if (alias && englishCanonicalNameSet.has(alias)) {
            return { ...c, name: alias };
        }
        const intl = enRegionDisplay ? enRegionDisplay.of(c.code) : null;
        if (intl && englishCanonicalNameSet.has(intl)) {
            return { ...c, name: intl };
        }
        return c;
    });
}

function reconcileChineseNamesWithOrigCn(processed) {
    const cnSet = buildCnNameSetFromOrigDataCn();
    if (!cnSet) return processed;
    return processed.map(c => {
        const current = c.chineseName;
        if (!cnSet.has(current)) {
            // 如果 orig_data_cn 使用了我们别名中的名称，强制使用别名
            const alias = countryNameAliasByCode[c.code];
            const byIntl = zhRegionDisplay ? zhRegionDisplay.of(c.code) : null;
            const candidates = [alias, byIntl].filter(Boolean);
            for (const cand of candidates) {
                if (cnSet.has(cand)) {
                    return { ...c, chineseName: cand };
                }
            }
        }
        return c;
    });
}

// 备用数据（如果网络请求失败）
export const fallbackCountries = [
    { "name": "China", "code": "CN", "region": "Asia", "coordinates": [24, 6], "chineseName": "中国", "flag": "🇨🇳" },
    { "name": "United States", "code": "US", "region": "Americas", "coordinates": [1, 2], "chineseName": "美国", "flag": "🇺🇸" },
    { "name": "United Kingdom", "code": "GB", "region": "Europe", "coordinates": [11, 4], "chineseName": "英国", "flag": "🇬🇧" },
    { "name": "Japan", "code": "JP", "region": "Asia", "coordinates": [27, 6], "chineseName": "日本", "flag": "🇯🇵" },
    { "name": "Germany", "code": "DE", "region": "Europe", "coordinates": [14, 5], "chineseName": "德国", "flag": "🇩🇪" },
    { "name": "France", "code": "FR", "region": "Europe", "coordinates": [12, 6], "chineseName": "法国", "flag": "🇫🇷" },
    { "name": "India", "code": "IN", "region": "Asia", "coordinates": [22, 9], "chineseName": "印度", "flag": "🇮🇳" },
    { "name": "Brazil", "code": "BR", "region": "Americas", "coordinates": [8, 12], "chineseName": "巴西", "flag": "🇧🇷" }
];

// 从原始JSON文件获取完整的世界国家数据
// 从原始JSON文件获取完整的世界国家数据 (现在直接使用导入的本地数据)
async function loadWorldCountriesData() {
    return getWorldCountriesDataSync();
}

// 创建一个立即可用的数据加载函数
function getWorldCountriesData() {
    return Promise.resolve(getWorldCountriesDataSync());
}

// 创建一个同步的数据获取函数
function getWorldCountriesDataSync() {
    if (worldCountriesData) {
        let processedData = worldCountriesData.map((country: any) => {
            const code = country['alpha-2'];
            const nameMap = countryNameMap[code];

            return {
                name: resolveEnglishName(code, country.name),
                code: code,
                region: country.region,
                coordinates: country.coordinates,
                chineseName: resolveChineseName(code, country.name),
                flag: nameMap?.flag || ''
            };
        });
        processedData = reconcileChineseNamesWithOrigCn(processedData);
        processedData = reconcileEnglishNamesWithOrigEn(processedData);
        processedData = reconcileEnglishNamesWithCanonical(processedData);
        return processedData;
    }
    return fallbackCountries;
}
export { getWorldCountriesData, getWorldCountriesDataSync };
