import { useState, useEffect } from "react";
import axios from "axios";

const useCurrentUser = () => {
  const [userData, setUserData] = useState(null);
  const BASE_API = process.env.REACT_APP_BASE_API;

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(`${BASE_API}/api/v1/me`, config);
        if (response.data && response.data.user) {
          setUserData(response.data.user);
        }
      } catch (error) {
        console.error("Error fetching current user data:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  return userData;
};

export default useCurrentUser;
