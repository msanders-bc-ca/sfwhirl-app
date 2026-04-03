import { Topic } from '@/types';

export const SEED_TOPICS: Omit<Topic, 'id'>[] = [
  {
    title: '510(k) Clearance Pathway',
    category: 'regulatory',
    description: 'Substantial equivalence, predicate devices, and FDA submission strategy.',
    difficulty: 'beginner',
  },
  {
    title: 'PMA Approval Process',
    category: 'regulatory',
    description: 'Pre-market approval for high-risk Class III devices — clinical trials, panels, and timelines.',
    difficulty: 'advanced',
  },
  {
    title: 'MDR & EU CE Marking',
    category: 'regulatory',
    description: 'European Medical Device Regulation, notified bodies, and clinical evaluation reports.',
    difficulty: 'intermediate',
  },
  {
    title: 'Reimbursement & Coding (CMS)',
    category: 'reimbursement',
    description: 'CPT/HCPCS codes, coverage decisions, and building the economic case for payers.',
    difficulty: 'intermediate',
  },
  {
    title: 'Market Sizing & Segmentation',
    category: 'market_access',
    description: 'TAM/SAM/SOM analysis, competitive landscape, and beachhead markets.',
    difficulty: 'beginner',
  },
  {
    title: 'Design Controls (21 CFR Part 820)',
    category: 'design_controls',
    description: 'Design history file, verification vs. validation, and risk management.',
    difficulty: 'intermediate',
  },
  {
    title: 'Clinical Evidence Strategy',
    category: 'clinical_evidence',
    description: 'IDE trials, post-market surveillance, and building a body of clinical data.',
    difficulty: 'advanced',
  },
  {
    title: 'Commercialization & Go-to-Market',
    category: 'commercialization',
    description: 'Sales channel strategy, KOL engagement, and launch sequencing.',
    difficulty: 'intermediate',
  },
  {
    title: 'Quality Management Systems (ISO 13485)',
    category: 'manufacturing',
    description: 'QMS requirements, CAPA, and audit readiness for medical device manufacturers.',
    difficulty: 'intermediate',
  },
  {
    title: 'Health Economics & HEOR',
    category: 'reimbursement',
    description: 'Cost-effectiveness models, budget impact analysis, and value-based contracting.',
    difficulty: 'advanced',
  },
];

export const CATEGORY_LABELS: Record<string, string> = {
  regulatory: 'Regulatory',
  market_access: 'Market Access',
  reimbursement: 'Reimbursement',
  clinical_evidence: 'Clinical Evidence',
  design_controls: 'Design Controls',
  manufacturing: 'Manufacturing & Quality',
  commercialization: 'Commercialization',
};

export const CATEGORY_COLORS: Record<string, string> = {
  regulatory: '#3B82F6',
  market_access: '#10B981',
  reimbursement: '#F59E0B',
  clinical_evidence: '#EF4444',
  design_controls: '#8B5CF6',
  manufacturing: '#6B7280',
  commercialization: '#EC4899',
};

export const DIFFICULTY_XP: Record<string, number> = {
  beginner: 10,
  intermediate: 20,
  advanced: 35,
};
