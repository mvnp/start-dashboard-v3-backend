import { Request, Response, NextFunction } from "express";
import { TokenPayload } from "./auth";

interface JWTAuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export const getBusinessFilter = (user: TokenPayload | undefined): number[] | null => {
  if (!user) return null;
  // Super Admin (role ID: 1) can see all businesses
  if (user.isSuperAdmin) return null;
  // Other users see only their associated businesses
  return user.businessIds;
};