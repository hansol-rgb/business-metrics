import { promises as fs } from 'fs';
import path from 'path';

export interface GrowthItem {
  id: number;
  title: string;
  owner: string;
  category: '자동화' | '템플릿' | '프로세스';
  estimatedHoursSaved: number;
  status: 'planned' | 'in_progress' | 'completed';
  completedAt: string | null;
  description: string;
}

export async function getGrowthItems(): Promise<GrowthItem[]> {
  const filePath = path.join(process.cwd(), 'src', 'data', 'growth-items.json');
  const content = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(content) as GrowthItem[];
}
