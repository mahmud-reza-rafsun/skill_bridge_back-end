import express from "express";
import { Application } from "express";
import cors from "cors"
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { categoryRouter } from "./modules/categories/category.route";
import { tutroRouter } from "./modules/tutor/tutor.route";
import { bookingRouter } from "./modules/bookings/booking.route";

const app: Application = express();

app.use(cors({
    origin: process.env.APP_URL || "http://localhost:3000", // client side url
    credentials: true,
}))

app.use(express.json());


app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/api/category", categoryRouter)
app.use("/api/tutors", tutroRouter)
app.use("/api/bookings", bookingRouter)

app.get("/", (req, res) => {
    res.send("Skill Bridge");
});

export default app;