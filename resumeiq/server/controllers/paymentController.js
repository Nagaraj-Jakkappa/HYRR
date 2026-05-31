const paymentService = require('../services/paymentService');

exports.createOrder = async (req, res, next) => {
  try {
    const { plan } = req.body;
    if (!['pro', 'careerPlus'].includes(plan)) {
      return res.status(400).json({ success: false, message: 'Invalid plan selected' });
    }

    const orderData = await paymentService.createOrder(req.user.id, plan);
    res.status(200).json({ success: true, data: orderData });
  } catch (error) {
    next(error);
  }
};

exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing payment details' });
    }

    const result = await paymentService.verifyPayment(req.user.id, {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

exports.handleWebhook = async (req, res, next) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    
    if (!signature) {
      return res.status(400).send('Missing signature');
    }

    const rawBody = req.rawBody; // Set in routes/index.js
    
    if (!rawBody) {
       return res.status(400).send('Missing raw body');
    }

    const isValid = await paymentService.verifyWebhook(rawBody, signature);
    
    if (!isValid) {
      return res.status(400).send('Invalid signature');
    }

    const event = JSON.parse(rawBody.toString());
    await paymentService.handleWebhookEvent(event);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('Webhook handler failed');
  }
};

exports.getMyPayments = async (req, res, next) => {
  try {
    const payments = await paymentService.getMyPayments(req.user.id);
    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    next(error);
  }
};
