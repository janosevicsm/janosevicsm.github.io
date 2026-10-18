/** Site-wide constants (copy from the design handoff). */
export const SITE = {
  name: 'Marko Janošević',
  title: 'Marko Janošević — Full-stack Engineer & Tech Lead',
  description:
    'Marko Janošević — full-stack engineer and tech lead in Novi Sad, Serbia. Co-founder of eMachy, a B2B marketplace for industrial machines. .NET, Angular, React Native and AI-assisted development.',
  email: 'markojanosevicsm7@gmail.com',
  github: 'https://github.com/janosevicsm',
  linkedin: 'https://linkedin.com/in/marko-janosevic',
  instagram: 'https://www.instagram.com/kanj0s/',
  wedosoftware: 'https://wedosoftware.eu',
  emachy: 'https://emachy.com',
  location: 'Novi Sad, Serbia',
  coordinates: '45.27° N - 19.83° E',
} as const;

/** Intro loader greetings, in order (English and Serbian first). The loader's bars and counter follow the count. */
export const LOADER_GREETINGS = ['Hello', 'Zdravo', 'Hola', 'Bonjour', 'Ciao', 'Hallo', 'Olá', '你好'] as const;

/** Home page sections, in order (ids are the anchors used by the nav). */
export const NAV_LINKS = [
  { label: 'Work', id: 'work', key: 'work' },
  { label: 'Experience', id: 'experience', key: 'experience' },
  { label: 'About', id: 'about', key: 'about' },
  { label: 'Contact', id: 'contact', key: 'contact' },
] as const;

export const SOCIALS = [
  { label: 'GitHub', href: SITE.github },
  { label: 'LinkedIn', href: SITE.linkedin },
  { label: 'Instagram', href: SITE.instagram },
  { label: 'Email', href: `mailto:${SITE.email}` },
] as const;
