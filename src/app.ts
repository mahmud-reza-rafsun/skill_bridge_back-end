import express, { Application, Request, Response } from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";

// Route Imports
import { tutorRouter } from "./modules/tutor/tutor.route";
import { bookingRouter } from "./modules/bookings/booking.route";
import { ReviewRouter } from "./modules/reviews/review.route";
import { AdminRouter } from "./modules/admin/admin.route";
import { tutorsRouter } from "./modules/tutors/tutor.route";
import { categoryRouter } from "./modules/category/category.route";

const app: Application = express();

// --- CORS Configuration ---
// const allowedOrigins = [
//     process.env.APP_URL || "http://localhost:3000",
//     process.env.APP_URL,
// ].filter(Boolean) as string[];

// app.use(
//     cors({
//         origin: (origin, callback) => {
//             if (!origin) return callback(null, true);

//             const isAllowed =
//                 allowedOrigins.includes(origin) ||
//                 /^https:\/\/.*\.vercel\.app$/.test(origin);

//             if (isAllowed) {
//                 callback(null, true);
//             } else {
//                 callback(new Error(`Origin ${origin} not allowed by CORS`));
//             }
//         },
//         credentials: true,
//         methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
//         allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
//         exposedHeaders: ["Set-Cookie"],
//     })
// );

app.use(cors({
    origin: true,
    credentials: true
}));

// --- Middleware ---
app.use(express.json());
app.set("trust proxy", 1);

// --- Authentication Handler (Better Auth) ---
app.all("/api/auth/*splat", toNodeHandler(auth));

// --- API Routes ---
app.use("/api/tutors", tutorRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/tutors", tutorsRouter);
app.use("/api/reviews", ReviewRouter);
app.use("/api/category", categoryRouter);
app.use("/api/admin", AdminRouter);

// --- Base Route ---
app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "Welcome to Skill Bridge API",
        version: "1.0.0"
    });
});

export default app;