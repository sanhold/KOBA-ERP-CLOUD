export interface IDepartment {
  id: string;
  tenantId: string;
  branchId: string;
  name: string;
  code: string;
  managerId?: string;
  createdAt: Date;
  updatedAt: Date;
}
