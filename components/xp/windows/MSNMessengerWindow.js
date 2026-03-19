import { useState, useEffect, useRef } from "react";

const CONTACT_EMAIL = "irhamputra.dev@gmail.com";

const STAGE = {
  LOADING: "loading",
  GREETING: "greeting",
  ASK_NAME: "ask_name",
  GOT_NAME: "got_name",
  ASK_MESSAGE: "ask_message",
  READY_SEND: "ready_send",
  SENT: "sent",
};

const SCRIPTS = {
  id: {
    greeting: [
      { delay: 1800, text: "heyy!! 👋 seneng banget ada yang mampir ke portfolio gue!" },
      { delay: 2000, text: "gue lagi online nih, siap-siap diajak ngobrol 😄" },
      { delay: 2200, text: "eh tapi sebelum lanjut — boleh kenalan dulu gak? nama kamu siapa? 😊" },
    ],
    gotName: (name) => [
      { delay: 1200, text: `hai ${name}!! 🎉` },
      { delay: 2400, text: `wah nama yang keren banget tuh! gue irham btw, software engineer yang lebih sering ngoding daripada tidur 😅` },
      { delay: 2600, text: `jadi ${name}, ada yang bisa gue bantu? mau collab, nanya-nanya, atau sekedar say hi juga boleh banget! 👀` },
    ],
    readySend: (name) => [
      { delay: 1400, text: `noted ${name}! 📝 gue baca pesannya ya` },
      { delay: 2000, text: `klik tombol "Kirim ke Email" di bawah biar langsung masuk ke inbox gue 📬` },
      { delay: 1800, text: `gue bakal bales secepatnya, promise! 🤙` },
    ],
    sent: (name) => `email masuk! makasih udah reach out ${name}, gue bales secepatnya ya 🚀`,
    emailSubject: (name) => `Heyy irham! — Salam dari ${name}`,
    emailBody: (name, msg) => `Hi Irham!\n\nNama: ${name}\n\nPesan:\n${msg}\n\n---\nDikirim via irhamputra.com MSN Messenger 😄`,
    placeholder: { name: "Tulis namamu...", message: "Cerita aja, gue dengerin 😊" },
    sendBtn: "📬 Kirim ke Email",
  },
  de: {
    greeting: [
      { delay: 1800, text: "Heyy!! 👋 Schön, dass du mein Portfolio besuchst!" },
      { delay: 2000, text: "Ich bin gerade online und freue mich auf ein Gespräch 😄" },
      { delay: 2200, text: "Aber zuerst — darf ich fragen, wie du heißt? 😊" },
    ],
    gotName: (name) => [
      { delay: 1200, text: `Hallo ${name}!! 🎉` },
      { delay: 2400, text: `Was für ein toller Name! Ich bin Irham, ein Software-Entwickler, der mehr Zeit mit Coden als mit Schlafen verbringt 😅` },
      { delay: 2600, text: `Also ${name}, wie kann ich dir helfen? Zusammenarbeit, Fragen oder einfach Hallo sagen? 👀` },
    ],
    readySend: (name) => [
      { delay: 1400, text: `Verstanden ${name}! 📝 Ich lese deine Nachricht` },
      { delay: 2000, text: `Klick auf "Per E-Mail senden" damit sie direkt in meinen Posteingang kommt 📬` },
      { delay: 1800, text: `Ich antworte so schnell wie möglich, versprochen! 🤙` },
    ],
    sent: (name) => `E-Mail eingegangen! Danke, dass du dich gemeldet hast ${name}, ich antworte so schnell wie möglich 🚀`,
    emailSubject: (name) => `Heyy Irham! — Grüße von ${name}`,
    emailBody: (name, msg) => `Hi Irham!\n\nName: ${name}\n\nNachricht:\n${msg}\n\n---\nGesendet über irhamputra.com MSN Messenger 😄`,
    placeholder: { name: "Dein Name...", message: "Erzähl mir alles 😊" },
    sendBtn: "📬 Per E-Mail senden",
  },
  en: {
    greeting: [
      { delay: 1800, text: "heyy!! 👋 so glad you stopped by my portfolio!" },
      { delay: 2000, text: "I'm online right now, ready to chat 😄" },
      { delay: 2200, text: "but first — mind if I ask your name? 😊" },
    ],
    gotName: (name) => [
      { delay: 1200, text: `hey ${name}!! 🎉` },
      { delay: 2400, text: `what a cool name! I'm irham btw, a software engineer who spends more time coding than sleeping 😅` },
      { delay: 2600, text: `so ${name}, what can I do for you? collab, questions about my work, or just saying hi — all good! 👀` },
    ],
    readySend: (name) => [
      { delay: 1400, text: `noted ${name}! 📝 I'll read your message` },
      { delay: 2000, text: `click "Send to Email" below and it'll land right in my inbox 📬` },
      { delay: 1800, text: `I'll reply as soon as possible, promise! 🤙` },
    ],
    sent: (name) => `email received! thanks for reaching out ${name}, I'll get back to you ASAP 🚀`,
    emailSubject: (name) => `Heyy irham! — Hello from ${name}`,
    emailBody: (name, msg) => `Hi Irham!\n\nName: ${name}\n\nMessage:\n${msg}\n\n---\nSent via irhamputra.com MSN Messenger 😄`,
    placeholder: { name: "Your name...", message: "Tell me anything 😊" },
    sendBtn: "📬 Send to Email",
  },
};

