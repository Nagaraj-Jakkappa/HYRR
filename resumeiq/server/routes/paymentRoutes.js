const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');
const validate = require('../middleware/validate');
const { z } = require('zod');

const createOrderSchema = z.object({
  plan: z.enum(['pro', 'careerPlus'])
});

// Rate limiting for payment routes to prevent abuse
router.use(apiLimiter);

router.post(
  '/create-order',
  protect,
  validate(createOrderSchema),
  paymentController.createOrder
);
router.post('/verify', protect, paymentController.verifyPayment);
router.get('/my-payments', protect, paymentController.getMyPayments);

// Webhook route is registered directly in index.js to handle raw body parsing properly
// before express.json() intercepts it.

module.exports = router;
