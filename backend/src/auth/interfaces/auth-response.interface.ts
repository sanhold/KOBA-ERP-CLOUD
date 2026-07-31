export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    tenantId: string;
    status: string;
    roles: string[];
  };
}
