import { Request, Response } from "express";
import { bookingService } from "./bookings.service";

// backend/controller/booking.controller.ts
const createBooking = async (req: Request, res: Response) => {
    try {
        const { tutorId } = req.params;
        const studentId = req.user?.id;
        const { totalAmount, date } = req.body;

        console.log("Received Date from Frontend:", date);

        const result = await bookingService.createBooking(
            studentId as string,
            tutorId as string,
            {
                totalAmount: Number(totalAmount),
                date: date
            }
        );
        console.log("console from controller.ts", result.date);

        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: result
        });
    } catch (e: any) {
        res.status(400).json({ success: false, message: e.message });
    }
};

const getAllBooking = async (req: Request, res: Response) => {
    try {
        const result = await bookingService.getAllBookings();
        res.status(200).json({
            success: true,
            message: "All bookings retrieved successfully",
            data: result
        });
    } catch (e: any) {
        res.status(500).json({ success: false, message: e.message });
    }
};

const getSingleBooking = async (req: Request, res: Response) => {
    try {
        const { bookingId } = req.params;
        const result = await bookingService.getSingleBooking(bookingId as string);
        res.status(200).json({
            success: true,
            message: "Booking details retrieved successfully",
            data: result
        });
    } catch (e: any) {
        res.status(404).json({ success: false, message: e.message });
    }
};

const getTutorBookings = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        const result = await bookingService.getTutorBookings(userId as string);

        res.status(200).json({
            success: true,
            message: "Incoming student bookings fetched successfully",
            data: result
        });
    } catch (e: any) {
        res.status(500).json({ success: false, message: e.message });
    }
};

export const bookingsController = {
    createBooking,
    getTutorBookings,
    getAllBooking,
    getSingleBooking
};