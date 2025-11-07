import express from "express";
import { addDoctor ,allDoctor,loginAdmin} from "../controllers/adminController.js";
import upload from "../middleware/multer.js";
import authAdmin from "../middleware/authAdmin.js";
import { changeAvailablity } from "../controllers/doctorController.js";
import {getAppointmentData} from "../controllers/userController.js"
const adminRouter = express.Router()

adminRouter.post('/add-doctor',authAdmin,upload.single('image'),addDoctor);
adminRouter.post('/login',loginAdmin);
adminRouter.post('/all-doctors',authAdmin,allDoctor)
adminRouter.post('/change-availablity',authAdmin,changeAvailablity)
adminRouter.get('/getAppointmentData',authAdmin,getAppointmentData)
export default adminRouter