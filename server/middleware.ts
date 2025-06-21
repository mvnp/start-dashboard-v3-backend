import { Request, Response, NextFunction } from "express";
import { TokenPayload } from "./auth";

interface JWTAuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export const getBusinessFilter = (user: TokenPayload | undefined, req?: Request): number[] | null => {
  if (!user) return null;
  
  // Check for selected business ID from request headers (frontend business selection)
  const selectedBusinessId = req?.headers['x-selected-business-id'] as string;
  console.log(selectedBusinessId);
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
  
  // For merchants (Role ID 2), return all their business IDs for comprehensive access
  if (user.roleId === 2) {
    return user.businessIds.length > 0 ? user.businessIds : [];
  }
  
  // For other non-Super Admin users, they MUST have a selected business ID
  // Return empty array to prevent access to any data if no business is selected
  return [];
};