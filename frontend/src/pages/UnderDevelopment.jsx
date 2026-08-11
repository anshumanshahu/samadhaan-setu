import React from "react";
import { LuConstruction, LuArrowLeft, LuHammer } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

const UnderDevelopment = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="relative flex justify-center mb-6">
          <LuConstruction className="text-yellow-500 text-8xl animate-pulse" />
          <LuHammer className="text-blue-600 text-3xl absolute bottom-0 right-1/3 animate-bounce" />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Under Development
        </h1>

        <p className="text-gray-600 mb-8">
          We're working hard to bring you this feature. Our team is currently
          coding away to make sure everything is perfect. Stay tuned!
        </p>

        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg"
        >
          <LuArrowLeft className="text-xl" />
          Go Back
        </button>
      </div>

      <div className="mt-12 flex gap-4">
        <div className="h-2 w-2 bg-blue-400 rounded-full animate-ping"></div>
        <div className="h-2 w-2 bg-blue-500 rounded-full animate-ping [animation-delay:0.2s]"></div>
        <div className="h-2 w-2 bg-blue-600 rounded-full animate-ping [animation-delay:0.4s]"></div>
      </div>
    </div>
  );
};

export default UnderDevelopment;
