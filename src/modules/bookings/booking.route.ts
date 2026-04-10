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
    "/get-my-booking",
    auth(UserRole.STUDENT, UserRole.TUTOR, UserRole.ADMIN),
    bookingsController.getMyBooking
)

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

export const bookingRouter: Router = router;