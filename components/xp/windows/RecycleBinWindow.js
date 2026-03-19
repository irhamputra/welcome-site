import { useState } from "react";
import { format, parseISO } from "date-fns";
import { useWindowManager } from "../../../context/windowManager";

const I = (name) => `/xp/icons/Windows XP Icons/${name}.png`;

function formatDate(d) {
  try { return format(parseISO(d), "MM/dd/yyyy hh:mm aa"); } catch { return ""; }
}

// ── Sidebar panel (reused from ReposWindow pattern) ──────────────────────────
function SidePanel({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ marginBottom: 6 }}>
      <div
        onClick={() => setOpen((o) => !o)}
        style={{
          background: "linear-gradient(180deg,#3169c4 0%,#1d4ea0 100%)",
          color: "white", fontSize: 11, fontWeight: "bold",
          padding: "3px 8px", cursor: "default",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          userSelect: "none", borderRadius: open ? "4px 4px 0 0" : 4,
        }}
      >
        <span>{title}</span>
        <span style={{ fontSize: 8 }}>{open ? "▼" : "▶"}</span>
      </div>
      {open && (
        <div style={{
          background: "#dce4f5", border: "1px solid #7a96c2",
          borderTop: "none", padding: "6px 8px", borderRadius: "0 0 4px 4px",
        }}>
          {children}
        </div>
      )}
    </div>
  );
}

function SideAction({ icon, label, disabled, onClick }) {
  return (
    <div
      onClick={disabled ? undefined : onClick}
      style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "2px 0", cursor: disabled ? "default" : "pointer",
        fontSize: 11, color: disabled ? "#888" : "#0033a0",
        opacity: disabled ? 0.5 : 1,
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.textDecoration = "underline"; }}
      onMouseLeave={(e) => { e.currentTarget.style.textDecoration = "none"; }}
    >
      {icon && <img src={icon} alt="" style={{ width: 16, height: 16, flexShrink: 0 }} />}
      <span>{label}</span>
    </div>
  );
}

function ToolBtn({ icon, label, disabled, onClick }) {
  return (
    <button
      onClick={onClick} disabled={disabled} title={label}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 1,
        padding: "2px 6px", background: "transparent",
        border: "1px solid transparent", borderRadius: 2,
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.4 : 1, fontSize: 10, color: "#222", flexShrink: 0,
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.border = "1px solid #7a96c2"; }}
      onMouseLeave={(e) => { e.currentTarget.style.border = "1px solid transparent"; }}
    >
      <img src={icon} alt={label} style={{ width: 20, height: 20 }} />
      <span>{label}</span>
    </button>
  );
}

