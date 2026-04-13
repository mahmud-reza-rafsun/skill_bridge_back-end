import { BookingStatus, UserRole } from "../../../generated/prisma";
import { prisma } from "../../lib/prisma";

const createOrUpdateTutorProfile = async (data: any, userId: string) => {
    const { categoryName, bio, hourlyRate, subject, image } = data;

    const subjectData = Array.isArray(subject) ? subject.join(", ") : subject;

    return await prisma.$transaction(async (tx) => {
        const user = await tx.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new Error("User not found.");
        }

        const profile = await tx.tutorProfile.upsert({
            where: { userId },
            update: {
                bio,
                hourlyRate: Number(hourlyRate),
                categoryName,
                subject: subjectData,
                image
            },
            create: {
                userId,
                bio,
                hourlyRate: Number(hourlyRate),
                categoryName,
                subject: subjectData,
                image,
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        role: true,
                        image: true
                    }
                }
            }
        });

        return profile;
    });
};

const getAllTutors = async () => {
    return await prisma.tutorProfile.findMany({
        where: {
            user: {
                role: UserRole.TUTOR,
                isDeleted: false,
            }
        },
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                    image: true,
                }
            }
        },
    });
};

const getSingleTutor = async (userId: string) => {
    const result = await prisma.tutorProfile.findUnique({
        where: { userId },
        include: {
            user: { select: { name: true, email: true, image: true } }
        }
    });

    if (!result) throw new Error("Tutor profile not found!");
    return result;
};

const updateTutorProfile = async (userId: string, data: any) => {
    const isTutorExist = await prisma.tutorProfile.findUnique({ where: { userId } });
    if (!isTutorExist) throw new Error("Tutor profile not found!");

    return await prisma.tutorProfile.update({
        where: { userId },
        data: {
            subject: data.subject,
            bio: data.bio,
            hourlyRate: Number(data.hourlyRate),
            availability: data.availability,
            categoryName: data.categoryName
        }
    });
};


const getTutorDashboardData = async (userId: string) => {
    const tutorProfile = await prisma.tutorProfile.findUnique({ where: { userId } });

    if (!tutorProfile) {
        throw new Error("Tutor profile not found!");
    }

    const [
        totalEarnings,
        totalStudents,
        totalBookings,
        upcomingBookingsCount,
        reviews,
        revenueChartData,
    ] = await Promise.all([
        prisma.booking.aggregate({
            where: {
                tutorId: tutorProfile.id
            },
            _sum: { totalAmount: true }
        }),

        prisma.booking.groupBy({
            by: ['studentId'],
            where: { tutorId: tutorProfile.id },
            _count: true
        }),

        prisma.booking.count({
            where: { tutorId: tutorProfile.id }
        }),

        prisma.booking.count({
            where: {
                tutorId: tutorProfile.id,
                status: BookingStatus.CONFIRMED,
                date: { gte: new Date() }
            }
        }),

        prisma.review.aggregate({
            where: { tutorId: tutorProfile.id },
            _avg: { rating: true },
            _count: { rating: true }
        }),

        prisma.booking.findMany({
            where: { tutorId: tutorProfile.id },
            select: {
                totalAmount: true,
                createdAt: true
            },
            orderBy: {
                createdAt: 'asc'
            }
        })
    ]);

    return {
        stats: {
            revenue: totalEarnings._sum.totalAmount || 0,
            students: totalStudents.length,
            bookings: totalBookings,
            nextBookingCount: upcomingBookingsCount,
            averageRating: reviews._avg.rating?.toFixed(1) || "0.0",
            totalReviews: reviews._count.rating
        },
        revenueChart: revenueChartData,
    };
};

const getMyStudentsList = async (userId: string) => {
    const tutorProfile = await prisma.tutorProfile.findUnique({ where: { userId } });
    if (!tutorProfile) return [];

    return await prisma.booking.findMany({
        where: { tutorId: tutorProfile.id },
        include: {
            student: { select: { id: true, name: true, email: true } }
        },
        distinct: ['studentId'],
        orderBy: { createdAt: 'desc' }
    });
};

const getTutorBookings = async (userId: string) => {
    console.log("Attempting to find profile for User ID:", userId);

    const tutorProfile = await prisma.tutorProfile.findFirst({
        where: { userId: userId }
    });

    console.log("Database result for tutorProfile:", tutorProfile);

    if (!tutorProfile) {
        throw new Error(`Tutor profile missing for User ID: ${userId}. Please ensure this user is registered as a tutor.`);
    }

    return await prisma.booking.findMany({
        where: { tutorId: tutorProfile.id },
        include: {
            student: {
                select: { id: true, name: true, email: true, image: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
};

const updateBookingStatus = async (bookingId: string, status: BookingStatus) => {
    // বুকিংটি আসলে আছে কি না তা চেক করা
    const isBookingExist = await prisma.booking.findUnique({
        where: { id: bookingId }
    });

    if (!isBookingExist) {
        throw new Error("Booking not found!");
    }

    // স্ট্যাটাস আপডেট করা
    return await prisma.booking.update({
        where: { id: bookingId },
        data: { status }
    });
};

export const tutorService = {
    createOrUpdateTutorProfile,
    getAllTutors,
    getSingleTutor,
    updateTutorProfile,
    getTutorDashboardData,
    getMyStudentsList,
    getTutorBookings,
    updateBookingStatus
};