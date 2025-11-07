import React, { useState, useContext, useEffect, useMemo, } from "react";
import { AppContext } from "../context/AppContext";
import { useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const getNext7Days = () => {
  const today = new Date();
  let result = [];

  for (let i = 0; i < 7; i++) {
    let nextDate = new Date(today);
    nextDate.setDate(today.getDate() + i);

    result.push({
      day: nextDate.toLocaleDateString("en-US", { weekday: "short" }), // e.g. Thu
      date: nextDate.toLocaleDateString("en-US", { day: "numeric" }),  // e.g. 02
      month: nextDate.toLocaleDateString("en-US", { month: "short" }), // e.g. Sep
      year: nextDate.getFullYear(),                                    // e.g. 2025
      fullDate: nextDate,                                              // full Date object
     
    });
  }

  return result;
};


const getTimeSlots = (start = "10:30", end = "18:30", interval = 30) => {
  const slots = [];
  let [startHour, startMin] = start.split(":").map(Number);
  let [endHour, endMin] = end.split(":").map(Number);

  let current = new Date();
  current.setHours(startHour, startMin, 0, 0);

  let endTime = new Date();
  endTime.setHours(endHour, endMin, 0, 0);

  while (current <= endTime) {
    let timeStr = current.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    slots.push(timeStr);
    current.setMinutes(current.getMinutes() + interval);
  }

  return slots;
};

const Appointments = () => {
  const navigate = useNavigate()
  const bookingDays = getNext7Days();
  const allTimeSlots = getTimeSlots("10:30", "18:30", 30);
  const { docId } = useParams();
  const { doctors, currencySymbol ,backendURL,getDoctorsData,token} = useContext(AppContext);

  const [docInfo, setDocInfo] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectTime, setSelectTime] = useState(null);

  const fetchDoctorById = async () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    setDocInfo(docInfo);
  };

  const bookAppointment = async (req,res)=>{
    debugger
    if (!token) {
        toast.warn("Login to book an appointment")
        return  navigate("/login")
    }
    try {
      const slotDate = `${selectedDate.month}-${selectedDate.date}-${selectedDate.year}`; 
      const slotTime = `${selectTime}`; 

      const { data } = await axios.post(
        backendURL + "/api/user/bookAppointment",
        { docId, slotDate, slotTime },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
        if (data.success) {
        toast.success(data.message)
        getDoctorsData()
        navigate("/my-appointments")
      }
      else{
        toast.error(data.message)
        console.log(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchDoctorById();
  }, [docId, doctors]);

  useEffect(() => {
    if (bookingDays.length > 0 && !selectedDate) {
      setSelectedDate(bookingDays[0]); // still auto-selects today's date
    }
  }, [bookingDays, selectedDate]);

  

  // ✅ Filter slots based on current time if today is selected
  const filteredTimeSlots = useMemo(() => {
    if (!selectedDate) return allTimeSlots;

    const today = new Date();
    const isToday =
      selectedDate.fullDate.toDateString() === today.toDateString();

    if (!isToday) return allTimeSlots;

    return allTimeSlots.filter((slot) => {
      const slotDate = new Date();
      const [time, modifier] = slot.split(" ");
      let [hours, minutes] = time.split(":").map(Number);

      if (modifier === "PM" && hours !== 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;

      slotDate.setHours(hours, minutes, 0, 0);

      return slotDate > today; // keep only future slots
    });
  }, [selectedDate, allTimeSlots]);

  const selectDateFunction = (slot) => {
    // console.log(slot)
    setSelectedDate(slot);
    setSelectTime(null); // reset selected time whenever date changes
  };

  const selectTimeFunction = (time) => {
    setSelectTime(time);
  };

  return (
    docInfo && (
      <>
        {/* Doctor Info */}
        <div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              <img
                className="bg-primary w-full sm:max-w-72 rounded-lg"
                src={docInfo.image}
                alt=""
                style={{ backgroundColor: "rgb(95 111 255 )" }}
              />
            </div>
            <div className="flex-1 border border-[#ADADAD] rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
              <p className="flex items-center gap-2 text-3xl font-medium text-gray-700">
                {docInfo.name}
                <img className="w-5" src={assets.verified_icon} alt="" />
              </p>
              <div className="flex items-center gap-2 mt-1 text-gray-600">
                <p>
                  {docInfo.degree}-{docInfo.speciality}
                </p>
                <button className="py-0.5 px-2 border text-xs rounded-full">
                  {docInfo.experience}
                </button>
              </div>
              <div>
                <p className="flex items-center gap-1 text-sm font-medium text-[#262626] mt-3">
                  About
                  <img className="w-3" src={assets.info_icon} alt="" />
                </p>
                <p className="text-sm text-gray-600 max-w-[700px] mt-1">
                  {docInfo.about}
                </p>
              </div>
              <p className="text-gray-600 font-medium mt-4">
                Appointment fee: {currencySymbol}
                {docInfo.fees}
              </p>
            </div>
          </div>
        </div>

        {/* Booking Section */}
        <div className="sm:ml-72 sm:pl-4 mt-8 font-medium text-[#565656]">
          <p>Booking slots</p>

          {/* Date Slots */}
          <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
            {bookingDays.map((slot, idx) => (
              <div
                onClick={() => selectDateFunction(slot)}
                key={idx}
                className={`flex items-center justify-center flex-col text-center py-6 min-w-16 rounded-full cursor-pointer border border-[#DDDDDD]
                  ${
                    selectedDate?.date === slot.date
                      ? "bg-[#5f6fff] text-white"
                      : ""
                  }
                `}
              >
                <p>{slot.day}</p>
                <p>{slot.date}</p>
                <p hidden>{slot.year}</p>
              </div>
            ))}
          </div>

          {/* Time Slots */}
          <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4 scrollbar-hide">
            {filteredTimeSlots.length > 0 ? (
              filteredTimeSlots.map((time, idx) => (
                <p
                  key={idx}
                  onClick={() => selectTimeFunction(time)}
                  className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer text-[#949494] border border-[#B4B4B4]
                    ${selectTime === time ? "bg-[#5f6fff] text-white" : ""}
                  `}
                >
                  {time}
                </p>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No slots available today</p>
            )}
          </div>

          <button
            disabled={!selectTime}
            className={`px-20 py-3 rounded-full my-6 text-sm font-light ${
              selectTime
                ? "bg-[#5f6fff] text-white cursor-pointer"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
            onClick={bookAppointment}
          >
            Book an appointment
          </button>
        </div>
        <RelatedDoctors value={docInfo.speciality} Id={docId} />
      </>
    )
  );
};

export default Appointments;
