import { Request, Response } from 'express';
import { SuccessStudentService } from './student.service';

const getSuccessStudent = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const result = await SuccessStudentService.getSuccessStudent(page, limit);

        res.status(200).json({
            success: true,
            message: 'Success students retrieved successfully',
            meta: result.meta,
            data: result.data,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error instanceof Error ? error.message : error,
        });
    }
};

export const SuccessStudentController = {
    getSuccessStudent,
};