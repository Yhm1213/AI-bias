import * as echarts from 'echarts';
import { getWorldCountriesDataSync, countryNameMap, fallbackCountries } from './world-countries-data';
import { origDataCn, origDataEn } from './completion-data';

/**
 * Tile Grid Map API - 模块化接口
 * 为大型网站集成提供的标准化API
 */

interface TileGridMapOptions {
    language?: string;
    bubbleWidth?: number;
    bubbleHeight?: number;
    spacing?: number;
    margin?: number;
    [key: string]: any;
}

interface CountryDataNode {
    name: string;
    value: number[];
    code: string;
    region: string;
    chineseName: string;
    flag: string;
}

export class TileGridMapAPI {
    containerId: string;
    currentLanguage: string;
    chartInstance: echarts.ECharts | null;
    config: TileGridMapOptions;
    _panelZBase: number;

    constructor(containerId: string, options: TileGridMapOptions = {}) {
        this.containerId = containerId;
        this.currentLanguage = options.language || 'zh';
        this.chartInstance = null;
        this.config = {
            bubbleWidth: options.bubbleWidth || 320,
            bubbleHeight: options.bubbleHeight || 100,
            spacing: options.spacing || 20,
            margin: options.margin || 20,
            ...options
        };
        this._panelZBase = 2000;
    }

    // 初始化地图
    async init() {
        try {
            const mapElement = document.getElementById(this.containerId);
            if (!mapElement) {
                throw new Error(`Container #${this.containerId} not found`);
            }

            this.chartInstance = echarts.init(mapElement);
            this._setupEventListeners();
            this._createMapOption();
            await this._loadMapData();

            return { success: true, message: 'Map initialized successfully' };
        } catch (error) {
            console.error('Map initialization failed:', error);
            return { success: false, error: error.message };
        }
    }

    // 切换语言
    switchLanguage(lang) {
        this.currentLanguage = lang;
        this._updateLanguageButtons();
        this._updateStatusMessage();
    }

    // 显示国家详情气泡
    showCountryDetails(countryData: CountryDataNode) {
        if (!origDataCn || !origDataEn) {
            return { success: false, error: 'Data not loaded' };
        }

        // 保险：在渲染新面板前，先清除上一次生成的面板/气泡
        this.clearBubbles();

        const details = this._getCountryCompletions(countryData);
        this._displayPanels(countryData, details);

        return { success: true, country: countryData.name };
    }

    // 清除所有气泡
    clearBubbles() {
        const bubbles = document.querySelectorAll('.bubble-container');
        bubbles.forEach(element => element.remove());
        const panels = document.querySelectorAll('.panel-container');
        panels.forEach(element => element.remove());
    }

    // 销毁地图实例
    destroy() {
        if (this.chartInstance) {
            this.chartInstance.dispose();
            this.chartInstance = null;
        }
        this.clearBubbles();
    }

    // 私有方法：设置事件监听器
    _setupEventListeners() {
        this.chartInstance.on('click', (params) => {
            if (params.componentType === 'series' && params.data) {
                this.showCountryDetails(params.data as CountryDataNode);
            }
        });

        // 背景点击不再自动清除面板，保持直到用户手动关闭
        this.chartInstance.getZr().on('click', () => { });

        window.addEventListener('resize', () => {
            if (this.chartInstance) {
                this.chartInstance.resize();
            }
        });
    }

