import { useEffect, useRef, useState } from "react";
import { useWindowManager } from "../../context/windowManager";

export default function Window({ id, children }) {
  const {
    windows,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    updatePosition,
  } = useWindowManager();

  const [isMobile, setIsMobile] = useState(false);
  const windowRef = useRef(null);
  const dragState = useRef(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const win = windows[id];
  if (!win || !win.isOpen || win.isMinimized) return null;

  const handleTitleBarMouseDown = (e) => {
    if (isMobile || win.isMaximized) return;
    if (e.button !== 0) return;
    // Don't drag when clicking the control buttons
    if (e.target.closest(".title-bar-controls")) return;

    focusWindow(id);

    const el = windowRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    dragState.current = {
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startElX: rect.left,
      startElY: rect.top,
    };

    const onMouseMove = (moveEvent) => {
      if (!dragState.current) return;
      const dx = moveEvent.clientX - dragState.current.startMouseX;
      const dy = moveEvent.clientY - dragState.current.startMouseY;
      let newX = dragState.current.startElX + dx;
      let newY = dragState.current.startElY + dy;

      // Bound within viewport
      const parentWidth = window.innerWidth;
      const parentHeight = window.innerHeight;
      newX = Math.max(0, Math.min(newX, parentWidth - el.offsetWidth));
      newY = Math.max(0, Math.min(newY, parentHeight - el.offsetHeight));

      el.style.left = newX + "px";
      el.style.top = newY + "px";
    };

    const onMouseUp = (upEvent) => {
      if (!dragState.current) return;
      const dx = upEvent.clientX - dragState.current.startMouseX;
      const dy = upEvent.clientY - dragState.current.startMouseY;
      let newX = dragState.current.startElX + dx;
      let newY = dragState.current.startElY + dy;

      const parentWidth = window.innerWidth;
      const parentHeight = window.innerHeight;
      newX = Math.max(0, Math.min(newX, parentWidth - el.offsetWidth));
      newY = Math.max(0, Math.min(newY, parentHeight - el.offsetHeight));

      updatePosition(id, { x: newX, y: newY });
      dragState.current = null;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    e.preventDefault();
  };

  const isFullscreen = isMobile || win.isMaximized;

  const style = isFullscreen
    ? {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "calc(100% - 40px)",
        zIndex: win.zIndex,
        borderRadius: 0,
      }
    : {
        position: "fixed",
        top: win.position.y,
        left: win.position.x,
        width: win.width,
        height: win.height,
        zIndex: win.zIndex,
      };

  return (
    <div
      ref={windowRef}
      className="window"
      style={style}
      onMouseDown={() => focusWindow(id)}
    >
      <div className="title-bar" onMouseDown={handleTitleBarMouseDown} style={{ cursor: isFullscreen ? "default" : "move" }}>
        <div className="title-bar-text" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0, flex: 1 }}>{win.title}</div>
        <div className="title-bar-controls">
          <button aria-label="Minimize" onClick={() => minimizeWindow(id)} />
          <button aria-label="Maximize" onClick={() => maximizeWindow(id)} />
          <button aria-label="Close" onClick={() => closeWindow(id)} />
        </div>
      </div>
      <div
        className="window-body"
        style={{
          height: "calc(100% - 28px)",
          overflow: "hidden",
          margin: 0,
          padding: 0,
        }}
      >
        {children}
      </div>
    </div>
  );
}
