const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  razorpay_order_id: { 
    type: String, 
    required: true,
    unique: true
  },
  razorpay_payment_id: { 
    type: String, 
    default: null 
  },
  razorpay_signature: { 
    type: String, 
    default: null 
  },
  plan: { 
    type: String, 
    enum: ['pro', 'careerPlus'],
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  currency: { 
    type: String, 
    default: 'INR' 
  },
  status: { 
    type: String, 
    enum: ['created', 'paid', 'failed'], 
    default: 'created' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
