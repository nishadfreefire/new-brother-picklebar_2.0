import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'CHANGE_THIS_IN_PRODUCTION_' + Math.random().toString(36);
const JWT_EXPIRES_IN = '2h';

export interface AuthenticatedRequest extends Request {
  adminAuthenticated?: boolean;
  sessionId?: string;
}

// Generate JWT token after successful admin authentication
export function generateAdminToken(): string {
  return jwt.sign(
    { 
      role: 'admin', 
      authenticated: true,
      timestamp: Date.now() 
    }, 
    JWT_SECRET, 
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// Verify JWT token middleware
export function verifyAdminToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '') || 
                req.cookies?.adminToken ||
                req.headers['x-admin-token'] as string;

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      error: 'Authentication required. Please verify admin PIN first.' 
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { role: string; authenticated: boolean };
    
    if (decoded.role !== 'admin' || !decoded.authenticated) {
      return res.status(403).json({ 
        success: false, 
        error: 'Invalid admin credentials' 
      });
    }

    req.adminAuthenticated = true;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ 
        success: false, 
        error: 'Session expired. Please login again.' 
      });
    }
    return res.status(401).json({ 
      success: false, 
      error: 'Invalid authentication token' 
    });
  }
}

// Request size limiter
export function requestSizeLimiter(maxSizeInMB: number = 10) {
  return (req: Request, res: Response, next: NextFunction) => {
    const contentLength = parseInt(req.headers['content-length'] || '0', 10);
    const maxBytes = maxSizeInMB * 1024 * 1024;

    if (contentLength > maxBytes) {
      return res.status(413).json({ 
        success: false, 
        error: `Request too large. Maximum size is ${maxSizeInMB}MB` 
      });
    }
    next();
  };
}

// Simple request timeout middleware
export function requestTimeout(timeoutMs: number = 30000) {
  return (req: Request, res: Response, next: NextFunction) => {
    const timeout = setTimeout(() => {
      if (!res.headersSent) {
        res.status(408).json({ 
          success: false, 
          error: 'Request timeout' 
        });
      }
    }, timeoutMs);

    res.on('finish', () => clearTimeout(timeout));
    res.on('close', () => clearTimeout(timeout));
    
    next();
  };
}