    // 私有方法：创建地图配置
    _createMapOption() {
        const option = {
            tooltip: {
                trigger: 'item',
                backgroundColor: 'rgba(18, 18, 18, 0.9)',
                borderColor: '#3f3f46',
                textStyle: {
                    color: '#e4e4e7'
                },
                formatter: (params) => {
                    const data = params.data;
                    const code = data.code;
                    const nameMap = countryNameMap[code];
                    const chineseName = data.chineseName || nameMap?.zh || data.name;
                    const englishName = data.name;
                    const region = data.region;

                    let displayName, regionLabel;
                    if (this.currentLanguage === 'zh') {
                        displayName = chineseName;
                        regionLabel = '大洲: ' + region;
                    } else {
                        displayName = englishName;
                        regionLabel = 'Region: ' + region;
                    }

                    return '<div style="font-size:14px;padding:8px">' +
                        '<div style="font-weight:bold;margin-bottom:4px;color:#F68CB2">' + displayName + '</div>' +
                        '<div style="color:#a1a1aa">' + regionLabel + '</div>' +
                        '</div>';
                }
            },
            visualMap: {
                show: false,
                min: 0,
                max: 1,
                inRange: {
                    color: ['rgba(255, 255, 255, 0.05)'] // dark theme default cell color
                }
            },
            grid: {
                left: 40,
                right: 40,
                top: 80,
                bottom: 40,
                containLabel: false
            },
            xAxis: {
                type: 'category',
                data: Array.from({ length: 32 }, (_, i) => i),
                axisTick: { show: false },
                axisLine: { show: false },
                axisLabel: { show: false },
                splitLine: { show: false }
            },
            yAxis: {
                type: 'category',
                data: Array.from({ length: 24 }, (_, i) => 23 - i),
                axisTick: { show: false },
                axisLine: { show: false },
                axisLabel: { show: false },
                splitLine: { show: false }
            },
            series: [{
                name: 'Countries',
                type: 'heatmap',
                data: [],
                label: {
                    show: true,
                    color: '#2ABB3A', // Custom User Color matching theme
                    fontSize: 10,
                    fontWeight: 'bold',
                    formatter: function (params) {
                        return params.data.code;
                    }
                },
                itemStyle: {
                    color: 'rgba(255, 255, 255, 0.05)', // transparent white
                    borderColor: '#2ABB3A', // zinc-800
                    borderWidth: 1,
                    borderRadius: 4 // Rounded corners
                },
                emphasis: {
                    itemStyle: {
                        color: 'rgba(42, 187, 58, 0.8)', // Matching highlight #2ABB3A
                        borderColor: '#2ABB3A',
                        borderWidth: 2
                    },
                    label: {
                        color: '#ffffff',
                        fontSize: 12,
                        fontWeight: 'bold'
                    }
                }
            }]
        };

        this.chartInstance.setOption(option);
    }

    // 私有方法：加载地图数据
    async _loadMapData() {
        const loadingEl = document.getElementById(this.containerId).querySelector('.loading');
        if (loadingEl) {
            loadingEl.remove();
        }

        let countries;
        try {
            countries = getWorldCountriesDataSync();
        } catch (error) {
            countries = fallbackCountries;
        }

        const data = countries.map(country => ({
            name: country.name,
            value: [country.coordinates[0], 23 - country.coordinates[1], 1],
            code: country.code,
            region: country.region,
            chineseName: country.chineseName,
            flag: country.flag
        }));

        this.chartInstance.setOption({
            series: [{
                data: data
            }]
        });

        this._updateStatus(`成功加载 ${data.length} 个国家的数据`);
    }

    // 私有方法：获取国家描述数据
    _getCountryCompletions(countryData) {
        const countryNameEn = countryData.name;
        const countryNameCn = countryData.chineseName;

        return {
            cnMan: this._getCompletion(origDataCn, countryNameCn, '男人', 'cn'),
            cnWoman: this._getCompletion(origDataCn, countryNameCn, '女人', 'cn'),
            enMan: this._getCompletion(origDataEn, countryNameEn, 'man', 'en'),
            enWoman: this._getCompletion(origDataEn, countryNameEn, 'woman', 'en')
        };
    }

