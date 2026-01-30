import express, { Router } from "express"
import auth, { UserRole } from "../middleware/auth";
import { adminController } from "./admin.controller";

const router = express.Router()

router.get("/", auth(UserRole.ADMIN), adminController.getAllUser);
router.patch("/:id", auth(UserRole.ADMIN), adminController.updateUserStatus);

export const AdminRouter: Router = router;