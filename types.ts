export type LeadStatus = 'Novo Lead' | 'Qualificado' | 'Follow-up' | 'Agendou Visita' | 'Em Negociação' | 'Ganho' | 'Perdido';

export interface WatchInterest {
  id: string;
  brand: string;
  model: string;
  reference: string;
  price: number;
  image: string;
  size?: string;
  year?: string;
}

export interface Note {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  isMe: boolean;
}

export interface Lead {
  id: string;
  name: string;
  handle: string; // e.g., @jimc_collector
  avatar: string;
  email: string;
  phone: string;
  location: string;
  status: LeadStatus;
  lastStatusChange: string; // ISO Date string for tracking movement
  lastActive: string;
  source: string; // e.g., Instagram, Website
  budget: string;
  interests: WatchInterest[];
  notes: Note[];
  tags: string[]; // e.g. "VIP Referral", "High Intent"
  addedAt: string;
}

export interface Metric {
  label: string;
  value: string;
  change: string; // e.g. "+12%"
  trend: 'up' | 'down';
  isPrimary?: boolean; // For the dark green card
}

export interface ChartData {
  name: string;
  value: number; // Mantido para compatibilidade, representa receita
  leads: number;
  sales: number;
  visits: number;
}