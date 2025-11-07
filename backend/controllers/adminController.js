import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import jwt from 'jsonwebtoken'
// api for adding doctor

const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      available,
      fees,
      address,
      //   slots_booked,
    } = req.body;
    const imageFile = req.file;

    // checking for all data  to add doctor
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !available ||
      !fees ||
      !address 
    ) {
      return res.json({ success: false, mesage: "Feilds are missing" });
    }
    // validating email format
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        mesage: "Please enter the valid email",
      });
    }
    // validating password strong password
    if (password.length < 8) {
      return res.json({
        success: false,
        mesage: "Please enter the strong password",
      });
    }
    // hasing docotor password
    const salt = await bcrypt.genSalt(10);
    const hashedPasswrd = await bcrypt.hash(password, salt);

    // upload image to cloudninary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url;
   
    const doctorData = {
      name,
      email,
      image: imageUrl,
      password: hashedPasswrd,
      speciality,
      degree,
      experience,
      available,
      about,
      fees,
      address: JSON.parse(address),
      date: Date.now(),
    };
    const newDoctor = new doctorModel(doctorData)
    await newDoctor.save()
    res.json({success:true,mesage:'Doctor added'})
  } catch (error) {
    console.log(error)
    res.json({success:false,mesage:error.mesage})
  }
};

// api for admin login
const loginAdmin = async (req,res)=>{
    try {
        const {email,password} = req.body
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password,process.env.JWT_SECRET)
            res.json({success:true,token})
        }
        else{
            res.json({success:false,mesage:'invalid credicial'})
        }
    } catch (error) {
        console.log(error)
        res.json({success:false,mesage:error.mesage})
    }
}
// api to get all doctor data
const allDoctor = async (req,res)=>{
    try {
        const doctors = await doctorModel.find({}).select('-password')
        res.json({success:true,doctors})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

export { addDoctor , loginAdmin,allDoctor};
