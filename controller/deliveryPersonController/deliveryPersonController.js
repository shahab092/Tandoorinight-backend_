const DeliveryPerson = require("../../modules/DeliveryPerson");

// ✅ Add delivery person
exports.addDeliveryPerson = async (req, res) => {
  try {
    const deliveryPerson = new DeliveryPerson(req.body);
    await deliveryPerson.save();
    res.status(201).json({ success: true, data: deliveryPerson });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ Get all delivery persons
 exports.getDeliveryPersons = async (req, res) => {
  try {
    const persons = await DeliveryPerson.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: persons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get single delivery person by ID
exports.getDeliveryPersonById = async (req, res) => {
  try {
    const person = await DeliveryPerson.findById(req.params.id);
    if (!person) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    res.status(200).json({ success: true, data: person });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update delivery person
exports.updateDeliveryPerson = async (req, res) => {
  try {
    const person = await DeliveryPerson.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!person) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    res.status(200).json({ success: true, data: person });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ Delete delivery person
exports.deleteDeliveryPerson = async (req, res) => {
  try {
    const person = await DeliveryPerson.findByIdAndDelete(req.params.id);
    if (!person) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.updateDeliveryPersonStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const person = await DeliveryPerson.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!person) {
      return res.status(404).json({ success: false, message: "Delivery person not found" });
    }

    res.status(200).json({ success: true, data: person });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};