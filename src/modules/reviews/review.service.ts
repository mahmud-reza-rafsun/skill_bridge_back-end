import { prisma } from "../../lib/prisma";

const createReview = async (
    studentUserId: string,
    bookingId: string,
    payload: { rating: number; comment?: string }
) => {
    const { rating, comment } = payload;
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
    if (bookingData.studentId !== studentUserId) {
        throw new Error("You are not authorized to review this booking!");
    }
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

const getTutorBooking = async (tutorUserId: string) => {
    return await prisma.booking.findMany({
        where: {
            tutor: {
                userId: tutorUserId
            }
        },
        include: {
            review: {
                select: {
                    rating: true,
                    comment: true,
                }
            },
            tutor: {
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true,
                            image: true
                        }
                    }
                }
            },
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

export const reviewService = {
    createReview,
    getTutorBooking,
};