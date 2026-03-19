import { useEffect, useState, useRef, useCallback } from "react";
import { useWindowManager } from "../../context/windowManager";
import DesktopIcon from "./DesktopIcon";
import Taskbar from "./Taskbar";
import StartMenu from "./StartMenu";
import Window from "./Window";
import ReposWindow from "./windows/ReposWindow";
import ProfileWindow from "./windows/ProfileWindow";
import MyComputerWindow from "./windows/MyComputerWindow";
import RecycleBinWindow from "./windows/RecycleBinWindow";
import InternetExplorerWindow from "./windows/InternetExplorerWindow";
import OutlookExpressWindow from "./windows/OutlookExpressWindow";
import PaintWindow from "./windows/PaintWindow";
import NotepadWindow from "./windows/NotepadWindow";
import WordPadWindow from "./windows/WordPadWindow";
import CalculatorWindow from "./windows/CalculatorWindow";
import RunWindow from "./windows/RunWindow";
import MSNMessengerWindow from "./windows/MSNMessengerWindow";
import MinesweeperWindow from "./windows/MinesweeperWindow";
import BSODScreen from "./BSODScreen";
import BalloonNotification from "./BalloonNotification";
import ContextMenu from "./ContextMenu";

const STATIC_ICONS = [
  { id: "mycomputer", icon: "/xp/icons/Windows XP Icons/My Computer.png", label: "My Computer" },
  { id: "repos", icon: "/xp/icons/Windows XP Icons/My Documents.png", label: "My Documents" },
  { id: "ie", icon: "/xp/icons/Windows XP Icons/Internet Explorer 6.png", label: "Internet Explorer" },
  { id: "outlook", icon: "/xp/icons/Windows XP Icons/Outlook Express.png", label: "Outlook Express" },
  { id: "paint", icon: "/xp/icons/Windows XP Icons/Paint.png", label: "Paint" },
  { id: "minesweeper", icon: "/xp/icons/Windows XP Icons/Minesweeper.png", label: "Minesweeper" },
];

// Konami code sequence
const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];

function getIconMenu(id, openWindow, emptyBin, binEmpty) {
  switch (id) {
    case "recyclebin":
      return [
        { label: "Open", onClick: () => openWindow("recyclebin") },
        { label: "Empty Recycle Bin", onClick: () => emptyBin(), disabled: binEmpty },
        "---",
        { label: "Properties", disabled: true },
      ];
    case "mycomputer":
      return [
        { label: "Open", onClick: () => openWindow("mycomputer") },
        { label: "Explore", onClick: () => openWindow("mycomputer") },
        "---",
        { label: "Create Shortcut", disabled: true },
        { label: "Properties", onClick: () => openWindow("profile") },
      ];
    case "repos":
      return [
        { label: "Open", onClick: () => openWindow("repos") },
        { label: "Explore", onClick: () => openWindow("repos") },
        "---",
        { label: "Create Shortcut", disabled: true },
        { label: "Rename", disabled: true },
        { label: "Properties", disabled: true },
      ];
    default:
      return [
        { label: "Open", onClick: () => openWindow(id) },
        "---",
        { label: "Create Shortcut", disabled: true },
        { label: "Rename", disabled: true },
        { label: "Properties", disabled: true },
      ];
  }
}

