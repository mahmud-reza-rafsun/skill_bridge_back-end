import express from 'express';
import { SuccessStudentController } from './student.controller';

const router = express.Router();

// GET API: /api/success-students
router.get('/success-students', SuccessStudentController.getSuccessStudent);

export const studentRoutes = router;