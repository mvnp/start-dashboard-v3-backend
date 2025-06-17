import { Request, Response, NextFunction } from "express";
import { TokenPayload } from "./auth";

interface JWTAuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export const getBusinessFilter = (user: TokenPayload | undefined, req?: Request): number[] | null => {
  if (!user) return null;
  // Super Admin (role ID: 1) can see all businesses
  if (user.isSuperAdmin) return null;
  
  // Check for selected business ID from request headers (frontend business selection)
  const selectedBusinessId = req?.headers['x-selected-business-id'] as string;
  if (selectedBusinessId) {
    const businessId = parseInt(selectedBusinessId);
    // Verify user has access to this business
    if (user.businessIds.includes(businessId)) {
      return [businessId];
    }
  }
  
  // Fallback to user's associated businesses
  return user.businessIds;
};