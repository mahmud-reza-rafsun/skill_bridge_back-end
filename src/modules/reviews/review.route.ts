import express, { Router } from "express"
import auth, { UserRole } from "../middleware/auth";
import { reviewController } from "./review.controller";

const router = express.Router()

router.post("/:bookingId", auth(UserRole.STUDENT), reviewController.createReview);

export const ReviewRouter: Router = router;