export interface ICompany {
  id: string;
  tenantId: string;
  organizationId: string;
  name: string;
  registrationNumber?: string;
  taxId?: string;
  createdAt: Date;
  updatedAt: Date;
}
