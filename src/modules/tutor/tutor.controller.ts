import { Request, Response } from "express";
import { tutorService } from "./turor.service";

const createOrUpdateTutorProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const result = await tutorService.createOrUpdateTutorProfile(req.body, userId as string);
        res.status(201).json({ success: true, message: "Tutor profile created successfully", data: result });
    } catch (e: any) {
        res.status(400).json({ success: false, message: e.message });
    }
};

const getAllTutors = async (req: Request, res: Response) => {
    try {
        const result = await tutorService.getAllTutors();

        res.status(200).json({
            success: true,
            message: "Tutors fetched successfully",
            data: result
        });
    } catch (e: any) {
        res.status(500).json({
            success: false,
            message: e.message || "Internal Server Error"
        });
    }
};

const getSingleTutor = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const result = await tutorService.getSingleTutor(userId as string);
        res.status(200).json({ success: true, data: result });
    } catch (e: any) {
        res.status(404).json({ success: false, message: e.message });
    }
};

const updateProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id; // Using logged in user's ID for security
        const result = await tutorService.updateTutorProfile(userId as string, req.body);
        res.status(200).json({ success: true, message: "Profile updated successfully", data: result });
    } catch (e: any) {
        res.status(400).json({ success: false, message: e.message });
    }
};

const getDashboard = async (req: Request, res: Response) => {
    try {
        const result = await tutorService.getTutorDashboardData(req.user?.id as string);
        res.status(200).json({ success: true, data: result });
    } catch (e: any) {
        res.status(500).json({ success: false, message: e.message });
    }
};

const getStudents = async (req: Request, res: Response) => {
    try {
        const result = await tutorService.getMyStudentsList(req.user?.id as string);
        res.status(200).json({ success: true, data: result });
    } catch (e: any) {
        res.status(500).json({ success: false, message: e.message });
    }
};

const getTutorBookings = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        console.log("userID", userId)
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized access" });
        }

        const result = await tutorService.getTutorBookings(userId);

        res.status(200).json({
            success: true,
            message: "Student requests fetched successfully",
            data: result
        });
    } catch (e: any) {
        res.status(500).json({
            success: false,
            message: e.message || "Something went wrong"
        });
    }
};

const updateBookingStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // ফ্রন্টএন্ড থেকে 'CONFIRMED' অথবা 'CANCELLED' আসবে

        const result = await tutorService.updateBookingStatus(id as string, status);

        res.status(200).json({
            success: true,
            message: `Booking ${status.toLowerCase()} successfully`,
            data: result
        });
    } catch (e: any) {
        res.status(500).json({
            success: false,
            message: e.message || "Failed to update status"
        });
    }
};

export const tutorController = {
    createOrUpdateTutorProfile,
    getAllTutors,
    getSingleTutor,
    updateProfile,
    getDashboard,
    getStudents,
    getTutorBookings,
    updateBookingStatus
};