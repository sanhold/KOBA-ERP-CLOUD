export interface JwtPayload {
  sub: string;           // User ID (UUID)
  email: string;         // User Email
  tenantId: string;      // Tenant ID (UUID)
  organizationId?: string; // Organization ID (UUID)
  departmentId?: string; // Department ID (UUID)
  roles: string[];       // Assigned Role Codes (e.g. ['ADMIN_TENANT', 'COMPTABLE'])
  iat?: number;
  exp?: number;
}
