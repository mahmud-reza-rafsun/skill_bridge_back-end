import { Request, Response } from "express";
import { tutorService } from "./turor.service";

const createTuror = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        console.log(user)
        if (!user) {
            return res.status(400).json({
                error: "Unauthorized!",
            })
        }
        const id = user.id;
        console.log(id)
        const data = req.body;
        const result = await tutorService.createTuror(data, id as string)
        res.status(201).json(result)
    } catch (e: any) {
        console.log("FULL ERROR:", e); // আপনার টার্মিনাল চেক করুন
        res.status(400).json({
            error: "Turtor creation failed",
            message: e.message, // সরাসরি মেসেজটি পাঠান
            details: e
        })
    }
}

export const tutroController = {
    createTuror
}