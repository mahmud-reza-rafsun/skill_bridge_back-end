import express, { Router } from "express";
import { bookingsController } from "./bookings.controller";
import auth, { UserRole } from "../../middleware/auth";

const router = express.Router();

// ১. স্ট্যাটিক রাউটগুলো আগে রাখতে হয়
router.get(
    "/",
    auth(UserRole.ADMIN),
    bookingsController.getAllBooking
);

router.get(
    "/my-bookings",
    auth(UserRole.STUDENT, UserRole.TUTOR),
    bookingsController.getMyBooking
);

// ২. ডাইনামিক আইডি রাউটগুলো পরে
router.get(
    "/:bookingId",
    auth(UserRole.TUTOR, UserRole.STUDENT, UserRole.ADMIN),
    bookingsController.getSingleBooking
);

// যখন ইউজার বুক বাটনে ক্লিক করবে, টিউটর আইডি প্যারাম হিসেবে যাবে
router.post(
    "/:tutorId",
    auth(UserRole.STUDENT),
    bookingsController.createBooking
);

router.patch(
    "/status/:bookingId",
    auth(UserRole.TUTOR, UserRole.ADMIN), // স্টুডেন্ট সাধারণত নিজের বুকিং স্ট্যাটাস আপডেট করতে পারে না, তাই স্টুডেন্ট বাদ দেওয়া হয়েছে
    bookingsController.updateStatus
);

export const bookingRouter: Router = router;