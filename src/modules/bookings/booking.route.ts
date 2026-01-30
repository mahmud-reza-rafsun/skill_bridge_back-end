import express, { Router } from "express"
import auth, { UserRole } from "../middleware/auth";
import { bookingsController } from "./bookings.controller";

const router = express.Router()

router.get("/", auth(UserRole.TUTOR, UserRole.STUDENT), bookingsController.getAllBooking);
router.get("/:bookingId", auth(UserRole.TUTOR, UserRole.STUDENT), bookingsController.getSingleBooking);

router.post("/:tutorId", auth(UserRole.STUDENT, UserRole.TUTOR), bookingsController.createBooking);

export const bookingRouter: Router = router;