import { Request, Response } from "express";
import { adminService } from "./admin.service";

const getAllUser = async (req: Request, res: Response) => {
    try {
        const result = await adminService.getAllUser();
        res.status(200).json({ success: true, message: "Users fetched", data: result });
    } catch (e: any) {
        res.status(400).json({ success: false, message: e.message });
    }
};


const blockUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const result = await adminService.blockAndUnblockUser(id as string, status);
        res.status(200).json({ success: true, message: `Status: ${status}`, data: result });
    } catch (e: any) {
        res.status(400).json({ success: false, message: e.message });
    }
};

const deleteToggle = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await adminService.toggleUserDelete(id as string);
        res.status(200).json({
            success: true,
            message: result.isDeleted ? "User soft deleted" : "User restored",
            data: result
        });
    } catch (e: any) {
        res.status(400).json({ success: false, message: e.message });
    }
};

const getAllBookings = async (req: Request, res: Response) => {
    try {
        const result = await adminService.getAllBookings()
        res.status(200).json({
            success: true,
            message: "Retrive all bookings",
            data: result
        });
    } catch (e: any) {
        res.status(400).json({ success: false, message: e.message });
    }
};

const getAdminStats = async (req: Request, res: Response) => {
    try {
        const result = await adminService.getAdminStats();
        res.status(200).json({
            success: true,
            message: "Admin statistics retrieved successfully",
            data: result
        });
    } catch (e: any) {
        res.status(400).json({
            success: false,
            message: e.message || "Failed to fetch stats"
        });
    }
};

export const adminController = {
    getAllUser,
    blockUser,
    getAdminStats,
    getAllBookings,
    deleteToggle,
};