    // 私有方法：获取单个描述
    _getCompletion(sourceData, country, gender, lang) {
        if (!sourceData || sourceData.length === 0) {
            return lang === 'en' ? 'Loading data...' : '数据加载中...';
        }

        const countryKey = 'Country';
        const genderKey = 'Gender';
        // 归一化性别，兼容多种写法
        const normalizeGender = (value) => {
            const s = String(value || '').trim().toLowerCase();
            if (['男人', '男', '男性'].includes(value)) return 'cn_m';
            if (['女人', '女', '女性'].includes(value)) return 'cn_f';
            if (['man', 'men', 'male', 'm'].includes(s)) return 'en_m';
            if (['woman', 'women', 'female', 'f', 'w'].includes(s)) return 'en_f';
            return s || '';
        };

        const targetNorm = (() => {
            if (lang === 'cn') {
                return normalizeGender(gender === '男人' ? '男人' : '女人');
            }
            return normalizeGender(gender === 'man' ? 'man' : 'woman');
        })();

        const filtered = sourceData.filter(item => {
            const sameCountry = item[countryKey] === country;
            const itemNorm = normalizeGender(item[genderKey]);
            // 允许中英文数据都被统一比较
            const isMatch = (targetNorm === 'cn_m' && (itemNorm === 'cn_m' || itemNorm === 'en_m'))
                || (targetNorm === 'cn_f' && (itemNorm === 'cn_f' || itemNorm === 'en_f'))
                || (targetNorm === 'en_m' && (itemNorm === 'en_m' || itemNorm === 'cn_m'))
                || (targetNorm === 'en_f' && (itemNorm === 'en_f' || itemNorm === 'cn_f'));
            return sameCountry && isMatch;
        });

        if (filtered.length === 0) {
            return lang === 'en' ? 'No matching description found.' : '没有找到匹配的描述。';
        }

        const randomIndex = Math.floor(Math.random() * filtered.length);
        return filtered[randomIndex].Completion || (lang === 'en' ? 'Content is empty.' : '内容为空。');
    }

    // 私有方法：显示气泡
    _displayBubbles(countryData: CountryDataNode, details: any) {
        // 获取点击位置的像素坐标
        const pos = this.chartInstance!.convertToPixel('grid', countryData.value as number[]);

        if (!pos || pos.length < 2) {
            return;
        }

        // 获取地图容器的位置偏移
        const mapElement = document.getElementById(this.containerId);
        const mapRect = mapElement.getBoundingClientRect();

        const centerX = pos[0] + mapRect.left;
        const centerY = pos[1] + mapRect.top + window.scrollY;

        this.clearBubbles();

        // 计算自适应布局（基础位置与最大高度）
        const layout = this._calculateLayout(centerX, centerY);

        // 使用动态高度与轻微随机偏移渲染
        this._renderBubblesWithDynamicHeights(layout, details, centerX, centerY);
    }

