import { useEffect, useRef, useState, useCallback } from "react";

const COLORS = [
  "#000000", "#808080", "#800000", "#808000", "#008000", "#008080", "#000080", "#800080",
  "#C0C0C0", "#FFFFFF", "#FF0000", "#FFFF00", "#00FF00", "#00FFFF", "#0000FF", "#FF00FF",
  "#FF8040", "#804000", "#80FF00", "#004040", "#0080FF", "#8000FF", "#FF0080", "#FF8080",
  "#FFFF80", "#80FF80", "#80FFFF", "#8080FF", "#FF80FF", "#FF4040", "#40FF40", "#4040FF",
];

const TOOLS = [
  { id: "select",   icon: "⬚", label: "Select" },
  { id: "eraser",   icon: "◻", label: "Eraser" },
  { id: "fill",     icon: "⬡", label: "Fill" },
  { id: "picker",   icon: "✒", label: "Color Picker" },
  { id: "pencil",   icon: "✏", label: "Pencil" },
  { id: "brush",    icon: "🖌", label: "Brush" },
  { id: "line",     icon: "╱", label: "Line" },
  { id: "rect",     icon: "□", label: "Rectangle" },
  { id: "ellipse",  icon: "○", label: "Ellipse" },
  { id: "text",     icon: "A", label: "Text" },
];

const BRUSH_SIZES = [2, 4, 6, 10];

