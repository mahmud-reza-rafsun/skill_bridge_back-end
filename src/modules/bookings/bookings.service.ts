import { BookingStatus, UserRole } from "../../../generated/prisma";
import { prisma } from "../../lib/prisma";

const createBooking = async (
    studentUserId: string,
    tutorIdFromProfile: string,
    payload: { totalAmount: number }
) => {
    const tutorProfile = await prisma.tutorProfile.findUnique({
        where: { id: tutorIdFromProfile },
        select: { id: true, hourlyRate: true }
    });

    if (!tutorProfile) {
        throw new Error("Tutor profile not found!");
    }

    return await prisma.booking.create({
        data: {
            totalAmount: payload.totalAmount || tutorProfile.hourlyRate,
            studentId: studentUserId,
            tutorId: tutorProfile.id,
            status: BookingStatus.PENDING
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

const getMyBooking = async (userId: string) => {
    return await prisma.booking.findMany({
        where: {
            studentId: userId
        },
        include: {
            tutor: {
                include: {
                    user: {
                        select: { name: true, image: true, email: true }
                    }
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
};



export const bookingService = {
    createBooking,
    getAllBookings,
    getSingleBooking,
    getMyBooking,
};