export default function Desktop({ user, repos }) {
  const { openWindow, closeStartMenu, recyclebin, emptyBin } = useWindowManager();
  const recycleBinIcon = recyclebin.length > 0
    ? "/xp/icons/Windows XP Icons/Recycle Bin (full).png"
    : "/xp/icons/Windows XP Icons/Recycle Bin (empty).png";

  const DESKTOP_ICONS = [
    ...STATIC_ICONS.slice(0, 2),
    { id: "recyclebin", icon: recycleBinIcon, label: "Recycle Bin" },
    ...STATIC_ICONS.slice(2),
  ];

  const [showBSOD, setShowBSOD] = useState(false);
  const [showBalloon, setShowBalloon] = useState(false);
  const [contextMenu, setContextMenu] = useState(null); // { x, y, items }
  const konamiRef = useRef([]);

  const closeContextMenu = useCallback(() => setContextMenu(null), []);

  // Show balloon after 2s on mount
  useEffect(() => {
    const timer = setTimeout(() => setShowBalloon(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-dismiss balloon after 8s
  useEffect(() => {
    if (!showBalloon) return;
    const timer = setTimeout(() => setShowBalloon(false), 8000);
    return () => clearTimeout(timer);
  }, [showBalloon]);

  // Konami code listener for BSOD
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showBSOD) {
        setShowBSOD(false);
        return;
      }
      konamiRef.current = [...konamiRef.current, e.key].slice(-KONAMI.length);
      if (konamiRef.current.join(",") === KONAMI.join(",")) {
        setShowBSOD(true);
        konamiRef.current = [];
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showBSOD]);

  const handleBalloonAccept = () => {
    setShowBalloon(false);
    openWindow("msn");
  };

  const handleBalloonDecline = () => {
    setShowBalloon(false);
  };

  const handleDesktopContextMenu = (e) => {
    e.preventDefault();
    closeStartMenu();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      items: [
        { label: "Arrange Icons By", hasSubmenu: true },
        { label: "Refresh" },
        "---",
        { label: "Paste", disabled: true },
        { label: "Paste Shortcut", disabled: true },
        "---",
        { label: "New", hasSubmenu: true },
        "---",
        { label: "Properties", onClick: () => openWindow("mycomputer") },
      ],
    });
  };

  const handleIconContextMenu = (e, iconId) => {
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      items: getIconMenu(iconId, openWindow, emptyBin, recyclebin.length === 0),
    });
  };

  return (
    <div
      className="xp-desktop"
      onClick={() => { closeStartMenu(); closeContextMenu(); }}
      onContextMenu={(e) => {
        // Only trigger on the desktop background (not windows, taskbar, etc.)
        if (e.target === e.currentTarget) {
          handleDesktopContextMenu(e);
        }
      }}
    >
      {showBSOD && (
        <BSODScreen onDismiss={() => setShowBSOD(false)} />
      )}

      {showBalloon && (
        <BalloonNotification
          onAccept={handleBalloonAccept}
          onDecline={handleBalloonDecline}
        />
      )}

      <div
        className="xp-desktop-icons"
        onClick={(e) => {
          // Deselect all icons when clicking empty space
          if (e.target === e.currentTarget) {
            const icons = document.querySelectorAll(".xp-desktop-icon.selected");
            icons.forEach((icon) => icon.classList.remove("selected"));
          }
        }}
        onContextMenu={(e) => {
          if (e.target === e.currentTarget) {
            handleDesktopContextMenu(e);
          }
        }}
      >
        {DESKTOP_ICONS.map((item) => (
          <DesktopIcon
            key={item.id}
            icon={item.icon}
            label={item.label}
            onDoubleClick={() => openWindow(item.id)}
            onContextMenu={(e) => handleIconContextMenu(e, item.id)}
          />
        ))}
      </div>

      {/* Windows */}
      <Window id="repos">
        <ReposWindow repos={repos} />
      </Window>
      <Window id="profile">
        <ProfileWindow user={user} />
      </Window>
      <Window id="mycomputer">
        <MyComputerWindow />
      </Window>
      <Window id="recyclebin">
        <RecycleBinWindow />
      </Window>
      <Window id="ie">
        <InternetExplorerWindow user={user} />
      </Window>
      <Window id="outlook">
        <OutlookExpressWindow />
      </Window>
      <Window id="paint">
        <PaintWindow />
      </Window>
      <Window id="notepad">
        <NotepadWindow />
      </Window>
      <Window id="wordpad">
        <WordPadWindow />
      </Window>
      <Window id="calculator">
        <CalculatorWindow />
      </Window>
      <Window id="run">
        <RunWindow />
      </Window>
      <Window id="msn">
        <MSNMessengerWindow user={user} />
      </Window>
      <Window id="minesweeper" disableFullscreen>
        <MinesweeperWindow />
      </Window>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={contextMenu.items}
          onClose={closeContextMenu}
        />
      )}

      {/* Start Menu */}
      <StartMenu user={user} />

      {/* Taskbar */}
      <Taskbar />
    </div>
  );
}
