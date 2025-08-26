// controllers/orderController.js
const Order = require('../../modules/order');
const Inventory = require('../../modules/Inventory');
const RemainHistory = require('../../modules/RemainHistory');
const User = require('../../modules/userSchema'); // ✅ Import this!

exports.placeOrder = async (req, res) => {
  try {
    const { items, totalAmount, paidAmount, discount, customerId, paymentMethod, deliveryPersonId } = req.body;
    const userId = req.user._id;
    const remainAmount = totalAmount - paidAmount;

    // ✅ Create Order (without inventory stock check/update) ,deliveryPersonId   
    const order = await Order.create({
      items,
      totalAmount,
      paidAmount,
      discount: discount || 0,
      remainAmount,
      customerId: customerId || null,
      userId, // 👈 comes from the token
      paymentMethod: paymentMethod || null,
      deliveryPersonId: deliveryPersonId || null, // ✅ set if provided
      // ✅ Include this if provided
      status: 'Paid'
    });

    // ✅ Save RemainHistory only if there's a remaining amount and customer exists
    if (remainAmount > 0 && customerId) {
      await RemainHistory.create({
        orderId: order._id,
        customerId,
        remainAmount
      });
    }

    res.status(201).json({ message: 'Order placed successfully', order });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


exports.updateCartItemQuantity = async (req, res) => {
  try {
    const { itemId, prevQuantity, newQuantity } = req.body;
    const diff = newQuantity - prevQuantity;

    const inventory = await Inventory.findOne({ itemId });
    if (!inventory || inventory.quantity < diff) {
      return res.status(400).json({ message: 'Not enough stock to increase quantity' });
    }

    await Inventory.updateOne({ itemId }, { $inc: { quantity: -diff } });

    res.status(200).json({ message: 'Cart item quantity updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customerId', 'name phone address') // populate customer fields
      .populate('items.itemId', 'title unitPrice unit images')
      .populate('userId', 'name email')// populate item details
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// 🔁 Update Order Status Only
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'paid', 'partially-paid', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ success: true, order: updatedOrder });
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


exports.getMonthlyOrders = async (req, res) => {
  try {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const orders = await Order.find({
      createdAt: { $gte: firstDay, $lte: lastDay }
    })
      .populate('customerId', 'name address phone')  // ✅ populate these customer fields
      .populate('items.itemId', 'title unitPrice unit category images barcodeValue')  // ✅ item fields
      .populate('userId', 'name email')// populate item details
      .populate('deliveryPersonId', 'name phone email')
    res.json(orders);

  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};
// Search orders between fromDate and toDate
// exports.searchOrdersByDate = async (req, res) => {
//   try {
//     const { fromDate, toDate } = req.body;

//     if (!fromDate || !toDate) {
//       return res.status(400).json({ message: 'fromDate and toDate are required' });
//     }

//     const startDate = new Date(fromDate);
//     const endDate = new Date(toDate);
//     endDate.setHours(23, 59, 59, 999);

//     const orders = await Order.find({
//       createdAt: { $gte: startDate, $lte: endDate }
//     }).populate('customerId').populate('items.itemId');

//     res.json(orders);
//   } catch (error) {
//     res.status(500).json({ message: 'Server Error', error });
//   }
// };

exports.searchOrdersByDate = async (req, res) => {
  try {
    const { fromDate, toDate, userId } = req.body;

    const filter = {};

    // If both dates are provided
    if (fromDate && toDate) {
      const startDate = new Date(fromDate);
      const endDate = new Date(toDate);
      endDate.setHours(23, 59, 59, 999);
      filter.createdAt = { $gte: startDate, $lte: endDate };
    }

    // If userId is provided
    if (userId) {
      filter.userId = userId; // Only orders created by this user
    }

    // If nothing is provided
    if (!fromDate && !toDate && !userId) {
      return res.status(400).json({ message: 'Please provide a date range or user.' });
    }

    const orders = await Order.find(filter)
      .populate('customerId')
      .populate('items.itemId');

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};


exports.getUniqueOrderUsers = async (req, res) => {
  try {
    // Step 1: Get distinct userIds from the Order collection
    const userIds = await Order.distinct('userId');

    // Step 2: Fetch user details for those IDs
    const users = await User.find({ _id: { $in: userIds } })
      .select('firstName lastName email'); // You can select whatever fields you want

    res.status(200).json({ success: true, users });
  } catch (err) {
    console.error('Error fetching unique order users:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
