export interface IBranch {
  id: string;
  tenantId: string;
  companyId: string;
  name: string;
  code: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}
