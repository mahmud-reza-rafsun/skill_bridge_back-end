import express from "express";
import auth, { UserRole } from "../../middleware/auth";
import { PaymentController } from "./payment.controller";

const router = express.Router();

router.post(
    "/checkout",
    auth(UserRole.ADMIN, UserRole.STUDENT, UserRole.TUTOR),
    PaymentController.createCheckoutSession
);

export const PaymentRoutes = router;