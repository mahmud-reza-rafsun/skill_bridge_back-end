import { BookingStatus, UserRole } from "../../../generated/prisma";
import { prisma } from "../../lib/prisma";

const getTutorBookings = async (tutorId: string) => {
    const result = await prisma.booking.findMany({
        where: {
            tutorId: tutorId
        },
        include: {
            student: {
                select: {
                    name: true,
                    email: true,
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
    return result;
};

const updateBookingStatus = async (
    bookingId: string,
    status: BookingStatus,
    user: any
) => {
    const booking = await prisma.booking.findUnique({
        where: { id: bookingId }
    });

    if (!booking) throw new Error("Booking not found!");

    return await prisma.booking.update({
        where: { id: bookingId },
        data: { status }
    });
};

export const tutorsService = {
    updateBookingStatus,
    getTutorBookings
}