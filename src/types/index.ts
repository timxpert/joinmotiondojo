export interface NinjaProject {
  title: string;
  video: string;
  note: string;
  poster?: string;
}

export interface NinjaSocialLinks {
  instagram?: string;
  x?: string;
  linkedin?: string;
  behance?: string;
  tiktok?: string;
  youtube?: string;
  website?: string;
  whatsapp?: string;
  email?: string;
}

export interface Ninja {
  slug: string;
  name: string;
  specialty: string;
  status: 'graduate' | 'training';
  phase: string;
  cohort: string;
  openToWork: boolean;
  photo?: string;
  bio: string;
  project: NinjaProject;
  links: NinjaSocialLinks;
  isSample?: boolean;
}

export interface Story {
  id: string;
  name: string;
  role: string;
  poster: string;
  videoUrl: string;
  summary: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}
