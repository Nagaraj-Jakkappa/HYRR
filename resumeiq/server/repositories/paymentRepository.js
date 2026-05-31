const Payment = require('../models/Payment');

class PaymentRepository {
  async createPayment(data) {
    return await Payment.create(data);
  }

  async getPaymentByOrderId(orderId) {
    return await Payment.findOne({ razorpay_order_id: orderId });
  }

  async updatePaymentByOrderId(orderId, updateData) {
    return await Payment.findOneAndUpdate(
      { razorpay_order_id: orderId },
      updateData,
      { new: true }
    );
  }

  async getPaymentsByUserId(userId) {
    return await Payment.find({ userId }).sort({ createdAt: -1 });
  }
}

module.exports = new PaymentRepository();
