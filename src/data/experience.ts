/**
 * Experience timeline (home #experience). Copy from design/project/Home.dc.html;
 * the `*Short` fields are the condensed HomeMobile.dc.html copy (≤ 760 px).
 *
 * Dates: `from` / `to` are ISO year or year-month strings (used for <time
 * datetime> and the screen-reader text); `to: null` means "Present".
 */
export interface ExperienceItem {
  from: string;
  to: string | null;
  role: string;
  /** organisation after the accent dot; omitted for a single-title entry */
  org?: string;
  orgShort?: string;
  orgHref?: string;
  desc: string;
  descShort?: string;
  tags?: string[];
}

export const EXPERIENCE_SUBTITLE = 'Work & education, 2016 - now';

export const EXPERIENCE: ExperienceItem[] = [
  {
    from: '2026-02',
    to: null,
    role: 'Co-founder & Tech Lead',
    org: 'eMachy',
    desc: 'Architecture, all repositories, the cross-repo workflow and AI-assisted development for a live industrial-machinery marketplace.',
    descShort: 'Architecture, all repositories, cross-repo workflow, AI-assisted development.',
    tags: ['.NET', 'Angular', 'PostgreSQL', 'Azure', 'Claude Code'],
  },
  {
    from: '2025-06',
    to: null,
    role: 'Software Engineer',
    org: 'WeDoSoftware',
    orgHref: 'https://wedosoftware.eu',
    desc: 'Full-stack applications for agriculture, real estate, HR tracking and more - mostly .NET + Angular, plus mobile apps in React Native. Novi Sad.',
    descShort:
      'Full-stack applications for agriculture, real estate, HR tracking and more - mostly .NET + Angular, plus React Native apps.',
    tags: ['.NET', 'C#', 'Angular', 'React Native', 'SQL'],
  },
  {
    from: '2024',
    to: null,
    role: 'Master’s studies',
    org: 'Faculty of Technical Sciences',
    orgShort: 'FTN Novi Sad',
    desc: 'Software Engineering and IT, Novi Sad. Thesis: agentic software development.',
    descShort: 'Software Engineering and IT. Thesis: agentic software development.',
  },
  {
    from: '2020',
    to: '2024',
    role: 'Bachelor’s degree',
    org: 'Faculty of Technical Sciences',
    orgShort: 'FTN Novi Sad',
    desc: 'Software Engineering and IT, Novi Sad. GPA 9.20 / 10, “Dositej” scholarship.',
    descShort: 'Software Engineering and IT. GPA 9.20 / 10, “Dositej” scholarship.',
  },
  {
    from: '2016',
    to: '2020',
    role: 'Mitrovačka gimnazija',
    desc: 'Sremska Mitrovica. Computer science programme.',
  },
];

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_LONG = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export interface DateParts {
  iso: string;
  /** "Feb" or "" */
  month: string;
  year: number;
  /** "February 2026" — for screen readers */
  long: string;
}

export function dateParts(iso: string): DateParts {
  const [y, m] = iso.split('-');
  const year = Number(y);
  const mi = m ? Number(m) - 1 : -1;
  return {
    iso,
    month: mi >= 0 ? MONTHS_SHORT[mi] : '',
    year,
    long: mi >= 0 ? `${MONTHS_LONG[mi]} ${year}` : String(year),
  };
}
