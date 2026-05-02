import { Request, Response } from "express";
import { PaymentService } from "./payment.service";
import { stripe } from "../../config/stripe/stripe.config";

const createCheckoutSession = async (req: Request, res: Response) => {
    try {
        const { bookingId } = req.body;
        const user = (req as any).user;

        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        if (!bookingId) {
            return res.status(400).json({ success: false, message: "Booking ID is required" });
        }

        const url = await PaymentService.createCheckoutSession(bookingId, user);

        return res.status(200).json({
            success: true,
            data: url
        });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const handleStripeWebhookEvent = async (req: Request, res: Response) => {
    const signature = req.headers['stripe-signature'] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
        return res.status(400).send("Webhook config missing");
    }

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
    } catch (error: any) {
        return res.status(400).send(error.message);
    }

    await PaymentService.handleWebhook(event);

    return res.json({ received: true });
};

const completeBooking = async (req: Request, res: Response) => {
    try {
        const { bookingId } = req.params;
        const user = (req as any).user;

        const result = await PaymentService.completeSessionAndCapturePayment(bookingId as string, user.id);

        return res.json({
            success: true,
            data: result
        });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const PaymentController = {
    createCheckoutSession,
    handleStripeWebhookEvent,
    completeBooking
};
