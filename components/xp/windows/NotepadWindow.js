import { useState, useRef } from "react";
import { useWindowManager } from "../../../context/windowManager";

export default function NotepadWindow({ id = "notepad" }) {
  const { windows, dispatch } = useWindowManager();
  const [text, setText] = useState("");
  const [wordWrap, setWordWrap] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null);
  const [statusBar, setStatusBar] = useState(true);
  const [fontDialog, setFontDialog] = useState(false);
  const [fontSize, setFontSize] = useState(13);
  const textareaRef = useRef(null);

  const lineCount = text.split("\n").length;
  const charCount = text.length;

  const getCaretPos = () => {
    const el = textareaRef.current;
    if (!el) return { ln: 1, col: 1 };
    const val = el.value.substring(0, el.selectionStart);
    const lines = val.split("\n");
    return { ln: lines.length, col: lines[lines.length - 1].length + 1 };
  };

  const [caret, setCaret] = useState({ ln: 1, col: 1 });

  const handleSelectAll = () => {
    const el = textareaRef.current;
    if (el) { el.focus(); el.select(); }
    setActiveMenu(null);
  };

  const handleCopy = () => {
    const el = textareaRef.current;
    if (el) {
      const sel = el.value.substring(el.selectionStart, el.selectionEnd);
      if (sel) navigator.clipboard.writeText(sel).catch(() => {});
    }
    setActiveMenu(null);
  };

  const handlePaste = async () => {
    try {
      const txt = await navigator.clipboard.readText();
      const el = textareaRef.current;
      if (el) {
        const start = el.selectionStart;
        const end = el.selectionEnd;
        const newText = text.substring(0, start) + txt + text.substring(end);
        setText(newText);
      }
    } catch {}
    setActiveMenu(null);
  };

  const handleSave = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "document.txt";
    a.click();
    setActiveMenu(null);
  };

  const insertDateTime = () => {
    const now = new Date();
    const str = now.toLocaleTimeString("en-US") + " " + now.toLocaleDateString("en-US");
    const el = textareaRef.current;
    if (el) {
      const start = el.selectionStart;
      setText(text.substring(0, start) + str + text.substring(el.selectionEnd));
    }
    setActiveMenu(null);
  };

  const menuItems = {
    File: [
      { label: "New", action: () => { setText(""); setActiveMenu(null); } },
      "---",
      { label: "Save As...", action: handleSave },
      "---",
      { label: "Print...", disabled: true },
    ],
    Edit: [
      { label: "Undo", disabled: true },
      "---",
      { label: "Cut", disabled: true },
      { label: "Copy", action: handleCopy },
      { label: "Paste", action: handlePaste },
      { label: "Delete", disabled: true },
      "---",
      { label: "Find...", disabled: true },
      { label: "Find Next", disabled: true },
      { label: "Replace...", disabled: true },
      { label: "Go To...", disabled: true },
      "---",
      { label: "Select All", action: handleSelectAll },
      { label: "Time/Date", action: insertDateTime },
    ],
    Format: [
      { label: `Word Wrap ${wordWrap ? "✓" : ""}`, action: () => { setWordWrap(!wordWrap); setActiveMenu(null); } },
      { label: "Font...", action: () => { setFontDialog(true); setActiveMenu(null); } },
    ],
    View: [
      { label: `Status Bar ${statusBar ? "✓" : ""}`, action: () => { setStatusBar(!statusBar); setActiveMenu(null); } },
    ],
    Help: [
      { label: "Help Topics", disabled: true },
      "---",
      { label: "About Notepad", disabled: true },
    ],
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", height: "100%", fontFamily: "Tahoma, Arial, sans-serif", fontSize: 12, background: "white", overflow: "hidden" }}
      onClick={() => setActiveMenu(null)}
    >
      {/* Menu Bar */}
      <div
        style={{ display: "flex", borderBottom: "1px solid #aca899", background: "#f1efe2", padding: "1px 4px", gap: 2, flexShrink: 0 }}
        onClick={e => e.stopPropagation()}
      >
        {Object.keys(menuItems).map(menu => (
          <div key={menu} style={{ position: "relative" }}>
            <div
              onClick={() => setActiveMenu(activeMenu === menu ? null : menu)}
              style={{ padding: "2px 6px", cursor: "default", background: activeMenu === menu ? "#316ac5" : "transparent", color: activeMenu === menu ? "white" : "black", borderRadius: 2 }}
            >
              {menu}
            </div>
            {activeMenu === menu && (
              <div style={{ position: "absolute", top: "100%", left: 0, background: "white", border: "1px solid #aca899", boxShadow: "2px 2px 4px rgba(0,0,0,0.2)", zIndex: 1000, minWidth: 160, padding: "2px 0" }}>
                {menuItems[menu].map((item, i) =>
                  item === "---" ? (
                    <div key={i} style={{ height: 1, background: "#aca899", margin: "2px 4px" }} />
                  ) : (
                    <div key={i}
                      style={{ padding: "4px 20px", cursor: "default", color: item.disabled ? "#aaa" : "black" }}
                      onMouseEnter={e => { if (!item.disabled) { e.currentTarget.style.background = "#316ac5"; e.currentTarget.style.color = "white"; } }}
                      onMouseLeave={e => { e.currentTarget.style.background = ""; e.currentTarget.style.color = item.disabled ? "#aaa" : "black"; }}
                      onClick={() => item.action?.()}
                    >
                      {item.label}
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Text Area */}
      <textarea
        ref={textareaRef}
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyUp={() => setCaret(getCaretPos())}
        onClick={() => setCaret(getCaretPos())}
        spellCheck={false}
        style={{
          flex: 1,
          border: "none", outline: "none", resize: "none",
          padding: "4px 6px",
          fontSize,
          fontFamily: "Courier New, Courier, monospace",
          lineHeight: 1.5,
          whiteSpace: wordWrap ? "pre-wrap" : "pre",
          overflowX: wordWrap ? "hidden" : "auto",
          overflowY: "auto",
          background: "white",
          color: "#000",
        }}
      />

      {/* Status Bar */}
      {statusBar && (
        <div style={{ display: "flex", gap: 16, padding: "1px 6px", background: "#f1efe2", borderTop: "1px solid #aca899", fontSize: 11, color: "#333", flexShrink: 0, height: 18 }}>
          <span>Ln {caret.ln}, Col {caret.col}</span>
          <span>{charCount} chars</span>
          <span>{lineCount} lines</span>
        </div>
      )}

      {/* Font dialog */}
      {fontDialog && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
          <div className="window" style={{ width: 240, padding: 0 }}>
            <div className="title-bar">
              <div className="title-bar-text">Font</div>
              <div className="title-bar-controls"><button aria-label="Close" onClick={() => setFontDialog(false)} /></div>
            </div>
            <div className="window-body" style={{ padding: 12 }}>
              <div style={{ marginBottom: 8, fontSize: 12 }}>Size:</div>
              <select value={fontSize} onChange={e => setFontSize(Number(e.target.value))} style={{ width: "100%", marginBottom: 12, fontSize: 12 }}>
                {[9, 10, 11, 12, 13, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}>
                <button onClick={() => setFontDialog(false)} style={{ padding: "3px 16px", fontSize: 12 }}>OK</button>
                <button onClick={() => setFontDialog(false)} style={{ padding: "3px 16px", fontSize: 12 }}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
