export interface Source {
  title: string;
  url: string;
}
export interface Period {
  start: number;
  end: number;
}
export interface Dynasty extends Period {
  id: string;
  name: string;
  short: string;
  capital: string;
  capitalCoord: [number, number];
  color: string;
  summary: string;
  territoryYear: number;
  territory: [number, number][];
  sources: Source[];
}
export interface Emperor {
  id: string;
  dynastyId: string;
  name: string;
  title: string;
  lifespan: string;
  reigns: Period[];
  summary: string;
  achievements: string[];
  assessment: string;
  sources: Source[];
  imported?: boolean;
  sourceTitle?: string;
  reignText?: string[];
  eraNames?: string;
  articleSections?: { title: string; content: string }[];
  parentNames?: string[];
  fetchStatus?: string;
  claimant?: boolean;
  biographyId?: string;
}
export interface HistoricalEvent extends Period {
  id: string;
  dynastyId: string;
  title: string;
  category: '政治' | '战争' | '文化' | '交流' | '建设';
  location: string;
  coordinates: [number, number];
  emperorIds: string[];
  summary: string;
  content: string;
  sources: Source[];
}
export interface Succession {
  from: string;
  to: string;
  relation: string;
  direct: boolean;
  note: string;
}
