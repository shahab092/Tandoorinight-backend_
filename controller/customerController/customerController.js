const Customer = require("../../modules/Customer");

// Add customer
exports.addCustomer = async (req, res) => {
  try {
    const { name, address, phone, bankName, branch, iban } = req.body;

    if (!name || !address || !phone) {
      return res.status(400).json({ success: false, message: "Name, address, and phone are required" });
    }

    const exists = await Customer.findOne({ phone });
    if (exists) {
      return res.status(409).json({ success: false, message: "Customer already exists" });
    }

    const newCustomer = new Customer({ name, address, phone, bankName, branch, iban });
    await newCustomer.save();

    res.status(201).json({ success: true, message: "Customer added", customer: newCustomer });
  } catch (error) {
    res.status(500).json({ success: false, message: "Add failed", error: error.message });
  }
};

// Get all customers
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, customers });
  } catch (error) {
    res.status(500).json({ success: false, message: "Fetch failed", error: error.message });
  }
};

// Update customer
exports.updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, phone, bankName, branch, iban } = req.body;

    if (!name || !address || !phone) {
      return res.status(400).json({ success: false, message: "Name, address, and phone are required" });
    }

    const customer = await Customer.findByIdAndUpdate(
      id,
      { name, address, phone, bankName, branch, iban },
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({ success: false, message: "Customer not found" });
    }

    res.status(200).json({ success: true, message: "Updated successfully", customer });
  } catch (error) {
    res.status(500).json({ success: false, message: "Update failed", error: error.message });
  }
};

// Delete customer
exports.deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Customer.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Customer not found" });
    }

    res.status(200).json({ success: true, message: "Customer deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Delete failed", error: error.message });
  }
};
