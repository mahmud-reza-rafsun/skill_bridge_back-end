import { Request, Response } from "express";
import { reviewService } from "./review.service";

const createReview = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const studentId = req.user?.id;
        const { bookingId } = req.params; // রাউটার থেকে আইডি নিচ্ছি

        // সার্ভিসকে ৩টি জিনিস দিচ্ছি: স্টুডেন্ট আইডি, বুকিং আইডি এবং বডির ডাটা
        const result = await reviewService.createReview(studentId as string, bookingId as string, data);

        res.status(200).json({
            success: true,
            message: "Review created successfully",
            data: result
        });
    } catch (e: any) {
        res.status(400).json({
            error: "Review creation failed",
            message: e.message
        });
    }
};


export const reviewController = {
    createReview
}