import { useState } from "react";
import { useRouter } from "next/router";

export default function LoginScreen({ user }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => router.push("/desktop"), 2200);
  };

  if (loading) {
    return <LoadingScreen user={user} />;
  }

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "#0a1f6e",
      display: "flex", flexDirection: "column",
      fontFamily: "Tahoma, 'Franklin Gothic Medium', Arial, sans-serif",
      userSelect: "none", overflow: "hidden",
    }}>
      {/* Top bar */}
      <div style={{
        background: "linear-gradient(180deg, #1a4bad 0%, #1246b5 40%, #0e3fa8 100%)",
        borderBottom: "2px solid #0832a0",
        display: "flex", alignItems: "center",
        padding: "10px 24px", gap: 14, flexShrink: 0,
        boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
      }}>
        <img
          src="/xp/icons/Windows XP.ico"
          alt="Windows XP"
          style={{ width: 40, height: 40, flexShrink: 0 }}
        />
        <div>
          <div style={{
            color: "white", fontStyle: "italic", fontWeight: "bold",
            fontSize: 28, lineHeight: 1,
            textShadow: "1px 1px 3px rgba(0,0,0,0.5)",
            letterSpacing: 1,
          }}>
            Windows
            <span style={{ fontSize: "0.55em", verticalAlign: "super", fontWeight: "bold", letterSpacing: 2 }}>XP</span>
          </div>
          <div style={{
            color: "#a8c8f8", fontSize: 11, letterSpacing: 3,
            textTransform: "uppercase", marginTop: 1,
          }}>
            Professional
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 3, background: "linear-gradient(90deg, #1c5bd4 0%, #4a8be8 50%, #1c5bd4 100%)", flexShrink: 0 }} />

      {/* Main content */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        background: "linear-gradient(180deg, #0e3fa8 0%, #0a2d8c 40%, #071e6e 100%)",
        padding: "40px 20px",
      }}>
        {/* Instruction text */}
        <div style={{
          color: "white", fontSize: 15, marginBottom: 32,
          textShadow: "0 1px 3px rgba(0,0,0,0.6)",
          letterSpacing: 0.3,
        }}>
          To begin, click your user name
        </div>

        {/* User card */}
        <div
          onClick={handleLogin}
          style={{
            display: "flex", alignItems: "center", gap: 16,
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.25)",
            borderRadius: 6, padding: "12px 28px 12px 16px",
            cursor: "pointer", minWidth: 260,
            transition: "background 0.15s",
            boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.22)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
        >
          <img
            src={user?.avatar_url || "/xp/icons/Windows XP Icons/User Accounts.png"}
            alt={user?.login || "User"}
            style={{
              width: 64, height: 64, borderRadius: 4,
              border: "2px solid rgba(255,255,255,0.5)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
              flexShrink: 0,
            }}
          />
          <div>
            <div style={{
              color: "white", fontSize: 16, fontWeight: "bold",
              textShadow: "0 1px 2px rgba(0,0,0,0.5)",
            }}>
              {user?.name || user?.login || "User"}
            </div>
            <div style={{ color: "#b8d4f8", fontSize: 12, marginTop: 2 }}>
              Software Engineer
            </div>
          </div>
        </div>

        {/* Hint arrow */}
        <div style={{
          marginTop: 24, color: "rgba(255,255,255,0.45)",
          fontSize: 12, display: "flex", alignItems: "center", gap: 6,
        }}>
          <span>↑</span>
          <span>Click to log on</span>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 3, background: "linear-gradient(90deg, #1c5bd4 0%, #4a8be8 50%, #1c5bd4 100%)", flexShrink: 0 }} />

      {/* Bottom bar */}
      <div style={{
        background: "linear-gradient(180deg, #1246b5 0%, #0e3fa8 100%)",
        borderTop: "2px solid #0832a0",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 24px", flexShrink: 0,
        boxShadow: "0 -2px 8px rgba(0,0,0,0.3)",
      }}>
        <FooterBtn
          icon="🔴"
          label="Turn off computer"
          onClick={() => {}}
        />
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>
          After you log on, you can add or change accounts.
        </div>
      </div>
    </div>
  );
}

/* ─── Loading Screen ──────────────────────────────────────────────── */
function LoadingScreen({ user }) {
  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "#071e6e",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      fontFamily: "Tahoma, Arial, sans-serif",
      userSelect: "none",
    }}>
      <img
        src="/xp/icons/Windows XP.ico"
        alt="Windows XP"
        style={{ width: 56, height: 56, marginBottom: 20 }}
      />
      <div style={{
        color: "white", fontStyle: "italic", fontWeight: "bold",
        fontSize: 36, lineHeight: 1, marginBottom: 32,
        textShadow: "1px 2px 4px rgba(0,0,0,0.5)",
      }}>
        Windows
        <span style={{ fontSize: "0.55em", verticalAlign: "super", letterSpacing: 2 }}>XP</span>
      </div>

      {user?.avatar_url && (
        <img
          src={user.avatar_url}
          alt={user.name}
          style={{
            width: 60, height: 60, borderRadius: 4,
            border: "2px solid rgba(255,255,255,0.4)",
            marginBottom: 12,
          }}
        />
      )}

      <div style={{ color: "#b8d4f8", fontSize: 14, marginBottom: 20 }}>
        Loading your personal settings...
      </div>

      {/* XP-style progress bar */}
      <div style={{
        width: 220, height: 8,
        background: "rgba(255,255,255,0.12)",
        borderRadius: 4, overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.2)",
      }}>
        <div style={{
          width: "38%", height: "100%",
          background: "linear-gradient(90deg, #4a9af0, #80c4ff, #4a9af0)",
          borderRadius: 4,
          animation: "xpLoadingBar 1.4s ease-in-out infinite",
        }} />
      </div>

      <style jsx>{`
        @keyframes xpLoadingBar {
          0%   { transform: translateX(-120%); }
          100% { transform: translateX(380%); }
        }
      `}</style>
    </div>
  );
}

/* ─── Footer Button ───────────────────────────────────────────────── */
function FooterBtn({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 8,
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.2)",
        borderRadius: 4, color: "white",
        padding: "5px 14px", cursor: "pointer",
        fontSize: 12, fontFamily: "Tahoma, sans-serif",
      }}
      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
      onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
    >
      <span>{icon}</span>
      {label}
    </button>
  );
}
