import { useEffect, useState } from "react";

function TrayIcon({ src, title }) {
  return (
    <img
      src={src}
      alt={title}
      title={title}
      style={{ width: 16, height: 16, cursor: "default", flexShrink: 0 }}
    />
  );
}
import { useWindowManager } from "../../context/windowManager";

export default function Taskbar() {
  const {
    windows,
    windowOrder,
    toggleStartMenu,
    focusWindow,
    minimizeWindow,
    restoreWindow,
  } = useWindowManager();

  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const WINDOW_ICONS = {
    repos: "/xp/icons/Windows XP Icons/My Documents.png",
    profile: "/xp/icons/Windows XP Icons/User Accounts.png",
    mycomputer: "/xp/icons/Windows XP Icons/My Computer.png",
    recyclebin: "/xp/icons/Windows XP Icons/Recycle Bin (empty).png",
    ie: "/xp/icons/Windows XP Icons/Internet Explorer 6.png",
  };

  const openWindows = windowOrder
    .map((id) => windows[id])
    .filter((w) => w?.isOpen);

  const handleWindowClick = (win) => {
    if (win.isMinimized) {
      restoreWindow(win.id);
    } else {
      // If it's the top window, minimize it; otherwise focus it
      const topId = windowOrder[windowOrder.length - 1];
      if (win.id === topId) {
        minimizeWindow(win.id);
      } else {
        focusWindow(win.id);
      }
    }
  };

  return (
    <div className="xp-taskbar" onClick={(e) => e.stopPropagation()}>
      <button className="xp-start-button" onClick={toggleStartMenu}>
        <img src="/xp/icons/Windows XP.ico" alt="" />
        <span>start</span>
      </button>

      <div className="xp-taskbar-windows">
        {openWindows.map((win) => (
          <button
            key={win.id}
            className={`xp-taskbar-window-btn ${!win.isMinimized && win.id === windowOrder[windowOrder.length - 1] ? "active" : ""}`}
            onClick={() => handleWindowClick(win)}
          >
            {WINDOW_ICONS[win.id] && (
              <img src={WINDOW_ICONS[win.id]} alt="" style={{ width: 14, height: 14, flexShrink: 0 }} />
            )}
            {win.title}
          </button>
        ))}
      </div>

      <div className="xp-system-tray">
        <TrayIcon src="/xp/icons/Windows XP Icons/Security Center.png" title="Security Center" />
        <TrayIcon src="/xp/icons/Windows XP Icons/Volume.png" title="Volume" />
        <TrayIcon src="/xp/icons/Windows XP Icons/Network Connection.png" title="Network Connection" />
        <TrayIcon src="/xp/icons/Windows XP Icons/MSN Messenger.png" title="MSN Messenger" />
        <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.2)", margin: "0 2px" }} />
        <span style={{ whiteSpace: "nowrap", fontSize: 11 }}>{time}</span>
      </div>
    </div>
  );
}