export default function RecycleBinWindow() {
  const { recyclebin, restoreFromBin, emptyBin } = useWindowManager();
  const [selected, setSelected] = useState(null);

  const selectedItem = recyclebin.find((i) => i.id === selected) ?? null;
  const isEmpty = recyclebin.length === 0;

  const handleRestore = (id) => {
    restoreFromBin(id ?? selected);
    setSelected(null);
  };

  const handleRestoreAll = () => {
    recyclebin.forEach((i) => restoreFromBin(i.id));
    setSelected(null);
  };

  const handleEmpty = () => {
    emptyBin();
    setSelected(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", fontFamily: "Tahoma, sans-serif", fontSize: 12, background: "#ece9d8" }}>

      {/* Toolbar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 2, padding: "2px 4px",
        background: "#ece9d8", borderBottom: "1px solid #aca899", flexShrink: 0,
      }}>
        <ToolBtn
          icon={I("Recycle Bin (empty)")}
          label="Empty Bin"
          disabled={isEmpty}
          onClick={handleEmpty}
        />
        <ToolBtn
          icon={I("Restore All Items")}
          label="Restore All"
          disabled={isEmpty}
          onClick={handleRestoreAll}
        />
        {selectedItem && (
          <ToolBtn
            icon={I("Restore")}
            label="Restore"
            onClick={() => handleRestore(selected)}
          />
        )}
      </div>

      {/* Address bar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 6, padding: "2px 6px",
        background: "#ece9d8", borderBottom: "1px solid #aca899", flexShrink: 0,
      }}>
        <span style={{ fontSize: 11, color: "#444" }}>Address</span>
        <div style={{
          flex: 1, display: "flex", alignItems: "center", gap: 4,
          background: "white", border: "1px solid #7f9db9", padding: "1px 6px",
        }}>
          <img src={I(isEmpty ? "Recycle Bin (empty)" : "Recycle Bin (full)")} alt="" style={{ width: 16, height: 16 }} />
          <span style={{ fontSize: 11 }}>C:\RECYCLER</span>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* Sidebar */}
        <div style={{
          width: 160, flexShrink: 0, background: "#dce4f5",
          borderRight: "1px solid #7a96c2", overflowY: "auto", padding: 6,
        }}>
          <SidePanel title="Recycle Bin Tasks">
            <SideAction icon={I("Recycle Bin (empty)")} label="Empty Recycle Bin" disabled={isEmpty}  onClick={handleEmpty} />
            <SideAction icon={I("Restore All Items")}   label="Restore all items" disabled={isEmpty}  onClick={handleRestoreAll} />
            <SideAction icon={I("Restore")}             label="Restore this item" disabled={!selected} onClick={() => handleRestore(selected)} />
          </SidePanel>

          <SidePanel title="Other Places">
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "2px 0", fontSize: 11, color: "#0033a0", cursor: "default" }}>
              <img src={I("Desktop")} alt="" style={{ width: 16, height: 16 }} />
              <span>Desktop</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "2px 0", fontSize: 11, color: "#0033a0", cursor: "default" }}>
              <img src={I("My Documents")} alt="" style={{ width: 16, height: 16 }} />
              <span>My Documents</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "2px 0", fontSize: 11, color: "#0033a0", cursor: "default" }}>
              <img src={I("My Computer")} alt="" style={{ width: 16, height: 16 }} />
              <span>My Computer</span>
            </div>
          </SidePanel>

          {selectedItem && (
            <SidePanel title="Details">
              <div style={{ fontSize: 10, color: "#333", lineHeight: 1.6 }}>
                <div style={{ textAlign: "center", marginBottom: 4 }}>
                  <img src={selectedItem.icon} alt="" style={{ width: 32, height: 32 }} />
                </div>
                <div style={{ fontWeight: "bold", wordBreak: "break-word" }}>{selectedItem.name}</div>
                <div style={{ color: "#555" }}>File Folder</div>
                {selectedItem.deletedAt && (
                  <div style={{ marginTop: 2 }}>Deleted:<br />{formatDate(selectedItem.deletedAt)}</div>
                )}
                {selectedItem.originalLocation && (
                  <div style={{ marginTop: 2, color: "#555", fontStyle: "italic", wordBreak: "break-all" }}>
                    {selectedItem.originalLocation}
                  </div>
                )}
              </div>
            </SidePanel>
          )}
        </div>

        {/* Content */}
        <div
          style={{ flex: 1, background: "white", overflow: "auto" }}
          onClick={(e) => { if (e.target === e.currentTarget) setSelected(null); }}
        >
          {isEmpty ? (
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", height: "100%", color: "#888", gap: 12,
            }}>
              <img src={I("Recycle Bin (empty)")} alt="" style={{ width: 64, height: 64, opacity: 0.5 }} />
              <div style={{ fontSize: 12 }}>Recycle Bin is empty</div>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
              <thead>
                <tr>
                  {["Name", "Original Location", "Date Deleted", "Type"].map((col) => (
                    <th key={col} style={{
                      padding: "2px 8px", textAlign: "left",
                      background: "linear-gradient(180deg,#f0ede4,#ddd9c8)",
                      borderRight: "1px solid #aca899", borderBottom: "1px solid #aca899",
                      fontSize: 11, fontWeight: "normal", userSelect: "none", whiteSpace: "nowrap",
                    }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recyclebin.map((item) => (
                  <tr
                    key={item.id}
                    onClick={(e) => { e.stopPropagation(); setSelected(item.id); }}
                    onDoubleClick={() => handleRestore(item.id)}
                    style={{
                      background: selected === item.id ? "#316ac5" : "transparent",
                      color: selected === item.id ? "white" : "#000",
                      cursor: "default",
                    }}
                    onMouseEnter={(e) => { if (selected !== item.id) e.currentTarget.style.background = "#eef3fb"; }}
                    onMouseLeave={(e) => { if (selected !== item.id) e.currentTarget.style.background = ""; }}
                  >
                    <td style={{ padding: "2px 8px", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
                      <img src={item.icon} alt="" style={{ width: 16, height: 16, flexShrink: 0 }} />
                      {item.name}
                    </td>
                    <td style={{ padding: "2px 8px", whiteSpace: "nowrap", fontSize: 11 }}>
                      {item.originalLocation ?? "—"}
                    </td>
                    <td style={{ padding: "2px 8px", whiteSpace: "nowrap" }}>
                      {item.deletedAt ? formatDate(item.deletedAt) : "—"}
                    </td>
                    <td style={{ padding: "2px 8px" }}>File Folder</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div style={{
        padding: "2px 8px", background: "#ece9d8", borderTop: "1px solid #aca899",
        fontSize: 11, color: "#444", flexShrink: 0, display: "flex", gap: 16,
      }}>
        <span>{recyclebin.length} object{recyclebin.length !== 1 ? "s" : ""}</span>
        {selectedItem && <span>1 object selected</span>}
      </div>
    </div>
  );
}
