import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
const MyProfile = () => {
  const { userData, setUserData, updateUserProfile ,token,backendURl,loadUserProfileData} = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);
  const address = userData.address || { line1: "", line2: "" };
  

  return (
    <div className="max-w-lg flex flex-col gap-2 text-sm pt-5">

      {
        isEdit ? 
        <label htmlFor="image">
          <div className="inline-block relative cursor-pointer">
            <img className="w-36 rounded opacity-75" src={image ? URL.createObjectURL(image) : userData.image} alt="" />
            <img className="w-10 absolute bottom-12 right-12" src={image ? "" : assets.upload_icon} alt="" />
          </div>
          <input onChange={(e)=> setImage(e.target.files[0])} type="file" id="image" hidden />
        </label>
        : 
        <img
        className="w-36 rounded"
        src={userData.image || "/default-profile.png"}
        alt="profile"
      />
      }
    

      {isEdit ? (
        <input
          className="bg-gray-100 text-3xl font-medium max-w-60"
          value={userData.name || ""}
          type="text"
          onChange={(e) =>
            setUserData((prev) => ({ ...prev, name: e.target.value }))
          }
        />
      ) : (
        <p className="font-medium text-3xl text-[#262626] mt-4">
          {userData.name || "No Name"}
        </p>
      )}

      <hr className="bg-[#ADADAD] h-[1px] border-none" />

      <div>
        <p className="text-gray-600 underline mt-3">CONTACT INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-[#363636]">
          <p className="font-medium">Email:</p>
          <p className="text-blue-500">{userData.email || "No Email"}</p>

          <p className="font-medium">Phone:</p>
          {isEdit ? (
            <input
              className="bg-gray-100 max-w-52"
              value={userData.phone || ""}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, phone: e.target.value }))
              }
            />
          ) : (
            <p className="text-blue-500">{userData.phone || "No Phone"}</p>
          )}

          <p className="font-medium">Address:</p>
          {isEdit ? (
            <div>
              <input
                className="bg-gray-100 max-w-52 mb-1"
                value={address.line1 || ""}
                type="text"
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    address: { ...prev.address, line1: e.target.value },
                  }))
                }
              />
              <br />
              <input
                className="bg-gray-100 max-w-52"
                value={address.line2 || ""}
                type="text"
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    address: { ...prev.address, line2: e.target.value },
                  }))
                }
              />
            </div>
          ) : (
            <p className="text-gray-500">
              {address.line1}
              <br />
              {address.line2}
            </p>
          )}
        </div>
      </div>

      <div>
        <p className="text-[#797979] underline mt-3">BASIC INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-gray-600">
          <p className="font-medium">Gender:</p>
          {isEdit ? (
            <select
              value={userData.gender || ""}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, gender: e.target.value }))
              }
              className="max-w-30 bg-gray-50"
            >
              <option value="">Not Selected</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          ) : (
            <p className="text-gray-500">{userData.gender || "Not Selected"}</p>
          )}

          <p className="font-medium">Birthday:</p>
          {isEdit ? (
            <input
              type="date"
              value={userData.dob || ""}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, dob: e.target.value }))
              }
              className="max-w-28 bg-gray-50"
            />
          ) : (
            <p className="text-gray-500">{userData.dob || "Not Set"}</p>
          )}
        </div>
      </div>

      <div className="mt-10">
        {isEdit ? (
          <button
          onClick={() => updateUserProfile(userData, image)}
            className="border border-primary px-8 py-2 rounded-full hover:bg-[#5f69ff] hover:text-white transition-all"
          >
            Save Information
          </button>
        ) : (
          <button
            onClick={() => setIsEdit(true)}
            className="border border-primary px-8 py-2 rounded-full hover:bg-[#5f69ff] hover:text-white transition-all"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
