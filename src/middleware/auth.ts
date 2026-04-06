import { NextFunction, Request, Response } from "express";
import { auth as betterAuth } from '../lib/auth';
import { prisma } from "../lib/prisma";
import { UserRole } from "../../generated/prisma";

// Explicitly export UserRole so it can be imported as a named export elsewhere
export { UserRole };

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                name: string;
                role: string;
                emailVerified: boolean;
            }
        }
    }
}

const auth = (...roles: UserRole[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // 1. Get session using Better Auth API
            const session = await betterAuth.api.getSession({
                headers: req.headers as any
            });

            if (!session) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized! Please login."
                });
            }

            // 2. Fetch user from DB to check status (Blocked/Deleted)
            const dbUser = await prisma.user.findUnique({
                where: { id: session.user.id }
            });

            if (!dbUser || dbUser.isDeleted || dbUser.status === "BLOCKED") {
                return res.status(403).json({
                    success: false,
                    message: "Your account is deleted or blocked. Please contact admin."
                });
            }

            // 3. Check email verification if required
            if (!session.user.emailVerified) {
                return res.status(403).json({
                    success: false,
                    message: "Email verification required. Please verify your email!"
                });
            }

            // 4. Attach user data to request object
            req.user = {
                id: session.user.id,
                email: session.user.email,
                name: session.user.name,
                role: session.user.role as string,
                emailVerified: session.user.emailVerified
            };

            // 5. Role based access control
            if (roles.length && !roles.includes(req.user.role as UserRole)) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden! You don't have permission to access this resource."
                });
            }

            next();
        } catch (err) {
            next(err);
        }
    };
};

export default auth;