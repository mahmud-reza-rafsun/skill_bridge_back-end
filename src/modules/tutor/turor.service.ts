import { BookingStatus, UserRole } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma"

const createTuror = async (data: any, id: string) => {
    const { categoryName, bio, hourlyRate, availability, subject } = data;
    return prisma.$transaction(async (tx) => {

        const existingProfile = await tx.tutorProfile.findUnique({
            where: { id: id }
        });

        if (existingProfile) {
            throw new Error("Tutor profile already exists for this user.");
        }

        const user = await tx.user.findUnique({
            where: { id: id },
            select: { role: true }
        })
        if (!user) {
            throw new Error("User now found")
        }

        let newRole = user.role;

        if (user?.role === UserRole.STUDENT) {
            newRole = UserRole.TUTOR
        }

        const updateTutor = await tx.user.update({
            where: { id: id },
            data: { role: newRole },
            select: {
                role: true,
                id: true
            }
        });

        const tutorProfile = await tx.tutorProfile.create({
            data: {
                bio,
                hourlyRate: hourlyRate,
                availability: availability,
                userId: id,
                categoryName: categoryName,
                subject: subject
            }
        });
        return {
            ...tutorProfile,
            role: updateTutor.role
        };
    });
}

const getAllTutors = async (search: string) => {
    let andConditions = []
    if (search) {
        andConditions.push({
            search: {
                equal: search
            }
        })
    }
    const result = await prisma.tutorProfile.findMany();
    return result
}

const getSingleTutor = async (id: string) => {
    const findSinlgeTutur = await prisma.tutorProfile.findUnique({
        where: { id: id },
    });
    if (!findSinlgeTutur) {
        throw new Error("Tutor not found!!!");
    }
    return findSinlgeTutur;
}

const updateTutorProfile = async (userId: string, data: any) => {
    const { subject, bio, hourlyRate, availability, categoryName } = data;
    const isTutorExist = await prisma.tutorProfile.findUnique({
        where: { userId }
    });

    if (!isTutorExist) {
        throw new Error("Tutor profile not found! Please create one first.");
    }

    const result = await prisma.tutorProfile.update({
        where: { userId },
        data: {
            subject: subject,
            bio: bio,
            hourlyRate: hourlyRate,
            availability: availability,
            categoryName: categoryName
        }
    });

    return result;
}

const updateTutorAvailability = async (userId: string, data: any) => {
    const { availability } = data;
    const isTutorExist = await prisma.tutorProfile.findUnique({
        where: { userId }
    });

    if (!isTutorExist) {
        throw new Error("Tutor profile not found! Please create one first.");
    }

    const result = await prisma.tutorProfile.update({
        where: { userId },
        data: {
            availability: availability,
        }
    });

    return result;
}

const getTutorDashboardData = async (userId: string) => {
    const tutorProfile = await prisma.tutorProfile.findUnique({
        where: { userId }
    });

    if (!tutorProfile) throw new Error("Tutor profile not found!");

    const [totalSessions, pendingSessions, reviews, upcomingSessions] = await Promise.all([
        prisma.booking.count({ where: { tutorId: tutorProfile.userId } }),
        prisma.booking.count({ where: { tutorId: tutorProfile.userId, status: BookingStatus.PENDING } }),
        prisma.review.aggregate({
            where: { tutorId: tutorProfile.userId },
            _avg: { rating: true },
            _count: true
        }),

        prisma.booking.findMany({
            where: { tutorId: tutorProfile.userId, status: BookingStatus.CONFIRMED },
            take: 5,
            include: {
                student: { select: { name: true, email: true } }
            },
            orderBy: { createdAt: 'desc' }
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

export const tutorService = {
    createTuror,
    getAllTutors,
    getSingleTutor,
    updateTutorProfile,
    updateTutorAvailability,
    getTutorDashboardData
}