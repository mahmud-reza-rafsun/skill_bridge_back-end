import { prisma } from "../../lib/prisma";

// backend/service/booking.service.ts
const createBooking = async (studentUserId: string, tutorIdFromProfile: string, payload: { totalAmount: number, date: any }) => {
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
            date: new Date(payload.date),
        }
    });

    if (existingBooking) {
        throw new Error("This tutor is already booked for this date!");
    }

    return await prisma.booking.create({
        data: {
            totalAmount: payload.totalAmount || tutorProfile.hourlyRate,
            studentId: studentUserId,
            tutorId: tutorProfile.id,
            date: new Date(payload.date),
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

const getTutorBookings = async (userId: string) => {
    const tutorProfile = await prisma.tutorProfile.findUnique({
        where: { userId: userId },
        select: { id: true }
    });

    if (!tutorProfile) {
        throw new Error("Tutor profile not found!");
    }

    return await prisma.booking.findMany({
        where: {
            tutorId: tutorProfile.id
        },
        include: {
            student: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true
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
    getTutorBookings,
};