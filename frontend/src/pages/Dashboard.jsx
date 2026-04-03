import { useState, useEffect, useCallback } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "../api/axios";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

const S = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(160deg, #0f0c29 0%, #1a1640 40%, #0d0d1a 100%)",
    fontFamily: "'Segoe UI', sans-serif",
    color: "#fff",
  },

  // NAVBAR
  navbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 32px",
    background: "rgba(255,255,255,0.03)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(12px)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  navBrand: { display: "flex", alignItems: "center", gap: "10px" },
  navIcon: {
    width: "36px",
    height: "36px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
  },
  navTitle: { fontSize: "18px", fontWeight: 700, letterSpacing: "-0.3px" },
  navRight: { display: "flex", gap: "10px", alignItems: "center" },
  btnNavAdd: {
    padding: "9px 18px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    border: "none",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(102,126,234,0.3)",
  },
  btnLogout: {
    padding: "8px 16px",
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "10px",
    color: "rgba(255,255,255,0.55)",
    fontSize: "14px",
    cursor: "pointer",
  },

  // NOTIF
  notif: (type) => ({
    position: "fixed",
    top: "72px",
    right: "24px",
    zIndex: 999,
    padding: "12px 20px",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: 500,
    background: type === "error" ? "rgba(248,113,113,0.15)" : "rgba(52,211,153,0.15)",
    border: `1px solid ${type === "error" ? "rgba(248,113,113,0.4)" : "rgba(52,211,153,0.4)"}`,
    color: type === "error" ? "#f87171" : "#34d399",
    boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
  }),

  // CONTENT
  content: { maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" },

  // STATS
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
    marginBottom: "28px",
  },
  statCard: (color) => ({
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    padding: "22px 20px",
    textAlign: "center",
    borderTop: `3px solid ${color}`,
  }),
  statNum: (color) => ({ fontSize: "38px", fontWeight: 800, color, lineHeight: 1 }),
  statLabel: { marginTop: "6px", fontSize: "13px", color: "rgba(255,255,255,0.45)", fontWeight: 500 },

  // FILTER
  filterBar: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "14px",
    padding: "14px 20px",
    marginBottom: "24px",
  },
  filterLabel: {
    fontSize: "12px",
    fontWeight: 600,
    color: "rgba(255,255,255,0.4)",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
  },
  filterSelect: {
    padding: "8px 12px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "13px",
    outline: "none",
    cursor: "pointer",
  },
  filterInput: {
    padding: "8px 12px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "13px",
    outline: "none",
  },
  btnReset: {
    padding: "7px 14px",
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "8px",
    color: "rgba(255,255,255,0.45)",
    fontSize: "13px",
    cursor: "pointer",
  },
  loading: { textAlign: "center", color: "rgba(255,255,255,0.4)", padding: "48px", fontSize: "15px" },
};

export default function Dashboard({ onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({ status: "", priority: "", kategori: "" });
  const [notif, setNotif] = useState(null);

  const showNotif = (msg, type = "success") => {
    setNotif({ msg, type });
    setTimeout(() => setNotif(null), 3000);
  };

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      if (filters.kategori) params.kategori = filters.kategori;
      const res = await getTasks(params);
      setTasks(res.data);
    } catch {
      showNotif("Gagal memuat tasks", "error");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleCreate = async (form) => {
    try {
      await createTask(form);
      showNotif("Task berhasil ditambahkan! ✓");
      setShowForm(false);
      fetchTasks();
    } catch { showNotif("Gagal menambah task", "error"); }
  };

  const handleUpdate = async (form) => {
    try {
      await updateTask(editData.id, { ...form, id: editData.id });
      showNotif("Task berhasil diupdate! ✓");
      setEditData(null);
      setShowForm(false);
      fetchTasks();
    } catch { showNotif("Gagal mengupdate task", "error"); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin hapus task ini?")) return;
    try {
      await deleteTask(id);
      showNotif("Task berhasil dihapus");
      fetchTasks();
    } catch { showNotif("Gagal menghapus task", "error"); }
  };

  const handleEdit = (task) => {
    setEditData(task);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    onLogout();
  };

  const stats = {
    total: tasks.length,
    done: tasks.filter((t) => t.status === "done").length,
    pending: tasks.filter((t) => t.status === "pending").length,
    high: tasks.filter((t) => t.priority === "high" && t.status !== "done").length,
  };

  const setFilter = (key) => (e) => setFilters({ ...filters, [key]: e.target.value });

  return (
    <div style={S.page}>
      {/* NAVBAR */}
      <nav style={S.navbar}>
        <div style={S.navBrand}>
          <div style={S.navIcon}>📋</div>
          <span style={S.navTitle}>Task Tracker</span>
        </div>
        <div style={S.navRight}>
          <button
            style={S.btnNavAdd}
            onClick={() => { setEditData(null); setShowForm(!showForm); }}
          >
            {showForm ? "✕ Tutup" : "+ New Task"}
          </button>
          <button style={S.btnLogout} onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      {/* NOTIF */}
      {notif && <div style={S.notif(notif.type)}>{notif.msg}</div>}

      <div style={S.content}>
        {/* STATS */}
        <div style={S.statsGrid}>
          {[
            { label: "Total Task",       num: stats.total,   color: "#a5b4fc" },
            { label: "Selesai",          num: stats.done,    color: "#34d399" },
            { label: "Pending",          num: stats.pending, color: "#fbbf24" },
            { label: "Prioritas Tinggi", num: stats.high,    color: "#f87171" },
          ].map((s) => (
            <div key={s.label} style={S.statCard(s.color)}>
              <div style={S.statNum(s.color)}>{s.num}</div>
              <div style={S.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* FORM */}
        {showForm && (
          <TaskForm
            onSubmit={editData ? handleUpdate : handleCreate}
            editData={editData}
            onCancel={() => { setShowForm(false); setEditData(null); }}
          />
        )}

        {/* FILTER */}
        <div style={S.filterBar}>
          <span style={S.filterLabel}>Filter:</span>
          <select style={S.filterSelect} value={filters.status} onChange={setFilter("status")}>
            <option value="">Semua Status</option>
            <option value="pending">⏳ Pending</option>
            <option value="done">✅ Done</option>
          </select>
          <select style={S.filterSelect} value={filters.priority} onChange={setFilter("priority")}>
            <option value="">Semua Prioritas</option>
            <option value="high">🔴 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Low</option>
          </select>
          <input
            style={S.filterInput}
            type="text"
            placeholder="Filter kategori..."
            value={filters.kategori}
            onChange={setFilter("kategori")}
          />
          <button style={S.btnReset} onClick={() => setFilters({ status: "", priority: "", kategori: "" })}>
            Reset
          </button>
        </div>

        {/* TASK LIST */}
        {loading
          ? <div style={S.loading}>⏳ Memuat tasks...</div>
          : <TaskList tasks={tasks} onEdit={handleEdit} onDelete={handleDelete} />
        }
      </div>
    </div>
  );
}