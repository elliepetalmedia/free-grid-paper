import type { PageSize } from './types';

export const PAGE_SIZES: Record<PageSize, { width: number; height: number; label: string }> = {
  'A4': { width: 210, height: 297, label: 'A4 (210x297mm)' },
  'Letter': { width: 215.9, height: 279.4, label: 'Letter (8.5x11in)' },
  'Legal': { width: 215.9, height: 355.6, label: 'Legal (8.5x14in)' },
  'A2': { width: 420, height: 594, label: 'A2 (420x594mm)' },
  'A1': { width: 594, height: 841, label: 'A1 (594x841mm)' },
  'A0': { width: 841, height: 1189, label: 'A0 (841x1189mm)' },
  'ArchC': { width: 457.2, height: 609.6, label: 'Arch C (18x24in)' },
  'ArchD': { width: 609.6, height: 914.4, label: 'Arch D (24x36in)' },
  'ArchE': { width: 914.4, height: 1219.2, label: 'Arch E (36x48in)' },
};
