import { Request, Response } from "express";
import { tutorService } from "./turor.service";

const createTutor = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const result = await tutorService.createTutor(req.body, userId as string);
        res.status(201).json({ success: true, message: "Tutor profile created successfully", data: result });
    } catch (e: any) {
        res.status(400).json({ success: false, message: e.message });
    }
};

const getAllTutors = async (req: Request, res: Response) => {
    try {
        const { search } = req.query;
        const result = await tutorService.getAllTutors(search as string);
        res.status(200).json({ success: true, message: "Tutors fetched successfully", data: result });
    } catch (e: any) {
        res.status(500).json({ success: false, message: e.message });
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

export const tutorController = {
    createTutor,
    getAllTutors,
    getSingleTutor,
    updateProfile,
    getDashboard,
    getStudents
};