import { BookingStatus, UserRole } from "../../../generated/prisma";
import { prisma } from "../../lib/prisma";

const createBooking = async (
    studentUserId: string,
    tutorUserId: string,
    payload: { startTime: string, endTime: string }
) => {
    const tutorProfile = await prisma.tutorProfile.findUnique({
        where: { userId: tutorUserId },
        select: { id: true, hourlyRate: true }
    });

    if (!tutorProfile) {
        throw new Error("Tutor profile not found!");
    }

    const start = new Date(payload.startTime);
    const end = new Date(payload.endTime);

    if (end <= start) {
        throw new Error("End time must be after start time!");
    }

    // Check for overlapping confirmed bookings for the same tutor
    const isAlreadyBooked = await prisma.booking.findFirst({
        where: {
            tutorId: tutorProfile.id,
            status: BookingStatus.CONFIRMED,
            AND: [
                { startTime: { lt: end } },
                { endTime: { gt: start } }
            ]
        }
    });

    if (isAlreadyBooked) {
        throw new Error("Tutor is already booked for this time slot!");
    }

    const durationInHours = Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60);
    const totalAmount = durationInHours * tutorProfile.hourlyRate;

    return await prisma.booking.create({
        data: {
            startTime: start,
            endTime: end,
            totalAmmount: totalAmount,
            studentId: studentUserId,
            tutorId: tutorProfile.id,
            status: BookingStatus.CONFIRMED
        },
        include: {
            tutor: { include: { user: { select: { name: true } } } },
            student: { select: { name: true } }
        }
    });
};

const getAllBookings = async () => {
    return await prisma.booking.findMany({
        include: {
            tutor: { include: { user: { select: { name: true, email: true } } } },
            student: { select: { name: true, email: true } }
        },
        orderBy: { createdAt: 'desc' }
    });
};

const getSingleBooking = async (id: string) => {
    const result = await prisma.booking.findUnique({
        where: { id },
        include: {
            tutor: { include: { user: { select: { name: true, email: true } } } },
            student: { select: { name: true, email: true } },
            review: true
        }
    });
    if (!result) throw new Error("Booking not found!");
    return result;
};

const getMyBooking = async (userId: string, role: string) => {
    let whereCondition: any = {};

    if (role === UserRole.STUDENT) {
        whereCondition = { studentId: userId };
    } else if (role === UserRole.TUTOR) {
        const profile = await prisma.tutorProfile.findUnique({ where: { userId } });
        if (!profile) return [];
        whereCondition = { tutorId: profile.id };
    }

    return await prisma.booking.findMany({
        where: whereCondition,
        include: {
            tutor: { include: { user: { select: { name: true } } } },
            student: { select: { name: true } }
        },
        orderBy: { createdAt: 'desc' }
    });
};

const updateBookingStatus = async (bookingId: string, status: BookingStatus) => {
    return await prisma.booking.update({
        where: { id: bookingId },
        data: { status }
    });
};

export const bookingService = {
    createBooking,
    getAllBookings,
    getSingleBooking,
    getMyBooking,
    updateBookingStatus
};