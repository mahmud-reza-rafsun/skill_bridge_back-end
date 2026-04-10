import { Request, Response } from "express";
import { tutorsService } from "./tutors.service";


const getTutorBookings = async (req: Request, res: Response) => {
    try {
        const user = req.user

        if (!user || !user.id) {
            throw new Error("User not authenticated!");
        }
        const result = await tutorsService.getTutorBookings(user.id);

        res.status(200).json({
            success: true,
            message: "Bookings retrieved successfully",
            data: result
        });
    } catch (e: any) {
        res.status(400).json({ success: false, message: e.message });
    }
};


const updateStatus = async (req: Request, res: Response) => {
    try {
        const { bookingId } = req.params;
        const { status } = req.body;
        const user = req.user

        const result = await tutorsService.updateBookingStatus(
            bookingId as string,
            status,
            user
        );

        res.status(200).json({
            success: true,
            message: `Booking status successfully updated to ${status}`,
            data: result
        });
    } catch (e: any) {
        res.status(400).json({ success: false, message: e.message });
    }
};

export const tutorsController = {
    getTutorBookings,
    updateStatus
}