    // 新：显示四个可拖拽且可关闭的独立面板（随机分布、不重叠、全在屏内）
    _displayPanels(countryData: CountryDataNode, details: any) {
        // 点击新国家时清除上一次的四个框
        this.clearBubbles();

        const texts = [details.enWoman, details.enMan, details.cnWoman, details.cnMan];
        const panels = [];

        // 先创建不可见面板以获取真实尺寸
        for (let i = 0; i < 4; i++) {
            const panel = this._createPanel({ x: 0, y: 0, width: this.config.bubbleWidth, height: this.config.bubbleHeight, text: (texts[i] || ''), invisible: true });
            panels.push(panel);
        }

        const placedRects = [];
        const margin = Math.max(8, this.config.margin || 20);
        const maxAttempts = 80;

        for (let i = 0; i < panels.length; i++) {
            const panel = panels[i];
            // 使用实际渲染尺寸（含内容与滚动条）
            let rect = panel.getBoundingClientRect();
            const panelWidth = Math.ceil(rect.width || this.config.bubbleWidth);
            const panelHeight = Math.ceil(rect.height || Math.max(120, this.config.bubbleHeight + 60));

            // 视口范围（以 viewport 坐标放置；元素为绝对定位相对页面）
            const viewLeft = margin;
            const viewTop = window.scrollY + margin;
            const viewRight = window.scrollX + window.innerWidth - margin - panelWidth;
            const viewBottom = window.scrollY + window.innerHeight - margin - panelHeight;

            let placed = false;
            for (let attempt = 0; attempt < maxAttempts; attempt++) {
                const x = Math.floor(this._randomBetween(viewLeft, Math.max(viewLeft, viewRight)));
                const y = Math.floor(this._randomBetween(viewTop, Math.max(viewTop, viewBottom)));
                panel.style.left = x + 'px';
                panel.style.top = y + 'px';

                const r = panel.getBoundingClientRect();
                const overlap = placedRects.some(pr => !(r.right <= pr.left || r.left >= pr.right || r.bottom <= pr.top || r.top >= pr.bottom));
                if (!overlap) {
                    placedRects.push({ left: r.left, top: r.top, right: r.right, bottom: r.bottom });
                    placed = true;
                    break;
                }
            }

            // 若未能找到完美位置，最后一次强行贴边
            if (!placed) {
                const x = Math.min(viewRight, Math.max(viewLeft, window.scrollX + (window.innerWidth - panelWidth) / 2));
                const y = Math.min(viewBottom, Math.max(viewTop, window.scrollY + (window.innerHeight - panelHeight) / 2 + i * 16));
                panel.style.left = x + 'px';
                panel.style.top = y + 'px';
            }

            panel.style.visibility = 'visible';
        }
    }

