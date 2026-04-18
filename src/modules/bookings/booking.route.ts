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
    '/get-tutor-bookings',
    auth(UserRole.STUDENT),
    bookingsController.getTutorBookings
);

router.get(
    "/:bookingId",
    auth(UserRole.TUTOR, UserRole.STUDENT, UserRole.ADMIN),
    bookingsController.getSingleBooking
);

router.post(
    "/create-bookings/:tutorId",
    auth(UserRole.STUDENT),
    bookingsController.createBooking
);

router.patch(
    '/complete-session/:id',
    auth(UserRole.STUDENT),
    bookingsController.completeSession
);

export const bookingRouter: Router = router;