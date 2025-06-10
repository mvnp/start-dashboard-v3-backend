import 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId?: number;
    userEmail?: string;
    roleId?: number;
    businessIds?: number[];
    isAuthenticated?: boolean;
  }
}

export interface AuthenticatedRequest extends Express.Request {
  session: Express.SessionData & {
    userId?: number;
    userEmail?: string;
    roleId?: number;
    businessIds?: number[];
    isAuthenticated?: boolean;
  };
}