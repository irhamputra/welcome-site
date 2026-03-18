import { useState } from "react";

const GITHUB_URL = "https://github.com/irhamputra";

export default function InternetExplorerWindow({ user }) {
  const [address, setAddress] = useState(GITHUB_URL);
  const [inputAddress, setInputAddress] = useState(GITHUB_URL);
  const [history, setHistory] = useState([GITHUB_URL]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [activeMenu, setActiveMenu] = useState(null);

  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < history.length - 1;

  const navigate = (url) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(url);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setAddress(url);
    setInputAddress(url);
  };

  const goBack = () => {
    if (!canGoBack) return;
    const idx = historyIndex - 1;
    setHistoryIndex(idx);
    setAddress(history[idx]);
    setInputAddress(history[idx]);
  };

  const goForward = () => {
    if (!canGoForward) return;
    const idx = historyIndex + 1;
    setHistoryIndex(idx);
    setAddress(history[idx]);
    setInputAddress(history[idx]);
  };

  const handleGo = () => {
    let url = inputAddress.trim();
    if (!url.startsWith("http")) url = "https://" + url;
    navigate(url);
  };

  const toggleMenu = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const isGitHubProfile = address === GITHUB_URL || address.startsWith("https://github.com/irhamputra");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        fontFamily: "Tahoma, Arial, sans-serif",
        fontSize: "12px",
        userSelect: "none",
        background: "#fff",
        overflow: "hidden",
      }}
      onClick={() => setActiveMenu(null)}
    >
      {/* Menu Bar */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #aca899",
          background: "#f1efe2",
          padding: "1px 4px",
          gap: "2px",
          flexShrink: 0,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {["File", "Edit", "View", "Favorites", "Tools", "Help"].map((menu) => (
          <div
            key={menu}
            onClick={() => toggleMenu(menu)}
            style={{
              padding: "2px 6px",
              cursor: "default",
              background: activeMenu === menu ? "#316ac5" : "transparent",
              color: activeMenu === menu ? "white" : "black",
              borderRadius: "2px",
              position: "relative",
            }}
          >
            {menu}
            {activeMenu === menu && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  background: "white",
                  border: "1px solid #aca899",
                  boxShadow: "2px 2px 4px rgba(0,0,0,0.2)",
                  zIndex: 1000,
                  minWidth: "160px",
                  padding: "2px 0",
                }}
              >
                {getMenuItems(menu, address, user).map((item, i) =>
                  item === "---" ? (
                    <div key={i} style={{ height: 1, background: "#aca899", margin: "2px 4px" }} />
                  ) : (
                    <div
                      key={i}
                      style={{
                        padding: "4px 20px",
                        cursor: "default",
                        color: item.disabled ? "#aaa" : "black",
                      }}
                      onMouseEnter={(e) => { if (!item.disabled) e.currentTarget.style.background = "#316ac5"; e.currentTarget.style.color = "white"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = ""; e.currentTarget.style.color = item.disabled ? "#aaa" : "black"; }}
                      onClick={() => {
                        if (item.href) window.open(item.href, "_blank");
                        setActiveMenu(null);
                      }}
                    >
                      {item.label || item}
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "2px",
          padding: "2px 4px",
          background: "#f1efe2",
          borderBottom: "1px solid #aca899",
          flexShrink: 0,
        }}
      >
        <NavBtn
          icon="/xp/icons/Whistler Icons/Whistler - Back.png"
          label="Back"
          disabled={!canGoBack}
          onClick={goBack}
        />
        <NavBtn
          icon="/xp/icons/Whistler Icons/Whistler - Forward.png"
          label="Forward"
          disabled={!canGoForward}
          onClick={goForward}
        />
        <div style={{ width: 1, height: 28, background: "#aca899", margin: "0 2px" }} />
        <NavBtn
          icon="/xp/icons/Windows XP Icons/IE Stop.png"
          label="Stop"
          onClick={() => {}}
        />
        <NavBtn
          icon="/xp/icons/Windows XP Icons/IE Refresh.png"
          label="Refresh"
          onClick={() => navigate(address)}
        />
        <NavBtn
          icon="/xp/icons/Windows XP Icons/IE Home.png"
          label="Home"
          onClick={() => navigate(GITHUB_URL)}
        />
        <div style={{ width: 1, height: 28, background: "#aca899", margin: "0 2px" }} />
        <NavBtn
          icon="/xp/icons/Whistler Icons/Whistler - IE Search.png"
          label="Search"
          onClick={() => {}}
        />
        <NavBtn
          icon="/xp/icons/Whistler Icons/Whistler - IE Favorites.png"
          label="Favorites"
          onClick={() => {}}
        />
        <NavBtn
          icon="/xp/icons/Whistler Icons/Whistler - IE History.png"
          label="History"
          onClick={() => {}}
        />
      </div>

      {/* Address Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          padding: "2px 4px",
          background: "#f1efe2",
          borderBottom: "1px solid #aca899",
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: "11px", color: "#555", whiteSpace: "nowrap" }}>Address</span>
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            background: "white",
            border: "1px solid #7f9db9",
            borderRadius: "1px",
          }}
        >
          <img
            src="/xp/icons/Windows XP Icons/Internet Explorer 6.png"
            alt=""
            style={{ width: 16, height: 16, margin: "0 3px", flexShrink: 0 }}
          />
          <input
            type="text"
            value={inputAddress}
            onChange={(e) => setInputAddress(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleGo(); }}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: "11px",
              fontFamily: "Tahoma, Arial, sans-serif",
              padding: "2px 2px",
              background: "transparent",
            }}
          />
        </div>
        <button
          onClick={handleGo}
          style={{
            padding: "2px 8px",
            fontSize: "11px",
            cursor: "pointer",
            background: "linear-gradient(180deg, #f8f8f0 0%, #e8e4d4 100%)",
            border: "1px solid #aca899",
            borderRadius: "2px",
          }}
        >
          Go
        </button>
      </div>

      {/* Content Area */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          background: "white",
          userSelect: "text",
        }}
      >
        {isGitHubProfile ? (
          <GitHubProfilePage user={user} />
        ) : (
          <div style={{ padding: "40px", textAlign: "center", color: "#555" }}>
            <img
              src="/xp/icons/Windows XP Icons/Internet Explorer 6.png"
              alt=""
              style={{ width: 48, height: 48, margin: "0 auto 16px", display: "block", opacity: 0.5 }}
            />
            <div style={{ fontSize: "18px", marginBottom: "8px", color: "#003399" }}>
              This page is not available offline
            </div>
            <div style={{ fontSize: "12px" }}>
              The page <strong>{address}</strong> could not be displayed.
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1px 4px",
          background: "#f1efe2",
          borderTop: "1px solid #aca899",
          fontSize: "11px",
          color: "#555",
          flexShrink: 0,
          height: "20px",
        }}
      >
        <span>Done</span>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <img
            src="/xp/icons/Windows XP Icons/Internet Explorer 6.png"
            alt=""
            style={{ width: 14, height: 14, opacity: 0.7 }}
          />
          <span>Internet</span>
        </div>
      </div>
    </div>
  );
}

function NavBtn({ icon, label, disabled, onClick }) {
  return (
    <button
      title={label}
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1px",
        padding: "2px 4px",
        background: "transparent",
        border: "1px solid transparent",
        borderRadius: "2px",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.4 : 1,
        minWidth: "32px",
        fontSize: "10px",
        color: "#333",
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.border = "1px solid #aca899";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.border = "1px solid transparent";
      }}
    >
      <img src={icon} alt={label} style={{ width: 20, height: 20 }} />
      <span>{label}</span>
    </button>
  );
}

