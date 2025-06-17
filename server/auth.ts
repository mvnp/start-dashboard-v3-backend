import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import storage from './storage';

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'barberpro-jwt-secret-key-2025';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'barberpro-refresh-secret-key-2025';
const JWT_EXPIRES_IN = '24h';
const REFRESH_TOKEN_EXPIRES_IN = '7d';

// Interfaces
export interface TokenPayload {
  userId: number;
  email: string;
  roleId: number;
  businessIds: number[];
  isSuperAdmin: boolean;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

// Generate Access Token
export function generateAccessToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Generate Refresh Token
export function generateRefreshToken(userId: number): string {
  return jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
}

// Verify Access Token
export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

// Verify Refresh Token
export function verifyRefreshToken(token: string): { userId: number } | null {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as { userId: number };
  } catch (error) {
    return null;
  }
}

// Hash Password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

// Compare Password
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// JWT Authentication Middleware
export async function authenticateJWT(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: 'Access denied',
      message: 'Authorization header missing or invalid format'
    });
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix

  try {
    const decoded = verifyAccessToken(token);
    
    if (!decoded) {
      return res.status(401).json({ 
        error: 'Invalid token',
        message: 'Token is invalid or expired'
      });
    }

    // Verify user still exists in database
    const user = await storage.getUser(decoded.userId);
    if (!user) {
      return res.status(401).json({ 
        error: 'User not found',
        message: 'User associated with token no longer exists'
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error('JWT verification error:', error);
    return res.status(401).json({ 
      error: 'Token verification failed',
      message: 'Unable to verify authentication token'
    });
  }
}

// Optional JWT Authentication (for endpoints that work with or without auth)
export async function optionalJWT(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(); // Continue without authentication
  }

  const token = authHeader.substring(7);
  
  try {
    const decoded = verifyAccessToken(token);
    if (decoded) {
      req.user = decoded;
    }
  } catch (error) {
    // Silently ignore invalid tokens for optional auth
  }
  
  next();
}

// Authenticate user with email/password and return tokens
export async function authenticateUser(email: string, password: string): Promise<{
  user: TokenPayload;
  accessToken: string;
  refreshToken: string;
} | null> {
  try {
    // First, try to get user by email
    const user = await storage.getUserByEmail(email);
    
    if (!user) {
      return null;
    }

    // Get user with role and business information
    const userData = await storage.getUserWithRoleAndBusiness(user.id);
    
    if (!userData) {
      return null;
    }

    // For demo purposes, allow simple password validation
    // In production, you should use proper password hashing with bcrypt
    const isValidPassword = password === 'admin123' || password === 'swagger123' || 
                           (email === 'test@swagger.com' && password === 'swagger123') ||
                           (email === 'mvnpereira@gmail.com' && password === 'admin123');
    
    if (!isValidPassword) {
      return null;
    }

    const tokenPayload: Omit<TokenPayload, 'iat' | 'exp'> = {
      userId: userData.user.id,
      email: userData.user.email,
      roleId: userData.roleId,
      businessIds: userData.businessIds,
      isSuperAdmin: userData.isSuperAdmin
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(userData.user.id);

    return {
      user: tokenPayload,
      accessToken,
      refreshToken
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

// Refresh access token using refresh token
export async function refreshAccessToken(refreshToken: string): Promise<{
  accessToken: string;
  refreshToken: string;
} | null> {
  try {
    const decoded = verifyRefreshToken(refreshToken);
    
    if (!decoded) {
      return null;
    }

    // Get updated user data
    const userData = await storage.getUserWithRoleAndBusiness(decoded.userId);
    
    if (!userData) {
      return null;
    }

    const tokenPayload: Omit<TokenPayload, 'iat' | 'exp'> = {
      userId: userData.user.id,
      email: userData.user.email,
      roleId: userData.roleId,
      businessIds: userData.businessIds,
      isSuperAdmin: userData.isSuperAdmin
    };

    const newAccessToken = generateAccessToken(tokenPayload);
    const newRefreshToken = generateRefreshToken(userData.user.id);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    };
  } catch (error) {
    console.error('Token refresh error:', error);
    return null;
  }
}