
import { GoogleGenAI } from "@google/genai";
import { PUBLICATIONS, BIO, RESEARCHER_NAME } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const askResearchAssistant = async (question: string) => {
  const model = "gemini-3-flash-preview";
  
  // 构建系统提示语，让 Gemini 扮演研究员助理
  const systemInstruction = `
    你现在是 ${RESEARCHER_NAME} 的 AI 学术助理。
    你的职责是根据以下背景资料回答访客的问题：
    个人简介：${BIO}
    发表论文：${JSON.stringify(PUBLICATIONS.map(p => ({title: p.title, abstract: p.abstract})))}
    
    请以专业、礼貌、简洁的语气回答。如果问题超出了上述背景范围，请委婉表示建议直接联系研究员。
    始终使用中文回答。
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: question,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "抱歉，助理目前无法响应，请稍后再试。";
  }
};
