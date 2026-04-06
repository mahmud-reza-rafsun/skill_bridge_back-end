import { UserStatus } from "../../../generated/prisma";
import { prisma } from "../../lib/prisma";

const getAllUser = async () => {
    return await prisma.user.findMany({
        where: { isDeleted: false },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            createdAt: true
        },
        orderBy: { createdAt: 'desc' }
    });
};

const blockAndUnblockUser = async (id: string, status: UserStatus) => {
    return await prisma.user.update({
        where: { id },
        data: { status }
    });
};

const toggleUserDelete = async (id: string) => {
    const user = await prisma.user.findUniqueOrThrow({ where: { id } });

    return await prisma.user.update({
        where: { id },
        data: {
            isDeleted: !user.isDeleted,
            status: !user.isDeleted ? UserStatus.BLOCKED : UserStatus.ACTIVE
        }
    });
};

const getAdminStats = async () => {
    const [totalUsers, totalStudents, totalTutors, totalBookings, totalReviews] = await Promise.all([
        prisma.user.count({ where: { isDeleted: false } }),
        prisma.user.count({ where: { role: 'STUDENT', isDeleted: false } }),
        prisma.user.count({ where: { role: 'TUTOR', isDeleted: false } }),
        prisma.booking.count(),
        prisma.review.count()
    ]);

    const totalEarnings = await prisma.booking.aggregate({
        _sum: { totalAmmount: true }
    });

    return {
        totalUsers,
        totalStudents,
        totalTutors,
        totalBookings,
        totalReviews,
        totalRevenue: totalEarnings._sum.totalAmmount || 0
    };
};

const getAllBookingsFromDB = async () => {
    return await prisma.booking.findMany({
        select: {
            id: true,
            status: true,
            totalAmmount: true,
            student: { select: { name: true, email: true } },
            tutor: {
                select: {
                    user: { select: { name: true } },
                    subject: true,
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
};

export const adminService = {
    getAllUser,
    blockAndUnblockUser,
    getAdminStats,
    getAllBookingsFromDB,
    toggleUserDelete
};