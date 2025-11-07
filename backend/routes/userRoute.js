import express from "express";
import { registerUser } from "../controllers/userController.js";
import { loginUser,usersData ,updateProfile,bookAppointment,getAppointmentByUser,cancelAppointment,paymentRazorPay,verifyRazorPay} from "../controllers/userController.js";
import authUser from "../middleware/authUser.js";
import upload from "../middleware/multer.js";

const userRouter = express.Router()

userRouter.post("/register",registerUser)
userRouter.post("/loginUser",loginUser)
userRouter.get("/usersData",authUser,usersData)
userRouter.post("/updateProfile",upload.single('image'),authUser,updateProfile)
userRouter.post('/bookAppointment',authUser,bookAppointment )
userRouter.get("/appointments", authUser, getAppointmentByUser);
userRouter.delete("/cancelAppointment/:id", authUser, cancelAppointment);
// Backward-compatible: also allow PUT for cancel
userRouter.put("/cancelAppointment/:id", authUser, cancelAppointment);
userRouter.post("/payment-razorpay",authUser,paymentRazorPay)
userRouter.post("/verify-razorpay",authUser,verifyRazorPay)



export default userRouter