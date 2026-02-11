import { prisma } from "../../lib/prisma"

const getAllUser = async () => {
    const users = prisma.user.findMany({
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

    return users
}

const updateUserStatus = async (id: string, status: string) => {
    const user = await prisma.user.findUnique({
        where: { id }
    });

    if (!user) {
        throw new Error("User not found");
    }

    const result = await prisma.user.update({
        where: { id },
        data: {
            status: status
        }
    });

    return result
}

const getAdminStats = async () => {
    const [totalUsers, totalStudents, totalTutors, totalBookings, totalReviews] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { role: 'STUDENT' } }),
        prisma.user.count({ where: { role: 'TUTOR' } }),
        prisma.booking.count(),
        prisma.review.count()
    ]);
    const totalEarnings = await prisma.booking.aggregate({
        _sum: {
            totalAmmount: true
        }
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

export const getAllBookingsFromDB = async () => {
    const result = await prisma.booking.findMany({
        select: {
            id: true,
            status: true,
            totalAmmount: true,
            student: {
                select: {
                    name: true,
                    email: true,
                }
            },
            tutor: {
                select: {
                    user: {
                        select: {
                            name: true,
                        }
                    },
                    subject: true,
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
    return result;
};

export const adminService = {
    getAllUser,
    updateUserStatus,
    getAdminStats,
    getAllBookingsFromDB
}