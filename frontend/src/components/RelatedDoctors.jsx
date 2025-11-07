import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
const RelatedDoctors = ({ value ,Id}) => {
    
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  const FindDoctorsbySpeciality = doctors.filter(
    (doctor) => doctor.speciality === value && doctor._id !== Id
  );

  return (
    <div
      className="flex flex-col items-center gap-4 my-16 text-[#262626]"
    >
      <h1 className="text-3xl font-medium">Related Doctors</h1>
      <p className="sm:w-1/3 text-center text-sm">
        Simply browse through our extensive list of trusted doctors.
      </p>
      <div className="w-full grid md:grid-cols-4  lg:grid-cols-4 gap-4 pt-5 gap-y-6 px-3 sm:px-0">
        {FindDoctorsbySpeciality.length > 0 &&
          FindDoctorsbySpeciality.map((doctors, index) => (
            <div
            onClick={() => {navigate(`/appointments/${doctors._id}`); scrollTo(0,0)}}
              key={doctors._id}
              className="border border-[#C9D8FF] rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
            >
              <img className="bg-[#EAEFFF]" src={doctors.image} alt="" />
              <div className="p-4">
                <div className="flex items-center gap-2 text-sm text-center text-green-500">
                  <p className="w-2 h-2 rounded-full bg-green-500"></p>
                  <p>Available</p>
                </div>
                <p className="text-[#262626] text-lg font-medium"></p>
                <p className="text-[#5C5C5C] text-sm">{doctors.speciality}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default RelatedDoctors;
