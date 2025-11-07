import { useContext } from "react";
import Login from "./pages/Login"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AdminContext } from "./context/AdminContext";
import Navbar from "./components/Navbar";
import SideBar from "./components/SideBar";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Admin/Dashboard";
import AllAppointment from "./pages/Admin/AllAppointment";
import AddDoctor from "./pages/Admin/AddDoctor";
import DoctorList from "./pages/Admin/DoctorList";

function App() {
  
  const {atoken} = useContext(AdminContext)
  return atoken ? (
    <>
    <div className="bg-[#F8F9FD]">
    <ToastContainer />
    <Navbar />
    <div className="flex items-start">
      <SideBar />
      <Routes >
        <Route path="/" element={<></>} />
        <Route path="/admin-dashboard" element={<Dashboard />} />
        <Route path="/all-appointments" element={<AllAppointment />} />
        <Route path="/add-doctor" element={<AddDoctor />} />
        <Route path="/doctor-list" element={<DoctorList />} />
      </Routes>
    </div>
    </div>
    </>
  ) :(
    <>
      <Login/>
       <ToastContainer />
    </>
  )
}

export default App
