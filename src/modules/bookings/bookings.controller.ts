import { Request, Response } from "express";
import { bookingService } from "./bookings.service";
import { BookingStatus } from "../../../generated/prisma";

const createBooking = async (req: Request, res: Response) => {
    try {
        const { tutorId } = req.params;
        const studentId = req.user?.id;
        const { totalAmount } = req.body;

        const result = await bookingService.createBooking(
            studentId as string,
            tutorId as string,
            { totalAmount: Number(totalAmount) }
        );

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

const getMyBooking = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        const result = await bookingService.getMyBooking(userId as string);

        res.status(200).json({
            success: true,
            message: "Your bookings fetched successfully",
            data: result
        });
    } catch (e: any) {
        res.status(500).json({ success: false, message: e.message });
    }
};

export const bookingsController = {
    createBooking,
    getMyBooking,
    getAllBooking,
    getSingleBooking
};