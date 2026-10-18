/**
 * Selected work (home #work). Desktop columns: Project | What it is | Stack | Where
 * (role or company, plus the year for eMachy). `meta` is the one-line mobile /
 * touch summary under the name ("What · Stack · Where", short enough for one line at 390 px).
 *
 * Client projects (WeDoSoftware) are named by domain and link to wedosoftware.eu. Preview
 * panels: `bg` / `ink` colour the panel, `logo` sits centred on it.
 */
export interface WorkItem {
  name: string;
  /** "What it is" column */
  what: string;
  /** "Stack" column */
  stack: string;
  /** "Where" column: role or company */
  where: string;
  /** right end of the "Where" column (eMachy only) */
  year?: string;
  /** mobile / touch one-liner under the name */
  meta: string;
  /** logo on the preview panel and the inline thumbnail (public/logos) */
  logo: { src: string; width: number; height: number };
  /** panel background + ring colour (CSS colour or var()) */
  bg: string;
  ink: string;
  /** round label on the floating preview card */
  label: string;
  /** row link: the case study, or the company site for client rows */
  href?: string;
  /** true when href leaves the site (opens in a new tab) */
  external?: boolean;
}

const EMACHY_LOGO = { src: '/logos/emachy.svg', width: 1000, height: 1000 };
const WDS_LOGO = { src: '/logos/wedosoftware.svg', width: 800, height: 800 };

export const WORK: WorkItem[] = [
  {
    name: 'eMachy',
    what: 'Industrial machines marketplace',
    stack: '.NET · Angular',
    where: 'Co-founder & tech lead',
    year: '2026',
    meta: 'Marketplace · .NET + Angular · Co-founder, 2026',
    logo: EMACHY_LOGO,
    bg: 'var(--accent)',
    ink: 'var(--on-accent)',
    label: 'View',
    href: '/work/emachy',
  },
  {
    name: 'Agriculture platforms',
    what: 'Web applications for agriculture',
    stack: '.NET · Angular',
    where: 'WeDoSoftware',
    meta: 'Web apps · .NET + Angular · WeDoSoftware',
    logo: WDS_LOGO,
    bg: 'var(--ink-2)',
    ink: 'var(--paper)',
    label: 'Visit ↗',
    href: 'https://wedosoftware.eu',
    external: true,
  },
  {
    name: 'HR & time tracking',
    what: 'Web application for HR and time tracking',
    stack: '.NET · Angular',
    where: 'WeDoSoftware',
    meta: 'Web app · .NET + Angular · WeDoSoftware',
    logo: WDS_LOGO,
    bg: 'var(--paper-2)',
    ink: 'var(--ink)',
    label: 'Visit ↗',
    href: 'https://wedosoftware.eu',
    external: true,
  },
  {
    name: 'Real estate app',
    what: 'Mobile app for real estate',
    stack: 'React Native',
    where: 'WeDoSoftware',
    meta: 'Mobile app · React Native · WeDoSoftware',
    logo: WDS_LOGO,
    bg: '#2a2d34',
    ink: 'var(--paper)',
    label: 'Visit ↗',
    href: 'https://wedosoftware.eu',
    external: true,
  },
];
