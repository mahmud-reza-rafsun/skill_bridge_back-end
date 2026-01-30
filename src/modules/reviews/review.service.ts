import { prisma } from "../../lib/prisma";

const createReview = async (studentUserId: string, bookingId: string, payload: { rating: number, comment?: string }) => {
    const { rating, comment } = payload;

    const bookingData = await prisma.booking.findUnique({
        where: { id: bookingId },
        select: {
            studentId: true,
            tutorId: true
        }
    })


    if (!bookingData) {
        throw new Error("Booking record not found!")
    }

    if (bookingData.studentId !== studentUserId) {
        throw new Error("You are not authorized to review this booking!")
    }

    const isRevideExist = await prisma.review.findUnique({
        where: { bookingId }
    })

    if (isRevideExist) {
        throw new Error("You have already reviewed this booking!");
    }

    const result = await prisma.review.create({
        data: {
            rating: Number(rating),
            comment: comment || '',
            studentId: studentUserId,
            tutorId: bookingData.tutorId,
            bookingId: bookingId
        },
        include: {
            tutor: true,
        }
    });

    return result;
};

export const reviewService = {
    createReview,
}