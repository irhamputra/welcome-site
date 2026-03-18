import { useState } from "react";

export default function DesktopIcon({ icon, label, onDoubleClick }) {
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
      onBlur={() => setSelected(false)}
      tabIndex={0}
    >
      <img src={icon} alt={label} draggable={false} />
      <span>{label}</span>
    </div>
  );
}
