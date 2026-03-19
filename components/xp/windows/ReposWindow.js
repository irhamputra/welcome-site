import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { useWindowManager } from "../../../context/windowManager";

const I = (name) => `/xp/icons/Windows XP Icons/${name}.png`;

// Map repo language to an XP icon
function langIcon(language) {
  if (!language) return I("Folder Closed");
  const l = language.toLowerCase();
  if (l === "javascript") return I("Java Script");
  if (l === "typescript") return I("Java Script");
  if (l === "html") return I("HTML");
  if (l === "css" || l === "scss" || l === "less") return I("CSS");
  if (l === "shell" || l === "batchfile") return I("BAT");
  if (l === "xml" || l === "xslt") return I("XML");
  return I("Folder Closed");
}

function formatDate(dateStr) {
  try { return format(parseISO(dateStr), "MM/dd/yyyy"); } catch { return ""; }
}

// ── Sidebar accordion panel ──────────────────────────────────────────────────
function SidePanel({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ marginBottom: 6 }}>
      <div
        onClick={() => setOpen((o) => !o)}
        style={{
          background: "linear-gradient(180deg,#3169c4 0%,#1d4ea0 100%)",
          color: "white",
          fontSize: 11,
          fontWeight: "bold",
          padding: "3px 8px",
          cursor: "default",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          userSelect: "none",
          borderRadius: open ? "4px 4px 0 0" : 4,
        }}
      >
        <span>{title}</span>
        <span style={{ fontSize: 8 }}>{open ? "▼" : "▶"}</span>
      </div>
      {open && (
        <div style={{
          background: "#dce4f5",
          border: "1px solid #7a96c2",
          borderTop: "none",
          padding: "6px 8px",
          borderRadius: "0 0 4px 4px",
        }}>
          {children}
        </div>
      )}
    </div>
  );
}

function SideLink({ icon, label, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{ display: "flex", alignItems: "center", gap: 6, padding: "2px 0", cursor: "pointer", fontSize: 11, color: "#0033a0" }}
      onMouseEnter={(e) => { e.currentTarget.style.textDecoration = "underline"; }}
      onMouseLeave={(e) => { e.currentTarget.style.textDecoration = "none"; }}
    >
      {icon && <img src={icon} alt="" style={{ width: 16, height: 16, flexShrink: 0 }} />}
      <span>{label}</span>
    </div>
  );
}

// ── Toolbar button ────────────────────────────────────────────────────────────
function ToolBtn({ icon, label, disabled, onClick, active }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 1,
        padding: "2px 6px", background: active ? "#d4e0f0" : "transparent",
        border: `1px solid ${active ? "#7a96c2" : "transparent"}`,
        borderRadius: 2, cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.4 : 1, fontSize: 10, color: "#222", flexShrink: 0,
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.border = "1px solid #7a96c2"; }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.border = "1px solid transparent"; }}
    >
      <img src={icon} alt={label} style={{ width: 20, height: 20 }} />
      <span>{label}</span>
    </button>
  );
}

// ── Root folders shown in My Documents ───────────────────────────────────────
const ROOT_FOLDERS = [
  { id: "mywork",   name: "My Work",    icon: I("Folder Closed"), type: "Folder", special: true },
  { id: "pictures", name: "My Pictures", icon: I("My Pictures"),  type: "Folder" },
  { id: "music",    name: "My Music",    icon: I("My Music"),     type: "Folder" },
  { id: "videos",   name: "My Videos",   icon: I("My Videos"),    type: "Folder" },
];

