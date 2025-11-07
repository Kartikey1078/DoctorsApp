import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";

const AllAppointment = () => {
  const { backendUrl, atoken } = useContext(AdminContext);
  const [appointments, setAppointments] = useState([]);
  const currencySymbol = "₹"; // You can move this to context later if needed

  // ✅ Fetch all appointments from backend
  const fetchAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/getAppointmentData`, {
        headers: { atoken },
      });

      if (data.success) {
        setAppointments(data.data);
      } else {
        toast.error("Failed to fetch appointments");
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Something went wrong while fetching appointments");
    }
  };

  useEffect(() => {
    if (atoken) {
      fetchAppointments();
    } else {
      toast.error("Admin token missing");
    }
  }, [atoken]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">All Appointments</h2>

      {appointments.length === 0 ? (
        <p className="text-gray-500">No appointments found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="py-2 px-4 border-b text-left">#</th>
                <th className="py-2 px-4 border-b text-left">User</th>
                <th className="py-2 px-4 border-b text-left">Doctor</th>
                <th className="py-2 px-4 border-b text-left">Speciality</th>
                <th className="py-2 px-4 border-b text-left">Fees</th>
                <th className="py-2 px-4 border-b text-left">Date & Time</th>
                <th className="py-2 px-4 border-b text-left">Payment</th>
              </tr>
            </thead>

            <tbody>
              {appointments.map((item, index) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{index + 1}</td>

                  {/* 👤 User */}
                  <td className="py-2 px-4 border-b">
                    <div>
                      <p className="font-medium">{item.userId?.name || "N/A"}</p>
                      <p className="text-sm text-gray-600">{item.userId?.email}</p>
                    </div>
                  </td>

                  {/* 👨‍⚕️ Doctor */}
                  <td className="py-2 px-4 border-b">
                    <div>
                      <p className="font-medium">{item.docId?.name || "N/A"}</p>
                      <p className="text-sm text-gray-600">{item.docId?.email}</p>
                    </div>
                  </td>

                  {/* 🧬 Speciality */}
                  <td className="py-2 px-4 border-b">{item.docId?.speciality}</td>

                  {/* 💰 Fees */}
                  <td className="py-2 px-4 border-b">
                    {currencySymbol}
                    {item.docId?.fees}
                  </td>

                  {/* 🗓 Date & Time */}
                  <td className="py-2 px-4 border-b">
                    {item.slotDate}, {item.slotTime}
                  </td>

                  {/* 💳 Payment Status */}
                  <td className="py-2 px-4 border-b">
                    {item.payment ? (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                        Paid
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">
                        Pending
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllAppointment;