    _createPanel({ x, y, width, height, text, invisible = false }) {
        const panel = document.createElement('div');
        panel.className = 'panel-container';
        panel.style.left = x + 'px';
        panel.style.top = y + 'px';
        panel.style.width = width + 'px';
        panel.style.minHeight = Math.max(80, height) + 'px';
        panel.style.zIndex = String(++this._panelZBase);
        if (invisible) panel.style.visibility = 'hidden';

        const header = document.createElement('div');
        header.className = 'panel-header';
        const closeBtn = document.createElement('button');
        closeBtn.className = 'panel-close';
        closeBtn.type = 'button';
        closeBtn.setAttribute('aria-label', 'Close');
        closeBtn.textContent = '×';
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            panel.remove();
        });
        header.appendChild(closeBtn);
        panel.appendChild(header);

        const content = document.createElement('div');
        content.className = 'panel-content';
        content.textContent = (text || '').replace(/\n{3,}/g, '\n\n').trim();
        panel.appendChild(content);

        // 拖拽
        const onMouseDown = (ev) => {
            ev.preventDefault();
            const rect = panel.getBoundingClientRect();
            const startX = ev.clientX;
            const startY = ev.clientY;
            const offsetX = startX - rect.left;
            const offsetY = startY - rect.top;
            panel.style.zIndex = String(++this._panelZBase);
            const onMouseMove = (mv) => {
                const nx = mv.clientX - offsetX + window.scrollX;
                const ny = mv.clientY - offsetY + window.scrollY;
                panel.style.left = Math.max(0, nx) + 'px';
                panel.style.top = Math.max(0, ny) + 'px';
            };
            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        };
        header.addEventListener('mousedown', onMouseDown);
        panel.addEventListener('mousedown', () => {
            panel.style.zIndex = String(++this._panelZBase);
        });

        document.body.appendChild(panel);
        return panel;
    }

    // 生成[min, max]之间的随机数
    _randomBetween(min, max) {
        return Math.random() * (max - min) + min;
    }

    // 按内容动态高度渲染，并保持在点击点上方，增加轻微随机性
    _renderBubblesWithDynamicHeights(layout, details, centerX, centerY) {
        const texts = [details.enWoman, details.enMan, details.cnWoman, details.cnMan];
        const zIndexes = [1001, 1002, 1003, 1004];
        const pointerDirections = ['bottom', 'bottom', 'bottom', 'bottom'];
        const { margin, spacing } = this.config;
        const pointerClearance = 12;
        const screenWidth = window.innerWidth;

        // 先创建不可见的骨架DOM以测量内容高度
        const bubbles = [];
        for (let i = 0; i < layout.positions.length; i++) {
            const base = layout.positions[i];
            const xBase = base.x;
            const jitterX = this._randomBetween(-6, 6);
            const x = Math.min(Math.max(margin, xBase + jitterX), screenWidth - base.width - margin);

            const bubble = document.createElement('div');
            bubble.className = 'bubble-container';
            bubble.style.left = x + 'px';
            bubble.style.top = base.y + 'px';
            bubble.style.width = base.width + 'px';
            bubble.style.visibility = 'hidden';
            bubble.style.zIndex = String(zIndexes[i]);

            // 添加箭头类（靠近国家一侧）
            if (base.pointerPlacement === 'bottom-left') {
                bubble.classList.add('bubble-pointer-bottom-left');
            } else if (base.pointerPlacement === 'bottom-right') {
                bubble.classList.add('bubble-pointer-bottom-right');
            }

            const content = document.createElement('div');
            content.className = 'bubble-content';
            content.style.cssText = `
                padding: 12px 14px; margin: 0; color: white;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                font-size: 13px; font-weight: bold; line-height: normal;
                white-space: pre-wrap; word-break: break-word;
                overflow-x: hidden; box-sizing: content-box; background: transparent;
                pointer-events: auto; cursor: auto; position: relative;
            `;
            // 文本净化，去除首尾空白与多余空行，避免视觉空洞
            const sanitized = (texts[i] || '').replace(/\n{3,}/g, '\n\n').trim();
            // 使用内部包装，便于在滚动模式下提供上下留白（通过margin实现）
            const inner = document.createElement('div');
            inner.className = 'bubble-inner';
            inner.textContent = sanitized;
            inner.style.margin = '4px 0';
            inner.style.whiteSpace = 'pre-wrap';
            inner.style.wordBreak = 'break-word';
            content.appendChild(inner);

            bubble.appendChild(content);
            document.body.appendChild(bubble);

            bubbles.push({ bubble, content, base, inner });
        }

        // 计算每个气泡的理想高度：<=3行使用自然高度（不设定固定height），>3行对齐到整行并滚动
        const heights = [];
        for (let i = 0; i < bubbles.length; i++) {
            const { bubble, content, base, inner } = bubbles[i];
            const cs = window.getComputedStyle(content);
            const fontSize = parseFloat(cs.fontSize) || 13;
            // 固定像素行高，避免半行截断
            const lineHeightPx = Math.max(14, Math.round(fontSize * 1.45));
            content.style.lineHeight = lineHeightPx + 'px';
            const paddingTop = parseFloat(cs.paddingTop) || 0;
            const paddingBottom = parseFloat(cs.paddingBottom) || 0;
            const verticalPadding = Math.round(paddingTop + paddingBottom);
            const maxHeight = base.height; // 包含padding
            const maxContentArea = Math.max(0, maxHeight - verticalPadding);
            const threeLineArea = lineHeightPx * 3;

            // 允许内容自由扩展以测量
            content.style.maxHeight = 'none';
            content.style.overflowY = 'visible';
            content.style.height = 'auto';
            // 仅测量真实文本高度，避免滚动留白影响判断
            const naturalScrollHeight = inner.scrollHeight + verticalPadding;
            const naturalContentArea = Math.max(0, naturalScrollHeight - verticalPadding);
            // 使用向上取整，避免边界情况下被误判为更少的行数
            const naturalLines = Math.max(1, Math.ceil(naturalContentArea / lineHeightPx));

            // 读取气泡边框厚度，确保容器高度覆盖内容高度
            const bcs = window.getComputedStyle(bubble);
            const borderTop = parseFloat(bcs.borderTopWidth) || 0;
            const borderBottom = parseFloat(bcs.borderBottomWidth) || 0;
            const borderSum = Math.round(borderTop + borderBottom);

            let bubbleHeight;
            if (naturalLines <= 3 && naturalScrollHeight + borderSum <= maxHeight) {
                // 使用自然高度，完全避免半行切割
                content.style.height = 'auto';
                content.style.overflowY = 'hidden';
                bubbleHeight = Math.max(48, Math.min(maxHeight, naturalScrollHeight + borderSum));
            } else {
                // 对齐到整行，并启用滚动（严格：显示3行文本 + 上下留白）
                const dpr = window.devicePixelRatio || 1;
                const inset = 4; // 与 inner.margin 对应
                // 可视区域 = 3行 + 上下留白；加入1px冗余避免舍入溢出
                let targetContentArea = 3 * lineHeightPx + inset * 2 + Math.ceil(dpr);
                targetContentArea = Math.min(maxContentArea, targetContentArea);
                content.style.height = Math.ceil(targetContentArea) + 'px';
                content.style.overflowY = 'auto';
                bubbleHeight = Math.min(maxHeight, Math.ceil(targetContentArea) + verticalPadding + borderSum);
                // 确保可视区域内上下有留白：通过inner的margin提供
                inner.style.marginTop = '4px';
                inner.style.marginBottom = '4px';
            }

            // 二次校验：确保固定高度时不出现文字外溢或被裁1px
            const ch = content.clientHeight; // 可见高度（含padding）
            const sh = content.scrollHeight; // 内容总高（含padding）
            if (content.style.overflowY === 'auto' && sh > ch) {
                // 若仍差 1px 左右，增加 1px（不超过上限）
                const gap = Math.min(2, Math.ceil((sh - ch)));
                const newH = Math.min(ch + gap, Math.max(0, maxContentArea));
                if (newH !== ch) {
                    content.style.height = newH + 'px';
                    bubbleHeight = Math.min(maxHeight, newH + verticalPadding + borderSum);
                }
            }

            heights.push(bubbleHeight);
        }

        // 计算最终群组高度与起始Y：群组底部贴近点击点之上
        const totalHeight = heights.reduce((a, b) => a + b, 0) + spacing * (heights.length - 1);
        let startY = centerY - pointerClearance - totalHeight;
        if (startY < margin) startY = margin;

        // 应用最终位置与高度；轻微Y抖动但保持不重叠
        let accY = startY;
        for (let i = 0; i < bubbles.length; i++) {
            const { bubble, content, base } = bubbles[i];
            const jitterY = this._randomBetween(-3, 3);
            const y = Math.max(margin, accY + jitterY);
            const h = heights[i];

            bubble.style.top = y + 'px';
            bubble.style.height = h + 'px';
            // 内容高度上面已设置

            bubble.style.visibility = 'visible';

            accY = y + h + spacing;
        }
    }

    // 私有方法：计算布局
    _calculateLayout(centerX, centerY) {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const { bubbleWidth, bubbleHeight, spacing, margin } = this.config;

        // 指针占用（底部三角高度），确保群组底部在点击点之上
        const pointerClearance = 12;

        // 可用空间：既不能超过窗口可见高度，也必须限制在点击点之上
        const availableTopSpace = Math.max(0, centerY - margin - pointerClearance);
        const availableViewportSpace = screenHeight - margin * 2;
        const availableHeight = Math.min(availableTopSpace, availableViewportSpace);

        // 动态调整气泡尺寸
        let adjustedBubbleHeight = bubbleHeight;
        let adjustedSpacing = spacing;
        const totalNeededHeight = bubbleHeight * 4 + spacing * 3;

        if (totalNeededHeight > availableHeight) {
            const compressionRatio = availableHeight / Math.max(totalNeededHeight, 1);
            adjustedBubbleHeight = Math.floor(bubbleHeight * compressionRatio);
            adjustedSpacing = Math.floor(spacing * compressionRatio);
            // 最小尺寸保护
            adjustedBubbleHeight = Math.max(60, adjustedBubbleHeight);
            adjustedSpacing = Math.max(5, adjustedSpacing);
        }

        const finalTotalHeight = adjustedBubbleHeight * 4 + adjustedSpacing * 3;

        // 计算左右位置
        const leftX = Math.max(margin, centerX - bubbleWidth - spacing);
        const rightX = Math.min(screenWidth - bubbleWidth - margin, centerX + spacing);

        // 将群组底部放在点击点之上（预留指针间隙），并确保不越过顶部边界
        let startY = centerY - finalTotalHeight - pointerClearance;
        if (startY < margin) {
            startY = margin;
        }

        return {
            positions: [
                { x: leftX, y: startY, width: bubbleWidth, height: adjustedBubbleHeight, pointerPlacement: 'bottom-right' },
                { x: rightX, y: startY + adjustedBubbleHeight + adjustedSpacing, width: bubbleWidth, height: adjustedBubbleHeight, pointerPlacement: 'bottom-left' },
                { x: leftX, y: startY + (adjustedBubbleHeight + adjustedSpacing) * 2, width: bubbleWidth, height: adjustedBubbleHeight, pointerPlacement: 'bottom-right' },
                { x: rightX, y: startY + (adjustedBubbleHeight + adjustedSpacing) * 3, width: bubbleWidth, height: adjustedBubbleHeight, pointerPlacement: 'bottom-left' }
            ]
        };
    }

    // 私有方法：创建单个气泡
    _createBubble(position, text, zIndex, pointerDirection, pointerPlacement) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble-container';
        bubble.style.left = position.x + 'px';
        bubble.style.top = position.y + 'px';
        bubble.style.width = position.width + 'px';
        bubble.style.height = position.height + 'px';
        bubble.style.zIndex = zIndex;

        const content = document.createElement('div');
        content.className = 'bubble-content';
        content.innerHTML = text;

        content.style.cssText = `
            padding: 15px;
            padding-right: 15px;
            color: white;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            font-size: 13px;
            font-weight: bold;
            line-height: 1.5;
            height: ${position.height - 30}px;
            overflow-y: auto;
            overflow-x: hidden;
            box-sizing: border-box;
            background: transparent;
            pointer-events: auto;
            cursor: auto;
            z-index: ${zIndex + 1};
            position: relative;
        `;

        bubble.appendChild(content);

        // 添加底部箭头指示（单箭头，靠近国家一侧，改为容器类控制）
        if (pointerDirection === 'bottom') {
            if (pointerPlacement === 'bottom-left') {
                bubble.classList.add('bubble-pointer-bottom-left');
            } else if (pointerPlacement === 'bottom-right') {
                bubble.classList.add('bubble-pointer-bottom-right');
            }
        }

        document.body.appendChild(bubble);
    }

    // 私有方法：更新语言按钮状态
    _updateLanguageButtons() {
        const zhBtn = document.getElementById('lang-zh');
        const enBtn = document.getElementById('lang-en');

        if (zhBtn && enBtn) {
            zhBtn.classList.toggle('active', this.currentLanguage === 'zh');
            enBtn.classList.toggle('active', this.currentLanguage === 'en');
        }
    }

    // 私有方法：更新状态信息
    _updateStatusMessage() {
        const statusEl = document.getElementById('status');
        if (statusEl) {
            const message = this.currentLanguage === 'zh'
                ? '界面语言已切换为中文，点击国家查看中英双语描述'
                : 'Interface language switched to English, click countries to view bilingual descriptions';
            statusEl.textContent = message;
            setTimeout(() => {
                statusEl.textContent = '成功加载 192 个国家的数据';
            }, 3000);
        }
    }

    // 私有方法：更新状态
    _updateStatus(message) {
        const statusEl = document.getElementById('status');
        if (statusEl) {
            statusEl.textContent = message;
        }
    }
}

