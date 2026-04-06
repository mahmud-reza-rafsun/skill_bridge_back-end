import { Request, Response } from "express";
import { categoryService } from "./category.service";

const createCategory = async (req: Request, res: Response) => {
    try {
        const result = await categoryService.createCategory(req.body);
        res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: result
        });
    } catch (e: any) {
        res.status(400).json({
            success: false,
            message: e.message || "Category creation failed"
        });
    }
};

const getAllCategory = async (req: Request, res: Response) => {
    try {
        const result = await categoryService.getAllCategory();
        res.status(200).json({
            success: true,
            message: "Categories fetched successfully",
            data: result
        });
    } catch (e: any) {
        res.status(400).json({
            success: false,
            message: e.message || "Failed to fetch categories"
        });
    }
};

const updateTutorCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // This should be the User ID
        const { categoryName } = req.body;

        const result = await categoryService.updateTutorCategory(id as string, categoryName);
        res.status(200).json({
            success: true,
            message: "Tutor category updated successfully",
            data: result
        });
    } catch (e: any) {
        res.status(400).json({
            success: false,
            message: e.message || "Update category failed"
        });
    }
};

export const categoryController = {
    createCategory,
    getAllCategory,
    updateTutorCategory
};