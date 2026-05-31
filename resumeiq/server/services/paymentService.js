const Razorpay = require('razorpay');
const crypto = require('crypto');
const paymentRepository = require('../repositories/paymentRepository');
const userRepository = require('../repositories/userRepository');

const PLAN_PRICES = {
  pro: 149900,
  careerPlus: 299900
};

class PaymentService {
  getRazorpay() {
    if (!this.razorpay) {
      this.razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });
    }
    return this.razorpay;
  }

  async createOrder(userId, plan) {
    if (!PLAN_PRICES[plan]) {
      const err = new Error('Invalid plan selected.');
      err.statusCode = 400;
      throw err;
    }

    const amount = PLAN_PRICES[plan];

    const options = {
      amount,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      notes: {
        userId: String(userId),
        plan
      }
    };

    let order;
    try {
      order = await this.getRazorpay().orders.create(options);
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.log("RAZORPAY ORDER ERROR", {
          statusCode: error?.statusCode,
          message: error?.message,
          errorCode: error?.error?.code,
          errorDescription: error?.error?.description,
          errorReason: error?.error?.reason,
          field: error?.error?.field,
        });
      }
      const newError = new Error('Payment gateway configuration error.');
      newError.statusCode = 500;
      throw newError;
    }

    await paymentRepository.createPayment({
      userId,
      razorpay_order_id: order.id,
      plan,
      amount
    });

    return {
      order_id: order.id,
      amount: order.amount,
      currency: order.currency
    };
  }

  async verifyPayment(userId, { razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
    const payment = await paymentRepository.getPaymentByOrderId(razorpay_order_id);
    
    if (!payment) {
      const err = new Error('Payment record not found');
      err.statusCode = 404;
      throw err;
    }

    if (payment.userId.toString() !== userId.toString()) {
      const err = new Error('Payment record not found');
      err.statusCode = 404;
      throw err;
    }
    
    if (payment.status === 'paid') {
      return { success: true, message: 'Already paid' };
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Upgrade user
      const user = await userRepository.findById(userId);
      if (!user) {
        const err = new Error('User not found');
        err.statusCode = 404;
        throw err;
      }

      user.plan = payment.plan;
      if (payment.plan === 'pro') {
          user.scansLimit = 9999;
      } else if (payment.plan === 'careerPlus') {
          user.scansLimit = 99999;
      }
      await user.save();

      // Mark payment as paid
      await paymentRepository.updatePaymentByOrderId(razorpay_order_id, {
        razorpay_payment_id,
        razorpay_signature,
        status: 'paid'
      });

      return { success: true };
    } else {
      await paymentRepository.updatePaymentByOrderId(razorpay_order_id, {
        status: 'failed'
      });
      const err = new Error('Invalid payment signature');
      err.statusCode = 400;
      throw err;
    }
  }

  async verifyWebhook(rawBody, signature) {
    if (!process.env.RAZORPAY_WEBHOOK_SECRET) {
      return false;
    }
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest('hex');

    return expectedSignature === signature;
  }

  async handleWebhookEvent(event) {
    if (event.event === 'payment.captured' || event.event === 'order.paid') {
      const paymentEntity = event.payload.payment.entity;
      const orderId = paymentEntity.order_id;
      
      const payment = await paymentRepository.getPaymentByOrderId(orderId);
      
      if (payment && payment.status !== 'paid') {
        await paymentRepository.updatePaymentByOrderId(orderId, {
          razorpay_payment_id: paymentEntity.id,
          status: 'paid'
        });

        // Upgrade user plan
        const user = await userRepository.findById(payment.userId);
        if (user) {
          user.plan = payment.plan;
          if (payment.plan === 'pro') {
              user.scansLimit = 9999;
          } else if (payment.plan === 'careerPlus') {
              user.scansLimit = 99999;
          }
          await user.save();
        }
      }
    }
  }

  async getMyPayments(userId) {
    return await paymentRepository.getPaymentsByUserId(userId);
  }
}

module.exports = new PaymentService();
