import { Request, Response, NextFunction } from "express";
import { TokenPayload } from "./auth";

interface JWTAuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export const getBusinessFilter = (user: TokenPayload | undefined, req?: Request): number[] | null => {
  if (!user) return null;
  
  // Check for selected business ID from request headers (frontend business selection)
  const selectedBusinessId = req?.headers['business-id'] as string;
  if (selectedBusinessId) {
    const businessId = parseInt(selectedBusinessId);
    // For Super Admin, allow any business ID selection
    if (user.isSuperAdmin) {
      return [businessId];
    }
    // For regular users, verify they have access to this business
    if (user.businessIds.includes(businessId)) {
      return [businessId];
    }
  }
  
  // Super Admin without business selection can see all businesses
  if (user.isSuperAdmin) return null;
  
  // Fallback to user's associated businesses
  return user.businessIds;
};