import { Request, Response } from "express";
import { adminService } from "./admin.service";

const getAllUser = async (req: Request, res: Response) => {
    try {
        const result = await adminService.getAllUser();

        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: result
        });
    } catch (e: any) {
        res.status(400).json({
            error: "Users retrieved failed",
            message: e.message
        });
    }
};

const updateUserStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const result = await adminService.updateUserStatus(id as string, status);
        res.status(200).json({
            success: true,
            message: `User is now ${status}`,
            data: result
        });
    } catch (e: any) {
        res.status(400).json({ success: false, message: e.message });
    }
};

const getStats = async (req: Request, res: Response) => {
    try {
        const result = await adminService.getAdminStats();
        res.status(200).json({
            success: true,
            message: "Dashboard statistics retrieved successfully",
            data: result
        });
    } catch (e: any) {
        res.status(500).json({ success: false, message: e.message });
    }
};


export const adminController = {
    getAllUser,
    updateUserStatus,
    getStats
}