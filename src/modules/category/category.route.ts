import express, { Router } from "express";
import auth, { UserRole } from "../../middleware/auth";
import { categoryController } from "./category.controller";


const router = express.Router();


router.post("/create-category", auth(UserRole.ADMIN), categoryController.createCategory);
router.get("/get-all-category", auth(UserRole.TUTOR, UserRole.ADMIN, UserRole.STUDENT), categoryController.getAllCategory);

export const categoryRouter: Router = router;