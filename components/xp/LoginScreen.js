import { useState } from "react";
import { useRouter } from "next/router";

export default function LoginScreen({ user }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      router.push("/desktop");
    }, 2000);
  };

  if (loading) {
    return (
      <div className="xp-loading-screen" style={{ animation: "none" }}>
        <div style={{ fontSize: "1.5rem", fontWeight: "bold", fontStyle: "italic" }}>
          Windows<span style={{ fontSize: "0.7em", verticalAlign: "super" }}>XP</span>
        </div>
        <div className="xp-loading-text">Loading your personal settings...</div>
        <div
          style={{
            marginTop: "24px",
            width: "200px",
            height: "6px",
            background: "rgba(255,255,255,0.2)",
            borderRadius: "3px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: "40%",
              height: "100%",
              background: "white",
              borderRadius: "3px",
              animation: "loadingBar 1.5s ease-in-out infinite",
            }}
          />
        </div>
        <style jsx>{`
          @keyframes loadingBar {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(350%); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="xp-login-screen">
      <div className="xp-login-header">
        <h1>
          Windows<span style={{ fontSize: "0.7em", verticalAlign: "super" }}>XP</span>
        </h1>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px",
        }}
      >
        <div
          style={{
            fontSize: "1rem",
            textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
            marginBottom: "8px",
          }}
        >
          To begin, click your user name
        </div>

        <div className="xp-login-user-card" onClick={handleLogin}>
          <img
            src={user?.avatar_url || "/xp/icons/Windows XP Icons/User Accounts.png"}
            alt={user?.login || "User"}
          />
          <div>
            <div className="user-name">{user?.name || user?.login || "User"}</div>
            <div style={{ fontSize: "0.8rem", opacity: 0.8 }}>
              Software Engineer
            </div>
          </div>
        </div>
      </div>

      <div className="xp-login-footer">
        <button
          style={{
            background: "none",
            border: "1px solid rgba(255,255,255,0.3)",
            color: "white",
            padding: "6px 16px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "0.8rem",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
          onClick={() => {}}
        >
          Turn off computer
        </button>
      </div>
    </div>
  );
}
