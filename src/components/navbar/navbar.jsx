import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiLogOut, FiLogIn } from "react-icons/fi"; // Icons

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      fetchUserData(storedToken);
    }
    
  }, []);

  const fetchUserData = async (token) => {
    try {
      const response = await axios.post("http://localhost:5000/user", {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
    } catch (error) {
      const status = error.response?.status;
      console.error("User fetch error:", error.response?.data || error.message);

      if (status === 400 || status === 401) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("token");
        setToken(null);
        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
      } else {
        toast.error("An unexpected error occurred. Try again.");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.success("Logged out successfully.");
    setTimeout(() => {
      window.location.href = "/login";
    }, 2500);
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <nav className="flex items-center justify-between p-4 bg-white shadow-md px-6">
        <h1 className="text-2xl font-bold text-blue-600">NexAge Inventory</h1>

        <ul className="flex items-center space-x-6 text-gray-700 font-medium">
          <li className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded shadow-sm">
            <a href="/" className="hover:text-blue-500 transition">All Items</a>
          </li>
          <li className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded shadow-sm">
            <a href="/issued-items" className="hover:text-blue-500 transition">Issued Items</a>
          </li>

          {user ? (
            <>
              <li className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded shadow-sm">
                <span className="font-semibold text-blue-700">{user.EmployeeName}</span>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-red-500 hover:text-red-700 transition"
                >
                  <FiLogOut size={20} />
                  <span>Logout</span>
                </button>
              </li>
            </>
          ) : (
            <li>
              <a
                href="/login"
                className="flex items-center space-x-1 text-green-600 hover:text-green-800 transition"
              >
                <FiLogIn size={20} />
                <span>Sign In</span>
              </a>
            </li>
          )}
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
