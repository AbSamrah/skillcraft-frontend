import React, { createContext, useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { getUserEnergy } from "../api/profile";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [energy, setEnergy] = useState(null);

  const refreshEnergy = useCallback(async (id) => {
    try {
      const energyData = await getUserEnergy(id);
      setEnergy(energyData);
    } catch (error) {
      console.error("Failed to refresh energy:", error);
      setEnergy(null);
    }
  }, []);

  const decodeToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("authToken");
        return null;
      }
      return {
        id: decoded.id,
        firstName: decoded.given_name,
        lastName: decoded.family_name,
        email: decoded.email,
        role: decoded.role,
      };
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("authToken");
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const userData = decodeToken(token);
      setUser(userData);
      if (userData.role === "User") refreshEnergy(userData.id);
    }
    setLoading(false);
  }, [refreshEnergy]);

  const login = (token) => {
    localStorage.setItem("authToken", token);
    const userData = decodeToken(token);
    setUser(userData);
    if (userData.role === "User") refreshEnergy(userData.id);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    setEnergy(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, loading, energy, refreshEnergy }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
