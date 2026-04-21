import { BookingStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma";

const createBooking = async (
    studentUserId: string,
    tutorIdFromProfile: string,
    payload: { totalAmount: number, day: string, slot: string }
) => {
    const tutorProfile = await prisma.tutorProfile.findUnique({
        where: { id: tutorIdFromProfile },
        select: { id: true, hourlyRate: true }
    });

    if (!tutorProfile) {
        throw new Error("Tutor profile not found!");
    }
    const existingBooking = await prisma.booking.findFirst({
        where: {
            tutorId: tutorProfile.id,
            day: payload.day,
            slot: payload.slot,
            status: 'PENDING'
        }
    });

    if (existingBooking) {
        throw new Error(`Tutor is already booked on ${payload.day} at ${payload.slot}!`);
    }
    return await prisma.booking.create({
        data: {
            totalAmount: payload.totalAmount || tutorProfile.hourlyRate,
            studentId: studentUserId,
            tutorId: tutorProfile.id,
            day: payload.day,
            slot: payload.slot,
            status: "PENDING"
        },
        include: {
            tutor: {
                include: {
                    user: { select: { name: true, image: true } }
                }
            },
            student: { select: { name: true, email: true } }
        }
    });
};

const getAllBookings = async () => {
    return await prisma.booking.findMany({
        include: {
            tutor: {
                include: {
                    user: { select: { name: true, email: true, image: true } }
                }
            },
            student: { select: { name: true, email: true } }
        },
        orderBy: { createdAt: 'desc' }
    });
};

const getSingleBooking = async (id: string) => {
    const result = await prisma.booking.findUnique({
        where: { id },
        include: {
            tutor: {
                include: {
                    user: { select: { name: true, email: true, image: true } }
                }
            },
            student: { select: { name: true, email: true } },
            review: true
        }
    });
    if (!result) throw new Error("Booking not found!");
    return result;
};

const getTutorBookings = async (studentUserId: string) => {
    return await prisma.booking.findMany({
        where: {
            studentId: studentUserId,
        },
        include: {
            tutor: {
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true,
                            image: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
};

const completeSession = async (bookingId: string, studentId: string) => {
    const booking = await prisma.booking.findFirst({
        where: {
            id: bookingId,
            studentId: studentId,
            status: BookingStatus.CONFIRMED,
        },
    });

    if (!booking) {
        throw new Error("Only confirmed sessions can be marked as completed.");
    }

    return await prisma.booking.update({
        where: {
            id: bookingId,
        },
        data: {
            status: BookingStatus.COMPLETED,
        },
    });
};

const getStudentDashboard = async (studentId: string) => {
    const allBookings = await prisma.booking.findMany({
        where: { studentId },
        include: {
            tutor: {
                include: {
                    user: {
                        select: { name: true, image: true }
                    }
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    const formattedBookings = allBookings.map((booking) => ({
        id: booking.id,
        bookingDate: booking.createdAt,
        tutorName: booking.tutor?.user?.name,
        tutorImage: booking.tutor?.user?.image,
        status: booking.status,
        totalAmount: booking.totalAmount
    }));

    const stats = {
        totalBookings: allBookings.length,
        pendingBookings: allBookings.filter(b => b.status === BookingStatus.PENDING).length,
        activeBookings: allBookings.filter(b => b.status === BookingStatus.CONFIRMED).length,
        completedBookings: allBookings.filter(b => b.status === BookingStatus.COMPLETED).length,
    };

    const totalSpent = allBookings
        .filter(b => b.status === BookingStatus.COMPLETED)
        .reduce((sum, booking) => sum + (Number(booking.totalAmount) || 0), 0);

    return {
        stats,
        totalSpent,
        recentBookings: formattedBookings.slice(0, 5), // Using the formatted array here
    };
};


export const bookingService = {
    createBooking,
    getAllBookings,
    getSingleBooking,
    getTutorBookings,
    completeSession,
    getStudentDashboard
};