import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const navigate = useNavigate();
  const [state,setState] = useState('Sign Up');
  const [email,setEmail] = useState('');
  const [password, setPassword] = useState("");
  const [name,setName] = useState("");
  const {setToken,backendURL,token} = useContext(AppContext);

  const onSubmitHandler = async (event) =>{
    event.preventDefault();
    try {
      if (state == 'Sign Up') {
        const {data} = await axios.post(backendURL + '/api/user/register', {name,password,email})
        if (data.success) {
            localStorage.setItem("token",data.token)
            setToken(data.token)
        }else{
          toast.error("Account already created!")
        }
      }
      else{
        const {data} = await axios.post(backendURL + '/api/user/loginUser', {password,email})
        if (data.success) {
            localStorage.setItem("token",data.token)
            setToken(data.token)
        }else{
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error.message)
    }
   
  }
  useEffect(()=>{
    if (token) {
      navigate('/')
    }
  },[token])

  return (
    <form className="min-h-[80vh] flex items-center" onSubmit={onSubmitHandler}>
      <div className="flex flex-col gap-3 m-auto items-start p-6 w-[90%] sm:w-[380px] border rounded-xl text-[#5E5E5E] text-sm shadow-lg border-0">
        <p className="text-2xl font-semibold">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </p>
        <p>
          Please {state === "Sign Up" ? "Sign Up" : "Login"}
          to book appointment
        </p>
        {
          state === 'Sign Up' &&
          <div className="w-full ">
          <p>Full Name</p>
          <input
            onChange={(e) => setName(e.target.value)}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="text"
            required
            value={name}
          />
        </div>
        }
       
        <div className="w-full ">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="email"
            required
            value={email}
          />
        </div>
        <div className="w-full ">
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="password"
            required
            value={password}
          />
        </div>
        <button type="submit" className="bg-[#5f6fff] text-white w-full py-2 my-2 rounded-md text-base">
          {state === "Sign Up" ? "Create account" : "Login"}
        </button>
        {state === "Sign Up" ? (
          <p>
            Already have an account?
            <span
              onClick={() => setState("Login")}
              className="text-primary underline cursor-pointer"
            >
              Login here
            </span>
          </p>
        ) : (
          <p>
            Create an new account?
            <span
              onClick={() => setState("Sign Up")}
              className="text-primary underline cursor-pointer"
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
