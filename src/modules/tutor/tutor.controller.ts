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
        if (!userId) {
            throw new Error("Tutor is not found!!!")
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

const updateTutorProfile = async (req: Request, res: Response) => {
    try {
        const { tutorId } = req.params;
        console.log(tutorId)
        if (!tutorId) {
            throw new Error("Tutor is not found!!!")
        }
        const data = req.body;
        console.log(data)
        const result = await tutorService.updateTutorProfile(tutorId as string, data)
        res.status(200).json({
            success: true,
            message: "Tutor details update successfully",
            data: result
        });
    } catch (e: any) {
        res.status(500).json({
            success: false,
            message: "Failed to update tutors details",
            error: e
        });
    }
}



export const tutroController = {
    createTuror,
    getAllTutors,
    getSingleTutor,
    updateTutorProfile
}