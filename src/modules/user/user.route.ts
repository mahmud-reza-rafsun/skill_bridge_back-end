import { Router } from "express";
import { userController } from "./user.controller";
import auth, { UserRole } from "../../middleware/auth";

const router = Router();


router.get("/get-profile", auth(UserRole.STUDENT, UserRole.TUTOR, UserRole.ADMIN), userController.getMyProfile);

export const userRouter: Router = router;