// ── Main component ────────────────────────────────────────────────────────────
export default function ReposWindow({ repos = [] }) {
  const { recyclebin, moveToBin } = useWindowManager();
  const [view, setView] = useState("icons"); // "icons" | "details"
  const [location, setLocation] = useState("root"); // "root" | "mywork"
  const [history, setHistory] = useState(["root"]);
  const [historyIdx, setHistoryIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const navigate = (loc) => {
    const newHist = [...history.slice(0, historyIdx + 1), loc];
    setHistory(newHist);
    setHistoryIdx(newHist.length - 1);
    setLocation(loc);
    setSelected(null);
  };

  const goBack = () => {
    if (historyIdx <= 0) return;
    const idx = historyIdx - 1;
    setHistoryIdx(idx);
    setLocation(history[idx]);
    setSelected(null);
  };

  const goForward = () => {
    if (historyIdx >= history.length - 1) return;
    const idx = historyIdx + 1;
    setHistoryIdx(idx);
    setLocation(history[idx]);
    setSelected(null);
  };

  const goUp = () => {
    if (location !== "root") navigate("root");
  };

  const canBack = historyIdx > 0;
  const canForward = historyIdx < history.length - 1;
  const canUp = location !== "root";

  const addressPath = location === "root"
    ? "C:\\My Documents"
    : "C:\\My Documents\\My Work";

  const binIds = new Set(recyclebin.map((i) => i.id));

  const currentItems = location === "root"
    ? ROOT_FOLDERS
    : repos
        .filter((r) => !binIds.has(r.id || r.name))
        .map((r) => ({
          id: r.id || r.name,
          name: r.name,
          icon: langIcon(r.language),
          type: "File Folder",
          language: r.language,
          stars: r.stargazers_count,
          updated: r.updated_at,
          description: r.description,
          url: r.html_url,
          isRepo: true,
        }));

  const handleDoubleClick = (item) => {
    if (item.id === "mywork") { navigate("mywork"); return; }
    if (item.isRepo) { window.open(item.url, "_blank"); return; }
  };

  const handleDelete = () => {
    const item = currentItems.find((i) => i.id === selected);
    if (!item || !item.isRepo) return;
    moveToBin({ ...item, originalLocation: "C:\\My Documents\\My Work" });
    setSelected(null);
  };

  const selectedItem = selected ? currentItems.find((i) => i.id === selected) : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", fontFamily: "Tahoma, sans-serif", fontSize: 12, background: "#ece9d8" }}>

      {/* Toolbar */}
      <div
        style={{
          display: "flex", alignItems: "center", gap: 2, padding: "2px 4px",
          background: "#ece9d8", borderBottom: "1px solid #aca899", flexShrink: 0,
        }}
        onKeyDown={(e) => { if (e.key === "Delete") handleDelete(); }}
        tabIndex={-1}
      >
        <ToolBtn icon={I("Back")}    label="Back"    disabled={!canBack}    onClick={goBack} />
        <ToolBtn icon={I("Forward")} label="Forward" disabled={!canForward} onClick={goForward} />
        <ToolBtn icon={I("Up")}      label="Up"      disabled={!canUp}      onClick={goUp} />
        <div style={{ width: 1, height: 32, background: "#aca899", margin: "0 2px" }} />
        <ToolBtn icon={I("Search")}      label="Search"  onClick={() => {}} />
        <ToolBtn icon={I("Folder View")} label="Folders" onClick={() => {}} />
        <div style={{ width: 1, height: 32, background: "#aca899", margin: "0 2px" }} />
        <ToolBtn icon={I("Delete")}  label="Delete"
          disabled={!selected || !currentItems.find((i) => i.id === selected)?.isRepo}
          onClick={handleDelete}
        />
        <div style={{ width: 1, height: 32, background: "#aca899", margin: "0 2px" }} />
        <ToolBtn icon={I("Icon View")}   label="Icons"   onClick={() => setView("icons")}   active={view === "icons"} />
        <ToolBtn icon={I("Detail View")} label="Details" onClick={() => setView("details")} active={view === "details"} />
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
          <img src={location === "root" ? I("My Documents") : I("Folder Opened")} alt="" style={{ width: 16, height: 16 }} />
          <span style={{ fontSize: 11, flex: 1 }}>{addressPath}</span>
        </div>
        <button style={{ padding: "1px 8px", fontSize: 11, cursor: "pointer", background: "linear-gradient(180deg,#f0ede4,#ddd9c8)", border: "1px solid #aca899", borderRadius: 2 }}>
          Go
        </button>
      </div>

      {/* Body: sidebar + content */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* Left sidebar — hidden on mobile */}
        {!isMobile && (
          <div style={{
            width: 160, flexShrink: 0, background: "#dce4f5",
            borderRight: "1px solid #7a96c2", overflowY: "auto", padding: 6,
          }}>
            {location === "root" ? (
              <>
                <SidePanel title="File and Folder Tasks">
                  <SideLink icon={I("New Folder")}        label="Make a new folder" />
                  <SideLink icon={I("Publish to web")}    label="Publish this folder" />
                  <SideLink icon={I("Shared Folder")}     label="Share this folder" />
                </SidePanel>
                <SidePanel title="Other Places">
                  <SideLink icon={I("Desktop")}           label="Desktop" />
                  <SideLink icon={I("My Computer")}       label="My Computer" />
                  <SideLink icon={I("Shared Folder")}     label="Shared Documents" />
                  <SideLink icon={I("My Network Places")} label="My Network Places" />
                </SidePanel>
              </>
            ) : (
              <>
                <SidePanel title="File and Folder Tasks">
                  <SideLink icon={I("Rename")}            label="Rename this folder" />
                  <SideLink icon={I("Move this folder")}  label="Move this folder" />
                  <SideLink icon={I("Copy To")}           label="Copy this folder" />
                </SidePanel>
                <SidePanel title="Other Places">
                  <SideLink icon={I("My Documents")}      label="My Documents"  onClick={() => navigate("root")} />
                  <SideLink icon={I("Desktop")}           label="Desktop" />
                  <SideLink icon={I("My Computer")}       label="My Computer" />
                </SidePanel>
                {selectedItem && (
                  <SidePanel title="Details">
                    <div style={{ fontSize: 10, color: "#333", lineHeight: 1.6 }}>
                      <div style={{ textAlign: "center", marginBottom: 4 }}>
                        <img src={selectedItem.icon} alt="" style={{ width: 32, height: 32 }} />
                      </div>
                      <div style={{ fontWeight: "bold", wordBreak: "break-word" }}>{selectedItem.name}</div>
                      {selectedItem.language && <div>Language: {selectedItem.language}</div>}
                      {selectedItem.stars > 0 && <div>Stars: ⭐ {selectedItem.stars}</div>}
                      {selectedItem.updated && <div>Modified: {formatDate(selectedItem.updated)}</div>}
                      {selectedItem.description && (
                        <div style={{ marginTop: 4, color: "#555", fontStyle: "italic" }}>
                          {selectedItem.description.slice(0, 80)}{selectedItem.description.length > 80 ? "…" : ""}
                        </div>
                      )}
                    </div>
                  </SidePanel>
                )}
              </>
            )}
          </div>
        )}

        {/* Content area */}
        <div
          style={{ flex: 1, background: "white", overflow: "auto" }}
          onClick={(e) => { if (e.target === e.currentTarget) setSelected(null); }}
        >
          {view === "icons" ? (
            <IconsView
              items={currentItems}
              selected={selected}
              onSelect={setSelected}
              onDoubleClick={handleDoubleClick}
            />
          ) : (
            <DetailsView
              items={currentItems}
              selected={selected}
              onSelect={setSelected}
              onDoubleClick={handleDoubleClick}
            />
          )}
        </div>
      </div>

      {/* Status bar */}
      <div style={{
        padding: "2px 8px", background: "#ece9d8", borderTop: "1px solid #aca899",
        fontSize: 11, color: "#444", flexShrink: 0, display: "flex", gap: 16,
      }}>
        <span>{currentItems.length} object{currentItems.length !== 1 ? "s" : ""}</span>
        {selectedItem && <span>1 object selected</span>}
      </div>
    </div>
  );
}

