import { useState } from "react";

export default function DesktopIcon({ icon, label, onDoubleClick, onContextMenu }) {
  const [selected, setSelected] = useState(false);

  return (
    <div
      className={`xp-desktop-icon ${selected ? "selected" : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        setSelected(true);
      }}
      onDoubleClick={() => {
        onDoubleClick?.();
        setSelected(false);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setSelected(true);
        onContextMenu?.(e);
      }}
      onBlur={() => setSelected(false)}
      tabIndex={0}
    >
      <img src={icon} alt={label} draggable={false} />
      <span>{label}</span>
    </div>
  );
}
