import { NextFunction, Request, Response } from "express";
import { auth as betterAuth } from '../lib/auth';
import { prisma } from "../lib/prisma";
import { UserRole } from "@prisma/client";

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
            const session = await betterAuth.api.getSession({
                headers: req.headers as any
            });

            if (!session) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized! Please login."
                });
            }

            const dbUser = await prisma.user.findUnique({
                where: { id: session.user.id }
            });

            if (!dbUser || dbUser.isDeleted || dbUser.status === "BLOCKED") {
                return res.status(403).json({
                    success: false,
                    message: "Your account is deleted or blocked. Please contact admin."
                });
            }

            if (!session.user.emailVerified) {
                return res.status(403).json({
                    success: false,
                    message: "Email verification required. Please verify your email!"
                });
            }

            // Normalize role: better-auth might return string or string[]
            const rawRole = session.user.role;
            const userRole = Array.isArray(rawRole) ? rawRole[0] : rawRole;

            req.user = {
                id: session.user.id,
                email: session.user.email,
                name: session.user.name,
                role: userRole as string,
                emailVerified: session.user.emailVerified
            };

            const currentUserRole = String(req.user.role).toUpperCase();

            // অ্যালাউড রোলগুলোকেও আপারকেস স্ট্রিং এ কনভার্ট করে নেওয়া
            const allowedRoles = roles.map(role => String(role).toUpperCase());

            if (roles.length && !allowedRoles.includes(currentUserRole)) {
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