// ── Icons view ────────────────────────────────────────────────────────────────
function IconsView({ items, selected, onSelect, onDoubleClick }) {
  return (
    <div style={{
      display: "flex", flexWrap: "wrap", alignContent: "flex-start",
      gap: 4, padding: 8,
    }}>
      {items.map((item) => (
        <div
          key={item.id}
          onClick={(e) => { e.stopPropagation(); onSelect(item.id); }}
          onDoubleClick={() => onDoubleClick(item)}
          style={{
            width: 80, display: "flex", flexDirection: "column", alignItems: "center",
            gap: 4, padding: "6px 4px", borderRadius: 2, cursor: "default",
            background: selected === item.id ? "#316ac5" : "transparent",
            border: `1px solid ${selected === item.id ? "#316ac5" : "transparent"}`,
          }}
        >
          <img src={item.icon} alt="" style={{ width: 32, height: 32 }} />
          <span style={{
            fontSize: 11, textAlign: "center", wordBreak: "break-word",
            color: selected === item.id ? "white" : "#000",
            lineHeight: 1.3, maxWidth: 76,
          }}>
            {item.name}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Details view ──────────────────────────────────────────────────────────────
function DetailsView({ items, selected, onSelect, onDoubleClick }) {
  const [sortField, setSortField] = useState("name");
  const [sortDir, setSortDir]   = useState("asc");

  const handleSort = (field) => {
    if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const sorted = [...items].sort((a, b) => {
    const av = (a[sortField] ?? "").toString().toLowerCase();
    const bv = (b[sortField] ?? "").toString().toLowerCase();
    return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
  });

  const arrow = (f) => sortField === f ? (sortDir === "asc" ? " ▲" : " ▼") : "";

  const thStyle = (field) => ({
    padding: "2px 8px", textAlign: "left", cursor: "default",
    background: "linear-gradient(180deg,#f0ede4,#ddd9c8)",
    borderRight: "1px solid #aca899", borderBottom: "1px solid #aca899",
    fontSize: 11, fontWeight: "normal", userSelect: "none", whiteSpace: "nowrap",
  });

  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
      <thead>
        <tr>
          <th style={thStyle("name")}    onClick={() => handleSort("name")}>Name{arrow("name")}</th>
          <th style={thStyle("type")}    onClick={() => handleSort("type")}>Type{arrow("type")}</th>
          <th style={thStyle("language")} onClick={() => handleSort("language")}>Language{arrow("language")}</th>
          <th style={{ ...thStyle("stars"), textAlign: "right" }}   onClick={() => handleSort("stars")}>Stars{arrow("stars")}</th>
          <th style={thStyle("updated")} onClick={() => handleSort("updated")}>Date Modified{arrow("updated")}</th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((item) => (
          <tr
            key={item.id}
            onClick={(e) => { e.stopPropagation(); onSelect(item.id); }}
            onDoubleClick={() => onDoubleClick(item)}
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
            <td style={{ padding: "2px 8px", whiteSpace: "nowrap" }}>{item.type || "File Folder"}</td>
            <td style={{ padding: "2px 8px" }}>{item.language || "—"}</td>
            <td style={{ padding: "2px 8px", textAlign: "right" }}>{item.stars > 0 ? `⭐ ${item.stars}` : "—"}</td>
            <td style={{ padding: "2px 8px", whiteSpace: "nowrap" }}>{item.updated ? formatDate(item.updated) : "—"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
