import { useEffect, useRef, useState } from "react";

export default function ContextMenu({ x, y, items, onClose }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x, y });

  // Clamp position so menu stays on screen
  useEffect(() => {
    if (!ref.current) return;
    const { offsetWidth: w, offsetHeight: h } = ref.current;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    setPos({
      x: Math.min(x, vw - w - 4),
      y: Math.min(y, vh - h - 4),
    });
  }, [x, y]);

  // Close on outside click or Escape
  useEffect(() => {
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        background: "white",
        border: "1px solid #808080",
        boxShadow: "2px 2px 5px rgba(0,0,0,0.35)",
        zIndex: 99998,
        minWidth: 170,
        padding: "2px 0",
        fontFamily: "Tahoma, sans-serif",
        fontSize: 12,
        userSelect: "none",
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {items.map((item, i) =>
        item === "---" ? (
          <div
            key={i}
            style={{ height: 1, background: "#d4d0c8", margin: "2px 4px" }}
          />
        ) : (
          <ContextMenuItem key={i} item={item} onClose={onClose} />
        )
      )}
    </div>
  );
}

function ContextMenuItem({ item, onClose }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() => {
        if (!item.disabled) {
          item.onClick?.();
          onClose();
        }
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "4px 24px",
        cursor: item.disabled ? "default" : "default",
        color: item.disabled ? "#808080" : hovered ? "white" : "#000",
        background: hovered && !item.disabled ? "#316ac5" : "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
      }}
    >
      <span>{item.label}</span>
      {item.hasSubmenu && (
        <span style={{ fontSize: 9, marginLeft: 8 }}>▶</span>
      )}
    </div>
  );
}
