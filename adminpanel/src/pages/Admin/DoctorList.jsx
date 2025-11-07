import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { data } from 'react-router-dom';

const DoctorList = () => {
  const {doctors,atoken,getAllDoctors,changeAvailablity} = useContext(AdminContext);
  useEffect(()=>{
    if (atoken) {
      getAllDoctors()
    }
  },[atoken])
  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
        <h1 className='text-lg font-medium'>All Doctors</h1>
        <div className='flex w-full flex-wrap gap-2.5 pt-2'>
          {
            doctors.map((doc,index)=>(
              <div className='border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group' key={index}>
                <img className='bg-indigo-50 group-hover:bg-[#5f6FFF] transition-all duration-500' src={doc.image} alt="" />
                <div className='p-4 '>
                  <p className='text-neutral-800 text-lg font-medium'>{doc.name}</p>
                  <p className='text-zinc-600 text-sm'>{doc.speciality}</p>
                  <div className='mt-2 flex items-center text-sm gap-1'>
                    <input onChange={()=> changeAvailablity(doc._id)} type="checkbox"  checked={doc.available} />
                    <p>Available</p>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
    </div>
  )
}

export default DoctorList