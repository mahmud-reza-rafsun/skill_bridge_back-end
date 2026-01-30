import { Request, Response } from "express";
import { categoryService } from "./category.service";

const createCategory = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const result = await categoryService.createCategory(data)
        res.status(200).json({
            success: true,
            message: "Category create successfully",
            data: result
        });
    } catch (e) {
        res.status(400).json({
            error: "Category creation failed",
            details: e
        })
    }
}

const getAllCategory = async (req: Request, res: Response) => {
    try {
        const result = await categoryService.getAllCategory()
        res.status(200).json({
            success: true,
            message: "Category Data Fetched successfully",
            data: result
        });
    } catch (e) {
        res.status(400).json({
            error: "Fetch category data failed",
            details: e
        })
    }
}

const updateTutorCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { categoryName } = req.body;

        const result = await categoryService.updateTutorCategory(id as string, categoryName)
        res.status(200).json({
            success: true,
            message: "Category Updated successfully",
            data: result
        });
    } catch (e) {
        res.status(400).json({
            error: "Update category data failed",
            details: e
        })
    }
}

export const categoryController = {
    createCategory,
    getAllCategory,
    updateTutorCategory
}