import express from "express";
import { Application } from "express";
import cors from "cors"
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { categoryRouter } from "./modules/categories/category.route";
import { tutroRouter } from "./modules/tutor/tutor.route";
import { bookingRouter } from "./modules/bookings/booking.route";
import { ReviewRouter } from "./modules/reviews/review.route";
import { AdminRouter } from "./modules/admin/admin.route";

const app: Application = express();

const allowedOrigins = [
    process.env.APP_URL || "http://localhost:3000",
    process.env.PROD_APP_URL, // Production frontend URL
].filter(Boolean); // Remove undefined values

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (mobile apps, Postman, etc.)
            if (!origin) return callback(null, true);

            // Check if origin is in allowedOrigins or matches Vercel preview pattern
            const isAllowed =
                allowedOrigins.includes(origin) ||
                /^https:\/\/next-blog-client.*\.vercel\.app$/.test(origin) ||
                /^https:\/\/.*\.vercel\.app$/.test(origin); // Any Vercel deployment

            if (isAllowed) {
                callback(null, true);
            } else {
                callback(new Error(`Origin ${origin} not allowed by CORS`));
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
        exposedHeaders: ["Set-Cookie"],
    }),
);



app.use(express.json());

app.set("trust proxy", 1);


app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/api/categories", categoryRouter)
app.use("/api/tutors", tutroRouter)
app.use("/api/bookings", bookingRouter)
app.use("/api/reviews", ReviewRouter)
app.use("/api/admin", AdminRouter)

app.get("/", (req, res) => {
    res.send("Skill Bridge");
});

export default app;