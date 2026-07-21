export const SITE_NAME = 'SingFit STUDIO Caregiver';
export const PRODUCT_DESCRIPTOR = 'STUDIO Caregiver';
export const PAGE_TITLE = 'SingFit STUDIO Caregiver Walkthrough';

export const CALENDLY_URL = 'https://calendly.com/rachelfrancine/complimentary-singfit-session';

export type SectionId = 'video' | 'who' | 'benefits' | 'stories' | 'questions';

export interface NavigationItem {
  label: string;
  href: `#${SectionId}`;
}

export const MAIN_NAVIGATION = [
  { label: 'See a session', href: '#video' },
  { label: 'Who it’s for', href: '#who' },
  { label: 'Benefits', href: '#benefits' },
  { label: 'Stories', href: '#stories' },
  { label: 'Questions', href: '#questions' },
] satisfies readonly NavigationItem[];

export interface FooterLegalLink {
  label: string;
  href: string;
  target: '_blank';
  rel: 'noopener noreferrer';
}

export const FOOTER_LEGAL_LINKS = [
  {
    label: 'Privacy Policy',
    href: 'https://musicismedicine.singfit.com/privacy',
    target: '_blank',
    rel: 'noopener noreferrer',
  },
  {
    label: 'Terms of Service',
    href: 'https://musicismedicine.singfit.com/terms',
    target: '_blank',
    rel: 'noopener noreferrer',
  },
  {
    label: 'Accessibility Statement',
    href: 'https://musicismedicine.singfit.com/accessibility',
    target: '_blank',
    rel: 'noopener noreferrer',
  },
] satisfies readonly FooterLegalLink[];

export const VIMEO_SESSION = {
  embedUrl: 'https://player.vimeo.com/video/1194167243?badge=0&autopause=0&player_id=singfit-session-video&app_id=58479',
  fallbackUrl: 'https://vimeo.com/1194167243',
  title: 'Watch how a SingFit STUDIO Caregiver session works',
} as const;
