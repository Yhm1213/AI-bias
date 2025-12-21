
export interface Publication {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  doi?: string;
  abstract: string;
  tags: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  link?: string;
  status: 'Completed' | 'Ongoing' | 'Proposed';
}

export interface ResearchMetric {
  subject: string;
  value: number;
  fullMark: number;
}
