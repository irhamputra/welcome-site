import { useState } from "react";
import { useWindowManager } from "../../../context/windowManager";

const I = (name) => `/xp/icons/Windows XP Icons/${name}.png`;

// ── Reusable sidebar components ─────────────────────────────────────────────
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

function SideAction({ icon, label, onClick, disabled }) {
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

// ── Drive data ───────────────────────────────────────────────────────────────
const HARD_DRIVES = [
  {
    letter: "C:", label: "Local Disk", icon: "Local Disk",
    totalGB: 80, freeGB: 46.5,
    desc: "Next.js 16 · Pages Router",
  },
  {
    letter: "D:", label: "Work Files", icon: "Local Disk",
    totalGB: 120, freeGB: 39.8,
    desc: "React 19 · JavaScript",
  },
  {
    letter: "E:", label: "Assets", icon: "Local Disk",
    totalGB: 60, freeGB: 43.2,
    desc: "Tailwind CSS · XP.css",
  },
];

const REMOVABLE_DRIVES = [
  {
    letter: "F:", label: "GitHub API", icon: "CD-ROM",
    totalGB: 4.7, freeGB: 1.2,
    desc: "Data Source · Axios",
  },
  {
    letter: "G:", label: "Vercel Deploy", icon: "DVD",
    totalGB: 8.5, freeGB: 3.1,
    desc: "Deployment · Edge Network",
  },
];

// ── Free space bar (XP style) ────────────────────────────────────────────────
function SpaceBar({ totalGB, freeGB }) {
  const usedPct = ((totalGB - freeGB) / totalGB) * 100;
  const isAlmost = usedPct > 80;
  return (
    <div>
      <div style={{
        width: "100%", height: 8,
        background: "#fff", border: "1px solid #999",
        borderRadius: 1, overflow: "hidden",
      }}>
        <div style={{
          width: `${usedPct}%`, height: "100%",
          background: isAlmost ? "#c00000" : "#317dc6",
        }} />
      </div>
      <div style={{ fontSize: 10, color: "#444", marginTop: 2 }}>
        {freeGB.toFixed(1)} GB free of {totalGB} GB
      </div>
    </div>
  );
}

// ── Drive tile (XP Tiles view) ────────────────────────────────────────────────
function DriveTile({ drive, selected, onSelect }) {
  return (
    <div
      onClick={(e) => { e.stopPropagation(); onSelect(drive.letter); }}
      onDoubleClick={() => {}}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "6px 10px", borderRadius: 2, cursor: "default",
        background: selected ? "#316ac5" : "transparent",
        color: selected ? "white" : "#000",
        width: 220,
        userSelect: "none",
      }}
      onMouseEnter={(e) => { if (!selected) e.currentTarget.style.background = "#eef3fb"; }}
      onMouseLeave={(e) => { if (!selected) e.currentTarget.style.background = "transparent"; }}
    >
      <img src={I(drive.icon)} alt="" style={{ width: 32, height: 32, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, fontWeight: "bold", color: selected ? "white" : "#000" }}>
          {drive.label} ({drive.letter})
        </div>
        <SpaceBar totalGB={drive.totalGB} freeGB={drive.freeGB} />
        <div style={{
          fontSize: 10, color: selected ? "#cde" : "#666",
          marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {drive.desc}
        </div>
      </div>
    </div>
  );
}

// ── Section header (gray separator text) ────────────────────────────────────
function SectionHeader({ label }) {
  return (
    <div style={{
      fontSize: 11, color: "#5a5a5a", fontWeight: "bold",
      padding: "10px 10px 4px",
      borderBottom: "1px solid #c8c4b8",
      marginBottom: 4,
    }}>
      {label}
    </div>
  );
}

// ── Toolbar button ───────────────────────────────────────────────────────────
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
      <img src={I(icon)} alt={label} style={{ width: 20, height: 20 }} />
      <span>{label}</span>
    </button>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function MyComputerWindow() {
  const { openWindow } = useWindowManager();
  const [selected, setSelected] = useState(null);

  const allDrives = [...HARD_DRIVES, ...REMOVABLE_DRIVES];
  const selectedDrive = allDrives.find((d) => d.letter === selected) ?? null;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", fontFamily: "Tahoma, sans-serif", fontSize: 12, background: "#ece9d8" }}>

      {/* Toolbar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 2, padding: "2px 4px",
        background: "#ece9d8", borderBottom: "1px solid #aca899", flexShrink: 0,
      }}>
        <ToolBtn icon="Back" label="Back" disabled />
        <ToolBtn icon="Forward" label="Forward" disabled />
        <div style={{ width: 1, height: 28, background: "#aca899", margin: "0 2px" }} />
        <ToolBtn icon="Search" label="Search" disabled />
        <ToolBtn icon="Folder View" label="Folders" disabled />
        <div style={{ width: 1, height: 28, background: "#aca899", margin: "0 2px" }} />
        <ToolBtn icon="explorer properties" label="Properties" disabled />
        <ToolBtn icon="System Information" label="System Info" onClick={() => openWindow("profile")} />
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
          <img src={I("My Computer")} alt="" style={{ width: 16, height: 16 }} />
          <span style={{ fontSize: 11 }}>My Computer</span>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* Sidebar */}
        <div style={{
          width: 160, flexShrink: 0, background: "#dce4f5",
          borderRight: "1px solid #7a96c2", overflowY: "auto", padding: 6,
        }}>
          <SidePanel title="System Tasks">
            <SideAction icon={I("System Information")} label="View system info"  onClick={() => openWindow("profile")} />
            <SideAction icon={I("Add or Remove Windows Components")} label="Add/remove programs" disabled />
            <SideAction icon={I("Additional Settings")} label="Change a setting" disabled />
          </SidePanel>

          <SidePanel title="Other Places">
            <SideAction icon={I("My Network Places")} label="My Network Places" disabled />
            <SideAction icon={I("My Documents")}      label="My Documents"      onClick={() => openWindow("repos")} />
            <SideAction icon={I("Shared Folder")}     label="Shared Documents"  disabled />
            <SideAction icon={I("Control Panel")}     label="Control Panel"     disabled />
          </SidePanel>

          {selectedDrive && (
            <SidePanel title="Details">
              <div style={{ fontSize: 10, color: "#333", lineHeight: 1.6 }}>
                <div style={{ textAlign: "center", marginBottom: 4 }}>
                  <img src={I(selectedDrive.icon)} alt="" style={{ width: 32, height: 32 }} />
                </div>
                <div style={{ fontWeight: "bold" }}>{selectedDrive.label} ({selectedDrive.letter})</div>
                <div style={{ color: "#555" }}>Local Disk</div>
                <div style={{ marginTop: 4 }}>
                  <div>Free Space: {selectedDrive.freeGB.toFixed(1)} GB</div>
                  <div>Total Size: {selectedDrive.totalGB} GB</div>
                </div>
                <div style={{ marginTop: 4, color: "#555", fontStyle: "italic" }}>
                  {selectedDrive.desc}
                </div>
              </div>
            </SidePanel>
          )}
        </div>

        {/* Content area */}
        <div
          style={{ flex: 1, background: "white", overflowY: "auto" }}
          onClick={() => setSelected(null)}
        >
          {/* Hard Disk Drives */}
          <SectionHeader label="Hard Disk Drives" />
          <div style={{ display: "flex", flexWrap: "wrap", padding: "0 4px 8px" }}>
            {HARD_DRIVES.map((d) => (
              <DriveTile
                key={d.letter}
                drive={d}
                selected={selected === d.letter}
                onSelect={setSelected}
              />
            ))}
          </div>

          {/* Devices with Removable Storage */}
          <SectionHeader label="Devices with Removable Storage" />
          <div style={{ display: "flex", flexWrap: "wrap", padding: "0 4px 8px" }}>
            {REMOVABLE_DRIVES.map((d) => (
              <DriveTile
                key={d.letter}
                drive={d}
                selected={selected === d.letter}
                onSelect={setSelected}
              />
            ))}
          </div>

          {/* System info footer */}
          <div style={{
            margin: "8px 10px", padding: "8px 10px",
            background: "#f5f3ec", border: "1px solid #d4cfc4",
            borderRadius: 2, fontSize: 11, color: "#555",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <img src={I("System Properties")} alt="" style={{ width: 16, height: 16 }} />
              <strong style={{ color: "#333" }}>Microsoft Windows XP</strong>
            </div>
            <div>Professional · Version 2002 · Service Pack 3</div>
            <div style={{ marginTop: 2 }}>Registered to: <strong>Irham Putra</strong></div>
            <div>irhamputra.com · Build 2025</div>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div style={{
        padding: "2px 8px", background: "#ece9d8", borderTop: "1px solid #aca899",
        fontSize: 11, color: "#444", flexShrink: 0, display: "flex", gap: 16,
      }}>
        <span>{allDrives.length} objects</span>
        {selectedDrive && <span>{selectedDrive.label} ({selectedDrive.letter}) — {selectedDrive.freeGB.toFixed(1)} GB free</span>}
      </div>
    </div>
  );
}