export default function PaintWindow() {
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  const containerRef = useRef(null);

  const [tool, setTool] = useState("pencil");
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [brushSize, setBrushSize] = useState(2);
  const [activeMenu, setActiveMenu] = useState(null);
  const [statusText, setStatusText] = useState("For Help, click Help Topics on the Help Menu.");
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [canvasSize, setCanvasSize] = useState({ w: 600, h: 400 });

  const drawing = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const lastPos = useRef({ x: 0, y: 0 });
  const snapshotRef = useRef(null);
  const textInputRef = useRef(null);
  const [textPos, setTextPos] = useState(null);
  const [textValue, setTextValue] = useState("");

  // Initialise canvas with white background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: Math.round((clientX - rect.left) * scaleX),
      y: Math.round((clientY - rect.top) * scaleY),
    };
  };

  const floodFill = useCallback((ctx, x, y, fillColor) => {
    const canvas = canvasRef.current;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const idx = (y * canvas.width + x) * 4;
    const targetR = data[idx], targetG = data[idx + 1], targetB = data[idx + 2], targetA = data[idx + 3];

    const fill = fillColor.replace("#", "");
    const fillR = parseInt(fill.substring(0, 2), 16);
    const fillG = parseInt(fill.substring(2, 4), 16);
    const fillB = parseInt(fill.substring(4, 6), 16);

    if (targetR === fillR && targetG === fillG && targetB === fillB) return;

    const match = (i) =>
      Math.abs(data[i] - targetR) < 32 &&
      Math.abs(data[i + 1] - targetG) < 32 &&
      Math.abs(data[i + 2] - targetB) < 32 &&
      Math.abs(data[i + 3] - targetA) < 32;

    const stack = [[x, y]];
    const visited = new Uint8Array(canvas.width * canvas.height);

    while (stack.length > 0) {
      const [cx, cy] = stack.pop();
      if (cx < 0 || cx >= canvas.width || cy < 0 || cy >= canvas.height) continue;
      const i = (cy * canvas.width + cx) * 4;
      if (visited[cy * canvas.width + cx]) continue;
      if (!match(i)) continue;
      visited[cy * canvas.width + cx] = 1;
      data[i] = fillR; data[i + 1] = fillG; data[i + 2] = fillB; data[i + 3] = 255;
      stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
    }
    ctx.putImageData(imageData, 0, 0);
  }, []);

  const drawShape = useCallback((ctx, tool, start, end, color, size, fill) => {
    ctx.strokeStyle = color;
    ctx.fillStyle = fill;
    ctx.lineWidth = size;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (tool === "line") {
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    } else if (tool === "rect") {
      const w = end.x - start.x;
      const h = end.y - start.y;
      ctx.strokeRect(start.x, start.y, w, h);
    } else if (tool === "ellipse") {
      const rx = Math.abs(end.x - start.x) / 2;
      const ry = Math.abs(end.y - start.y) / 2;
      const cx = start.x + (end.x - start.x) / 2;
      const cy = start.y + (end.y - start.y) / 2;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
  }, []);

  const handleMouseDown = useCallback((e) => {
    if (e.button !== undefined && e.button !== 0 && e.button !== 2) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const pos = getPos(e);
    const color = e.button === 2 ? bgColor : fgColor;

    if (tool === "text") {
      setTextPos(pos);
      setTextValue("");
      setTimeout(() => textInputRef.current?.focus(), 50);
      return;
    }

    if (tool === "picker") {
      const pixel = ctx.getImageData(pos.x, pos.y, 1, 1).data;
      const hex = "#" + [pixel[0], pixel[1], pixel[2]].map(v => v.toString(16).padStart(2, "0")).join("");
      if (e.button === 2) setBgColor(hex); else setFgColor(hex);
      return;
    }

    if (tool === "fill") {
      floodFill(ctx, pos.x, pos.y, color);
      return;
    }

    drawing.current = true;
    startPos.current = pos;
    lastPos.current = pos;

    if (["line", "rect", "ellipse"].includes(tool)) {
      snapshotRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }

    if (tool === "pencil" || tool === "brush") {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      ctx.strokeStyle = color;
      ctx.lineWidth = tool === "brush" ? brushSize * 2 : brushSize;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    }
    if (tool === "eraser") {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }
    e.preventDefault();
  }, [tool, fgColor, bgColor, brushSize, floodFill]);

  const handleMouseMove = useCallback((e) => {
    const pos = getPos(e);
    setCursorPos(pos);
    setStatusText(`${pos.x}, ${pos.y}`);

    if (!drawing.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const color = fgColor;

    if (tool === "pencil" || tool === "brush") {
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      lastPos.current = pos;
    } else if (tool === "eraser") {
      const sz = brushSize * 4;
      ctx.clearRect(pos.x - sz / 2, pos.y - sz / 2, sz, sz);
      ctx.fillStyle = bgColor;
      ctx.fillRect(pos.x - sz / 2, pos.y - sz / 2, sz, sz);
      lastPos.current = pos;
    } else if (["line", "rect", "ellipse"].includes(tool)) {
      // Draw on overlay canvas
      const overlay = overlayRef.current;
      const octx = overlay.getContext("2d");
      octx.clearRect(0, 0, overlay.width, overlay.height);
      drawShape(octx, tool, startPos.current, pos, color, brushSize, "transparent");
    }
    e.preventDefault();
  }, [tool, fgColor, bgColor, brushSize, drawShape]);

  const handleMouseUp = useCallback((e) => {
    if (!drawing.current) return;
    drawing.current = false;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const pos = getPos(e);
    const color = fgColor;

    if (["line", "rect", "ellipse"].includes(tool)) {
      // Commit overlay to main canvas
      const overlay = overlayRef.current;
      const octx = overlay.getContext("2d");
      octx.clearRect(0, 0, overlay.width, overlay.height);
      drawShape(ctx, tool, startPos.current, pos, color, brushSize, "transparent");
    }
  }, [tool, fgColor, brushSize, drawShape]);

  const commitText = useCallback(() => {
    if (!textPos || !textValue.trim()) { setTextPos(null); return; }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.font = `${brushSize * 6 + 10}px Tahoma, sans-serif`;
    ctx.fillStyle = fgColor;
    ctx.fillText(textValue, textPos.x, textPos.y);
    setTextPos(null);
    setTextValue("");
  }, [textPos, textValue, fgColor, brushSize]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const saveCanvas = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "painting.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const getCursor = () => {
    switch (tool) {
      case "pencil":  return "crosshair";
      case "brush":   return "crosshair";
      case "eraser":  return "cell";
      case "fill":    return "crosshair";
      case "picker":  return "crosshair";
      case "text":    return "text";
      default:        return "crosshair";
    }
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", height: "100%", fontFamily: "Tahoma, Arial, sans-serif", fontSize: "12px", background: "#d4d0c8", overflow: "hidden", userSelect: "none" }}
      onClick={() => setActiveMenu(null)}
    >
      {/* Menu Bar */}
      <div
        style={{ display: "flex", borderBottom: "1px solid #aca899", background: "#f1efe2", padding: "1px 4px", gap: "2px", flexShrink: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {["File", "Edit", "View", "Image", "Colors", "Help"].map((menu) => (
          <div
            key={menu}
            onClick={() => setActiveMenu(activeMenu === menu ? null : menu)}
            style={{ padding: "2px 6px", cursor: "default", background: activeMenu === menu ? "#316ac5" : "transparent", color: activeMenu === menu ? "white" : "black", borderRadius: "2px", position: "relative" }}
          >
            {menu}
            {activeMenu === menu && (
              <div style={{ position: "absolute", top: "100%", left: 0, background: "white", border: "1px solid #aca899", boxShadow: "2px 2px 4px rgba(0,0,0,0.2)", zIndex: 1000, minWidth: "160px", padding: "2px 0" }}>
                {getPaintMenu(menu, { clearCanvas, saveCanvas }).map((item, i) =>
                  item === "---" ? (
                    <div key={i} style={{ height: 1, background: "#aca899", margin: "2px 4px" }} />
                  ) : (
                    <div
                      key={i}
                      style={{ padding: "4px 20px", cursor: "default", color: item.disabled ? "#aaa" : "black" }}
                      onMouseEnter={(e) => { if (!item.disabled) { e.currentTarget.style.background = "#316ac5"; e.currentTarget.style.color = "white"; } }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = ""; e.currentTarget.style.color = item.disabled ? "#aaa" : "black"; }}
                      onClick={() => { if (item.action) item.action(); setActiveMenu(null); }}
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

      {/* Main area */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Tool Box */}
        <div style={{ width: 52, background: "#d4d0c8", borderRight: "1px solid #aca899", padding: "4px 2px", display: "flex", flexDirection: "column", gap: 1, flexShrink: 0, overflowY: "auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            {TOOLS.map((t) => (
              <button
                key={t.id}
                title={t.label}
                onClick={() => { setTool(t.id); setTextPos(null); }}
                style={{
                  width: 22, height: 22,
                  background: tool === t.id ? "#e8e4d0" : "#d4d0c8",
                  border: tool === t.id ? "2px inset #808080" : "2px outset #ffffff",
                  cursor: "default",
                  fontSize: t.id === "text" ? 13 : 12,
                  fontWeight: t.id === "text" ? "bold" : "normal",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  padding: 0,
                  color: "#000",
                }}
              >
                {t.icon}
              </button>
            ))}
          </div>

          {/* Brush size */}
          <div style={{ marginTop: 6, padding: "2px", border: "1px inset #808080", background: "#d4d0c8" }}>
            {BRUSH_SIZES.map((s) => (
              <div
                key={s}
                onClick={() => setBrushSize(s)}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 14, cursor: "default", background: brushSize === s ? "#316ac5" : "transparent" }}
              >
                <div style={{ width: s * 3, height: s, background: brushSize === s ? "white" : "#000", borderRadius: s }} />
              </div>
            ))}
          </div>

          {/* FG / BG color swatches */}
          <div style={{ marginTop: 6, position: "relative", height: 30, width: 44 }}>
            <div
              style={{ position: "absolute", bottom: 0, right: 0, width: 20, height: 20, background: bgColor, border: "1px solid #000", cursor: "pointer" }}
              title="Background color"
              onClick={() => {}}
            />
            <div
              style={{ position: "absolute", top: 0, left: 0, width: 20, height: 20, background: fgColor, border: "1px solid #000", cursor: "pointer", zIndex: 1 }}
              title="Foreground color"
              onClick={() => {}}
            />
          </div>
        </div>

        {/* Canvas area */}
        <div
          ref={containerRef}
          style={{ flex: 1, overflow: "auto", background: "#808080", padding: "8px", display: "flex", alignItems: "flex-start", justifyContent: "flex-start" }}
        >
          <div style={{ position: "relative", display: "inline-block", boxShadow: "2px 2px 6px rgba(0,0,0,0.4)" }}>
            <canvas
              ref={canvasRef}
              width={canvasSize.w}
              height={canvasSize.h}
              style={{ display: "block", cursor: getCursor() }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onContextMenu={(e) => { e.preventDefault(); handleMouseDown(e); }}
            />
            {/* Overlay canvas for shape preview */}
            <canvas
              ref={overlayRef}
              width={canvasSize.w}
              height={canvasSize.h}
              style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
            />
            {/* Text input overlay */}
            {textPos && (
              <input
                ref={textInputRef}
                type="text"
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                onBlur={commitText}
                onKeyDown={(e) => { if (e.key === "Enter") commitText(); if (e.key === "Escape") { setTextPos(null); setTextValue(""); } }}
                style={{
                  position: "absolute",
                  left: textPos.x,
                  top: textPos.y - (brushSize * 6 + 10),
                  background: "transparent",
                  border: "1px dashed #316ac5",
                  outline: "none",
                  fontSize: brushSize * 6 + 10,
                  fontFamily: "Tahoma, sans-serif",
                  color: fgColor,
                  minWidth: 60,
                  padding: 0,
                }}
              />
            )}
            {/* Resize handles */}
            <ResizeHandle pos="right" canvasSize={canvasSize} setCanvasSize={setCanvasSize} canvasRef={canvasRef} />
            <ResizeHandle pos="bottom" canvasSize={canvasSize} setCanvasSize={setCanvasSize} canvasRef={canvasRef} />
            <ResizeHandle pos="corner" canvasSize={canvasSize} setCanvasSize={setCanvasSize} canvasRef={canvasRef} />
          </div>
        </div>
      </div>

      {/* Color Palette */}
      <div style={{ display: "flex", alignItems: "center", gap: 2, padding: "3px 6px", background: "#d4d0c8", borderTop: "1px solid #aca899", flexShrink: 0 }}>
        {/* FG/BG swatch */}
        <div style={{ position: "relative", width: 28, height: 22, marginRight: 4, flexShrink: 0 }}>
          <div style={{ position: "absolute", bottom: 0, right: 0, width: 16, height: 16, background: bgColor, border: "1px solid #000" }} />
          <div style={{ position: "absolute", top: 0, left: 0, width: 16, height: 16, background: fgColor, border: "1px solid #000", zIndex: 1 }} />
        </div>
        {/* Palette */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 1, width: 260 }}>
          {COLORS.map((c) => (
            <div
              key={c}
              title={c}
              onClick={() => setFgColor(c)}
              onContextMenu={(e) => { e.preventDefault(); setBgColor(c); }}
              style={{ width: 14, height: 14, background: c, border: fgColor === c ? "2px inset #fff" : "1px solid #808080", cursor: "pointer", flexShrink: 0 }}
            />
          ))}
        </div>
      </div>

      {/* Status bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "1px 6px", background: "#d4d0c8", borderTop: "1px solid #aca899", fontSize: "11px", color: "#000", flexShrink: 0, height: 18 }}>
        <span style={{ flex: 1 }}>{statusText}</span>
        <span>{cursorPos.x}, {cursorPos.y}</span>
        <span>{canvasSize.w}x{canvasSize.h}</span>
      </div>
    </div>
  );
}

/* ─── Resize Handle ─────────────────────────────────────────────────── */
function ResizeHandle({ pos, canvasSize, setCanvasSize, canvasRef }) {
  const dragging = useRef(false);
  const startRef = useRef({ x: 0, y: 0, w: 0, h: 0 });

  const style = {
    position: "absolute",
    width: 8, height: 8,
    background: "#d4d0c8",
    border: "1px solid #000",
    cursor: pos === "right" ? "e-resize" : pos === "bottom" ? "s-resize" : "se-resize",
    ...(pos === "right"  && { right: -5, top: "50%", transform: "translateY(-50%)" }),
    ...(pos === "bottom" && { bottom: -5, left: "50%", transform: "translateX(-50%)" }),
    ...(pos === "corner" && { right: -5, bottom: -5 }),
  };

  const onMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragging.current = true;
    startRef.current = { x: e.clientX, y: e.clientY, w: canvasSize.w, h: canvasSize.h };

    const onMove = (me) => {
      if (!dragging.current) return;
      const dx = me.clientX - startRef.current.x;
      const dy = me.clientY - startRef.current.y;
      const newW = pos === "bottom" ? startRef.current.w : Math.max(100, startRef.current.w + dx);
      const newH = pos === "right"  ? startRef.current.h : Math.max(100, startRef.current.h + dy);

      // Preserve existing drawing
      const canvas = canvasRef.current;
      const snapshot = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
      setCanvasSize({ w: newW, h: newH });
      // Restore after resize (useEffect in parent handles this)
      setTimeout(() => {
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.putImageData(snapshot, 0, 0);
      }, 0);
    };
    const onUp = () => {
      dragging.current = false;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  return <div style={style} onMouseDown={onMouseDown} />;
}

/* ─── Menu items ────────────────────────────────────────────────────── */
function getPaintMenu(menu, { clearCanvas, saveCanvas }) {
  switch (menu) {
    case "File":
      return [
        { label: "New", action: clearCanvas },
        "---",
        { label: "Save As...", action: saveCanvas },
        "---",
        { label: "Print...", disabled: true },
      ];
    case "Edit":
      return [
        { label: "Undo", disabled: true },
        "---",
        { label: "Select All", disabled: true },
        { label: "Clear Selection", disabled: true },
        "---",
        { label: "Copy", disabled: true },
        { label: "Paste", disabled: true },
      ];
    case "View":
      return [
        { label: "Tool Box", disabled: true },
        { label: "Color Box", disabled: true },
        { label: "Status Bar", disabled: true },
        "---",
        { label: "Zoom", disabled: true },
      ];
    case "Image":
      return [
        { label: "Flip/Rotate...", disabled: true },
        { label: "Stretch/Skew...", disabled: true },
        "---",
        { label: "Invert Colors", disabled: true },
        { label: "Attributes...", disabled: true },
        "---",
        { label: "Clear Image", action: clearCanvas },
      ];
    case "Colors":
      return [
        { label: "Edit Colors...", disabled: true },
      ];
    case "Help":
      return [
        { label: "Help Topics", disabled: true },
        "---",
        { label: "About Paint", disabled: true },
      ];
    default:
      return [];
  }
}
