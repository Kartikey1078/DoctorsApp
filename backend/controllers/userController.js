import newappointmentModel from "../models/newAppointment.js";
import validator from "validator";
import bycrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import userModal from "../models/userModel.js";
import { json } from "express";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import razorpay from "razorpay";
import crypto from "crypto";
// api to register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Details" });
    }
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a valid email" });
    }
    if (password.length < 8) {
      return res.json({ success: false, message: "Enter a strong password" });
    }
    // hashing user password
    const salt = await bycrypt.genSalt(10);
    const hashedPassword = await bycrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new userModel(userData);
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// api for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModal.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User does not exists" });
    }
    const isMatch = await bycrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/// get data of user
const usersData = async (req, res) => {
  try {
    const userID = req.user.id; // set by authUser middleware
    const user = await userModal.findById(userID).select("-password");
    res.json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// update user profile
const updateProfile = async (req, res) => {
  try {
    const userID = req.user.id; // ✅ get from auth middleware
    const { name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: "data is missing" });
    }

    let updateData = { name, phone, address, dob, gender };

    if (imageFile) {
      // upload image to cloudinary
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      updateData.image = imageUpload.secure_url;
    }

    const updatedUser = await userModal
      .findByIdAndUpdate(userID, updateData, { new: true })
      .select("-password");

    res.json({ success: true, message: "profile updated", user: updatedUser });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// api to complete appointment
const bookAppointment = async (req, res) => {
  try {
    const userID = req.user.id; // ✅ get from auth middleware
    const { docId, slotDate, slotTime } = req.body;

    const docData = await doctorModel.findById(docId).select("-password");
    if (!docData.available) {
      return res.json({ success: false, message: "Doctor is not available" });
    }

    let slotsBooked = docData.slotsBooked;
    const userData = await userModal.findById(userID).select("-password");

    // Check for existing active (non-cancelled) appointments for this slot
    const activeAppt = await newappointmentModel.findOne({
      docID: docId,
      slotDate: slotDate,
      slotTime: slotTime,
    });

    // If there's an active appointment for this slot, reject
    if (activeAppt) {
      return res.json({ success: false, message: "Slot is not available" });
    }

    // Check for cancelled appointment (allow rebooking)
    const cancelledAppt = await newappointmentModel.findOne({
      docID: docId,
      slotDate: slotDate,
      slotTime: slotTime,
    });

    let appointmentData;
    if (cancelledAppt) {
      // Reactivate cancelled appointment for rebooking
      appointmentData = await newappointmentModel.findByIdAndUpdate(
        cancelledAppt._id,
        {
          userID,
          docID: docId,
          userData,
          docData,
          amount: docData.fees,
          slotTime,
          slotDate,
          date: Date.now(),
          $unset: { cancelled: "" },
        },
        { new: true }
      );
    } else {
      // Create new appointment
      const appointmentdata = {
        userID,
        docID: docId,
        userData,
        docData,
        amount: docData.fees,
        slotTime,
        slotDate,
        date: Date.now(),
      };
      appointmentData = new newappointmentModel(appointmentdata);
      await appointmentData.save();
    }

    // Add or update slot in slotsBooked
    if (slotsBooked[slotDate]) {
      if (!slotsBooked[slotDate].includes(slotTime)) {
        slotsBooked[slotDate].push(slotTime);
      }
    } else {
      slotsBooked[slotDate] = [slotTime];
    }

    await doctorModel.findByIdAndUpdate(docId, { slotsBooked });

    res.json({ success: true, message: "Appointment booked" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const getAppointmentByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const appointment = await newappointmentModel.find({
      userID: userId,
    });
    res.json({ success: true, appointment });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const userID = req.user.id;

    // 🔹 Find appointment
    const appt = await newappointmentModel.findById(id);
    if (!appt) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    // 🔹 Verify user ownership
    if (String(appt.userID) !== String(userID)) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    // 🔹 Free doctor's booked slot
    const doctor = await doctorModel.findById(appt.docID);
    if (doctor && doctor.slotsBooked) {
      const slotsOnDate = doctor.slotsBooked[appt.slotDate] || [];

      // remove cancelled slot time
      const updatedSlots = slotsOnDate.filter((time) => time !== appt.slotTime);

      // if date still has other slots, update it; else remove that date key
      if (updatedSlots.length > 0) {
        doctor.slotsBooked[appt.slotDate] = updatedSlots;
      } else {
        delete doctor.slotsBooked[appt.slotDate];
      }

      await doctorModel.findByIdAndUpdate(doctor._id, {
        slotsBooked: doctor.slotsBooked,
      });
    }

    // 🔹 Permanently delete appointment
    await newappointmentModel.findByIdAndDelete(id);

    res.json({ success: true, message: "Appointment cancelled successfully" });
  } catch (error) {
    console.error("Cancel error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// API TO MAKE PAYMENT
const paymentRazorPay = async (req, res) => {

  try {
    const {appointmentId} =  req.body
  const appointmentData = await newappointmentModel.findById(appointmentId)

  if (!appointmentData) {
    return res
    .status(404)
    .json({ success: false, message: "Appointment Cancelled or not found" });
  }

  // creating option for razorPay
  const options = {
    amount: appointmentData.amount * 100,
    currency: process.env.CURRENCY,
    receipt: appointmentId
  }

  // creation of an order
  const order = await razorpayInstance.orders.create(options)

  res.json({success:true,order})

  } catch (error) {
    console.error("Cancel error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
  
};

//api to verify payment razorpay
const verifyRazorPay = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // 🧠 Check if all required fields are present
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing payment details" });
    }

    // 🔒 Verify Razorpay signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      console.log("✅ Payment verified successfully!");

      // 🧾 Get the appointmentId from the order's receipt field
      const order = await razorpayInstance.orders.fetch(razorpay_order_id);
      const appointmentId = order.receipt;

      // 📋 Find that appointment in DB
      const appointment = await newappointmentModel.findById(appointmentId);

      if (!appointment) {
        return res.status(404).json({ success: false, message: "Appointment not found" });
      }

      // 💰 Log the payment details
      console.log(`💸 Payment received for Appointment ID: ${appointmentId}`);
      console.log(`💰 Amount Paid: ${appointment.amount} ${process.env.CURRENCY}`);
      console.log(`🧾 Razorpay Payment ID: ${razorpay_payment_id}`);

      // ✅ Update appointment status (optional)
      appointment.payment = true;
      appointment.paymentId = razorpay_payment_id;
      await appointment.save();

      return res.json({
        success: true,
        message: "Payment verified successfully!",
        amountPaid: appointment.amount,
        currency: process.env.CURRENCY,
      });
    } else {
      console.log("❌ Invalid signature!");
      return res.status(400).json({ success: false, message: "Invalid signature!" });
    }
  } catch (error) {
    console.error("Error verifying Razorpay payment:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getAppointmentData = async (req, res) => {
  try {
    const appointments = await newappointmentModel.find({});
    
    // manually attach populated data
    const withDetails = await Promise.all(
      appointments.map(async (a) => {
        const user = await userModel.findById(a.userID).select("name email");
        const doc = await doctorModel.findById(a.docID).select("name speciality fees");
        return { ...a._doc, userId: user, docId: doc };
      })
    );

    res.json({ success: true, data: withDetails });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};



export {
  registerUser,
  loginUser,
  usersData,
  updateProfile,
  bookAppointment,
  getAppointmentByUser,
  cancelAppointment,
  paymentRazorPay,
  verifyRazorPay,
  getAppointmentData
};
