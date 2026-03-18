import { useState, useRef, useEffect } from "react";
import { useWindowManager } from "../../../context/windowManager";

const COMMANDS = {
  notepad:           { type: "window", id: "notepad" },
  wordpad:           { type: "window", id: "wordpad" },
  calc:              { type: "window", id: "calculator" },
  mspaint:           { type: "window", id: "paint" },
  paint:             { type: "window", id: "paint" },
  iexplore:          { type: "window", id: "ie" },
  outlook:           { type: "window", id: "outlook" },
  explorer:          { type: "window", id: "repos" },
  control:           { type: "window", id: "mycomputer" },
  "control panel":   { type: "window", id: "mycomputer" },
  "www.google.com":  { type: "url", url: "https://www.google.com" },
  "www.github.com":  { type: "url", url: "https://github.com/irhamputra" },
  "www.linkedin.com":{ type: "url", url: "https://www.linkedin.com/in/muhamad-irham-prasetyo/" },
  shutdown:          { type: "msg", msg: "Shutting down... just kidding 😄" },
  "shutdown /s /t 0":{ type: "msg", msg: "Shutting down... just kidding 😄" },
  winver:            { type: "msg", msg: "Microsoft Windows XP\nVersion 2002 (Build 2600)\nirhamputra.com Edition" },
  cmd:               { type: "msg", msg: "Command Prompt is not available in this version." },
  regedit:           { type: "msg", msg: "Registry Editor is disabled by your administrator." },
};

export default function RunWindow() {
  const { openWindow, closeWindow } = useWindowManager();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [histIdx, setHistIdx] = useState(-1);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleRun = () => {
    const cmd = value.trim().toLowerCase();
    if (!cmd) return;

    setHistory(prev => [value.trim(), ...prev.slice(0, 9)]);
    setHistIdx(-1);

    const matched = COMMANDS[cmd];
    if (matched) {
      if (matched.type === "window") { openWindow(matched.id); closeWindow("run"); return; }
      if (matched.type === "url") { window.open(matched.url, "_blank"); closeWindow("run"); return; }
      if (matched.type === "msg") { setError(matched.msg); return; }
    }

    if (cmd.startsWith("http://") || cmd.startsWith("https://") || cmd.startsWith("www.")) {
      window.open(cmd.startsWith("www.") ? "https://" + cmd : cmd, "_blank");
      closeWindow("run");
      return;
    }

    setError(`Windows cannot find '${value.trim()}'. Make sure you typed the name correctly, and then try again.`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") { handleRun(); return; }
    if (e.key === "Escape") { closeWindow("run"); return; }
    if (e.key === "ArrowUp") {
      const idx = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(idx); setValue(history[idx] || "");
    }
    if (e.key === "ArrowDown") {
      const idx = Math.max(histIdx - 1, -1);
      setHistIdx(idx); setValue(idx === -1 ? "" : history[idx]);
    }
  };

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      height: "100%", width: "100%",
      fontFamily: "Tahoma, Arial, sans-serif", fontSize: 12,
      background: "#ece9d8",
    }}>
      {/* Content area — grows to fill space */}
      <div style={{ flex: 1, padding: "14px 14px 10px", display: "flex", flexDirection: "column", gap: 10, overflow: "hidden" }}>

        {/* Icon + description */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <img
            src="/xp/icons/Windows XP Icons/Run.png"
            alt=""
            style={{ width: 48, height: 48, flexShrink: 0 }}
          />
          <div style={{ fontSize: 12, color: "#000", lineHeight: 1.5, paddingTop: 2 }}>
            Type the name of a program, folder, document, or Internet resource, and Windows will open it for you.
          </div>
        </div>

        {/* Open: input */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <label style={{ fontSize: 12, whiteSpace: "nowrap", minWidth: 38 }}>Open:</label>
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={e => { setValue(e.target.value); setError(""); }}
            onKeyDown={handleKeyDown}
            list="run-cmd-history"
            autoComplete="off"
            style={{
              flex: 1, height: 21,
              border: "2px solid", borderColor: "#808080 #fff #fff #808080",
              outline: "1px solid #000",
              padding: "0 3px",
              fontSize: 12, fontFamily: "Tahoma, Arial, sans-serif",
              background: "white",
            }}
          />
          <datalist id="run-cmd-history">
            {history.map((h, i) => <option key={i} value={h} />)}
          </datalist>
        </div>

        {/* Error / info message */}
        {error && (
          <div style={{
            background: "white",
            border: "2px solid", borderColor: "#808080 #fff #fff #808080",
            outline: "1px solid #000",
            padding: "6px 8px", fontSize: 11, color: "#000",
            lineHeight: 1.6, whiteSpace: "pre-line",
            overflow: "auto", maxHeight: 60,
          }}>
            {error}
          </div>
        )}
      </div>

      {/* Horizontal rule */}
      <div style={{ height: 2, background: "#fff", boxShadow: "0 -1px 0 #808080", flexShrink: 0 }} />

      {/* Button row — always pinned to bottom */}
      <div style={{
        display: "flex", justifyContent: "flex-end", alignItems: "center",
        gap: 6, padding: "8px 10px",
        background: "#ece9d8", flexShrink: 0,
      }}>
        <DlgButton label="OK"       onClick={handleRun} primary />
        <DlgButton label="Cancel"   onClick={() => closeWindow("run")} />
        <DlgButton label="Browse…"  disabled />
      </div>
    </div>
  );
}

function DlgButton({ label, onClick, primary, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 75, height: 23,
        fontFamily: "Tahoma, Arial, sans-serif", fontSize: 12,
        cursor: disabled ? "default" : "pointer",
        color: disabled ? "#aaa" : "#000",
        background: "linear-gradient(180deg, #f8f8f0 0%, #e0dbd0 100%)",
        border: "2px solid", borderColor: "#fff #808080 #808080 #fff",
        outline: primary ? "1px solid #000" : "none",
        padding: 0,
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.filter = "brightness(1.05)"; }}
      onMouseLeave={e => { e.currentTarget.style.filter = ""; }}
      onMouseDown={e => { if (!disabled) { e.preventDefault(); e.currentTarget.style.borderColor = "#808080 #fff #fff #808080"; } }}
      onMouseUp={e => { e.currentTarget.style.borderColor = "#fff #808080 #808080 #fff"; }}
    >
      {label}
    </button>
  );
}
