import { useState, useEffect } from "react";

const CONTACT_EMAIL = "irhamputraprasetyo@gmail.com";

const FOLDERS = [
  { id: "inbox", label: "Inbox", icon: "📥", count: 1 },
  { id: "outbox", label: "Outbox", icon: "📤", count: 0 },
  { id: "sent", label: "Sent Items", icon: "📨", count: 0 },
  { id: "deleted", label: "Deleted Items", icon: "🗑️", count: 0 },
  { id: "drafts", label: "Drafts", icon: "📝", count: 0 },
];

const INBOX_MESSAGES = [
  {
    id: 1,
    from: "Irham Putra",
    email: CONTACT_EMAIL,
    subject: "Welcome! — Contact me anytime",
    date: "3/19/2026 10:00 AM",
    read: false,
    body: `Hi there! 👋

Thank you for visiting my portfolio.

I'm Irham Putra, a Software Engineer passionate about building great web experiences.

Feel free to reach out if you'd like to:
  • Discuss a project or collaboration
  • Ask about my work experience
  • Just say hello!

Click "New Mail" in the toolbar to send me a message — I'd love to hear from you.

Best regards,
Irham Putra
irhamputraprasetyo@gmail.com`,
  },
];

export default function OutlookExpressWindow() {
  const [activeFolder, setActiveFolder] = useState("inbox");
  const [selectedMessage, setSelectedMessage] = useState(INBOX_MESSAGES[0]);
  const [view, setView] = useState("inbox"); // "inbox" | "compose"
  const [activeMenu, setActiveMenu] = useState(null);
  const [messages, setMessages] = useState(INBOX_MESSAGES);
  const [readIds, setReadIds] = useState(new Set());
  const [isMobile, setIsMobile] = useState(false);
  const [showFolders, setShowFolders] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Compose form state
  const [composeTo, setComposeTo] = useState(CONTACT_EMAIL);
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");
  const [sendStatus, setSendStatus] = useState(null); // null | "sent" | "error"

  const openCompose = () => {
    setComposeTo(CONTACT_EMAIL);
    setComposeSubject("");
    setComposeBody("");
    setSendStatus(null);
    setView("compose");
    setShowFolders(false);
  };

  const handleSend = () => {
    if (!composeSubject.trim() || !composeBody.trim()) {
      setSendStatus("error");
      return;
    }
    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(composeSubject)}&body=${encodeURIComponent(composeBody)}`;
    window.open(mailto, "_blank");
    setSendStatus("sent");
    setTimeout(() => {
      setView("inbox");
      setSendStatus(null);
    }, 2000);
  };

  const handleSelectMessage = (msg) => {
    setSelectedMessage(msg);
    setReadIds((prev) => new Set([...prev, msg.id]));
  };

  const unreadCount = (folderId) => {
    if (folderId !== "inbox") return 0;
    return messages.filter((m) => !readIds.has(m.id)).length;
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", height: "100%", fontFamily: "Tahoma, Arial, sans-serif", fontSize: "12px", background: "#fff", overflow: "hidden" }}
      onClick={() => setActiveMenu(null)}
    >
      {/* Menu Bar */}
      <div
        style={{ display: "flex", borderBottom: "1px solid #aca899", background: "#f1efe2", padding: "1px 4px", gap: "2px", flexShrink: 0, overflowX: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        {["File", "Edit", "View", "Tools", "Message", "Help"].map((menu) => (
          <div
            key={menu}
            onClick={() => setActiveMenu(activeMenu === menu ? null : menu)}
            style={{ padding: "2px 6px", cursor: "default", background: activeMenu === menu ? "#316ac5" : "transparent", color: activeMenu === menu ? "white" : "black", borderRadius: "2px", position: "relative", whiteSpace: "nowrap", flexShrink: 0 }}
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

      {/* Toolbar */}
      <div style={{ display: "flex", alignItems: "center", gap: "2px", padding: "2px 6px", background: "#f1efe2", borderBottom: "1px solid #aca899", flexShrink: 0, overflowX: "auto" }}>
        <ToolBtn icon="/xp/icons/Windows XP Icons/OE Create Mail.png" label="New Mail" onClick={openCompose} isMobile={isMobile} />
        <div style={{ width: 1, height: 28, background: "#aca899", margin: "0 2px", flexShrink: 0 }} />
        <ToolBtn icon="/xp/icons/Windows XP Icons/OE Reply.png" label="Reply" disabled={view !== "inbox" || !selectedMessage} onClick={() => { if (selectedMessage) openCompose(); }} isMobile={isMobile} />
        <ToolBtn icon="/xp/icons/Windows XP Icons/OE Reply All.png" label="Reply All" disabled isMobile={isMobile} />
        <ToolBtn icon="/xp/icons/Windows XP Icons/OE Forward.png" label="Forward" disabled isMobile={isMobile} />
        <div style={{ width: 1, height: 28, background: "#aca899", margin: "0 2px", flexShrink: 0 }} />
        <ToolBtn icon="/xp/icons/Windows XP Icons/OE Send and Receive.png" label="Send/Recv" onClick={() => {}} isMobile={isMobile} />
        {!isMobile && (
          <>
            <div style={{ width: 1, height: 28, background: "#aca899", margin: "0 2px", flexShrink: 0 }} />
            <ToolBtn icon="/xp/icons/Windows XP Icons/Email.png" label="Addresses" disabled isMobile={false} />
          </>
        )}
        {/* Mobile: Folders toggle */}
        {isMobile && (
          <button
            onClick={() => setShowFolders(!showFolders)}
            style={{ marginLeft: "auto", padding: "2px 8px", background: showFolders ? "#316ac5" : "transparent", color: showFolders ? "white" : "#333", border: "1px solid #aca899", borderRadius: 2, fontSize: 11, cursor: "pointer", flexShrink: 0 }}
          >
            📁 Folders
          </button>
        )}
      </div>

      {/* Mobile Folder Dropdown */}
      {isMobile && showFolders && (
        <div style={{ background: "#f8f6f0", borderBottom: "1px solid #aca899", flexShrink: 0, zIndex: 10 }}>
          {FOLDERS.map((folder) => {
            const unread = unreadCount(folder.id);
            const isActive = activeFolder === folder.id;
            return (
              <div
                key={folder.id}
                onClick={() => { setActiveFolder(folder.id); setView("inbox"); setSelectedMessage(null); setShowFolders(false); }}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", cursor: "default", background: isActive ? "#316ac5" : "transparent", color: isActive ? "white" : "#000" }}
              >
                <span style={{ fontSize: 14 }}>{folder.icon}</span>
                <span style={{ flex: 1, fontSize: 13, fontWeight: unread > 0 ? "bold" : "normal" }}>{folder.label}</span>
                {unread > 0 && (
                  <span style={{ fontSize: 11, color: isActive ? "white" : "#316ac5", fontWeight: "bold" }}>({unread})</span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Body */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Left Folder Pane — desktop only */}
        {!isMobile && (
          <div style={{ width: 160, borderRight: "1px solid #aca899", background: "#f8f6f0", flexShrink: 0, overflow: "auto", paddingTop: 4 }}>
            <div style={{ padding: "4px 8px", fontSize: "11px", fontWeight: "bold", color: "#555", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Local Folders
            </div>
            {FOLDERS.map((folder) => {
              const unread = unreadCount(folder.id);
              const isActive = activeFolder === folder.id;
              return (
                <div
                  key={folder.id}
                  onClick={() => { setActiveFolder(folder.id); setView("inbox"); setSelectedMessage(null); }}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 12px", cursor: "default", background: isActive ? "#316ac5" : "transparent", color: isActive ? "white" : "#000" }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "#e8e4d8"; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                >
                  <span style={{ fontSize: 13 }}>{folder.icon}</span>
                  <span style={{ flex: 1, fontSize: 12, fontWeight: unread > 0 ? "bold" : "normal" }}>{folder.label}</span>
                  {unread > 0 && (
                    <span style={{ fontSize: 11, color: isActive ? "white" : "#316ac5", fontWeight: "bold" }}>({unread})</span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Right Pane */}
        {view === "compose" ? (
          <ComposeView
            to={composeTo}
            subject={composeSubject}
            body={composeBody}
            onToChange={setComposeTo}
            onSubjectChange={setComposeSubject}
            onBodyChange={setComposeBody}
            onSend={handleSend}
            onCancel={() => setView("inbox")}
            sendStatus={sendStatus}
            isMobile={isMobile}
          />
        ) : (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* Message List */}
            <div style={{ height: isMobile ? 130 : 160, borderBottom: "1px solid #aca899", overflow: "auto", background: "white", flexShrink: 0 }}>
              {/* List header */}
              <div style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "20px 1fr 90px" : "24px 1fr 160px 110px",
                background: "#f1efe2", borderBottom: "1px solid #aca899", padding: "2px 0", position: "sticky", top: 0
              }}>
                {(isMobile ? ["", "From / Subject", "Date"] : ["", "From / Subject", "Received", ""]).map((h, i) => (
                  <div key={i} style={{ padding: "2px 8px", fontSize: 11, color: "#555", borderRight: i < (isMobile ? 2 : 3) ? "1px solid #aca899" : "none", fontWeight: 600 }}>{h}</div>
                ))}
              </div>

              {activeFolder === "inbox" && messages.length > 0 ? (
                messages.map((msg) => {
                  const isRead = readIds.has(msg.id);
                  const isSelected = selectedMessage?.id === msg.id;
                  return (
                    <div
                      key={msg.id}
                      onClick={() => handleSelectMessage(msg)}
                      style={{
                        display: "grid",
                        gridTemplateColumns: isMobile ? "20px 1fr 90px" : "24px 1fr 160px 110px",
                        background: isSelected ? "#316ac5" : "white", color: isSelected ? "white" : "black",
                        cursor: "default", borderBottom: "1px solid #f0ece0"
                      }}
                      onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = "#e8f0fe"; }}
                      onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = "white"; }}
                    >
                      <div style={{ padding: "4px 4px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {!isRead && <span style={{ color: isSelected ? "white" : "#316ac5", fontSize: 10 }}>●</span>}
                      </div>
                      <div style={{ padding: "4px 8px", minWidth: 0 }}>
                        <div style={{ fontWeight: isRead ? "normal" : "bold", fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{msg.from}</div>
                        <div style={{ fontSize: 11, color: isSelected ? "rgba(255,255,255,0.8)" : "#555", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{msg.subject}</div>
                      </div>
                      <div style={{ padding: "4px 6px", fontSize: isMobile ? 10 : 11, color: isSelected ? "rgba(255,255,255,0.8)" : "#555", display: "flex", alignItems: "center", whiteSpace: "nowrap", overflow: "hidden" }}>
                        {isMobile ? msg.date.split(" ")[0] : msg.date}
                      </div>
                      {!isMobile && <div />}
                    </div>
                  );
                })
              ) : (
                <div style={{ padding: "20px 16px", color: "#888", fontSize: 12, fontStyle: "italic" }}>
                  {activeFolder === "inbox" ? "No messages" : "This folder is empty."}
                </div>
              )}
            </div>

            {/* Message Preview */}
            <div style={{ flex: 1, overflow: "auto", background: "white" }}>
              {selectedMessage && activeFolder === "inbox" ? (
                <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                  {/* Header */}
                  <div style={{ padding: isMobile ? "6px 10px" : "8px 12px", borderBottom: "1px solid #aca899", background: "#f8f6f0", flexShrink: 0 }}>
                    <table style={{ fontSize: 12, borderCollapse: "collapse", width: "100%" }}>
                      <tbody>
                        <tr>
                          <td style={{ fontWeight: "bold", paddingRight: 8, color: "#555", whiteSpace: "nowrap", width: 60 }}>From:</td>
                          <td style={{ overflow: "hidden", textOverflow: "ellipsis", maxWidth: 0, whiteSpace: "nowrap" }}>{selectedMessage.from} &lt;{selectedMessage.email}&gt;</td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: "bold", paddingRight: 8, color: "#555" }}>Date:</td>
                          <td>{selectedMessage.date}</td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: "bold", paddingRight: 8, color: "#555" }}>To:</td>
                          <td>You</td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: "bold", paddingRight: 8, color: "#555" }}>Subject:</td>
                          <td style={{ fontWeight: "bold" }}>{selectedMessage.subject}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  {/* Body */}
                  <div style={{ flex: 1, padding: isMobile ? "10px 12px" : "12px 16px", fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap", color: "#1a1a1a", userSelect: "text", fontFamily: "Tahoma, Arial, sans-serif", overflow: "auto" }}>
                    {selectedMessage.body}
                    <div style={{ marginTop: 24, paddingTop: 12, borderTop: "1px solid #e0dcd0" }}>
                      <button
                        onClick={openCompose}
                        style={{ padding: isMobile ? "8px 20px" : "5px 16px", background: "linear-gradient(180deg,#f8f8f0,#e8e4d4)", border: "1px solid #aca899", borderRadius: 2, cursor: "pointer", fontSize: 12, fontFamily: "Tahoma, sans-serif" }}
                      >
                        ✉ Reply to Irham
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ padding: "32px 16px", color: "#888", fontSize: 12, fontStyle: "italic", textAlign: "center" }}>
                  Select a message to read it
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1px 6px", background: "#f1efe2", borderTop: "1px solid #aca899", fontSize: "11px", color: "#555", flexShrink: 0, height: 20 }}>
        <span>{activeFolder === "inbox" ? `${messages.length} message(s), ${unreadCount("inbox")} unread` : "0 message(s)"}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <img src="/xp/icons/Windows XP Icons/Outlook Express.png" alt="" style={{ width: 14, height: 14, opacity: 0.7 }} />
          {!isMobile && <span>Working Online</span>}
        </div>
      </div>
    </div>
  );
}

/* ─── Compose View ─────────────────────────────────────────────────────── */
function ComposeView({ to, subject, body, onToChange, onSubjectChange, onBodyChange, onSend, onCancel, sendStatus, isMobile }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "white", overflow: "hidden" }}>
      {/* Compose Toolbar */}
      <div style={{ display: "flex", alignItems: "center", gap: "2px", padding: "2px 6px", background: "#f1efe2", borderBottom: "1px solid #aca899", flexShrink: 0 }}>
        <ToolBtn icon="/xp/icons/Windows XP Icons/OE Send.png" label="Send" onClick={onSend} isMobile={isMobile} />
        <div style={{ width: 1, height: 28, background: "#aca899", margin: "0 2px" }} />
        <ToolBtn icon="/xp/icons/Windows XP Icons/OE Create Mail.png" label="Cancel" onClick={onCancel} isMobile={isMobile} />
      </div>

      {/* Fields */}
      <div style={{ padding: "8px 10px", borderBottom: "1px solid #aca899", flexShrink: 0, background: "#fafaf8" }}>
        <FieldRow label="To:" value={to} onChange={onToChange} readOnly />
        <FieldRow label="Cc:" value="" onChange={() => {}} />
        <FieldRow label="Subject:" value={subject} onChange={onSubjectChange} />
      </div>

      {/* Body */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <textarea
          value={body}
          onChange={(e) => onBodyChange(e.target.value)}
          placeholder="Write your message here..."
          style={{ width: "100%", height: "100%", border: "none", outline: "none", resize: "none", padding: "10px 12px", fontSize: isMobile ? 14 : 13, fontFamily: "Tahoma, Arial, sans-serif", lineHeight: 1.7, background: "white", boxSizing: "border-box", color: "#1a1a1a" }}
        />
      </div>

      {/* Status */}
      {sendStatus === "sent" && (
        <div style={{ padding: "8px 12px", background: "#dff0d8", borderTop: "1px solid #aca899", fontSize: 12, color: "#3c763d", fontWeight: "bold" }}>
          ✓ Message sent! Opening your mail client...
        </div>
      )}
      {sendStatus === "error" && (
        <div style={{ padding: "8px 12px", background: "#f2dede", borderTop: "1px solid #aca899", fontSize: 12, color: "#a94442" }}>
          ⚠ Please fill in Subject and Message before sending.
        </div>
      )}
    </div>
  );
}

function FieldRow({ label, value, onChange, readOnly }) {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
      <span style={{ width: 56, fontSize: 12, color: "#555", fontWeight: "bold", flexShrink: 0 }}>{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly}
        style={{ flex: 1, border: "1px solid #7f9db9", padding: "2px 6px", fontSize: 12, fontFamily: "Tahoma, Arial, sans-serif", outline: "none", background: readOnly ? "#f0ece0" : "white", color: "#1a1a1a" }}
      />
    </div>
  );
}

/* ─── ToolBtn ─────────────────────────────────────────────────────────── */
function ToolBtn({ icon, label, disabled, onClick, isMobile }) {
  return (
    <button
      title={label}
      onClick={onClick}
      disabled={disabled}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1px", padding: "2px 4px", background: "transparent", border: "1px solid transparent", borderRadius: "2px", cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.4 : 1, minWidth: isMobile ? "28px" : "36px", fontSize: "10px", color: "#333", fontFamily: "Tahoma, sans-serif", flexShrink: 0 }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.border = "1px solid #aca899"; }}
      onMouseLeave={(e) => { e.currentTarget.style.border = "1px solid transparent"; }}
    >
      <img src={icon} alt={label} style={{ width: 20, height: 20 }} />
      {!isMobile && <span>{label}</span>}
    </button>
  );
}

function getMenuItems(menu) {
  switch (menu) {
    case "File":
      return [
        { label: "New Message", action: null },
        "---",
        { label: "Close", disabled: true },
      ];
    case "Edit":
      return [
        { label: "Select All", disabled: true },
        { label: "Copy", disabled: true },
      ];
    case "View":
      return [
        { label: "Layout...", disabled: true },
        { label: "Columns...", disabled: true },
      ];
    case "Tools":
      return [
        { label: "Send and Receive All", disabled: true },
        "---",
        { label: "Accounts...", disabled: true },
        { label: "Options...", disabled: true },
      ];
    case "Message":
      return [
        { label: "New Message" },
        "---",
        { label: "Reply to Sender", disabled: true },
        { label: "Forward", disabled: true },
      ];
    case "Help":
      return [
        { label: "Outlook Express Help", disabled: true },
        "---",
        { label: "About Outlook Express", disabled: true },
      ];
    default:
      return [];
  }
}
