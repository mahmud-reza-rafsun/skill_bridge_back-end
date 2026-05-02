import express, { Router } from "express";
import { tutorController } from "./tutor.controller";
import auth, { UserRole } from "../../middleware/auth";

const router = express.Router();

router.get("/get-all-tutors", tutorController.getAllTutors);
router.get("/tutor-stats", auth(UserRole.TUTOR), tutorController.getDashboard);
router.get("/my-students", auth(UserRole.TUTOR), tutorController.getStudents);
router.get('/get-student-bookings', auth(UserRole.TUTOR), tutorController.getTutorBookings);
router.get("/:userId", tutorController.getSingleTutor);
router.post(
    "/tutor-profile",
    auth(UserRole.STUDENT, UserRole.TUTOR, UserRole.ADMIN),
    tutorController.createOrUpdateTutorProfile
);

router.post("/create-availability", auth(UserRole.TUTOR), tutorController.createAvailability);
router.delete(
    '/delete-booking/:id',
    auth(UserRole.TUTOR, UserRole.STUDENT),
    tutorController.deleteBooking
);
router.patch("/profile", auth(UserRole.TUTOR), tutorController.updateProfile);
router.patch('/status/:id',
    auth(UserRole.TUTOR, UserRole.STUDENT),
    tutorController.updateBookingStatus
);

export const tutorRouter: Router = router;