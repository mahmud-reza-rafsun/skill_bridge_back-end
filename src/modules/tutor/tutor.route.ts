import express, { Router } from "express";
import { tutorController } from "./tutor.controller";
import auth, { UserRole } from "../../middleware/auth";

const router = express.Router();

router.get("/get-all-tutors", auth(UserRole.ADMIN, UserRole.STUDENT, UserRole.TUTOR), tutorController.getAllTutors);
router.get("/dashboard", auth(UserRole.TUTOR), tutorController.getDashboard);
router.get("/my-students", auth(UserRole.TUTOR), tutorController.getStudents);
router.get("/:userId", tutorController.getSingleTutor);

router.post(
    "/tutor-profile",
    auth(UserRole.STUDENT, UserRole.TUTOR, UserRole.ADMIN),
    tutorController.createOrUpdateTutorProfile
);
router.patch("/profile", auth(UserRole.TUTOR), tutorController.updateProfile);

export const tutorRouter: Router = router;