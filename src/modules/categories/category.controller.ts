import { Request, Response } from "express";
import { categoryService } from "./category.service";

const createCategory = async (req: Request, res: Response) => {
    try {
        console.log(req.user)
        const data = req.body;
        const result = await categoryService.createCategory(data)
        res.status(201).json(result)
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
        res.status(200).json(result)
    } catch (e) {
        res.status(400).json({
            error: "Fetch category data failed",
            details: e
        })
    }
}

export const categoryController = {
    createCategory,
    getAllCategory
}