import { BookingStatus } from "../../../generated/prisma";
import { prisma } from "../../lib/prisma";
import { UserRole } from "../../middleware/auth";

const createTutor = async (data: any, userId: string) => {
    const { categoryName, bio, hourlyRate, availability, subject } = data;

    return prisma.$transaction(async (tx) => {
        // 1. Check if profile already exists
        const existingProfile = await tx.tutorProfile.findUnique({
            where: { userId }
        });

        if (existingProfile) {
            throw new Error("Tutor profile already exists for this user.");
        }

        // 2. Update user role to TUTOR
        await tx.user.update({
            where: { id: userId },
            data: { role: UserRole.TUTOR }
        });

        // 3. Create Tutor Profile
        return await tx.tutorProfile.create({
            data: {
                bio,
                hourlyRate: Number(hourlyRate),
                availability,
                userId,
                categoryName,
                subject
            },
            include: {
                user: { select: { name: true, email: true, role: true } }
            }
        });
    });
};

const getAllTutors = async (search?: string) => {
    return await prisma.tutorProfile.findMany({
        where: search ? {
            OR: [
                { subject: { contains: search, mode: 'insensitive' } },
                { categoryName: { contains: search, mode: 'insensitive' } },
                { user: { name: { contains: search, mode: 'insensitive' } } }
            ]
        } : {},
        include: {
            user: { select: { name: true, email: true, image: true } }
        }
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
    if (!tutorProfile) throw new Error("Tutor profile not found!");

    const [totalSessions, pendingSessions, reviews, upcomingSessions] = await Promise.all([
        prisma.booking.count({ where: { tutorId: tutorProfile.id } }),
        prisma.booking.count({ where: { tutorId: tutorProfile.id, status: BookingStatus.PENDING } }),
        prisma.review.aggregate({
            where: { tutorId: tutorProfile.id },
            _avg: { rating: true },
            _count: true
        }),
        prisma.booking.findMany({
            where: { tutorId: tutorProfile.id, status: BookingStatus.CONFIRMED },
            take: 5,
            include: { student: { select: { name: true, email: true } } },
            orderBy: { startTime: 'asc' }
        })
    ]);

    return {
        stats: {
            totalSessions,
            pendingSessions,
            totalReviews: reviews._count,
            averageRating: reviews._avg.rating || 0
        },
        upcomingSessions
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

export const tutorService = {
    createTutor,
    getAllTutors,
    getSingleTutor,
    updateTutorProfile,
    getTutorDashboardData,
    getMyStudentsList
};