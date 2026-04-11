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
    createOrUpdateTutorProfile,
    getAllTutors,
    getSingleTutor,
    updateTutorProfile,
    getTutorDashboardData,
    getMyStudentsList
};