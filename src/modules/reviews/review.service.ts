import { prisma } from "../../lib/prisma";

const createReview = async (
    studentUserId: string,
    bookingId: string,
    payload: { rating: number; comment?: string }
) => {
    const { rating, comment } = payload;

    // 1. Check if the booking exists
    const bookingData = await prisma.booking.findUnique({
        where: { id: bookingId },
        select: {
            studentId: true,
            tutorId: true
        }
    });

    if (!bookingData) {
        throw new Error("Booking record not found!");
    }

    // 2. Authorization: Only the student of this booking can review
    if (bookingData.studentId !== studentUserId) {
        throw new Error("You are not authorized to review this booking!");
    }

    // 3. One-to-One check: Ensure no duplicate reviews for the same booking
    const isReviewExist = await prisma.review.findUnique({
        where: { bookingId }
    });

    if (isReviewExist) {
        throw new Error("You have already reviewed this booking!");
    }

    // 4. Create the review
    return await prisma.review.create({
        data: {
            rating: Number(rating),
            comment: comment || '',
            studentId: studentUserId,
            tutorId: bookingData.tutorId,
            bookingId: bookingId
        }
    });
};

export const reviewService = {
    createReview,
};