import { Request, Response, NextFunction } from "express";
import storage from "./storage";

interface AuthenticatedRequest extends Request {
  session: any;
  user?: {
    id: number;
    email: string;
    roleId: number;
    businessIds: number[];
    isSuperAdmin: boolean;
  };
}

export const requireAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.session?.isAuthenticated || !req.session?.userId) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const userData = await storage.getUserWithRoleAndBusiness(req.session.userId);
    if (!userData) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = {
      id: userData.user.id,
      email: userData.user.email,
      roleId: userData.roleId,
      businessIds: userData.businessIds,
      isSuperAdmin: userData.roleId === 1
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ error: "Authentication error" });
  }
};

export const getBusinessFilter = (user: AuthenticatedRequest['user']): number[] | null => {
  if (!user) return null;
  // Super Admin (role ID: 1) can see all businesses
  if (user.isSuperAdmin) return null;
  // Other users see only their associated businesses
  return user.businessIds;
};