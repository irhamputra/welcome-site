import { useState, useRef, useCallback } from "react";

const FONTS = ["Arial", "Times New Roman", "Courier New", "Tahoma", "Verdana", "Georgia"];
const FONT_SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 36, 48, 72];

export default function WordPadWindow() {
  const editorRef = useRef(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [font, setFont] = useState("Arial");
  const [fontSize, setFontSize] = useState(12);
  const [fontSizeInput, setFontSizeInput] = useState("12");

  const exec = useCallback((cmd, value = null) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, value);
  }, []);

  const isActive = (cmd) => {
    try { return document.queryCommandState(cmd); } catch { return false; }
  };

  const handleFontChange = (f) => {
    setFont(f);
    exec("fontName", f);
  };

  const handleFontSizeChange = (s) => {
    setFontSize(s);
    setFontSizeInput(String(s));
    // execCommand fontSize uses 1-7 scale; use styleWithCSS instead
    exec("styleWithCSS", true);
    exec("fontSize", 4);
    // Override the size with inline style after
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      const spans = editorRef.current?.querySelectorAll("font[size]");
      spans?.forEach(span => { span.removeAttribute("size"); span.style.fontSize = s + "px"; });
    }
  };

  const handleSave = () => {
    const html = editorRef.current?.innerHTML || "";
    const blob = new Blob([html], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "document.rtf";
    a.click();
    setActiveMenu(null);
  };

  const handlePrint = () => {
    const content = editorRef.current?.innerHTML || "";
    const w = window.open("", "_blank");
    w.document.write(`<html><body style="font-family:Arial;font-size:12px;">${content}</body></html>`);
    w.document.close();
    w.print();
    setActiveMenu(null);
  };

  const menuItems = {
    File: [
      { label: "New", action: () => { if (editorRef.current) editorRef.current.innerHTML = ""; setActiveMenu(null); } },
      "---",
      { label: "Save As...", action: handleSave },
      "---",
      { label: "Print...", action: handlePrint },
    ],
    Edit: [
      { label: "Undo", action: () => { exec("undo"); setActiveMenu(null); } },
      { label: "Redo", action: () => { exec("redo"); setActiveMenu(null); } },
      "---",
      { label: "Cut", action: () => { exec("cut"); setActiveMenu(null); } },
      { label: "Copy", action: () => { exec("copy"); setActiveMenu(null); } },
      { label: "Paste", action: () => { exec("paste"); setActiveMenu(null); } },
      "---",
      { label: "Select All", action: () => { exec("selectAll"); setActiveMenu(null); } },
    ],
    View: [
      { label: "Toolbar", disabled: true },
      { label: "Format Bar", disabled: true },
      { label: "Ruler", disabled: true },
      { label: "Status Bar", disabled: true },
    ],
    Insert: [
      { label: "Date and Time...", action: () => {
        exec("insertText", new Date().toLocaleString("en-US"));
        setActiveMenu(null);
      }},
    ],
    Format: [
      { label: "Font...", disabled: true },
      { label: "Bullet Style", action: () => { exec("insertUnorderedList"); setActiveMenu(null); } },
      { label: "Paragraph...", disabled: true },
      { label: "Tabs...", disabled: true },
    ],
    Help: [
      { label: "Help Topics", disabled: true },
      "---",
      { label: "About WordPad", disabled: true },
    ],
  };

  const ToolBtn = ({ cmd, label, children, action }) => {
    const active = cmd ? isActive(cmd) : false;
    return (
      <button
        title={label}
        onMouseDown={e => { e.preventDefault(); action ? action() : exec(cmd); }}
        style={{
          minWidth: 22, height: 22, padding: "0 3px",
          background: active ? "#e8e0c8" : "transparent",
          border: active ? "1px inset #808080" : "1px solid transparent",
          cursor: "default", fontSize: 12, fontWeight: cmd === "bold" ? "bold" : "normal",
          fontStyle: cmd === "italic" ? "italic" : "normal",
          textDecoration: cmd === "underline" ? "underline" : "none",
          display: "flex", alignItems: "center", justifyContent: "center",
          borderRadius: 1, color: "#000",
        }}
        onMouseEnter={e => { if (!active) e.currentTarget.style.border = "1px solid #aca899"; }}
        onMouseLeave={e => { if (!active) e.currentTarget.style.border = "1px solid transparent"; }}
      >
        {children}
      </button>
    );
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", height: "100%", fontFamily: "Tahoma, Arial, sans-serif", fontSize: 12, background: "#f1efe2", overflow: "hidden" }}
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

      {/* Standard Toolbar */}
      <div style={{ display: "flex", alignItems: "center", gap: 1, padding: "2px 6px", borderBottom: "1px solid #aca899", background: "#f1efe2", flexShrink: 0 }}>
        <ToolBtn label="New" action={() => { if (editorRef.current) editorRef.current.innerHTML = ""; }}>🗋</ToolBtn>
        <ToolBtn label="Save" action={handleSave}>💾</ToolBtn>
        <ToolBtn label="Print" action={handlePrint}>🖨</ToolBtn>
        <div style={{ width: 1, height: 20, background: "#aca899", margin: "0 3px" }} />
        <ToolBtn label="Cut" action={() => exec("cut")}>✂</ToolBtn>
        <ToolBtn label="Copy" action={() => exec("copy")}>📋</ToolBtn>
        <ToolBtn label="Paste" action={() => exec("paste")}>📌</ToolBtn>
        <div style={{ width: 1, height: 20, background: "#aca899", margin: "0 3px" }} />
        <ToolBtn label="Undo" action={() => exec("undo")}>↩</ToolBtn>
        <ToolBtn label="Redo" action={() => exec("redo")}>↪</ToolBtn>
      </div>

      {/* Format Toolbar */}
      <div style={{ display: "flex", alignItems: "center", gap: 2, padding: "2px 6px", borderBottom: "1px solid #aca899", background: "#f1efe2", flexShrink: 0 }}>
        {/* Font picker */}
        <select
          value={font}
          onChange={e => handleFontChange(e.target.value)}
          style={{ height: 20, fontSize: 11, fontFamily: font, border: "1px solid #7f9db9", padding: "0 2px", width: 110 }}
        >
          {FONTS.map(f => <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>)}
        </select>
        {/* Font size */}
        <select
          value={fontSize}
          onChange={e => handleFontSizeChange(Number(e.target.value))}
          style={{ height: 20, fontSize: 11, border: "1px solid #7f9db9", padding: "0 2px", width: 46 }}
        >
          {FONT_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <div style={{ width: 1, height: 20, background: "#aca899", margin: "0 2px" }} />
        <ToolBtn cmd="bold" label="Bold"><b>B</b></ToolBtn>
        <ToolBtn cmd="italic" label="Italic"><i>I</i></ToolBtn>
        <ToolBtn cmd="underline" label="Underline"><u>U</u></ToolBtn>
        <div style={{ width: 1, height: 20, background: "#aca899", margin: "0 2px" }} />
        <ToolBtn cmd="justifyLeft" label="Align Left">≡</ToolBtn>
        <ToolBtn cmd="justifyCenter" label="Center">≡</ToolBtn>
        <ToolBtn cmd="justifyRight" label="Align Right">≡</ToolBtn>
        <div style={{ width: 1, height: 20, background: "#aca899", margin: "0 2px" }} />
        <ToolBtn cmd="insertUnorderedList" label="Bullets">•</ToolBtn>
      </div>

      {/* Ruler */}
      <div style={{ height: 16, background: "#f8f6f0", borderBottom: "1px solid #aca899", flexShrink: 0, overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 7, height: 1, background: "#aca899" }} />
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} style={{ position: "absolute", left: 32 + i * 24, top: i % 2 === 0 ? 4 : 8, width: 1, height: i % 2 === 0 ? 8 : 4, background: "#666" }} />
        ))}
      </div>

      {/* Editor */}
      <div style={{ flex: 1, background: "white", overflow: "auto", padding: "0 8px" }}>
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          style={{
            minHeight: "100%", padding: "12px 40px",
            outline: "none", fontSize: fontSize, fontFamily: font,
            lineHeight: 1.6, color: "#000",
            boxShadow: "0 0 8px rgba(0,0,0,0.1)",
            background: "white",
          }}
          onKeyDown={e => {
            if (e.ctrlKey) {
              if (e.key === "b") { e.preventDefault(); exec("bold"); }
              if (e.key === "i") { e.preventDefault(); exec("italic"); }
              if (e.key === "u") { e.preventDefault(); exec("underline"); }
              if (e.key === "z") { e.preventDefault(); exec("undo"); }
              if (e.key === "y") { e.preventDefault(); exec("redo"); }
            }
          }}
        />
      </div>

      {/* Status bar */}
      <div style={{ padding: "1px 6px", background: "#f1efe2", borderTop: "1px solid #aca899", fontSize: 11, color: "#555", flexShrink: 0, height: 18, display: "flex", alignItems: "center" }}>
        For Help, press F1
      </div>
    </div>
  );
}
