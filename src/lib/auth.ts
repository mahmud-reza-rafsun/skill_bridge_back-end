import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { UserRole, UserStatus } from "../../generated/prisma";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    baseURL: process.env.BETTER_AUTH_URL,
    trustedOrigins: [process.env.APP_URL || "http://localhost:3000"],

    session: {
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60,
        },
    },
    advanced: {
        cookiePrefix: "better-auth",
        useSecureCookies: process.env.NODE_ENV === "production",
        crossSubDomainCookies: {
            enabled: false,
        },
        disableCSRFCheck: true,
    },
    cookie: {
        attributes: {
            sameSite: "none",
            secure: true,
        },
    },

    user: {
        fields: {
            emailVerified: "emailVerified",
        },
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: UserRole.STUDENT,
            },
            status: {
                type: "string",
                required: false,
                defaultValue: "ACTIVE",
            },
            isDeleted: {
                type: "boolean",
                required: false,
                defaultValue: false,
            },
            phone: {
                type: "string",
                required: false
            }
        }
    },

    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        requireEmailVerification: false
    },

    emailVerification: {
        sendOnSignUp: false,
    },

    socialProviders: {
        google: {
            prompt: "select_account consent",
            accessType: "offline",
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        }
    },

    databaseHooks: {
        user: {
            create: {
                before: async (user) => {
                    return {
                        data: {
                            ...user,
                            emailVerified: true,
                            status: UserStatus.ACTIVE,
                            isDeleted: false,
                        },
                    };
                },
            },
        },
    },
});