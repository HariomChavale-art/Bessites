
'use server';

/**
 * @fileOverview Server Actions for payment processing.
 * Handles Stripe and Razorpay session/order creation.
 */

import Stripe from 'stripe';
import Razorpay from 'razorpay';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-01-27-preview',
});

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

export async function createStripeSession(amount: number, userId: string, userEmail: string) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Wallet Deposit - Bessites',
              description: `Adding $${amount} to your discovery wallet.`,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/wallet/add-funds?session_id={CHECKOUT_SESSION_ID}&success=true&amount=${amount}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/wallet/add-funds?success=false`,
      metadata: {
        userId,
        userEmail,
      },
    });

    return { sessionId: session.id, url: session.url };
  } catch (error: any) {
    console.error('Stripe Error:', error);
    throw new Error(error.message || 'Could not create Stripe session');
  }
}

export async function createRazorpayOrder(amount: number, userId: string) {
  try {
    // Razorpay amounts are in paise (1 INR = 100 paise)
    // For this prototype, we'll assume 1 USD = 80 INR for conversion if needed, 
    // but usually user selects INR for Razorpay.
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 80 * 100), // Mock conversion for prototype
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId,
      },
    });

    return { orderId: order.id, amount: order.amount, currency: order.currency };
  } catch (error: any) {
    console.error('Razorpay Error:', error);
    throw new Error(error.message || 'Could not create Razorpay order');
  }
}

export async function verifyPayment(sessionId: string) {
  // In a real app, you'd check Stripe/Razorpay for status
  // For the prototype, we simulate a successful verification
  return { status: 'success' };
}
