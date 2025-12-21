
import { Publication, Project, ResearchMetric } from './types';

export const RESEARCHER_NAME = "张科研 博士";
export const RESEARCHER_TITLE = "高级研究员 / 人工智能实验室负责人";
export const BIO = "致力于大规模机器学习、神经符号计算以及跨学科AI应用的探索。在顶会如 NeurIPS, ICML, CVPR 发表论文 20 余篇。目前关注点在于如何提升模型的推理能力与知识图谱的融合。";

export const PUBLICATIONS: Publication[] = [
  {
    id: "1",
    title: "Towards Scalable Neuro-Symbolic Reasoning in Large Language Models",
    authors: ["Zhang, K.", "Li, W.", "Wang, J."],
    journal: "Nature Machine Intelligence",
    year: 2024,
    doi: "10.1038/nmi.2024.123",
    abstract: "This paper proposes a novel framework for integrating logical rules into transformer architectures...",
    tags: ["LLM", "Neuro-Symbolic", "Reasoning"]
  },
  {
    id: "2",
    title: "Graph-based Cross-modal Retrieval for Scientific Knowledge Discovery",
    authors: ["Zhang, K.", "Chen, X."],
    journal: "IEEE TPAMI",
    year: 2023,
    abstract: "Exploring the latent representations of multi-modal scientific data using graph neural networks.",
    tags: ["Graph Neural Networks", "Knowledge Discovery"]
  }
];

export const PROJECTS: Project[] = [
  {
    id: "p1",
    name: "Project Minerva",
    description: "开发一个具备多步逻辑推理能力的学术型大语言模型。",
    imageUrl: "https://picsum.photos/seed/minerva/800/600",
    status: "Ongoing"
  },
  {
    id: "p2",
    name: "EcoNet AI",
    description: "利用卫星影像分析区域生态环境变化的AI监测平台。",
    imageUrl: "https://picsum.photos/seed/eco/800/600",
    status: "Completed"
  }
];

export const METRICS: ResearchMetric[] = [
  { subject: '深度学习', value: 120, fullMark: 150 },
  { subject: '知识图谱', value: 110, fullMark: 150 },
  { subject: '计算机视觉', value: 85, fullMark: 150 },
  { subject: '自然语言处理', value: 145, fullMark: 150 },
  { subject: '数学建模', value: 90, fullMark: 150 },
];
