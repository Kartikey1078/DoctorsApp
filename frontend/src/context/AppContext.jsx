// src/context/AppContext.jsx
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const currencySymbol = "$";
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  // ✅ token from localStorage
  const [token, setToken] = useState(localStorage.getItem("token") || null);


  // ✅ doctors list state
  const [doctors, setDoctors] = useState([]);

  // ✅ loading state for doctors
const [doctorsLoading, setDoctorsLoading] = useState(true);

  // ✅ user profile state
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    image: "",
    address: { line1: "", line2: "" },
    gender: "",
    dob: "",
  });

  // -----------------------------
  // 1. Fetch doctors list
  // -----------------------------
  const getDoctorsData = async () => {
    try {
      setDoctorsLoading(true); // ✅ start loading
  
      const { data } = await axios.get(`${backendURL}/api/doctor/list`);
  
      if (data.success) {
        setDoctors(data.doctors);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setDoctorsLoading(false); // ✅ stop loading
    }
  };
  

  // -----------------------------
  // 2. Load user profile
  // -----------------------------
  const loadUserProfileData = async () => {
    try {
      if (!token) return;
      const { data } = await axios.get(`${backendURL}/api/user/usersData`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setUserData({
          ...data.user,
          address: data.user.address || { line1: "", line2: "" },
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // -----------------------------
  // 3. Update user profile
  // -----------------------------
  const updateUserProfile = async (userData, imageFile) => {
    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("dob", userData.dob);
      formData.append("gender", userData.gender);
      formData.append("address[line1]", userData.address.line1);
      formData.append("address[line2]", userData.address.line2);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const { data } = await axios.post(
        `${backendURL}/api/user/updateProfile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        toast.success("Profile updated successfully!");
        setUserData({
          ...data.user,
          address: data.user.address || { line1: "", line2: "" },
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // get appointment data

  const getAppointmentData = async () => {
    if (!token) return []; // no token, return empty
  
    try {
      const { data } = await axios.get(`${backendURL}/api/user/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (data.success) {
        return data.appointment; // ✅ return array
      } else {
        toast.error(data.message);
        return [];
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
      return [];
    }
  };
  

  // -----------------------------
  // 4. Effects
  // -----------------------------
  useEffect(() => {
    getDoctorsData();
  }, []);

  
  useEffect(() => {
    if (token) {
      loadUserProfileData();
    } else {
      setUserData({
        name: "",
        email: "",
        phone: "",
        image: "",
        address: { line1: "", line2: "" },
        gender: "",
        dob: "",
      });
    }
  }, [token]);


  useEffect(() => {
    if (token) {
      loadUserProfileData();
  
      const fetchAppointments = async () => {
        const appointments = await getAppointmentData();
        console.log("Appointments:", appointments);
      };
  
      fetchAppointments();
    }
  }, [token]);

  // -----------------------------
  // 5. Context value
  // -----------------------------
  const value = {
    doctors,
    doctorsLoading,
    currencySymbol,
    token,
    setToken,
    backendURL,
    userData,
    setUserData,
    loadUserProfileData,
    updateUserProfile,
    getDoctorsData,
    getAppointmentData
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
