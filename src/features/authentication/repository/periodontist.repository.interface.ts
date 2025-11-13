import type { Tables } from '@/lib/supabase/types';

type PeriodontistRow = Tables<'periodontist'>;

export type PeriodontistProfile = {
  id: string;
  email: string;
  fullName: string;
  professionalCredentials: string | null;
  accountStatus: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
};

export type CreatePeriodontistInput = {
  id: string;
  email: string;
  fullName: string;
  professionalCredentials?: string | null;
};

export type UpdatePeriodontistInput = Partial<{
  fullName: string;
  professionalCredentials: string | null;
  accountStatus: 'active' | 'inactive' | 'suspended';
}>;

export interface PeriodontistRepositoryPort {
  createPeriodontist(input: CreatePeriodontistInput): Promise<PeriodontistProfile>;
  findByEmail(email: string): Promise<PeriodontistProfile | null>;
  updatePeriodontist(id: string, input: UpdatePeriodontistInput): Promise<PeriodontistProfile>;
}

export const mapPeriodontistRowToProfile = (
  row: PeriodontistRow,
): PeriodontistProfile => ({
  id: row.id,
  email: row.email,
  fullName: row.full_name,
  professionalCredentials: row.professional_credentials,
  accountStatus: row.account_status,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});
