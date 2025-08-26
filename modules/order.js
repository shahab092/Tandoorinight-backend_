const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    items: [
        {
            itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
            quantity: { type: Number, required: true }
        }
    ],
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number },
    discount: { type: Number, default: 0 },
    remainAmount: { type: Number, default: 0 },
    status: { type: String, default: 'Paid' },
    paymentMethod: { type: String, default: null }, // ✅ Added payment method (optional)
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', default: null },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    deliveryPersonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DeliveryPerson',
        default: null
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);


