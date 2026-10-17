import { Stage, StageConfig } from '@/types/ats';

export const STAGES: StageConfig[] = [
  {
    id: 'applied',
    label: 'Applied',
    description: 'Fresh applicants received from job portal',
    color: {
      bg: 'bg-blue-50 dark:bg-blue-950/30',
      text: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-200 dark:border-blue-800',
      badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
      accent: '#3b82f6',
    },
  },
  {
    id: 'screening',
    label: 'Screening',
    description: 'Initial resume review and phone qualification',
    color: {
      bg: 'bg-purple-50 dark:bg-purple-950/30',
      text: 'text-purple-700 dark:text-purple-300',
      border: 'border-purple-200 dark:border-purple-800',
      badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
      accent: '#8b5cf6',
    },
  },
  {
    id: 'interview',
    label: 'Technical Interview',
    description: 'System design, live coding, and technical evaluation',
    color: {
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      text: 'text-amber-700 dark:text-amber-300',
      border: 'border-amber-200 dark:border-amber-800',
      badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
      accent: '#f59e0b',
    },
  },
  {
    id: 'offer',
    label: 'Offer Extended',
    description: 'Formal employment offer shared with candidate',
    color: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      text: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-200 dark:border-emerald-800',
      badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300',
      accent: '#10b981',
    },
  },
  {
    id: 'hired',
    label: 'Hired',
    description: 'Offer accepted and onboarding initiated',
    color: {
      bg: 'bg-teal-50 dark:bg-teal-950/30',
      text: 'text-teal-700 dark:text-teal-300',
      border: 'border-teal-200 dark:border-teal-800',
      badge: 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300',
      accent: '#0d9488',
    },
  },
  {
    id: 'rejected',
    label: 'Rejected',
    description: 'Not moved forward for this cycle',
    color: {
      bg: 'bg-rose-50 dark:bg-rose-950/30',
      text: 'text-rose-700 dark:text-rose-300',
      border: 'border-rose-200 dark:border-rose-800',
      badge: 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300',
      accent: '#f43f5e',
    },
  },
];

export const DEPARTMENTS = [
  'Engineering',
  'Product',
  'Design',
  'Data & AI',
  'Operations',
] as const;

export const AVAILABLE_ROLES = [
  'Full Stack Developer Intern',
  'Frontend Engineer',
  'Backend Engineer (Java / Node.js)',
  'AI / ML Engineer',
  'UI/UX Product Designer',
  'Data Analyst Intern',
  'DevOps & Cloud Engineer',
];
