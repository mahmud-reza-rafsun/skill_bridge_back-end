import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use true for port 465, false for port 587
    auth: {
        user: process.env.APP_USER,
        pass: process.env.APP_PASS,
    },
});

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    baseURL: process.env.BETTER_AUTH_URL,
    trustedOrigins: [process.env.APP_URL || "http://localhost:3000"],
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "STUDENT",
                required: false
            },
            phone: {
                type: "string",
                required: false
            },
            status: {
                type: "string",
                defaultValue: "ACTIVE",
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
        autoSignInAfterVerification: false,
        sendVerificationEmail: async ({ user, url, token }, request) => {
            try {
                const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`
                const info = await transporter.sendMail({
                    from: '"Skill Bridge" <skillbridge@edu.com>',
                    to: "rafsun16.it@gmail.com",
                    subject: "Congratulations you verify email",
                    text: "we wish for your bright furure",
                    html: `
                        <!DOCTYPE html>
                        <html lang="en">
                        <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Verify Your Email</title>
                        <style>
                            body {
                            font-family: 'Arial', sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                            }
                            .container {
                            max-width: 600px;
                            margin: 40px auto;
                            background-color: #ffffff;
                            border-radius: 10px;
                            padding: 30px;
                            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                            }
                            h1 {
                            color: #333333;
                            text-align: center;
                            }
                            p {
                            font-size: 16px;
                            color: #555555;
                            line-height: 1.5;
                            }
                            .button {
                            display: block;
                            width: 200px;
                            margin: 30px auto;
                            padding: 15px 0;
                            text-align: center;
                            background-color: #0070f3;
                            color: #ffffff !important;
                            text-decoration: none;
                            border-radius: 5px;
                            font-weight: bold;
                            }
                            .footer {
                            text-align: center;
                            font-size: 12px;
                            color: #999999;
                            margin-top: 20px;
                            }
                        </style>
                        </head>
                        <body>
                        <div class="container">
                            <h1>Welcome to Skill Bridge, ${user.name}!</h1>
                            <p>Thank you for signing up. To get started, please verify your email address by clicking the button below:</p>
                            <a href="${verificationUrl}" class="button">Verify Email</a>
                            <p>If the button doesn’t work, copy and paste this link into your browser:</p>
                            <p><a href="${verificationUrl}">${verificationUrl}</a></p>
                            <p class="footer">If you did not sign up for Skill Bridge, you can safely ignore this email.</p>
                        </div>
                        </body>
                        </html>
                        `

                });
            } catch (err) {
                throw err
            }
        },
    },
    socialProviders: {
        google: {
            prompt: "select_account consent",
            accessType: "offline",
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        }
    }
});