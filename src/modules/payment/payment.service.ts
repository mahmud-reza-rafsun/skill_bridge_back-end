import { PaymentStatus, BookingStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../config/stripe/stripe.config";

const createCheckoutSession = async (bookingId: string, user: any) => {
    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { tutor: true }
    });

    if (!booking) throw new Error("Booking not found");
    if (booking.status !== BookingStatus.PENDING) {
        throw new Error("Invalid booking state");
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        customer_email: user.email,
        line_items: [{
            price_data: {
                currency: "usd",
                product_data: {
                    name: `Tutoring Session`,
                    description: `${booking.day} ${booking.slot}`,
                },
                unit_amount: Math.round(booking.totalAmount * 100),
            },
            quantity: 1,
        }],
        mode: "payment",
        payment_intent_data: {
            capture_method: "manual",
            metadata: { bookingId: booking.id }
        },
        metadata: {
            bookingId: booking.id,
            userId: user.id
        },
        success_url: `${process.env.APP_URL}/my-bookings`,
        cancel_url: `${process.env.APP_URL}/my-bookings`,
    });

    return session.url;
};

const handleWebhook = async (event: any) => {
    const session = event.data.object;
    const bookingId = session.metadata?.bookingId;

    if (!bookingId) return;

    if (event.type === "checkout.session.completed") {
        const paymentIntentId = session.payment_intent;

        await prisma.payment.upsert({
            where: { bookingId },
            update: {
                status: PaymentStatus.HOLD,
                stripeIntentId: paymentIntentId,
                amount: session.amount_total / 100,
            },
            create: {
                bookingId,
                stripeIntentId: paymentIntentId,
                amount: session.amount_total / 100,
                status: PaymentStatus.HOLD,
            },
        });
    }

    if (event.type === "payment_intent.payment_failed") {
        await prisma.booking.update({
            where: { id: bookingId },
            data: { status: BookingStatus.CANCELLED }
        });
    }
};

const completeSessionAndCapturePayment = async (bookingId: string, studentId: string) => {
    const booking = await prisma.booking.findFirst({
        where: {
            id: bookingId,
            studentId,
            status: BookingStatus.CONFIRMED
        },
        include: { payment: true }
    });

    if (!booking?.payment?.stripeIntentId) {
        throw new Error("No payment to capture");
    }

    await stripe.paymentIntents.capture(booking.payment.stripeIntentId);

    await prisma.payment.update({
        where: { bookingId },
        data: { status: PaymentStatus.PAID }
    });

    return await prisma.booking.update({
        where: { id: bookingId },
        data: { status: BookingStatus.COMPLETED }
    });
};

export const PaymentService = {
    createCheckoutSession,
    handleWebhook,
    completeSessionAndCapturePayment
};
