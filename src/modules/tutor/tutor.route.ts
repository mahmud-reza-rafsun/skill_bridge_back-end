import express, { Router } from "express"
import auth, { UserRole } from "../middleware/auth";
import { tutroController } from "./tutor.controller";

const router = express.Router()

router.post("/", auth(UserRole.STUDENT), tutroController.createTuror);


export const tutroRouter: Router = router;