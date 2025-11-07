import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'
const Navbar = () => {
    const {atoken,setAToken} = useContext(AdminContext)
    const navigate = useNavigate()
    const LogOut = () =>{
        navigate('/')
        atoken  && localStorage.removeItem("atoken") 
        atoken  && setAToken('') 
    }
  return (
    <div className="flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white">
      <div className="flex items-center gap-2 text-sm">
        <img
          className="w-36 sm:w-40 cursor-pointer"
          src={assets.admin_logo}
          alt=""
        />
        <p className="border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-500">
          {atoken ? "Admin" : "Doctor"}
        </p>
      </div>
      <button onClick={LogOut} className="bg-red-950 border rounded-full px-4 py-2 text-white">
        Log Out
      </button>
    </div>
  );
}

export default Navbar