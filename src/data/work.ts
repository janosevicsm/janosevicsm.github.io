/**
 * Selected work (home #work). Copy from design/project/Home.dc.html (desktop
 * columns) and HomeMobile.dc.html (`meta`, the one-line summary under the name).
 * Client projects at WeDoSoftware are under NDA: named by domain, not linked.
 *
 * `bg` / `ink` are the placeholder panel colours from the design (the eMachy
 * panel uses the accent). Swap in real images later if NDAs allow.
 */
export interface WorkItem {
  name: string;
  /** desktop "Discipline" column */
  discipline: string;
  /** desktop "Context" column */
  context: string;
  /** right end of the context column ("2026" or "NDA") */
  year: string;
  /** mobile / touch one-liner under the name */
  meta: string;
  /** large word on the floating preview panel */
  glyph: string;
  /** placeholder panel background + text colour (CSS colour or var()) */
  bg: string;
  ink: string;
  /** case-study link; client rows have none (NDA) */
  href?: string;
}

export const WORK_NOTE = 'Client projects at WeDoSoftware are under NDA, so they are named by domain.';

export const WORK: WorkItem[] = [
  {
    name: 'eMachy',
    discipline: 'Industrial machines marketplace',
    context: 'Own venture - Tech lead',
    year: '2026',
    meta: 'Industrial machines marketplace · Tech lead · 2026',
    glyph: 'eMachy',
    bg: 'var(--accent)',
    ink: 'var(--on-accent)',
    href: '/work/emachy',
  },
  {
    name: 'Agriculture platform',
    discipline: 'Full-stack (.NET + Angular)',
    context: 'WeDoSoftware',
    year: 'NDA',
    meta: 'Full-stack (.NET + Angular) · WeDoSoftware',
    glyph: 'Agri',
    bg: '#3e5238',
    ink: 'var(--paper)',
  },
  {
    name: 'Real estate platform',
    discipline: 'Full-stack (.NET + Angular)',
    context: 'WeDoSoftware',
    year: 'NDA',
    meta: 'Full-stack (.NET + Angular) · WeDoSoftware',
    glyph: 'Estate',
    bg: '#b8a98d',
    ink: 'var(--ink)',
  },
  {
    name: 'HR & time tracking',
    discipline: 'Full-stack (.NET + Angular)',
    context: 'WeDoSoftware',
    year: 'NDA',
    meta: 'Full-stack (.NET + Angular) · WeDoSoftware',
    glyph: 'HR',
    bg: '#2a2d34',
    ink: 'var(--paper)',
  },
  {
    name: 'Mobile apps',
    discipline: 'React Native',
    context: 'WeDoSoftware',
    year: 'NDA',
    meta: 'React Native · WeDoSoftware',
    glyph: 'Mobile',
    bg: 'var(--rule-light)',
    ink: 'var(--ink)',
  },
];
