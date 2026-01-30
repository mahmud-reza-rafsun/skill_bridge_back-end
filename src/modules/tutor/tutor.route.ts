import express, { Router } from "express"
import auth, { UserRole } from "../middleware/auth";
import { tutroController } from "./tutor.controller";

const router = express.Router()

router.get("/", auth(UserRole.STUDENT, UserRole.ADMIN), tutroController.getAllTutors);
router.get("/:userId", auth(UserRole.STUDENT, UserRole.ADMIN, UserRole.TUTOR), tutroController.getSingleTutor);

router.post("/", auth(UserRole.STUDENT, UserRole.ADMIN), tutroController.createTuror);
router.put("/profile/:tutorId", auth(UserRole.TUTOR, UserRole.ADMIN), tutroController.updateTutorProfile);

export const tutroRouter: Router = router;