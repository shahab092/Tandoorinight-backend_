const RemainHistory = require('../../modules/RemainHistory');
const PaymentHistory = require('../../modules/PaymentHistory');
const Order = require('../../modules/order');
const Customer = require('../../modules/Customer');
const mongoose = require('mongoose');


exports.getLedgerCustomers = async (req, res) => {
  try {
    const customersWithBalances = await RemainHistory.aggregate([
      { $match: { remainAmount: { $gt: 0 } } },
      {
        $group: {
          _id: '$customerId',
          totalBalance: { $sum: '$remainAmount' },
          lastPaymentDate: { $max: '$updatedAt' }
        }
      },
      {
        $lookup: {
          from: 'customers',
          localField: '_id',
          foreignField: '_id',
          as: 'customer'
        }
      },
      { $unwind: '$customer' },
      {
        $project: {
          _id: '$customer._id',
          name: '$customer.name',
          phone: '$customer.phone',
          address: '$customer.address',
          totalBalance: 1,
          lastPaymentDate: 1
        }
      },
      { $sort: { totalBalance: -1 } }
    ]);

    res.json(customersWithBalances);
  } catch (error) {
    console.error('Ledger Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customers ledger',
      error: error.message
    });
  }
};

exports.getCustomerLedger = async (req, res) => {
  try {
    const { customerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid customer ID format'
      });
    }

    const customerObjectId = new mongoose.Types.ObjectId(customerId);
    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    const unpaidOrders = await RemainHistory.aggregate([
      { $match: { customerId: customerObjectId, remainAmount: { $gt: 0 } } },
      {
        $lookup: {
          from: 'orders',
          localField: 'orderId',
          foreignField: '_id',
          as: 'order'
        }
      },
      { $unwind: '$order' },
      {
        $project: {
          _id: '$order._id',
          totalAmount: '$order.totalAmount',
          paidAmount: '$order.paidAmount',
          remainAmount: 1,
          createdAt: '$order.createdAt',
          itemsCount: { $size: '$order.items' }
        }
      },
      { $sort: { createdAt: -1 } }
    ]);

    const summary = {
      totalBalance: unpaidOrders.reduce((sum, order) => sum + order.remainAmount, 0),
      totalOrders: unpaidOrders.length,
      lastPayment: await PaymentHistory.findOne({ customerId: customerObjectId })
        .sort({ createdAt: -1 })
        .select('amountPaid createdAt processedBy')
        .populate('processedBy', 'name')
    };

    res.json({
      success: true,
      customer,
      orders: unpaidOrders,
      summary
    });
  } catch (error) {
    console.error('Ledger Detail Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer ledger details',
      error: error.message
    });
  }
};


 

 
exports.getPaymentHistory = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid customer ID format' 
      });
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: [
        { path: 'orderId', select: '_id' }, // Only get _id from order
        { path: 'processedBy', select: 'name' }
      ]
    };

    const payments = await PaymentHistory.paginate(
      { customerId: new mongoose.Types.ObjectId(customerId) },
      options
    );

    res.json({
      success: true,
      payments
    });
  } catch (error) {
    console.error('Payment History Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch payment history',
      error: error.message 
    });
  }
};

/**
 * @desc    Pay customer's outstanding balance across all orders
 * @route   POST /api/ledger/pay-customer/:customerId
 * @access  Private
 */
exports.payCustomerBalance = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { customerId } = req.params;
    const { amountPaid, paymentMethod, notes } = req.body;

    // Fallback system user ID (replace with a valid ObjectId from your DB)
    const systemUserId = new mongoose.Types.ObjectId('65d5f8a1e4b0a1b9c8a7b6c5');

    if (typeof amountPaid !== 'number' || amountPaid <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment amount'
      });
    }

    const unpaidOrders = await RemainHistory.find({
      customerId: new mongoose.Types.ObjectId(customerId),
      remainAmount: { $gt: 0 }
    }).sort({ createdAt: 1 }).session(session);

    if (unpaidOrders.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No outstanding balance for this customer'
      });
    }

    let remainingPayment = amountPaid;
    const updatedOrders = [];
    const paymentRecords = [];

    for (const order of unpaidOrders) {
      if (remainingPayment <= 0) break;

      const paymentAmount = Math.min(remainingPayment, order.remainAmount);
      const previousBalance = order.remainAmount;

      order.remainAmount -= paymentAmount;
      order.updatedAt = new Date();
      await order.save({ session });

      const mainOrder = await Order.findById(order.orderId).session(session);
      if (mainOrder) {
        mainOrder.paidAmount += paymentAmount;
        mainOrder.remainAmount = order.remainAmount;

        // ✅ Fix: Ensure userId is set to avoid validation error
        if (!mainOrder.userId) {
          mainOrder.userId = systemUserId;
        }

        await mainOrder.save({ session });
      }

      const payment = await PaymentHistory.create([{
        remainId: order._id,
        customerId: order.customerId,
        orderId: order.orderId,
        amountPaid: paymentAmount,
        paymentMethod: paymentMethod || 'cash',
        notes,
        processedBy: systemUserId, // Use system user instead of authenticated user
        previousBalance,
        newBalance: order.remainAmount
      }], { session });

      paymentRecords.push(payment[0]);
      remainingPayment -= paymentAmount;
      updatedOrders.push(order);
    }

    await session.commitTransaction();

    res.json({
      success: true,
      message: 'Payment processed successfully',
      amountPaid: amountPaid - remainingPayment,
      remainingBalance: updatedOrders.reduce((sum, order) => sum + order.remainAmount, 0),
      payments: paymentRecords
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Payment Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process payment',
      error: error.message
    });
  } finally {
    session.endSession();
  }
};
