import axios from "axios"
import { createContext, useState } from "react"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export  const AdminContext = createContext()

const AdminContextProvider = (props) =>{
    const [atoken,setAToken] = useState(localStorage.getItem('atoken')?localStorage.getItem('atoken'):'')
    const [doctors,setDoctors] = useState([])
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const getAllDoctors = async ()=>{
        try {
            const {data} = await axios.post(backendUrl + '/api/admin/all-doctors',{},{ headers: { atoken } })
            if (data.success) {
                setDoctors(data.doctors)
                console.log(data.doctors)
            }
            else{
                toast.error(data.mesage)
            }
        } catch (error) {
            toast.error(error.mesage)
        }
    }
    const changeAvailablity = async (docID)=>{
        try {
            const {data}  = await axios.post(backendUrl + '/api/admin/change-availablity',{docID},{headers:{atoken}})
            if (data.success) {
                toast.success(data.message)
                getAllDoctors()
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    const value = {
        atoken,setAToken,backendUrl,getAllDoctors,doctors,changeAvailablity
    }

       

        return <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
}

export default AdminContextProvider