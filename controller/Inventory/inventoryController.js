const Inventory = require("../../modules/Inventory");

const addInventory = async (req, res) => {
  try {
    const { itemId, unit, quantity, costPrice, price } = req.body;

    if (!itemId || !unit || quantity == null || costPrice == null || price == null) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if inventory for this itemId already exists
    const existingInventory = await Inventory.findOne({ itemId });

    if (existingInventory) {
      // Update quantity and optionally prices
      existingInventory.quantity += Number(quantity);
      existingInventory.unit = unit; // optional update
      existingInventory.costPrice = costPrice; // optional update
      existingInventory.price = price; // optional update

      await existingInventory.save();
      return res.status(200).json({ message: "Inventory quantity updated", inventory: existingInventory });
    }

    // If not exists, create a new entry
    const newInventory = new Inventory({ itemId, unit, quantity, costPrice, price });
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
    const { itemId, unit, quantity, costPrice, price } = req.body;

    if (!itemId || !unit || quantity == null || costPrice == null || price == null) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const updated = await Inventory.findByIdAndUpdate(
      id,
      { itemId, unit, quantity, costPrice, price },
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

module.exports = {
  addInventory,
  getAllInventory,
  updateInventory,
  deleteInventory,
};
