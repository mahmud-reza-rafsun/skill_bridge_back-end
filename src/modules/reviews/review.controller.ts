import { Request, Response } from "express";
import { reviewService } from "./review.service";

const createReview = async (req: Request, res: Response) => {
    try {
        const { bookingId } = req.params;
        const studentId = req.user?.id;

        const result = await reviewService.createReview(
            studentId as string,
            bookingId as string,
            req.body
        );

        res.status(201).json({
            success: true,
            message: "Review created successfully",
            data: result
        });
    } catch (e: any) {
        res.status(400).json({
            success: false,
            message: e.message || "Review creation failed"
        });
    }
};

const getTutorBooking = async (req: Request, res: Response) => {
    try {
        const tutorUserId = req.user?.id;

        const result = await reviewService.getTutorBooking(
            tutorUserId as string
        );
        res.status(200).json({
            success: true,
            message: "Tutor bookings retrieved successfully",
            data: result
        });
    } catch (e: any) {
        res.status(400).json({
            success: false,
            message: e.message || "Tutor bookings retrieval failed"
        });
    }
};

export const reviewController = {
    createReview,
    getTutorBooking
};