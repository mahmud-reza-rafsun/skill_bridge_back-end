import express, { Router } from "express";
import auth, { UserRole } from "../../middleware/auth";
import { reviewController } from "./review.controller";

const router = express.Router();

router.get(
    "/get-tutor-reviews",
    auth(UserRole.TUTOR),
    reviewController.getTutorBooking
);

router.post(
    "/create-review/:bookingId",
    auth(UserRole.STUDENT),
    reviewController.createReview
);

export const ReviewRouter: Router = router;