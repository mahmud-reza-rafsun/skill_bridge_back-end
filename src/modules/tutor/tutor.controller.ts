import { Request, Response } from "express";
import { tutorService } from "./turor.service";

const createTuror = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(400).json({
                error: "Unauthorized!",
            })
        }
        const id = user.id;
        const data = req.body;
        const result = await tutorService.createTuror(data, id as string)
        res.status(200).json({
            success: true,
            message: "Tutor create successfully",
            data: result
        });
    } catch (e: any) {
        res.status(400).json({
            error: "Turtor creation failed",
            message: e.message,
            details: e
        })
    }
}

const getAllTutors = async (req: Request, res: Response) => {
    try {
        const result = await tutorService.getAllTutors()
        res.status(200).json({
            success: true,
            message: "Tutor fetch successfully",
            data: result
        });
    } catch (e: any) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch tutors",
            error: e
        });
    }
}

const getSingleTutor = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        console.log(userId)
        if (!userId) {
            throw new Error("User id not found!!!")
        }
        const result = await tutorService.getSingleTutor(userId as string)
        res.status(200).json({
            success: true,
            message: "Tutor details fetch successfully",
            data: result
        });
    } catch (e: any) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch tutors details",
            error: e
        });
    }
}

export const tutroController = {
    createTuror,
    getAllTutors,
    getSingleTutor
}