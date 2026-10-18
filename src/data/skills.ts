/** Toolbox (home #toolbox). Copy from design/project/Home.dc.html. */
export interface SkillGroup {
  title: string;
  items: string[];
}

export const SKILLS: SkillGroup[] = [
  { title: 'Backend', items: ['.NET / C#', 'Java / Spring', 'Python', 'Go', 'SQL'] },
  { title: 'Frontend', items: ['Angular', 'React', 'TypeScript'] },
  { title: 'Mobile', items: ['React Native', 'Android'] },
  { title: 'Tools', items: ['Docker', 'Azure', 'GitHub Actions', 'Claude Code', 'Figma'] },
];
