import mongoose from "mongoose";

const newappointmentSchema = new mongoose.Schema(
  {
    userID: { type: String, required: true },
    docID: { type: String, required: true },
    slotDate: { type: String, required: true },
    slotTime: { type: String, required: true },
    userData: { type: Object, required: true },
    docData: { type: Object, required: true },
    amount: { type: Number, required: true },
    date: { type: Number, required: true },
    payment: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false },
    newpayment: { type: Boolean, default: false },
  }
);

// 🔹 Explicitly set collection name to avoid pluralization confusion
const newappointmentModel =
  mongoose.models.newappointment ||
  mongoose.model("newappointment", newappointmentSchema, "newappointments");

export default newappointmentModel;
