import { BookingStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma";


const getSuccessStudent = async (page: number, limit: number) => {
    const skip = (page - 1) * limit;

    const result = await prisma.booking.findMany({
        where: {
            status: BookingStatus.COMPLETED,
        },
        include: {
            student: true,
        },
        skip: skip,
        take: limit,
        orderBy: {
            createdAt: 'desc',
        },
    });

    const total = await prisma.booking.count({
        where: {
            status: BookingStatus.COMPLETED,
        },
    });

    return {
        meta: {
            page,
            limit,
            total,
            totalPage: Math.ceil(total / limit),
        },
        data: result,
    };
};

export const SuccessStudentService = {
    getSuccessStudent,
};