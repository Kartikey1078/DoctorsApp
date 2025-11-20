import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';

import adminRouter from './routes/adminRoute.js';
import doctorRouter from './routes/doctorRoute.js';
import userRouter from './routes/userRoute.js';

import crypto from "crypto";
import { SquareClient } from "square";   // ⭐ FIXED IMPORT

// App setup
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

app.use(express.json());
app.use(cors({
  origin: [
    "https://doctorsapp-a0c3.onrender.com",
    "https://doctorsappadmin.onrender.com"
  ],
  credentials: true
}));

// ⭐ SQUARE CLIENT (v43+)
const client = new SquareClient({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: "sandbox", // change to "production" later
});

// ⭐ Payment Route
app.post("/api/payment/square", async (req, res) => {
  try {
    const { sourceId, amount } = req.body;

    const idempotencyKey =
      crypto.randomUUID?.() ||
      crypto.randomBytes(16).toString("hex");

    const paymentsApi = client.paymentsApi;

    const response = await paymentsApi.createPayment({
      sourceId,
      idempotencyKey,
      locationId: process.env.SQUARE_LOCATION_ID,
      amountMoney: {
        amount: Math.round(amount * 100),
        currency: process.env.CURRENCY || "USD",
      },
    });

    res.json({
      success: true,
      payment: response.result.payment,
    });

  } catch (err) {
    console.error("Square Payment Error:", err);
    res.status(500).json({
      success: false,
      message: err?.message,
    });
  }
});

// Existing routes
app.use('/api/admin', adminRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/user', userRouter);

app.get('/', (req, res) => {
  res.send("API working");
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
