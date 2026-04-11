import { Request, Response } from "express";
import { categoryService } from "./category.service";

const createCategory = async (req: Request, res: Response) => {
    try {
        const data = req.body;

        const result = await categoryService.createCategory(data);

        res.status(201).json({
            success: true,
            message: "category created successfully",
            data: result
        });
    } catch (e: any) {
        res.status(400).json({ success: false, message: e.message });
    }
}

const getAllCategory = async (req: Request, res: Response) => {
    try {
        const result = await categoryService.getAllCategory();
        res.status(200).json({
            success: true,
            message: "retrive all category successfully",
            data: result
        });
    } catch (e: any) {
        res.status(400).json({ success: false, message: e.message });
    }
}

export const categoryController = {
    createCategory,
    getAllCategory
}