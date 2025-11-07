import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import {useNavigate} from "react-router-dom";

const MyAppointments = () => {
  const { currencySymbol, getAppointmentData, token, backendURL } =
    useContext(AppContext);
  const [appointments, setAppointments] = useState([]);

  // ✅ Fetch appointments
  useEffect(() => {
    if (token) {
      const fetchAppointments = async () => {
        const data = await getAppointmentData();
        setAppointments(data);
      };
      fetchAppointments();
    }
  }, [token]);

  // ✅ Cancel appointment
  const cancelAppointment = async (appointment) => {
    try {
      if (!appointment._id) {
        toast.error("Invalid appointment data");
        return;
      }

      const cleanBackendURL = backendURL?.replace(/\/$/, "");
      const appointmentId = String(appointment._id).trim();
      const url = `${cleanBackendURL}/api/user/cancelAppointment/${appointmentId}`;

      let res;
      try {
        res = await axios.delete(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (deleteError) {
        if (
          deleteError.response?.status === 404 ||
          deleteError.response?.status === 405
        ) {
          res = await axios.put(
            url,
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        } else {
          throw deleteError;
        }
      }

      if (res.data?.success) {
        setAppointments((prev) =>
          prev.filter((a) => String(a._id) !== String(appointment._id))
        );
        toast.success("Appointment deleted successfully!");
      } else {
        toast.error(res.data?.message || "Unable to delete appointment");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Failed to delete"
      );
    }
  };

  // ✅ Initialize Razorpay payment
  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Appointment Payment",
      description: "Appointment Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(
            backendURL + "/api/user/verify-razorpay",
            response,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (data.success) {
            toast.success("Payment successful! 🎉");
            // 🔄 Refresh appointments without page reload
            const updatedData = await getAppointmentData();
            setAppointments(updatedData);
           
          } else {
            toast.error("Payment verification failed");
          }
        } catch (error) {
          console.error("Payment verification error:", error);
          toast.error("Payment verification failed");
        }
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // ✅ Create Razorpay order and start payment
  const appointmentRazorPay = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendURL + "/api/user/payment-razorpay",
        { appointmentId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        initPay(data.order);
      } else {
        toast.error("Failed to initiate payment");
      }
    } catch (error) {
      console.error("Error starting payment:", error);
      toast.error("Payment initiation failed");
    }
  };

  return (
    <div>
      <p className="pb-3 mt-12 text-lg font-medium text-gray-600 border-b">
        My Appointments
      </p>

      {appointments?.length > 0 ? (
        appointments.map((item) => (
          <div
            key={item._id || item.id}
            className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b"
          >
            {/* Doctor Image */}
            <div>
              {item.docData?.image ? (
                <img
                  className="w-36 h-36 object-cover rounded-xl bg-[#EAEFFF]"
                  src={item.docData.image}
                  alt={item.docData.name}
                />
              ) : (
                <div className="w-36 h-36 bg-gray-200 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
            </div>

            {/* Doctor Info */}
            <div className="flex-1 text-sm text-[#5E5E5E]">
              <p className="text-[#262626] text-base font-semibold">
                {item.docData?.name}
              </p>
              <p className="mt-1">
                <span className="font-medium">Speciality:</span>{" "}
                {item.docData?.speciality}
              </p>
              <p className="mt-1">
                <span className="font-medium">Experience:</span>{" "}
                {item.docData?.experience}
              </p>

              {/* ✅ Fees + Paid/Pending Badge */}
              <p className="mt-1">
                <span className="font-medium">Fees:</span> {currencySymbol}
                {item.docData?.fees}
                {item.payment ? (
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                    Paid
                  </span>
                ) : (
                  <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">
                    Pending
                  </span>
                )}
              </p>

              <p className="mt-1">
                <span className="text-sm text-[#3C3C3C] font-medium">
                  Address:
                </span>{" "}
                {item.docData?.address?.city}, {item.docData?.address?.pincode}
              </p>
              <p className="mt-1">
                <span className="text-sm text-[#3C3C3C] font-medium">
                  Date & Time:
                </span>{" "}
                {item?.slotDate}, {item?.slotTime}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-2 justify-end text-sm text-center">
              {!item.payment && (
                <button
                  onClick={() => appointmentRazorPay(item._id)}
                  className="text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-green-600 hover:text-white transition-all duration-300"
                >
                  Pay Online
                </button>
              )}

              <button
                onClick={() => cancelAppointment(item)}
                className="text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300"
              >
                Cancel Appointment
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 mt-6">No appointments found.</p>
      )}
    </div>
  );
};

export default MyAppointments;
