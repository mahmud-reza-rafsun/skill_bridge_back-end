import express from "express";
import auth, { UserRole } from "../../middleware/auth";
import { adminController } from "./admin.controller";

const router = express.Router();

router.get("/get-all-users", auth(UserRole.ADMIN), adminController.getAllUser);
router.get("/get-admin-stats", auth(UserRole.ADMIN), adminController.getStats);
router.get("/get-all-bookings", auth(UserRole.ADMIN), adminController.getAllBookings);

router.patch("/block-user/:id", auth(UserRole.ADMIN), adminController.blockUser);
router.delete("/delete-user/:id", auth(UserRole.ADMIN), adminController.deleteToggle);

export const AdminRouter = router;