import express, { Router } from "express";
import auth, { UserRole } from "../../middleware/auth";
import { tutorsController } from "./tutor.controller";

const router = express.Router();

router.get(
    "/my-students",
    auth(UserRole.TUTOR),
    tutorsController.getTutorBookings
);

router.patch(
    "/status/:bookingId",
    auth(UserRole.TUTOR, UserRole.ADMIN),
    tutorsController.updateStatus
);

export const tutorsRouter: Router = router;