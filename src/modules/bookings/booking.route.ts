import express, { Router } from "express";
import { bookingsController } from "./bookings.controller";
import auth, { UserRole } from "../../middleware/auth";

const router = express.Router();

router.get(
    "/",
    auth(UserRole.ADMIN),
    bookingsController.getAllBooking
);

router.get(
    "/my-bookings",
    auth(UserRole.STUDENT, UserRole.TUTOR),
    bookingsController.getMyBooking
);

router.get(
    "/:bookingId",
    auth(UserRole.TUTOR, UserRole.STUDENT, UserRole.ADMIN),
    bookingsController.getSingleBooking
);

router.post(
    "/:tutorId",
    auth(UserRole.STUDENT),
    bookingsController.createBooking
);

router.patch(
    "/status/:bookingId",
    auth(UserRole.TUTOR, UserRole.STUDENT, UserRole.ADMIN),
    bookingsController.updateStatus
);

export const bookingRouter: Router = router;