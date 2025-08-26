const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const paymentHistorySchema = new mongoose.Schema({
  remainId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'RemainHistory', 
    required: true 
  },
  customerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Customer', 
    required: true 
  },
  orderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Order', 
    required: true 
  },
  amountPaid: { 
    type: Number, 
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'bank_transfer', 'cheque', 'other'],
    default: 'cash'
  },
  notes: {
    type: String,
    trim: true
  },
  previousBalance: {
    type: Number,
    required: true
  },
  newBalance: {
    type: Number,
    required: true
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiptNumber: {
    type: String,
    unique: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add pagination plugin
paymentHistorySchema.plugin(mongoosePaginate);

// Add pre-save hook to generate receipt number
paymentHistorySchema.pre('save', async function(next) {
  if (!this.receiptNumber) {
    const count = await this.constructor.countDocuments();
    this.receiptNumber = `RC-${Date.now().toString().slice(-6)}-${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('PaymentHistory', paymentHistorySchema);