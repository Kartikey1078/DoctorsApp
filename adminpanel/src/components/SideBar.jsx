import React, { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { assets } from '../assets/assets'
import { NavLink } from 'react-router-dom'

const SideBar = () => {
    const {atoken} = useContext(AdminContext)
  return (
    <div className='min-h-screen bg-white border-right '>
        {
             atoken && 
                <ul className=' text-[#515151 mt-5]'>
                    <NavLink className={({isActive})=> `flex mt-5 mb-3 items-center gap-3 px-3 cursor-pointer  md:px-9 md:min-w-72 ${isActive ?  'bg-[#F2F3FF] border-r-4 border-[#5f6fff]' : ''}`} to={'/admin-dashboard'} >
                    <img src={assets.home_icon} />
                    <p>Dashboard</p>
                    </NavLink>
               
                    <NavLink className={({isActive})=> `flex mb-3 items-center gap-3 px-3 cursor-pointer  md:px-9 md:min-w-72 ${isActive ?  'bg-[#F2F3FF] border-r-4 border-[#5f6fff]' : ''}`} to={'/admin-dashboard'} to={'/all-appointments'} >
                    <img src={assets.appointment_icon} />
                    <p>Appointments</p>
                    </NavLink>
              
                    <NavLink className={({isActive})=> `flex mb-3 items-center gap-3 px-3 cursor-pointer  md:px-9 md:min-w-72 ${isActive ?  'bg-[#F2F3FF] border-r-4 border-[#5f6fff]' : ''}`} to={'/admin-dashboard'} to={'/add-doctor'} >
                    <img src={assets.add_icon} />
                    <p>Add Doctor</p>
                    </NavLink>
               
                    <NavLink className={({isActive})=> `flex mb-3 items-center gap-3 px-3 cursor-pointer  md:px-9 md:min-w-72 ${isActive ?  'bg-[#F2F3FF] border-r-4 border-[#5f6fff]' : ''}`} to={'/admin-dashboard'} to={'/doctor-list'} >
                    <img src={assets.people_icon} />
                    <p>Doctor List</p>
                    </NavLink>
                </ul>
        }
    </div>
  )
}

export default SideBar