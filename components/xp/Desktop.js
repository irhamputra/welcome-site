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

const DESKTOP_ICONS = [
  { id: "mycomputer", icon: "/xp/icons/Windows XP Icons/My Computer.png", label: "My Computer" },
  { id: "repos", icon: "/xp/icons/Windows XP Icons/My Documents.png", label: "My Documents" },
  { id: "recyclebin", icon: "/xp/icons/Windows XP Icons/Recycle Bin (empty).png", label: "Recycle Bin" },
  { id: "ie", icon: "/xp/icons/Windows XP Icons/Internet Explorer 6.png", label: "Internet Explorer" },
  { id: "outlook", icon: "/xp/icons/Windows XP Icons/Outlook Express.png", label: "Outlook Express" },
];

export default function Desktop({ user, repos }) {
  const { openWindow, closeStartMenu } = useWindowManager();

  return (
    <div className="xp-desktop" onClick={() => closeStartMenu()}>
      <div
        className="xp-desktop-icons"
        onClick={(e) => {
          // Deselect all icons when clicking empty space
          if (e.target === e.currentTarget) {
            const icons = document.querySelectorAll(".xp-desktop-icon.selected");
            icons.forEach((icon) => icon.classList.remove("selected"));
          }
        }}
      >
        {DESKTOP_ICONS.map((item) => (
          <DesktopIcon
            key={item.id}
            icon={item.icon}
            label={item.label}
            onDoubleClick={() => openWindow(item.id)}
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

      {/* Start Menu */}
      <StartMenu user={user} />

      {/* Taskbar */}
      <Taskbar />
    </div>
  );
}
