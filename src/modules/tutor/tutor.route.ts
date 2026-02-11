import express, { Router } from "express"
import auth, { UserRole } from "../middleware/auth";
import { tutorController } from "./tutor.controller";

const router = express.Router()

router.get("/", auth(UserRole.ADMIN, UserRole.TUTOR, UserRole.STUDENT), tutorController.getAllTutors);
router.get("/dashboard", auth(UserRole.ADMIN, UserRole.TUTOR), tutorController.getTutorDashboard);
router.get("/:userId", auth(UserRole.STUDENT, UserRole.ADMIN, UserRole.TUTOR), tutorController.getSingleTutor);


router.post("/", auth(UserRole.STUDENT, UserRole.ADMIN), tutorController.createTuror);

router.put("/availability/:tutorId", auth(UserRole.TUTOR, UserRole.ADMIN), tutorController.updateTutorAvailability);
router.put("/profile/:tutorId", auth(UserRole.TUTOR, UserRole.ADMIN), tutorController.updateTutorProfile);

export const tutroRouter: Router = router;