const priorityMap = {
  high:   { label: "High",   bg: "rgba(248,113,113,0.15)", color: "#f87171", border: "rgba(248,113,113,0.3)" },
  medium: { label: "Medium", bg: "rgba(251,191,36,0.15)",  color: "#fbbf24", border: "rgba(251,191,36,0.3)" },
  low:    { label: "Low",    bg: "rgba(52,211,153,0.15)",  color: "#34d399", border: "rgba(52,211,153,0.3)" },
};

const S = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "16px",
  },
  card: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    transition: "transform 0.2s, border-color 0.2s",
    fontFamily: "'Segoe UI', sans-serif",
    cursor: "default",
  },
  cardHeader: { display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" },
  badge: (p) => ({
    fontSize: "11px",
    fontWeight: 700,
    padding: "3px 10px",
    borderRadius: "100px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    background: priorityMap[p].bg,
    color: priorityMap[p].color,
    border: `1px solid ${priorityMap[p].border}`,
  }),
  kategori: {
    fontSize: "12px",
    color: "rgba(255,255,255,0.45)",
    background: "rgba(255,255,255,0.06)",
    padding: "3px 10px",
    borderRadius: "100px",
    border: "1px solid rgba(255,255,255,0.1)",
  },
  taskTitle: { color: "#fff", fontSize: "16px", fontWeight: 600, lineHeight: 1.4 },
  meta: { display: "flex", flexDirection: "column", gap: "4px", fontSize: "13px", color: "rgba(255,255,255,0.45)" },
  actions: { display: "flex", gap: "8px", marginTop: "4px" },
  btnEdit: {
    flex: 1,
    padding: "8px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
    border: "1px solid rgba(102,126,234,0.4)",
    background: "rgba(102,126,234,0.12)",
    color: "#a5b4fc",
  },
  btnDelete: {
    flex: 1,
    padding: "8px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
    border: "1px solid rgba(248,113,113,0.3)",
    background: "rgba(248,113,113,0.1)",
    color: "#f87171",
  },
  empty: {
    textAlign: "center",
    padding: "60px 24px",
    color: "rgba(255,255,255,0.3)",
    fontFamily: "'Segoe UI', sans-serif",
  },
  emptyIcon: { fontSize: "48px", marginBottom: "16px" },
};

function isOverdue(deadline, status) {
  return status !== "done" && new Date(deadline) < new Date();
}

export default function TaskList({ tasks, onEdit, onDelete }) {
  if (tasks.length === 0) {
    return (
      <div style={S.empty}>
        <div style={S.emptyIcon}>📭</div>
        <p>Belum ada task. Tambahkan task pertamamu!</p>
      </div>
    );
  }

  return (
    <div style={S.grid}>
      {tasks.map((task) => {
        const overdue = isOverdue(task.deadline, task.status);
        return (
          <div
            key={task.id}
            style={{
              ...S.card,
              opacity: task.status === "done" ? 0.55 : 1,
              borderColor: overdue ? "rgba(248,113,113,0.4)" : "rgba(255,255,255,0.08)",
            }}
          >
            <div style={S.cardHeader}>
              <span style={S.badge(task.priority)}>{priorityMap[task.priority].label}</span>
              <span style={S.kategori}>{task.kategori}</span>
              {task.status === "done" && (
                <span style={{ ...S.kategori, color: "#34d399", borderColor: "rgba(52,211,153,0.3)" }}>✅ Done</span>
              )}
            </div>

            <div style={S.taskTitle}>{task.title}</div>

            <div style={S.meta}>
              <span>{task.status === "done" ? "✅ Selesai" : "⏳ Pending"}</span>
              <span style={overdue ? { color: "#f87171", fontWeight: 600 } : {}}>
                📅 {task.deadline}{overdue ? " — Terlambat!" : ""}
              </span>
            </div>

            <div style={S.actions}>
              <button style={S.btnEdit} onClick={() => onEdit(task)}>✏️ Edit</button>
              <button style={S.btnDelete} onClick={() => onDelete(task.id)}>🗑 Hapus</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}