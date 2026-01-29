import { Request, Response } from "express";
import { bookingService } from "./bookings.service";

const createBooking = async (req: Request, res: Response) => {
    try {
        const data = req.body
        const user = req.user
        if (!user) {
            return res.status(400).json({
                error: "Unauthorized!",
            })
        }
        const { tutorId } = req.params
        const result = await bookingService.createBooking(user.id as string, tutorId as string, data)
        res.status(200).json({
            success: true,
            message: "Booking create successfully",
            data: result
        });
    } catch (e: any) {
        res.status(400).json({
            error: "Booking creation failed",
            message: e.message,
            details: e
        })
    }
}

const getAllBooking = async (req: Request, res: Response) => {
    try {
        const result = await bookingService.getAllBookings()
        res.status(200).json({
            success: true,
            message: "Bookings fetch successfully",
            data: result
        });
    } catch (e: any) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch Bookings",
            error: e
        });
    }
}

const getSingleBooking = async (req: Request, res: Response) => {
    try {
        const { bookingId } = req.params;
        const result = await bookingService.getSingleBooking(bookingId as string)
        res.status(200).json({
            success: true,
            message: "Booking details fetch successfully",
            data: result
        });
    } catch (e: any) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch booking details",
            error: e
        });
    }
}

export const bookingsController = {
    createBooking,
    getAllBooking,
    getSingleBooking
}