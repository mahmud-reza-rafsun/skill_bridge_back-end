import express, { Router } from "express"
import auth, { UserRole } from "../middleware/auth";
import { adminController } from "./admin.controller";

const router = express.Router()

router.get("/users", auth(UserRole.ADMIN), adminController.getAllUser);
router.get("/stats", auth(UserRole.ADMIN), adminController.getStats);

router.patch("/:id", auth(UserRole.ADMIN), adminController.updateUserStatus);


export const AdminRouter: Router = router;