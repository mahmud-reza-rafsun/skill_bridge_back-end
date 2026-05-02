import { Request, Response } from "express";
import { userService } from "./user.service";

const getMyProfile = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const userId = user?.id;

        console.log("Current User ID from Req:", userId);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized. User ID not found in session."
            });
        }

        const result = await userService.getProfile(userId);

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (e: any) {
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
};

export const userController = {
    getMyProfile
}