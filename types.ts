export interface ShowcaseExample {
  id: string;
  title: string;
  title_zh: string;
  description: string;
  description_zh: string;
  thumbnail: string; // URL to image
  category: 'visualization' | 'analysis' | 'animation' | 'basic';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  code: string; // The raw source code to display
}

export enum ViewMode {
  Map = 'MAP',
  Split = 'SPLIT',
  Code = 'CODE'
}

export type Language = 'en' | 'zh';
export type Theme = 'light' | 'dark';