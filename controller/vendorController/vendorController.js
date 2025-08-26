const Vendor = require("../../modules/Vendor");

// Add a new vendor
const addVendor = async (req, res) => {
    try {
        const { company, address, phone } = req.body;

        const vendor = new Vendor({ company, address, phone });
        await vendor.save();

        res.status(201).json({ success: true, vendor, message: "Vender add successfully " });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to add vendor",
            error: err.message,
        });
    }
};

// Get all vendors
const getAllVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find().sort({ createdAt: -1 });
        res.json({ success: true, vendors });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch vendors",
            error: err.message,
        });
    }
};

// Update vendor
const updateVendor = async (req, res) => {
    try {
        const { id } = req.params;
        const { company, address, phone } = req.body;

        const updated = await Vendor.findByIdAndUpdate(
            id,
            { company, address, phone },
            { new: true }
        );

        if (!updated) {
            return res
                .status(404)
                .json({ success: false, message: "Vendor not found" });
        }

        res.json({ success: true, vendor: updated });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Update failed",
            error: err.message,
        });
    }
};

// Delete vendor
const deleteVendor = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Vendor.findByIdAndDelete(id);

        if (!deleted) {
            return res
                .status(404)
                .json({ success: false, message: "Vendor not found" });
        }

        res.json({ success: true, message: "Vendor deleted" });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Delete failed",
            error: err.message,
        });
    }
};

module.exports = {
    addVendor,
    getAllVendors,
    updateVendor,
    deleteVendor,
};