function GitHubProfilePage({ user }) {
  if (!user) return <div style={{ padding: 16 }}>Loading...</div>;

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif", fontSize: "12px" }}>
      {/* GitHub-style header */}
      <div style={{ background: "#24292e", padding: "12px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
        <img
          src="/xp/icons/github.svg"
          alt="GitHub"
          style={{ width: 32, height: 32 }}
        />
        <span style={{ color: "white", fontSize: "16px", fontWeight: "bold" }}>GitHub</span>
        <div
          style={{
            flex: 1,
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "4px",
            padding: "4px 8px",
            color: "rgba(255,255,255,0.7)",
            fontSize: "11px",
          }}
        >
          Search or jump to...
        </div>
        <div style={{ display: "flex", gap: "12px", color: "white", fontSize: "11px", opacity: 0.8 }}>
          <span>Pull requests</span>
          <span>Issues</span>
          <span>Marketplace</span>
          <span>Explore</span>
        </div>
      </div>

      {/* Profile content */}
      <div style={{ display: "flex", gap: "24px", padding: "24px 32px", maxWidth: "900px", margin: "0 auto" }}>
        {/* Left sidebar */}
        <div style={{ width: "200px", flexShrink: 0 }}>
          <img
            src={user.avatar_url}
            alt={user.login}
            style={{
              width: "100%",
              borderRadius: "50%",
              border: "1px solid #e1e4e8",
              marginBottom: "12px",
            }}
          />
          <div style={{ fontSize: "20px", fontWeight: "bold", color: "#24292e", marginBottom: "2px" }}>
            {user.name}
          </div>
          <div style={{ fontSize: "16px", color: "#586069", marginBottom: "12px" }}>
            {user.login}
          </div>
          <a
            href={user.html_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              textAlign: "center",
              padding: "5px 12px",
              border: "1px solid #e1e4e8",
              borderRadius: "4px",
              color: "#24292e",
              textDecoration: "none",
              fontSize: "12px",
              marginBottom: "16px",
              background: "#fafbfc",
            }}
          >
            Follow
          </a>
          {user.bio && (
            <div style={{ fontSize: "12px", color: "#24292e", marginBottom: "12px" }}>
              {user.bio}
            </div>
          )}
          <div style={{ fontSize: "12px", color: "#586069", lineHeight: "1.8" }}>
            {user.company && <div>🏢 {user.company}</div>}
            {user.location && <div>📍 {user.location}</div>}
            {user.blog && (
              <div>
                🔗{" "}
                <a
                  href={user.blog.startsWith("http") ? user.blog : `https://${user.blog}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#0366d6" }}
                >
                  {user.blog}
                </a>
              </div>
            )}
            {user.twitter_username && <div>🐦 @{user.twitter_username}</div>}
          </div>
          <div style={{ fontSize: "12px", color: "#586069", marginTop: "12px", display: "flex", gap: "12px" }}>
            <span><strong style={{ color: "#24292e" }}>{user.followers}</strong> followers</span>
            <span><strong style={{ color: "#24292e" }}>{user.following}</strong> following</span>
          </div>
        </div>

        {/* Right: repo count info */}
        <div style={{ flex: 1 }}>
          <div style={{ borderBottom: "1px solid #e1e4e8", marginBottom: "16px", paddingBottom: "8px", display: "flex", gap: "16px" }}>
            {[
              { label: "Overview" },
              { label: "Repositories", count: user.public_repos },
              { label: "Projects" },
              { label: "Packages" },
              { label: "Stars" },
            ].map((tab) => (
              <div
                key={tab.label}
                style={{
                  padding: "4px 0",
                  borderBottom: tab.label === "Repositories" ? "2px solid #f9826c" : "2px solid transparent",
                  color: tab.label === "Repositories" ? "#24292e" : "#586069",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: tab.label === "Repositories" ? "600" : "normal",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span
                    style={{
                      background: "#e1e4e8",
                      borderRadius: "10px",
                      padding: "0 6px",
                      fontSize: "11px",
                    }}
                  >
                    {tab.count}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div style={{ color: "#586069", fontSize: "12px", padding: "24px 0", textAlign: "center" }}>
            <div style={{ fontSize: "14px", fontWeight: "600", color: "#24292e", marginBottom: "8px" }}>
              {user.public_repos} public repositories
            </div>
            <div>Open the "My Documents" window to browse all repositories.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getMenuItems(menu, address, user) {
  const githubUrl = `https://github.com/${user?.login || "irhamputra"}`;
  switch (menu) {
    case "File":
      return [
        { label: "Open...", disabled: true },
        { label: "Save As...", disabled: true },
        "---",
        { label: "Print...", disabled: true },
        "---",
        { label: "Close", disabled: true },
      ];
    case "Edit":
      return [
        { label: "Cut", disabled: true },
        { label: "Copy", disabled: true },
        { label: "Paste", disabled: true },
        "---",
        { label: "Select All", disabled: true },
      ];
    case "View":
      return [
        { label: "Toolbars", disabled: true },
        { label: "Status Bar", disabled: true },
        "---",
        { label: "Full Screen", disabled: true },
      ];
    case "Favorites":
      return [
        { label: "Add to Favorites...", disabled: true },
        { label: "Organize Favorites...", disabled: true },
        "---",
        { label: "GitHub Profile", href: githubUrl },
      ];
    case "Tools":
      return [
        { label: "Internet Options...", disabled: true },
      ];
    case "Help":
      return [
        { label: "Contents and Index", disabled: true },
        "---",
        { label: "About Internet Explorer", disabled: true },
      ];
    default:
      return [];
  }
}
