import { useState, useEffect } from "react";

const defaultForm = { title: "", priority: "medium", deadline: "", status: "pending", kategori: "" };

const S = {
  card: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(102,126,234,0.4)",
    borderRadius: "20px",
    padding: "28px 32px",
    marginBottom: "24px",
    fontFamily: "'Segoe UI', sans-serif",
  },
  title: { color: "#fff", fontSize: "18px", fontWeight: 700, marginBottom: "24px" },
  row: { display: "flex", gap: "16px", marginBottom: "16px", flexWrap: "wrap" },
  fieldGroup: { display: "flex", flexDirection: "column", flex: 1, minWidth: "160px" },
  label: {
    color: "rgba(255,255,255,0.5)",
    fontSize: "11px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    marginBottom: "7px",
  },
  input: {
    padding: "11px 14px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    width: "100%",
  },
  select: {
    padding: "11px 14px",
    background: "#1e1b4b",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
    width: "100%",
    cursor: "pointer",
  },
  actions: { display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "8px" },
  btnPrimary: {
    padding: "11px 24px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    border: "none",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(102,126,234,0.3)",
  },
  btnSecondary: {
    padding: "11px 20px",
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "10px",
    color: "rgba(255,255,255,0.6)",
    fontSize: "14px",
    cursor: "pointer",
  },
};

export default function TaskForm({ onSubmit, editData, onCancel }) {
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    setForm(editData ? {
      title: editData.title,
      priority: editData.priority,
      deadline: editData.deadline,
      status: editData.status,
      kategori: editData.kategori,
    } : defaultForm);
  }, [editData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm(defaultForm);
  };

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  return (
    <div style={S.card}>
      <div style={S.title}>{editData ? "✏️ Edit Task" : "＋ Task Baru"}</div>
      <form onSubmit={handleSubmit}>
        <div style={S.row}>
          <div style={{ ...S.fieldGroup, flex: 2 }}>
            <label style={S.label}>Judul Task</label>
            <input style={S.input} type="text" placeholder="Contoh: Kerjain laporan..." value={form.title} onChange={set("title")} required />
          </div>
          <div style={{ ...S.fieldGroup, flex: 1 }}>
            <label style={S.label}>Kategori</label>
            <input style={S.input} type="text" placeholder="Contoh: Kuliah..." value={form.kategori} onChange={set("kategori")} required />
          </div>
        </div>
        <div style={S.row}>
          <div style={S.fieldGroup}>
            <label style={S.label}>Prioritas</label>
            <select style={S.select} value={form.priority} onChange={set("priority")}>
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🔴 High</option>
            </select>
          </div>
          <div style={S.fieldGroup}>
            <label style={S.label}>Status</label>
            <select style={S.select} value={form.status} onChange={set("status")}>
              <option value="pending">⏳ Pending</option>
              <option value="done">✅ Done</option>
            </select>
          </div>
          <div style={S.fieldGroup}>
            <label style={S.label}>Deadline</label>
            <input style={{ ...S.input, colorScheme: "dark" }} type="date" value={form.deadline} onChange={set("deadline")} required />
          </div>
        </div>
        <div style={S.actions}>
          {onCancel && (
            <button type="button" style={S.btnSecondary} onClick={onCancel}>Batal</button>
          )}
          <button type="submit" style={S.btnPrimary}>
            {editData ? "💾 Simpan" : "＋ Tambah Task"}
          </button>
        </div>
      </form>
    </div>
  );
}