function getLang(countryCode) {
  if (countryCode === "ID") return "id";
  if (countryCode === "DE") return "de";
  return "en";
}

function TypingIndicator() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 6px" }}>
      <img src="/xp/icons/Windows XP Icons/MSN Messenger.png" alt="" style={{ width: 16, height: 16, flexShrink: 0 }} />
      <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{
            width: 6, height: 6, borderRadius: "50%", background: "#4da830",
            animation: `msnBounce 1s ease-in-out ${i * 0.2}s infinite`,
            display: "inline-block",
          }} />
        ))}
      </div>
      <span style={{ fontSize: 10, color: "#888", fontStyle: "italic" }}>irham is typing...</span>
    </div>
  );
}

const bubbleIn = { animation: "msnFadeIn 0.25s ease-out" };

function IrhamBubble({ text, avatarUrl }) {
  return (
    <div style={{ display: "flex", gap: 6, marginBottom: 8, alignItems: "flex-start", ...bubbleIn }}>
      {avatarUrl ? (
        <img src={avatarUrl} alt="irham" style={{ width: 22, height: 22, borderRadius: 3, marginTop: 2, flexShrink: 0 }} />
      ) : (
        <img src="/xp/icons/Windows XP Icons/MSN Messenger.png" alt="irham" style={{ width: 20, height: 20, marginTop: 2, flexShrink: 0 }} />
      )}
      <div>
        <div style={{ fontSize: 10, color: "#3a8a20", fontWeight: "bold", marginBottom: 2 }}>irham</div>
        <div style={{
          background: "#e8f5e2", border: "1px solid #b2dfb0",
          borderRadius: "0 8px 8px 8px", padding: "5px 10px",
          fontSize: 12, color: "#222", maxWidth: 240, lineHeight: 1.5,
        }}>
          {text}
        </div>
      </div>
    </div>
  );
}

function UserBubble({ text }) {
  return (
    <div style={{ display: "flex", flexDirection: "row-reverse", gap: 6, marginBottom: 8, alignItems: "flex-start", ...bubbleIn }}>
      <div style={{
        width: 20, height: 20, borderRadius: "50%", background: "#316ac5",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 10, color: "white", flexShrink: 0, marginTop: 2,
      }}>
        Y
      </div>
      <div>
        <div style={{ fontSize: 10, color: "#316ac5", fontWeight: "bold", marginBottom: 2, textAlign: "right" }}>You</div>
        <div style={{
          background: "#dce8ff", border: "1px solid #b0c8f0",
          borderRadius: "8px 0 8px 8px", padding: "5px 10px",
          fontSize: 12, color: "#222", maxWidth: 240, lineHeight: 1.5,
        }}>
          {text}
        </div>
      </div>
    </div>
  );
}

