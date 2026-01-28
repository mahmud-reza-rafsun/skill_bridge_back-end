import express, { Router } from "express"
import { categoryController } from "./category.controller"
import auth, { UserRole } from "../middleware/auth";

const router = express.Router()

router.post("/", auth(UserRole.ADMIN), categoryController.createCategory);
router.get("/", auth(UserRole.ADMIN), categoryController.getAllCategory);


export const categoryRouter: Router = router;