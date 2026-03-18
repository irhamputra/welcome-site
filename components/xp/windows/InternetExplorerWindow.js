import { useState } from "react";

const GITHUB_URL = "https://github.com/irhamputra";
const LINKEDIN_URL = "https://www.linkedin.com/in/muhamad-irham-prasetyo/";

export default function InternetExplorerWindow({ user }) {
  const [address, setAddress] = useState(LINKEDIN_URL);
  const [inputAddress, setInputAddress] = useState(LINKEDIN_URL);
  const [history, setHistory] = useState([LINKEDIN_URL]);
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

  const isGitHub = address.startsWith("https://github.com/irhamputra");
  const isLinkedIn = address.startsWith("https://www.linkedin.com/in/muhamad-irham-prasetyo");

  return (
    <div
      style={{ display: "flex", flexDirection: "column", height: "100%", fontFamily: "Tahoma, Arial, sans-serif", fontSize: "12px", userSelect: "none", background: "#fff", overflow: "hidden" }}
      onClick={() => setActiveMenu(null)}
    >
      {/* Menu Bar */}
      <div
        style={{ display: "flex", borderBottom: "1px solid #aca899", background: "#f1efe2", padding: "1px 4px", gap: "2px", flexShrink: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {["File", "Edit", "View", "Favorites", "Tools", "Help"].map((menu) => (
          <div
            key={menu}
            onClick={() => setActiveMenu(activeMenu === menu ? null : menu)}
            style={{ padding: "2px 6px", cursor: "default", background: activeMenu === menu ? "#316ac5" : "transparent", color: activeMenu === menu ? "white" : "black", borderRadius: "2px", position: "relative" }}
          >
            {menu}
            {activeMenu === menu && (
              <div style={{ position: "absolute", top: "100%", left: 0, background: "white", border: "1px solid #aca899", boxShadow: "2px 2px 4px rgba(0,0,0,0.2)", zIndex: 1000, minWidth: "180px", padding: "2px 0" }}>
                {getMenuItems(menu).map((item, i) =>
                  item === "---" ? (
                    <div key={i} style={{ height: 1, background: "#aca899", margin: "2px 4px" }} />
                  ) : (
                    <div
                      key={i}
                      style={{ padding: "4px 20px", cursor: "default", color: item.disabled ? "#aaa" : "black" }}
                      onMouseEnter={(e) => { if (!item.disabled) { e.currentTarget.style.background = "#316ac5"; e.currentTarget.style.color = "white"; } }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = ""; e.currentTarget.style.color = item.disabled ? "#aaa" : "black"; }}
                      onClick={() => { if (item.url) navigate(item.url); setActiveMenu(null); }}
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

      {/* Toolbar */}
      <div style={{ display: "flex", alignItems: "center", gap: "2px", padding: "2px 4px", background: "#f1efe2", borderBottom: "1px solid #aca899", flexShrink: 0 }}>
        <NavBtn icon="/xp/icons/Whistler Icons/Whistler - Back.png" label="Back" disabled={!canGoBack} onClick={goBack} />
        <NavBtn icon="/xp/icons/Whistler Icons/Whistler - Forward.png" label="Forward" disabled={!canGoForward} onClick={goForward} />
        <div style={{ width: 1, height: 28, background: "#aca899", margin: "0 2px" }} />
        <NavBtn icon="/xp/icons/Windows XP Icons/IE Stop.png" label="Stop" onClick={() => {}} />
        <NavBtn icon="/xp/icons/Windows XP Icons/IE Refresh.png" label="Refresh" onClick={() => navigate(address)} />
        <NavBtn icon="/xp/icons/Windows XP Icons/IE Home.png" label="Home" onClick={() => navigate(GITHUB_URL)} />
        <div style={{ width: 1, height: 28, background: "#aca899", margin: "0 2px" }} />
        <NavBtn icon="/xp/icons/Whistler Icons/Whistler - IE Search.png" label="Search" onClick={() => {}} />
        <NavBtn icon="/xp/icons/Whistler Icons/Whistler - IE Favorites.png" label="Favorites" onClick={() => {}} />
        <NavBtn icon="/xp/icons/Whistler Icons/Whistler - IE History.png" label="History" onClick={() => {}} />
      </div>

      {/* Address Bar */}
      <div style={{ display: "flex", alignItems: "center", gap: "4px", padding: "2px 4px", background: "#f1efe2", borderBottom: "1px solid #aca899", flexShrink: 0 }}>
        <span style={{ fontSize: "11px", color: "#555", whiteSpace: "nowrap" }}>Address</span>
        <div style={{ flex: 1, display: "flex", alignItems: "center", background: "white", border: "1px solid #7f9db9" }}>
          <img src="/xp/icons/Windows XP Icons/Internet Explorer 6.png" alt="" style={{ width: 16, height: 16, margin: "0 3px", flexShrink: 0 }} />
          <input
            type="text"
            value={inputAddress}
            onChange={(e) => setInputAddress(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleGo(); }}
            style={{ flex: 1, border: "none", outline: "none", fontSize: "11px", fontFamily: "Tahoma, Arial, sans-serif", padding: "2px", background: "transparent", userSelect: "text" }}
          />
        </div>
        <button onClick={handleGo} style={{ padding: "2px 8px", fontSize: "11px", cursor: "pointer", background: "linear-gradient(180deg,#f8f8f0,#e8e4d4)", border: "1px solid #aca899", borderRadius: "2px" }}>Go</button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "auto", background: "white", userSelect: "text" }}>
        {isGitHub  && <GitHubPage user={user} onNavigate={navigate} linkedinUrl={LINKEDIN_URL} />}
        {isLinkedIn && <LinkedInPage user={user} onNavigate={navigate} githubUrl={GITHUB_URL} />}
        {!isGitHub && !isLinkedIn && <ErrorPage address={address} />}
      </div>

      {/* Status Bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1px 4px", background: "#f1efe2", borderTop: "1px solid #aca899", fontSize: "11px", color: "#555", flexShrink: 0, height: "20px" }}>
        <span>Done</span>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button onClick={() => window.open(address, "_blank")} style={{ background: "none", border: "none", fontSize: "10px", color: "#0054e3", cursor: "pointer", padding: 0, textDecoration: "underline" }}>Open in new window</button>
          <img src="/xp/icons/Windows XP Icons/Internet Explorer 6.png" alt="" style={{ width: 14, height: 14, opacity: 0.7 }} />
          <span>Internet</span>
        </div>
      </div>
    </div>
  );
}

/* ─── GitHub Profile Page ─────────────────────────────────────────────── */
function GitHubPage({ user, onNavigate, linkedinUrl }) {
  if (!user) return <div style={{ padding: 24, color: "#555" }}>Loading...</div>;

  const tabs = ["Overview", "Repositories", "Projects", "Packages", "Stars"];

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontSize: "13px", background: "#f6f8fa", minHeight: "100%" }}>

      {/* GitHub top nav */}
      <div style={{ background: "#24292f", padding: "12px 16px", display: "flex", alignItems: "center", gap: "16px" }}>
        <svg height="22" width="22" viewBox="0 0 16 16" fill="white">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
        </svg>
        <div style={{ flex: 1, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 6, padding: "4px 12px", color: "rgba(255,255,255,0.6)", fontSize: "12px" }}>
          Search or jump to...
        </div>
        {["Pull requests", "Issues", "Marketplace", "Explore"].map(n => (
          <span key={n} style={{ color: "white", fontSize: "12px", opacity: 0.8, cursor: "default", whiteSpace: "nowrap" }}>{n}</span>
        ))}
      </div>

      <div style={{ maxWidth: 1012, margin: "0 auto", padding: "24px 16px", display: "flex", gap: "24px" }}>
        {/* Left sidebar */}
        <div style={{ width: 256, flexShrink: 0 }}>
          <img src={user.avatar_url} alt={user.login} style={{ width: "100%", borderRadius: "50%", border: "1px solid #d0d7de", marginBottom: "16px" }} />
          <div style={{ fontSize: "20px", fontWeight: "600", color: "#24292f", lineHeight: 1.2 }}>{user.name}</div>
          <div style={{ fontSize: "16px", color: "#57606a", fontWeight: 300, marginBottom: "16px" }}>{user.login}</div>
          {user.bio && <div style={{ fontSize: "13px", color: "#24292f", marginBottom: "16px", lineHeight: 1.5 }}>{user.bio}</div>}
          <div style={{ marginBottom: "16px" }}>
            <a href={user.html_url} target="_blank" rel="noreferrer" style={{ display: "block", textAlign: "center", padding: "5px", border: "1px solid #d0d7de", borderRadius: 6, color: "#24292f", textDecoration: "none", fontSize: "12px", background: "#f6f8fa", fontWeight: 500 }}>Follow</a>
          </div>
          <div style={{ fontSize: "13px", color: "#57606a", lineHeight: 2 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <span>👥</span>
              <span><strong style={{ color: "#24292f" }}>{user.followers}</strong> followers · <strong style={{ color: "#24292f" }}>{user.following}</strong> following</span>
            </div>
            {user.company && <div>🏢 {user.company}</div>}
            {user.location && <div>📍 {user.location}</div>}
            {user.blog && <div>🔗 <a href={user.blog.startsWith("http") ? user.blog : `https://${user.blog}`} target="_blank" rel="noreferrer" style={{ color: "#0969da" }}>{user.blog}</a></div>}
            {user.twitter_username && <div>🐦 <a href={`https://twitter.com/${user.twitter_username}`} target="_blank" rel="noreferrer" style={{ color: "#0969da" }}>@{user.twitter_username}</a></div>}
          </div>

          <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #d0d7de", fontSize: "12px", color: "#57606a" }}>
            <div
              onClick={() => onNavigate(linkedinUrl)}
              style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", color: "#0969da", marginTop: 4 }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#0a66c2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              View LinkedIn profile
            </div>
          </div>
        </div>

        {/* Right content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid #d0d7de", marginBottom: "16px", gap: "4px" }}>
            {tabs.map(tab => (
              <div key={tab} style={{ padding: "8px 16px", fontSize: "13px", cursor: "default", borderBottom: tab === "Repositories" ? "2px solid #fd8c73" : "2px solid transparent", fontWeight: tab === "Repositories" ? 600 : 400, color: "#24292f", display: "flex", alignItems: "center", gap: 6 }}>
                {tab}
                {tab === "Repositories" && <span style={{ background: "#eaeef2", borderRadius: 10, padding: "0 6px", fontSize: "11px" }}>{user.public_repos}</span>}
              </div>
            ))}
          </div>

          {/* Contribution-style box */}
          <div style={{ border: "1px solid #d0d7de", borderRadius: 6, padding: "16px", background: "white", marginBottom: 16 }}>
            <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: 8 }}>{user.public_repos} public repositories</div>
            <div style={{ fontSize: "12px", color: "#57606a" }}>Open <strong>My Documents</strong> to browse all repositories with full details.</div>
          </div>

          {/* Pinned repos placeholder */}
          <div style={{ fontSize: "12px", color: "#57606a", marginBottom: 8, fontWeight: 600 }}>Pinned</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { name: "irhamputra", desc: "Personal portfolio website" },
              { name: "Projects", desc: "Open source contributions" },
            ].map(repo => (
              <div key={repo.name} style={{ border: "1px solid #d0d7de", borderRadius: 6, padding: "12px 16px", background: "white" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="#57606a"><path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"/></svg>
                  <a href={`${user.html_url}/${repo.name}`} target="_blank" rel="noreferrer" style={{ color: "#0969da", fontSize: "12px", fontWeight: 600, textDecoration: "none" }}>{user.login} / {repo.name}</a>
                </div>
                <div style={{ fontSize: "11px", color: "#57606a" }}>{repo.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── LinkedIn Profile Page ───────────────────────────────────────────── */
const EXPERIENCE = [
  {
    title: "Senior Software Engineer",
    company: "GET AG",
    period: "Jan 2020 – Present · 6 yrs 3 mos",
    location: "Leipzig Area, Germany",
    desc: "Design, develop, and install software solutions across the full development lifecycle. Provide technical guidance and coaching to developers. Create comprehensive documentation including flowcharts, diagrams, and code comments.",
  },
  {
    title: "Software Developer",
    company: "FUTURE.rent",
    period: "Jun 2019 – Dec 2019 · 7 mos",
    location: "Leipzig Area, Germany",
    desc: "",
  },
  {
    title: "Frontend Developer",
    company: "ener|xess GmbH",
    period: "Jun 2018 – Jun 2019 · 1 yr 1 mo",
    location: "Leipzig Area, Germany",
    desc: "",
  },
  {
    title: "Frontend Developer",
    company: "WWU Medien GmbH",
    period: "Apr 2018 – Jun 2018 · 3 mos",
    location: "Leipzig Area, Germany",
    desc: "",
  },
  {
    title: "Software Developer",
    company: "Radio PPI Dunia",
    period: "2015 – 2017 · 2 yrs",
    location: "Remote",
    desc: "",
  },
];

const SKILLS = ["TypeScript", "Node.js", "Rust", "React.js", "Next.js", "Angular", "Software Architecture", "VueJS", "GraphQL", "Docker"];

const CERTIFICATIONS = [
  "Ultimate Rust Crash Course",
  "Advanced React and GraphQL",
  "React Web Developer (with Redux)",
];

const SUMMARY = `As a Senior Software Engineer and Software Architect at GET AG, I collaborate with other professionals to design, develop, and integrate software solutions for various projects. I also lead and mentor the development team, ensuring that they follow the best practices and standards, and communicate effectively with the stakeholders. Some of the technologies I use are TypeScript, Node.js, and Rust.

I have a diploma in web design and development from SAE Institute Leipzig, where I learned the fundamentals of HTML, CSS, and JavaScript, as well as various front-end frameworks and tools, such as React, Next.js, VueJS, and QuasarJS. I am passionate about building things with React, TypeScript, and Rust, and I contribute to open source projects and web development communities.`;

function LinkedInPage({ user, onNavigate, githubUrl }) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", fontSize: "14px", background: "#f3f2ef", minHeight: "100%" }}>

      {/* LinkedIn nav */}
      <div style={{ background: "white", borderBottom: "1px solid #e0e0e0", padding: "0 24px", display: "flex", alignItems: "center", gap: "20px", height: 52, position: "sticky", top: 0, zIndex: 10 }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34">
          <path d="M34 2.5v29A2.5 2.5 0 0131.5 34h-29A2.5 2.5 0 010 31.5v-29A2.5 2.5 0 012.5 0h29A2.5 2.5 0 0134 2.5z" fill="#0a66c2"/>
          <path d="M15 13h4.6v2.1h.1c.6-1.2 2.2-2.5 4.6-2.5 4.9 0 5.8 3.2 5.8 7.4V28h-4.8v-7.1c0-1.7 0-3.9-2.4-3.9s-2.7 1.8-2.7 3.7V28H15V13zM6 9.8C4.3 9.8 3 8.5 3 6.9S4.3 4 6 4s3 1.3 3 2.9-1.3 2.9-3 2.9zM8.4 28H3.6V13h4.8v15z" fill="white"/>
        </svg>
        <div style={{ background: "#eef3f8", borderRadius: 4, padding: "6px 12px", display: "flex", alignItems: "center", gap: 6, width: 220, fontSize: "13px", color: "#666" }}>
          <svg width="14" height="14" fill="#666" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          Search
        </div>
        <div style={{ flex: 1 }} />
        {["Home", "My Network", "Jobs", "Messaging", "Notifications"].map(item => (
          <div key={item} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, cursor: "default", color: "#666", fontSize: "11px" }}>
            <span style={{ fontSize: "16px" }}>{{"Home":"🏠","My Network":"👥","Jobs":"💼","Messaging":"💬","Notifications":"🔔"}[item]}</span>
            <span>{item}</span>
          </div>
        ))}
      </div>

      <div style={{ maxWidth: 860, margin: "16px auto", padding: "0 16px", display: "flex", gap: "16px" }}>
        {/* Main card */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Profile card */}
          <div style={{ background: "white", borderRadius: 8, border: "1px solid #e0e0e0", overflow: "hidden", marginBottom: 12 }}>
            <div style={{ height: 120, background: "linear-gradient(135deg, #0077b5 0%, #00a0dc 50%, #0055a5 100%)" }} />
            <div style={{ padding: "0 24px 16px", position: "relative" }}>
              <div style={{ marginTop: -44 }}>
                <img
                  src={user?.avatar_url}
                  alt="Muhamad Irham Prasetyo"
                  style={{ width: 88, height: 88, borderRadius: "50%", border: "3px solid white", display: "block", background: "white" }}
                />
              </div>
              <div style={{ position: "absolute", top: 16, right: 24, display: "flex", gap: 8 }}>
                <button style={{ background: "white", color: "#0a66c2", border: "1px solid #0a66c2", borderRadius: 16, padding: "5px 16px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Message</button>
                <button style={{ background: "#0a66c2", color: "white", border: "none", borderRadius: 16, padding: "5px 16px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Connect</button>
              </div>
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: "20px", fontWeight: 600, color: "#191919" }}>Muhamad Irham Prasetyo</div>
                <div style={{ fontSize: "14px", color: "#191919", margin: "4px 0" }}>Senior Software Engineer at GET AG</div>
                <div style={{ fontSize: "13px", color: "#666", marginBottom: 4 }}>
                  Leipzig, Sachsen, Deutschland ·{" "}
                  <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" style={{ color: "#0a66c2", textDecoration: "none" }}>Contact info</a>
                </div>
                <div style={{ fontSize: "13px", color: "#0a66c2", marginBottom: 8 }}>500+ connections</div>
                <div style={{ fontSize: "12px", color: "#555" }}>
                  <strong>Languages:</strong> Indonesian (Native) · English (Limited Working) · German (Limited Working)
                </div>
              </div>
            </div>
          </div>

          {/* About */}
          <div style={{ background: "white", borderRadius: 8, border: "1px solid #e0e0e0", padding: "16px 24px", marginBottom: 12 }}>
            <div style={{ fontSize: "16px", fontWeight: 600, marginBottom: 10 }}>About</div>
            <div style={{ fontSize: "13px", color: "#191919", lineHeight: 1.7, whiteSpace: "pre-line" }}>{SUMMARY}</div>
          </div>

          {/* Experience */}
          <div style={{ background: "white", borderRadius: 8, border: "1px solid #e0e0e0", padding: "16px 24px", marginBottom: 12 }}>
            <div style={{ fontSize: "16px", fontWeight: 600, marginBottom: 16 }}>Experience</div>
            {EXPERIENCE.map((exp, i) => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: i < EXPERIENCE.length - 1 ? 20 : 0, paddingBottom: i < EXPERIENCE.length - 1 ? 20 : 0, borderBottom: i < EXPERIENCE.length - 1 ? "1px solid #f0ece4" : "none" }}>
                <div style={{ width: 44, height: 44, background: "#f3f2ef", border: "1px solid #e0e0e0", borderRadius: 4, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🏢</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "14px" }}>{exp.title}</div>
                  <div style={{ fontSize: "13px", color: "#191919" }}>{exp.company} · Full-time</div>
                  <div style={{ fontSize: "12px", color: "#666" }}>{exp.period}</div>
                  <div style={{ fontSize: "12px", color: "#666", marginBottom: exp.desc ? 4 : 0 }}>{exp.location}</div>
                  {exp.desc && <div style={{ fontSize: "13px", color: "#555", lineHeight: 1.5, marginTop: 4 }}>{exp.desc}</div>}
                </div>
              </div>
            ))}
          </div>

          {/* Education */}
          <div style={{ background: "white", borderRadius: 8, border: "1px solid #e0e0e0", padding: "16px 24px", marginBottom: 12 }}>
            <div style={{ fontSize: "16px", fontWeight: 600, marginBottom: 16 }}>Education</div>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ width: 44, height: 44, background: "#f3f2ef", border: "1px solid #e0e0e0", borderRadius: 4, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🎓</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: "14px" }}>SAE Institute Leipzig</div>
                <div style={{ fontSize: "13px", color: "#191919" }}>Diploma, Web Design & Development</div>
                <div style={{ fontSize: "12px", color: "#666" }}>2015 – 2017</div>
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div style={{ background: "white", borderRadius: 8, border: "1px solid #e0e0e0", padding: "16px 24px", marginBottom: 12 }}>
            <div style={{ fontSize: "16px", fontWeight: 600, marginBottom: 12 }}>Licenses & Certifications</div>
            {CERTIFICATIONS.map((cert, i) => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: i < CERTIFICATIONS.length - 1 ? 14 : 0 }}>
                <div style={{ width: 44, height: 44, background: "#f3f2ef", border: "1px solid #e0e0e0", borderRadius: 4, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>📜</div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ fontWeight: 600, fontSize: "13px" }}>{cert}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Skills */}
          <div style={{ background: "white", borderRadius: 8, border: "1px solid #e0e0e0", padding: "16px 24px", marginBottom: 12 }}>
            <div style={{ fontSize: "16px", fontWeight: 600, marginBottom: 12 }}>Skills</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {SKILLS.map(skill => (
                <span key={skill} style={{ border: "1px solid #c0c0c0", borderRadius: 14, padding: "4px 12px", fontSize: "12px", color: "#191919", background: "#f3f2ef" }}>{skill}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div style={{ width: 220, flexShrink: 0 }}>
          <div style={{ background: "white", borderRadius: 8, border: "1px solid #e0e0e0", padding: "16px", marginBottom: 12 }}>
            <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: 8 }}>Profile language</div>
            <div style={{ fontSize: "12px", color: "#666" }}>English</div>
          </div>
          <div style={{ background: "white", borderRadius: 8, border: "1px solid #e0e0e0", padding: "16px", marginBottom: 12 }}>
            <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: 8 }}>Top Skills</div>
            {["Software Architecture", "Angular", "React.js"].map(s => (
              <div key={s} style={{ fontSize: "12px", color: "#555", padding: "3px 0", borderBottom: "1px solid #f0ece4" }}>{s}</div>
            ))}
          </div>
          <div style={{ background: "white", borderRadius: 8, border: "1px solid #e0e0e0", padding: "16px" }}>
            <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: 8 }}>Also on</div>
            <div
              onClick={() => onNavigate(githubUrl)}
              style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", color: "#0a66c2", fontSize: "12px" }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="#24292f"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
              View GitHub profile
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Error Page ──────────────────────────────────────────────────────── */
function ErrorPage({ address }) {
  return (
    <div style={{ padding: "40px 32px", fontFamily: "Tahoma, sans-serif" }}>
      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        <img src="/xp/icons/Windows XP Icons/Internet Explorer 6.png" alt="" style={{ width: 32, height: 32, opacity: 0.6, marginTop: 4 }} />
        <div>
          <div style={{ fontSize: "20px", color: "#000080", marginBottom: 12, fontWeight: "bold" }}>
            The page cannot be displayed
          </div>
          <div style={{ fontSize: "13px", marginBottom: 16, color: "#333" }}>
            The page you are looking for is currently unavailable. The Web site might be experiencing technical difficulties, or you may need to adjust your browser settings.
          </div>
          <hr style={{ border: "none", borderTop: "1px solid #ccc", margin: "16px 0" }} />
          <div style={{ fontSize: "12px", color: "#555" }}>
            <div style={{ marginBottom: 8 }}>Please try the following:</div>
            <ul style={{ paddingLeft: 20, lineHeight: 2 }}>
              <li>Click the <strong>Refresh</strong> button, or try again later.</li>
              <li>Check your network connection.</li>
              <li>Try visiting <a href={GITHUB_URL} onClick={(e) => { e.preventDefault(); }} style={{ color: "#0000cc" }}>GitHub</a> or <a href={LINKEDIN_URL} onClick={(e) => { e.preventDefault(); }} style={{ color: "#0000cc" }}>LinkedIn</a> from Favorites.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── NavBtn ──────────────────────────────────────────────────────────── */
function NavBtn({ icon, label, disabled, onClick }) {
  return (
    <button
      title={label}
      onClick={onClick}
      disabled={disabled}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1px", padding: "2px 4px", background: "transparent", border: "1px solid transparent", borderRadius: "2px", cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.4 : 1, minWidth: "32px", fontSize: "10px", color: "#333" }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.border = "1px solid #aca899"; }}
      onMouseLeave={(e) => { e.currentTarget.style.border = "1px solid transparent"; }}
    >
      <img src={icon} alt={label} style={{ width: 20, height: 20 }} />
      <span>{label}</span>
    </button>
  );
}

function getMenuItems(menu) {
  switch (menu) {
    case "File":
      return [{ label: "Save As...", disabled: true }, "---", { label: "Print...", disabled: true }];
    case "Edit":
      return [{ label: "Select All", disabled: true }, { label: "Copy", disabled: true }];
    case "View":
      return [{ label: "Full Screen", disabled: true }, { label: "Source", disabled: true }];
    case "Favorites":
      return [
        { label: "Add to Favorites...", disabled: true },
        "---",
        { label: "GitHub — irhamputra", url: GITHUB_URL },
        { label: "LinkedIn — Muhamad Irham", url: LINKEDIN_URL },
      ];
    case "Tools":
      return [{ label: "Internet Options...", disabled: true }];
    case "Help":
      return [{ label: "About Internet Explorer", disabled: true }];
    default:
      return [];
  }
}
