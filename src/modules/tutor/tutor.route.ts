import express, { Router } from "express";
import { tutorController } from "./tutor.controller";
import auth, { UserRole } from "../../middleware/auth";

const router = express.Router();

router.get("/", tutorController.getAllTutors);
router.get("/dashboard", auth(UserRole.TUTOR), tutorController.getDashboard);
router.get("/my-students", auth(UserRole.TUTOR), tutorController.getStudents);
router.get("/:userId", tutorController.getSingleTutor);

router.post("/", auth(UserRole.STUDENT, UserRole.ADMIN), tutorController.createTutor);
router.patch("/profile", auth(UserRole.TUTOR), tutorController.updateProfile);

export const tutorRouter: Router = router;