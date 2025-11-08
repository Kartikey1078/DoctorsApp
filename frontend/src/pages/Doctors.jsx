import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import DoctorCardSkeleton from "../components/DoctorCardSkeleton"; // 👈 import skeleton

const Doctors = () => {
  const { speciality } = useParams();
  const [filterDoc, setFilterDoc] = useState([]);
  const [activeSpcl, setAddColor] = useState(speciality || "");
  const [mobileFilter, setMobileFilter] = useState(false);
  const [loading, setLoading] = useState(true); // 👈 new loading state
  const { doctors } = useContext(AppContext);
  const navigate = useNavigate();

  const handleFilter = () => {
    setLoading(true);
    setTimeout(() => { // simulate data load time
      if (speciality) {
        setFilterDoc(doctors.filter((doc) => doc.speciality === speciality));
      } else {
        setFilterDoc(doctors);
      }
      setLoading(false);
    }, 800);
  };

  const handleSpecilaityFilter = (spcl) => {
    if (spcl === speciality) {
      navigate(`/doctors`);
      setAddColor("");
      return;
    }
    setAddColor(spcl);
    navigate(`/doctors/${spcl}`);
  };

  useEffect(() => {
    handleFilter();
  }, [doctors, speciality]);

  const specialities = [
    "General physician",
    "Gynecologist",
    "Dermatologist",
    "Pediatricians",
    "Neurologist",
    "Gastroenterologist",
  ];

  return (
    <div>
      <p className="text-gray-600">Browse through the doctors specialist.</p>
      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        <button
          onClick={() => setMobileFilter((prev) => !prev)}
          className="py-1 px-3 border rounded text-sm transition-all md:hidden"
        >
          Filters
        </button>
  
        <div
          className={`flex-col gap-4 text-sm text-gray-600 ${
            mobileFilter ? "block" : "hidden"
          } sm:flex`}
        >
          {specialities.map((spcl) => (
            <p
              key={spcl}
              onClick={() => handleSpecilaityFilter(spcl)}
              className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border mb-2 border-gray-300 rounded transition-all cursor-pointer 
                ${activeSpcl === spcl ? "activeSpcl" : ""}`}
            >
              {spcl}
            </p>
          ))}
        </div>
  
        {/* Main content */}
        {loading ? (
          // Show skeletons
          <div className="w-full grid grid-cols-auto md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
            {[...Array(6)].map((_, i) => (
              <DoctorCardSkeleton key={i} />
            ))}
          </div>
        ) : filterDoc && filterDoc.length > 0 ? (
          // Show doctor cards
          <div className="w-full grid grid-cols-auto md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
            {filterDoc.map((doctor) => (
              <div
                onClick={() => navigate(`/appointments/${doctor._id}`)}
                key={doctor._id}
                className="border border-[#C9D8FF] rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
              >
                <img className="bg-[#EAEFFF]" src={doctor.image} alt="" />
                <div className="p-4">
                  <div className="flex items-center gap-2 text-sm text-center text-green-500">
                    <p className="w-2 h-2 rounded-full bg-green-500"></p>
                    <p>Available</p>
                  </div>
                  <p className="text-[#262626] text-lg font-medium">
                    {doctor.name}
                  </p>
                  <p className="text-[#5C5C5C] text-sm">{doctor.speciality}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Show "not available" only when loading = false and data empty
          <div className="w-full flex items-center justify-center py-10">
            <p className="text-gray-600 text-lg">
              Doctor's currently not available
            </p>
          </div>
        )}
      </div>
    </div>
  );
  
};

export default Doctors;
