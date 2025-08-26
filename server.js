const express = require("express");
const dotenv = require("dotenv");
const dataBaseconnect = require("./config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser"); // ⬅️ important
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require('./routes/categoryRoutes')
const items = require('./routes/items')
const customer = require('./routes/customerRoutes')
const vendorRoutes = require('./routes/vendorRoutes')
const inventoryRoutes = require('./routes/inventoryRoutes')
const order = require('./routes/orderRoutes')
const ledgerRoutes = require('./routes/ledgerRoutes')
const expenseRoutes = require('./routes/expenseRoutes')
dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser()); // ⬅️ must come after express.json
app.use(
  cors({
    origin: "https://pos-frontend-self.vercel.app", // frontend url
    credentials: true,               // allow sending cookies
  })
);
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Welcome back!!!!");
});

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/items", items);
app.use("/api/customers", customer);
app.use("/api/vendors", vendorRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use('/api/shop', order);
app.use('/api/ledger', ledgerRoutes);
app.use("/api/expenses", expenseRoutes);
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await dataBaseconnect();
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
  }
};

startServer();


// http://localhost:5000
//https://pos-frontend-self.vercel.app