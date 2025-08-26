const Inventory = require("../../modules/Inventory");

const addInventory = async (req, res) => {
  try {
    const { itemId, unit, quantity, costPrice } = req.body;

    if (!itemId || !unit || quantity == null || costPrice == null) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Always create new inventory record (no price)
    const newInventory = new Inventory({ itemId, unit, quantity, costPrice });
    await newInventory.save();

    res.status(201).json({ message: "Inventory item added", inventory: newInventory });
  } catch (error) {
    console.error("Add Inventory Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getAllInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find().populate("itemId", "title unit");
    res.status(200).json({ inventory });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch inventory", error });
  }
};

const updateInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const { itemId, unit, quantity, costPrice } = req.body;

    if (!itemId || !unit || quantity == null || costPrice == null) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const updated = await Inventory.findByIdAndUpdate(
      id,
      { itemId, unit, quantity, costPrice },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    res.status(200).json({ message: "Inventory item updated", inventory: updated });
  } catch (error) {
    console.error("Update Inventory Error:", error);
    res.status(500).json({ message: "Update failed" });
  }
};

const deleteInventory = async (req, res) => {
  try {
    const { id } = req.params;
    await Inventory.findByIdAndDelete(id);
    res.status(200).json({ message: "Inventory item deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};
// 📌 Get Inventory by Date Range
const getInventoryByDateRange = async (req, res) => {
  try {
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({ message: "From and To dates are required" });
    }

    // Parse dates properly
    const fromDate = new Date(from + "T00:00:00.000Z"); 
    const toDate = new Date(to + "T23:59:59.999Z");
 

    // Query with createdAt
    const inventory = await Inventory.find({
      createdAt: { $gte: fromDate, $lte: toDate }
    }).populate("itemId", "title unit");

    res.status(200).json({ 
      success: true, 
      count: inventory.length, 
      inventory 
    });
  } catch (error) {
    console.error("Date Range Inventory Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};



module.exports = {
  addInventory,
  getAllInventory,
  updateInventory,
  deleteInventory,
  getInventoryByDateRange
};
