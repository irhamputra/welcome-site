import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useWindowManager } from "../../context/windowManager";

const I = (name) => `/xp/icons/Windows XP Icons/${name}.png`;

export default function StartMenu({ user }) {
  const { startMenuOpen, closeStartMenu, openWindow } = useWindowManager();
  const menuRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (!startMenuOpen) return;
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        closeStartMenu();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [startMenuOpen, closeStartMenu]);

  if (!startMenuOpen) return null;

  const open = (id) => { openWindow(id); closeStartMenu(); };
  const logOff = () => { closeStartMenu(); router.push("/"); };

  return (
    <div
      ref={menuRef}
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "fixed",
        bottom: 40,
        left: 0,
        width: 380,
        background: "white",
        border: "2px solid #0054e3",
        borderRadius: "8px 8px 0 0",
        boxShadow: "4px -4px 12px rgba(0,0,0,0.4)",
        zIndex: 10000,
        fontFamily: "Tahoma, sans-serif",
        overflow: "hidden",
        animation: "slideUp 0.12s ease-out",
      }}
    >
      {/* Header */}
      <div style={{
        background: "linear-gradient(180deg, #245edb 0%, #1f54cc 60%, #1a49b8 100%)",
        padding: "8px 10px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        borderBottom: "2px solid #1a3f8f",
      }}>
        <img
          src={user?.avatar_url || I("User Accounts")}
          alt={user?.login || "User"}
          style={{ width: 48, height: 48, borderRadius: 4, border: "2px solid rgba(255,255,255,0.5)", flexShrink: 0 }}
        />
        <div>
          <div style={{ color: "white", fontSize: 13, fontWeight: "bold", textShadow: "0 1px 2px rgba(0,0,0,0.4)" }}>
            {user?.name || user?.login || "User"}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ display: "flex", minHeight: 320 }}>

        {/* Left column — programs */}
        <div style={{ flex: 1, background: "white", paddingTop: 6, borderRight: "1px solid #d0cdc8" }}>

          {/* Pinned programs */}
          <MenuItem icon={I("Internet Explorer 6")} label="Internet Explorer" bold onClick={() => open("ie")} />
          <MenuItem icon={I("Outlook Express")} label="Outlook Express" bold onClick={() => {}} />

          <div style={{ height: 1, background: "#d0cdc8", margin: "4px 8px" }} />

          {/* Frequent programs */}
          <MenuItem icon={I("My Documents")} label="My Documents" onClick={() => open("repos")} />
          <MenuItem icon={I("My Computer")} label="My Computer" onClick={() => open("mycomputer")} />
          <MenuItem icon={I("My Pictures")} label="My Pictures" onClick={() => {}} />
          <MenuItem icon={I("My Music")} label="My Music" onClick={() => {}} />
          <MenuItem icon={I("Notepad")} label="Notepad" onClick={() => open("notepad")} />
          <MenuItem icon={I("Calculator")} label="Calculator" onClick={() => open("calculator")} />
          <MenuItem icon={I("Paint")} label="Paint" onClick={() => open("paint")} />
          <MenuItem icon={I("Wordpad")} label="WordPad" onClick={() => open("wordpad")} />

          <div style={{ height: 1, background: "#d0cdc8", margin: "4px 8px" }} />

          {/* All Programs arrow */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "5px 10px", cursor: "default", fontSize: 12, fontWeight: "bold",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "#316ac5"}
            onMouseLeave={e => e.currentTarget.style.background = ""}
          >
            <span style={{ pointerEvents: "none" }}>All Programs</span>
            <span style={{ pointerEvents: "none", fontSize: 10 }}>▶</span>
          </div>
        </div>

        {/* Right column — places */}
        <div style={{ width: 160, background: "#d6e4f7", paddingTop: 6 }}>
          <RightItem icon={I("My Documents")} label="My Documents" onClick={() => open("repos")} />
          <RightItem icon={I("My Pictures")} label="My Pictures" onClick={() => {}} />
          <RightItem icon={I("My Music")} label="My Music" onClick={() => {}} />
          <RightItem icon={I("My Computer")} label="My Computer" onClick={() => open("mycomputer")} />
          <RightItem icon={I("My Network Places")} label="My Network Places" onClick={() => {}} />

          <div style={{ height: 1, background: "#a8bcd8", margin: "4px 8px" }} />

          <RightItem icon={I("Control Panel")} label="Control Panel" onClick={() => {}} />
          <RightItem icon={I("Printers and Faxes")} label="Printers and Faxes" onClick={() => {}} />

          <div style={{ height: 1, background: "#a8bcd8", margin: "4px 8px" }} />

          <RightItem icon={I("Help and Support")} label="Help and Support" onClick={() => {}} />
          <RightItem icon={I("Search")} label="Search" onClick={() => {}} />
          <RightItem icon={I("Run")} label="Run..." onClick={() => open("run")} />
        </div>
      </div>

      {/* Footer — Log Off / Turn Off */}
      <div style={{
        background: "linear-gradient(180deg, #245edb 0%, #1f54cc 60%, #1a49b8 100%)",
        borderTop: "2px solid #1a3f8f",
        display: "flex",
        justifyContent: "flex-end",
        gap: 4,
        padding: "5px 8px",
      }}>
        <FooterBtn icon={I("Switch User")} label="Log Off" onClick={logOff} />
        <FooterBtn icon={I("Restart")} label="Turn Off Computer" onClick={logOff} />
      </div>
    </div>
  );
}

function MenuItem({ icon, label, bold, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "4px 10px", cursor: "default", fontSize: 12,
        fontWeight: bold ? "bold" : "normal",
      }}
      onMouseEnter={e => { e.currentTarget.style.background = "#316ac5"; e.currentTarget.style.color = "white"; }}
      onMouseLeave={e => { e.currentTarget.style.background = ""; e.currentTarget.style.color = ""; }}
    >
      <img src={icon} alt="" style={{ width: 24, height: 24, flexShrink: 0 }} />
      <span style={{ pointerEvents: "none" }}>{label}</span>
    </div>
  );
}

function RightItem({ icon, label, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "4px 10px", cursor: "default", fontSize: 12,
      }}
      onMouseEnter={e => { e.currentTarget.style.background = "#316ac5"; e.currentTarget.style.color = "white"; }}
      onMouseLeave={e => { e.currentTarget.style.background = ""; e.currentTarget.style.color = ""; }}
    >
      <img src={icon} alt="" style={{ width: 20, height: 20, flexShrink: 0 }} />
      <span style={{ pointerEvents: "none" }}>{label}</span>
    </div>
  );
}

function FooterBtn({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 6,
        background: "none", border: "1px solid transparent",
        borderRadius: 3, color: "white",
        fontSize: 11, padding: "4px 10px", cursor: "pointer",
        textShadow: "0 1px 1px rgba(0,0,0,0.4)",
      }}
      onMouseEnter={e => { e.currentTarget.style.border = "1px solid rgba(255,255,255,0.4)"; e.currentTarget.style.background = "rgba(255,255,255,0.15)"; }}
      onMouseLeave={e => { e.currentTarget.style.border = "1px solid transparent"; e.currentTarget.style.background = "none"; }}
    >
      <img src={icon} alt="" style={{ width: 20, height: 20 }} />
      {label}
    </button>
  );
}
