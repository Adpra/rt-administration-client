import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../../layouts/navbars/Navbar";

interface IErrorProps {
  error: any;
}

function Error({ error }: IErrorProps) {
  const { state } = useLocation();
  const errorMessage = state?.message || error.message || "Unknown error";

  return (
    <>
      <Navbar />
      <div className="flex h-screen flex-col items-center justify-center">
        <h5 className="text-4xl font-bold text-black">Error</h5>
        <h1 className="text-lg text-gray-700 mt-4">{errorMessage}</h1>
      </div>
    </>
  );
}

export default Error;