export default function MSNMessengerWindow({ user }) {
  const [lang, setLang] = useState(null);
  const [stage, setStage] = useState(STAGE.LOADING);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState("");
  const [userName, setUserName] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const chatRef = useRef(null);
  const scriptRunning = useRef(false);
  const timeouts = useRef([]);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, isTyping]);

  // Clear timeouts on unmount
  useEffect(() => {
    return () => timeouts.current.forEach(clearTimeout);
  }, []);

  const runScript = (lines, onDone) => {
    scriptRunning.current = true;
    let total = 0;
    lines.forEach(({ delay, text }) => {
      total += delay;
      const t1 = setTimeout(() => setIsTyping(true), total - Math.min(delay * 0.6, 600));
      const t2 = setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [...prev, { from: "irham", text }]);
      }, total);
      timeouts.current.push(t1, t2);
    });
    const t3 = setTimeout(() => {
      scriptRunning.current = false;
      onDone?.();
    }, total + 100);
    timeouts.current.push(t3);
  };

  // Fetch geo, then start greeting
  useEffect(() => {
    let cancelled = false;
    const startGreeting = (detectedLang) => {
      if (cancelled) return;
      setLang(detectedLang);
      setStage(STAGE.GREETING);
      const script = SCRIPTS[detectedLang];
      const greetingTotal = script.greeting.reduce((s, l) => s + l.delay, 0);
      runScript(script.greeting, () => {
        const t = setTimeout(() => { if (!cancelled) setStage(STAGE.ASK_NAME); }, 200);
        timeouts.current.push(t);
      });
    };

    const fallbackTimer = setTimeout(() => startGreeting("en"), 2000);
    timeouts.current.push(fallbackTimer);

    fetch("https://ipapi.co/json/")
      .then((r) => r.json())
      .then((data) => {
        clearTimeout(fallbackTimer);
        startGreeting(getLang(data.country_code));
      })
      .catch(() => {
        clearTimeout(fallbackTimer);
        startGreeting("en");
      });

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const script = lang ? SCRIPTS[lang] : null;

  const canType = stage === STAGE.ASK_NAME || stage === STAGE.ASK_MESSAGE;

  const handleSend = () => {
    const text = input.trim();
    if (!text || !canType || !script) return;
    setMessages((prev) => [...prev, { from: "user", text }]);
    setInput("");

    if (stage === STAGE.ASK_NAME) {
      const name = text;
      setUserName(name);
      setStage(STAGE.GOT_NAME);
      const t = setTimeout(() => {
        setStage(STAGE.ASK_MESSAGE);
        runScript(script.gotName(name));
      }, 300);
      timeouts.current.push(t);
    } else if (stage === STAGE.ASK_MESSAGE) {
      setUserMessage(text);
      setStage(STAGE.READY_SEND);
      const t = setTimeout(() => runScript(script.readySend(userName)), 300);
      timeouts.current.push(t);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleEmailSend = () => {
    if (!script) return;
    const subject = encodeURIComponent(script.emailSubject(userName));
    const body = encodeURIComponent(script.emailBody(userName, userMessage));
    window.open(`mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`, "_blank");
    setMessages((prev) => [...prev, { from: "irham", text: script.sent(userName) }]);
    setStage(STAGE.SENT);
  };

  const placeholder = script
    ? (stage === STAGE.ASK_NAME ? script.placeholder.name : script.placeholder.message)
    : "";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", fontFamily: "Tahoma, sans-serif", fontSize: 12, background: "white" }}>

      {/* Header */}
      <div style={{
        background: "linear-gradient(180deg, #6dbf4e 0%, #4da830 50%, #3a8a20 100%)",
        padding: "8px 10px", display: "flex", alignItems: "center", gap: 8,
        borderBottom: "1px solid #2a6a10", flexShrink: 0,
      }}>
        {user?.avatar_url ? (
          <img
            src={user.avatar_url}
            alt="irham"
            style={{ width: 36, height: 36, borderRadius: 4, border: "2px solid rgba(255,255,255,0.4)", flexShrink: 0 }}
          />
        ) : (
          <img src="/xp/icons/Windows XP Icons/MSN Messenger.png" alt="MSN" style={{ width: 28, height: 28 }} />
        )}
        <div>
          <div style={{ color: "white", fontWeight: "bold", fontSize: 13, textShadow: "0 1px 2px rgba(0,0,0,0.4)" }}>
            {user?.name || user?.login || "irham"}
          </div>
          <div style={{ color: "#d0f0c0", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: "#00ff44" }} />
            Online — irhamputra.com
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div ref={chatRef} style={{ flex: 1, padding: "10px 10px 6px", overflowY: "auto", background: "white" }}>
        {stage === STAGE.LOADING && (
          <div style={{ color: "#aaa", fontSize: 11, fontStyle: "italic", textAlign: "center", paddingTop: 20 }}>
            Connecting...
          </div>
        )}
        {messages.map((msg, i) =>
          msg.from === "irham"
            ? <IrhamBubble key={i} text={msg.text} avatarUrl={user?.avatar_url} />
            : <UserBubble key={i} text={msg.text} />
        )}
        {isTyping && <TypingIndicator />}
      </div>

      {/* Input */}
      {stage !== STAGE.SENT && stage !== STAGE.LOADING && (
        <div style={{ borderTop: "1px solid #d0d0d0", padding: 8, background: "#f5f5f0", flexShrink: 0 }}>
          {stage === STAGE.READY_SEND ? (
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={handleEmailSend}
                style={{
                  padding: "5px 18px", fontSize: 12, fontFamily: "Tahoma, sans-serif",
                  cursor: "pointer", background: "#4da830", border: "1px solid #2a6a10",
                  borderRadius: 2, color: "white", fontWeight: "bold",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#3a8a20"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#4da830"; }}
              >
                {script?.sendBtn}
              </button>
            </div>
          ) : (
            <>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={!canType}
                rows={3}
                style={{
                  width: "100%", border: "1px solid #aaa", borderRadius: 2,
                  padding: 6, fontFamily: "Tahoma, sans-serif", fontSize: 12,
                  resize: "none", outline: "none",
                  background: canType ? "white" : "#f0f0ec",
                  color: canType ? "#000" : "#999",
                  boxSizing: "border-box", marginBottom: 6,
                }}
              />
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || !canType}
                  style={{
                    padding: "3px 16px", fontSize: 12, fontFamily: "Tahoma, sans-serif",
                    cursor: input.trim() && canType ? "pointer" : "default",
                    background: input.trim() && canType ? "#ece9d8" : "#f0f0ec",
                    border: "1px solid #767676", borderRadius: 2,
                    color: input.trim() && canType ? "#000" : "#999",
                  }}
                >
                  Send
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Footer */}
      <div style={{
        background: "linear-gradient(180deg, #d6e8ff 0%, #b8d4ff 100%)",
        borderTop: "1px solid #8aaee0", padding: "3px 10px",
        display: "flex", alignItems: "center", gap: 6,
        fontSize: 10, color: "#333", flexShrink: 0,
      }}>
        <img src="/xp/icons/Windows XP Icons/MSN Messenger.png" alt="" style={{ width: 14, height: 14 }} />
        <span>MSN Messenger 7.5</span>
        {lang && lang !== "en" && (
          <span style={{ marginLeft: "auto", opacity: 0.6 }}>
            {lang === "id" ? "🇮🇩" : lang === "de" ? "🇩🇪" : ""}
          </span>
        )}
      </div>

      <style>{`
        @keyframes msnBounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-4px); opacity: 1; }
        }
        @keyframes msnFadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
