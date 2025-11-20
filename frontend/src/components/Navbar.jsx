import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const { token, setToken, userData } = useContext(AppContext);

  const underlineColor = "#5f6fff";
  const navLinks = [
    { name: "HOME", path: "/" },
    { name: "ALL DOCTORS", path: "/doctors" },
    { name: "ABOUT", path: "/about" },
    { name: "CONTACT", path: "/contact" },
    // { name: "CHECKOUT", path: "/checkout" },
    { name: "ADMIN LOGIN", path: "https://doctorsappadmin.onrender.com/" },
  ];
  const [activeLink, setActiveLink] = useState("/");
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
    navigate("/");
  };
  const handleUnderline = (path) => {
    setActiveLink(path);
  };

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">
      <img
        onClick={() => navigate("/")}
        className="w-44 cursor-pointer "
        src={assets.logo}
        alt="Logo"
      />
      {/* Nav links */}
      <ul className="hidden md:flex gap-8 font-medium">
        {navLinks.map((link, index) => (
          <li key={link.name} className="flex flex-col items-center ">
            <NavLink
              onClick={() => handleUnderline(link.path)}
              to={link.path}
              className="py-1 text-gray-700 hover:text-red-500 transition-colors"
            >
              {link.name}
            </NavLink>
            {activeLink === link.path && (
              <span
                style={{ backgroundColor: underlineColor }}
                className="block h-0.5 w-full mt-1 transition-all"
              ></span>
            )}
          </li>
        ))}
      </ul>

      {/* Create account button */}
      <div className="flex gap-2">
        {token && userData ? (
          <div className="flex items-center cursor-pointer group relative gap-2">
            <button className="focus:outline-none">
              <img className="w-8 rounded-full" src={userData.image} alt="" />
            </button>
            <img className="w-2.5" src={assets.dropdown_icon} alt="" />

            <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block group-focus-within:block">
              <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4">
                <p
                  onMouseDown={() => navigate("my-profile")}
                  className="hover:text-black cursor-pointer"
                >
                  My Profile
                </p>
                <p
                  onMouseDown={() => navigate("my-appointments")}
                  className="hover:text-black cursor-pointer"
                >
                  My Appointment
                </p>
                <p
                  onMouseDown={logout}
                  className="hover:text-black cursor-pointer"
                >
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 hidden md:block"
            style={{
              backgroundColor: underlineColor,
              color: "#fff",
              borderRadius: "30px",
            }}
          >
            Create account
          </button>
        )}
        <img
          onClick={() => setShowMenu(true)}
          className="w-6 md:hidden"
          src={assets.menu_icon}
          alt=""
        />
        {/* mobile menu */}
        <div className={`${showMenu ? 'fixed w-full' : 'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
            <div className="flex items-center justify-between px-5 py-6">
                <img className="w-36" src={assets.logo} alt="" />
                <img className="w-7" onClick={()=> setShowMenu(false)} src={assets.cross_icon} alt="" />
            </div>
            <ul className="flex flex-col items-center gap-3 font-medium mt-5 px-5">
                <NavLink  onClick={()=> setShowMenu(false)} to='/' ><p className='px-4 py-2 rounded inline-block'>HOME</p></NavLink>
                <NavLink  onClick={()=> setShowMenu(false)} to='/doctors' ><p className='px-4 py-2 rounded inline-block'>ALL DOCTORS</p></NavLink>
                <NavLink  onClick={()=> setShowMenu(false)} to='/about' ><p className='px-4 py-2 rounded inline-block'>ABOUT</p></NavLink>
                <NavLink  onClick={()=> setShowMenu(false)} to='/contact' ><p className='px-4 py-2 rounded inline-block'>CONTACT</p></NavLink>
                <NavLink onClick={()=> setShowMenu(false)} to='/checkout'><p className='px-4 py-2 rounded inline-block'>CHECKOUT</p></NavLink>
                {/* <NavLink  onClick={()=> setShowMenu(false)} to='/login' ><p className='px-4 py-2 rounded inline-block'>CREATE ACCOUNT</p></NavLink> */}
                 <a
              href="https://doctorsappadmin.onrender.com/add-doctor"
              rel="noreferrer"
              onClick={() => setShowMenu(false)}
              className="px-4 py-2 rounded inline-block"
            >
              ADMIN LOGINN
            </a>
            </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
