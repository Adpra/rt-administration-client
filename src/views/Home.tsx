import React from "react";
import defaultAxios from "../utils/DefaultAxios";
import Navbar from "../layouts/navbars/Navbar";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";

function Home() {
  return (
    <>
      <Navbar />
      <div>home</div>
    </>
  );
}

export default Home;
