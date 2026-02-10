
export interface PageEntry {
  title: string;
  description: string;
  path: string;
  tags?: string[];
}

export interface ConfigData {
  title: string;
  subtitle: string;
  pages: PageEntry[];
}
