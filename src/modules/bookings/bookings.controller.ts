import { Request, Response } from "express";
import { bookingService } from "./bookings.service";

// backend/controller/booking.controller.ts
const createBooking = async (req: Request, res: Response) => {
    try {
        const { tutorId } = req.params;
        const studentId = req.user?.id;
        const { totalAmount, day, slot } = req.body;

        const result = await bookingService.createBooking(
            studentId as string,
            tutorId as string,
            {
                totalAmount: Number(totalAmount),
                day: day,
                slot: slot
            }
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

const getTutorBookings = async (req: Request, res: Response) => {
    try {
        const studentId = req.user?.id;

        if (!studentId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated!"
            });
        }

        const result = await bookingService.getTutorBookings(studentId);
        res.status(200).json({
            success: true,
            message: "Bookings retrieved successfully",
            data: result || [],
        });

    } catch (e: any) {
        res.status(400).json({
            success: false,
            message: e.message || "Something went wrong!",
        });
    }
};

const completeSession = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // Booking ID from URL
        const studentId = req.user?.id; // Student ID from Auth middleware

        if (!studentId) {
            throw new Error("User not authenticated!");
        }

        const result = await bookingService.completeSession(id as string, studentId);

        res.status(200).json({
            success: true,
            message: "Session marked as completed successfully",
            data: result,
        });
    } catch (e: any) {
        res.status(400).json({
            success: false,
            message: e.message || "Failed to complete session",
        });
    }
};

const getStudentDashboard = async (req: Request, res: Response) => {
    try {
        const studentId = req.user?.id;
        const result = await bookingService.getStudentDashboard(studentId as string);

        res.status(200).json({
            success: true,
            message: "Student dashboard data fetched successfully",
            data: result
        });
    } catch (e: any) {
        res.status(500).json({
            success: false,
            message: e.message || "Internal Server Error"
        });
    }
};

export const bookingsController = {
    createBooking,
    getAllBooking,
    getSingleBooking,
    getTutorBookings,
    completeSession,
    getStudentDashboard
};