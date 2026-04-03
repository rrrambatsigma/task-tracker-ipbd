import { useState } from "react";
import { login } from "../api/axios";

const S = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
    fontFamily: "'Segoe UI', sans-serif",
    padding: "24px",
  },
  card: {
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "24px",
    padding: "48px 40px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
  },
  header: { textAlign: "center", marginBottom: "36px" },
  iconWrap: {
    width: "64px",
    height: "64px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    borderRadius: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
    fontSize: "28px",
    boxShadow: "0 8px 24px rgba(102,126,234,0.4)",
  },
  h1: { color: "#fff", fontSize: "28px", fontWeight: 700, margin: "0 0 8px", letterSpacing: "-0.5px" },
  subtitle: { color: "rgba(255,255,255,0.5)", fontSize: "14px", margin: 0 },
  fieldGroup: { marginBottom: "18px" },
  label: {
    display: "block",
    color: "rgba(255,255,255,0.6)",
    fontSize: "12px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    padding: "13px 16px",
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
  },
  errorBox: {
    background: "rgba(248,113,113,0.15)",
    border: "1px solid rgba(248,113,113,0.4)",
    borderRadius: "10px",
    padding: "10px 14px",
    color: "#fca5a5",
    fontSize: "13px",
    marginBottom: "16px",
  },
  btn: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    border: "none",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "16px",
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 8px 24px rgba(102,126,234,0.35)",
    marginTop: "4px",
  },
};

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focus, setFocus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await login(form.username, form.password);
      localStorage.setItem("token", res.data.access_token);
      onLogin(res.data.access_token);
    } catch {
      setError("Login gagal. Cek username & password.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (name) => ({
    ...S.input,
    borderColor: focus === name ? "#667eea" : "rgba(255,255,255,0.15)",
    boxShadow: focus === name ? "0 0 0 3px rgba(102,126,234,0.2)" : "none",
  });

  return (
    <div style={S.wrapper}>
      <div style={S.card}>
        <div style={S.header}>
          <div style={S.iconWrap}>📋</div>
          <h1 style={S.h1}>Task Tracker</h1>
          <p style={S.subtitle}>Masuk untuk mulai kelola tugasmu</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={S.fieldGroup}>
            <label style={S.label}>Username</label>
            <input
              style={inputStyle("username")}
              type="text"
              placeholder="Masukkan username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              onFocus={() => setFocus("username")}
              onBlur={() => setFocus("")}
              required
            />
          </div>
          <div style={S.fieldGroup}>
            <label style={S.label}>Password</label>
            <input
              style={inputStyle("password")}
              type="password"
              placeholder="Masukkan password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              onFocus={() => setFocus("password")}
              onBlur={() => setFocus("")}
              required
            />
          </div>
          {error && <div style={S.errorBox}>⚠ {error}</div>}
          <button
            type="submit"
            style={{ ...S.btn, opacity: loading ? 0.7 : 1 }}
            disabled={loading}
          >
            {loading ? "⏳ Masuk..." : "Masuk →"}
          </button>
        </form>
      </div>
    </div>
  );
}