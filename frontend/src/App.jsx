import { useState, useEffect } from "react";
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard";
import "./App.css";

export default function App() {
  // Selalu mulai dari null — wajib login ulang setiap buka app
  const [token, setToken] = useState(null);

  // Bersihkan token lama saat app pertama kali load
  useEffect(() => {
    localStorage.removeItem("token");
  }, []);

  const handleLogin = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return token ? (
    <Dashboard onLogout={handleLogout} />
  ) : (
    <Login onLogin={handleLogin} />
  );
}