import { BookingStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const createBooking = async (studentUserId: string, tutorUserId: string, payload: { startTime: string, endTime: string }) => {
    const tutorProfile = await prisma.tutorProfile.findUnique({
        where: { userId: tutorUserId },
        select: {
            id: true,
            hourlyRate: true
        }
    });

    if (!tutorProfile) {
        throw new Error("Tutor profile not found for this user!");
    }

    const start = new Date(payload.startTime);
    const end = new Date(payload.endTime);

    if (end <= start) {
        throw new Error("End time must be after start time!");
    }

    const durationInHours = Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60);
    const totalAmount = durationInHours * tutorProfile.hourlyRate;

    const result = await prisma.booking.create({
        include: {
            tutor: true
        },
        data: {
            startTime: start,
            endTime: end,
            totalAmmount: totalAmount,
            studentId: studentUserId,
            tutorId: tutorProfile.id,
            status: BookingStatus.CONFIRMED
        }
    })

    return result;
};

const getAllBookings = async () => {
    const result = await prisma.booking.findMany({
        include: {
            tutor: {
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true
                        }
                    }
                }
            },
            student: {
                select: {
                    name: true,
                    email: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return result;
};

export const bookingService = {
    createBooking,
    getAllBookings
}