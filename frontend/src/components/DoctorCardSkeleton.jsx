import React from "react";

const DoctorCardSkeleton = () => {
  return (
    <div className="border border-[#C9D8FF] rounded-xl overflow-hidden animate-pulse">
      <div className="bg-[#EAEFFF] h-40 w-full"></div>
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="h-3 w-20 bg-gray-300 rounded"></div>
        </div>
        <div className="h-5 w-32 bg-gray-300 rounded"></div>
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

export default DoctorCardSkeleton;
