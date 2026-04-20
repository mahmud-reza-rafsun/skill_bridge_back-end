import { BookingStatus, UserRole } from "@prisma/client";
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

const getAllTutors = async (query: { searchTerm?: string; category?: string }) => {
    const { searchTerm, category } = query;
    return await prisma.tutorProfile.findMany({
        where: {
            user: {
                role: UserRole.TUTOR,
                isDeleted: false,
            },
            AND: [
                searchTerm
                    ? {
                        subject: {
                            contains: searchTerm,
                            mode: 'insensitive',
                        },
                    }
                    : {},
                category
                    ? {
                        categoryName: {
                            equals: category,
                            mode: 'insensitive',
                        },
                    }
                    : {},
            ],
        },
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                    image: true,
                },
            },
            availability: true,
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
        // 1. Total Earnings
        prisma.booking.aggregate({
            where: {
                tutorId: tutorProfile.id,
                status: BookingStatus.COMPLETED // Only completed sessions contribute to earnings
            },
            _sum: { totalAmount: true }
        }),

        // 2. Unique Students Count
        prisma.booking.groupBy({
            by: ['studentId'],
            where: { tutorId: tutorProfile.id },
        }),

        // 3. Total Bookings
        prisma.booking.count({
            where: { tutorId: tutorProfile.id }
        }),

        // 4. Upcoming Bookings Fix (Using createdAt or specific status)
        prisma.booking.count({
            where: {
                tutorId: tutorProfile.id,
                status: BookingStatus.PENDING // Assuming PENDING status indicates upcoming sessions,
                // Since 'date' doesn't exist, we use createdAt or just status
                // If you want strictly future ones and have no Date field, 
                // filtering by status "CONFIRMED" is the most reliable way.
            }
        }),

        // 5. Reviews and Ratings
        prisma.review.aggregate({
            where: {
                booking: { tutorId: tutorProfile.id }
            },
            _avg: { rating: true },
            _count: { rating: true }
        }),

        // 6. Revenue Chart Data (Grouping by day/slot needs formatting later)
        prisma.booking.findMany({
            where: {
                tutorId: tutorProfile.id,
                status: BookingStatus.COMPLETED // Only completed sessions contribute to revenue 
            },
            select: {
                totalAmount: true,
                createdAt: true,
                day: true,   // Added day
                slot: true   // Added slot
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
        revenueChart: revenueChartData.map(item => ({
            amount: item.totalAmount,
            date: item.createdAt,
            label: `${item.day} (${item.slot})` // Combining day and slot for chart labels
        })),
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

    const tutorProfile = await prisma.tutorProfile.findFirst({
        where: { userId: userId }
    });

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
    const isBookingExist = await prisma.booking.findUnique({
        where: { id: bookingId }
    });

    if (!isBookingExist) {
        throw new Error("Booking not found!");
    }
    return await prisma.booking.update({
        where: { id: bookingId },
        data: { status }
    });
};

const deleteBooking = async (id: string) => {
    const isBookingExist = await prisma.booking.findUnique({
        where: { id }
    });

    if (!isBookingExist) {
        throw new Error("Booking not found!");
    }

    const result = await prisma.booking.delete({
        where: { id }
    });

    return result;
};

const createTutorAvailability = async (availabilityData: any, userId: string) => {
    return await prisma.$transaction(async (tx) => {
        const tutorProfile = await tx.tutorProfile.findUnique({
            where: { userId },
        });

        if (!tutorProfile) {
            throw new Error("Tutor profile not found. Please create a profile first.");
        }
        const availability = await tx.availability.upsert({
            where: { tutorProfileId: tutorProfile.id },
            update: {
                slots: availabilityData,
            },
            create: {
                tutorProfileId: tutorProfile.id,
                slots: availabilityData,
            },
        });

        return availability;
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
    updateBookingStatus,
    deleteBooking,
    createTutorAvailability
};