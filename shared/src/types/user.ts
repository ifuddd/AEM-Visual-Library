/**
 * User roles in the portal
 */
export enum UserRole {
  VIEWER = 'viewer',
  CONTRIBUTOR = 'contributor',
  DOC_OWNER = 'doc_owner',
  ADMIN = 'admin',
}

/**
 * User entity
 */
export interface User {
  azureAdOid: string;
  email: string;
  displayName: string;
  role: UserRole;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Azure AD JWT token payload
 */
export interface AzureAdTokenPayload {
  oid: string; // Object ID
  email?: string;
  preferred_username?: string;
  name?: string;
  roles?: string[];
  groups?: string[];
}

/**
 * Authenticated user context
 */
export interface AuthContext {
  user: User;
  token: string;
}
