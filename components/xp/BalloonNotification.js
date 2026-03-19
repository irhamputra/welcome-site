export default function BalloonNotification({ onAccept, onDecline }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 46,
        right: 8,
        width: 248,
        background: "white",
        border: "1px solid #767676",
        borderRadius: 4,
        boxShadow: "2px 2px 8px rgba(0,0,0,0.4)",
        fontFamily: "Tahoma, sans-serif",
        fontSize: 11,
        zIndex: 9999,
        animation: "fadeIn 0.15s ease-out",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div style={{
        background: "linear-gradient(180deg, #fff9c4 0%, #fffde0 100%)",
        borderBottom: "1px solid #c8b400",
        padding: "4px 6px 4px 8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: "3px 3px 0 0",
        gap: 6,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5, minWidth: 0 }}>
          <img
            src="/xp/icons/Windows XP Icons/MSN Messenger.png"
            alt="MSN"
            style={{ width: 14, height: 14, flexShrink: 0 }}
          />
          <span style={{ fontWeight: "bold", color: "#333", fontSize: 11, whiteSpace: "nowrap" }}>
            MSN Messenger
          </span>
        </div>
        <button
          onClick={onDecline}
          aria-label="Close"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 16,
            height: 16,
            flexShrink: 0,
            background: "none",
            border: "1px solid transparent",
            borderRadius: 2,
            cursor: "pointer",
            fontSize: 10,
            color: "#555",
            lineHeight: 1,
            padding: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#c0392b";
            e.currentTarget.style.color = "white";
            e.currentTarget.style.borderColor = "#922b21";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "none";
            e.currentTarget.style.color = "#555";
            e.currentTarget.style.borderColor = "transparent";
          }}
        >
          ✕
        </button>
      </div>

      {/* Body */}
      <div style={{ padding: "8px 10px 8px" }}>
        <p style={{ margin: "0 0 8px", color: "#333", lineHeight: "1.5" }}>
          <strong>irham</strong> wants to add you to his contact list.
        </p>
        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={onAccept}
            style={{
              padding: "3px 14px",
              fontSize: 11,
              fontFamily: "Tahoma, sans-serif",
              cursor: "pointer",
              background: "#ece9d8",
              border: "1px solid #767676",
              borderRadius: 2,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#ddd9c8"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#ece9d8"; }}
          >
            Yes
          </button>
          <button
            onClick={onDecline}
            style={{
              padding: "3px 14px",
              fontSize: 11,
              fontFamily: "Tahoma, sans-serif",
              cursor: "pointer",
              background: "#ece9d8",
              border: "1px solid #767676",
              borderRadius: 2,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#ddd9c8"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#ece9d8"; }}
          >
            No
          </button>
        </div>
      </div>

      {/* Pointer triangle */}
      <div style={{
        position: "absolute",
        bottom: -9,
        right: 32,
        width: 0,
        height: 0,
        borderLeft: "9px solid transparent",
        borderRight: "9px solid transparent",
        borderTop: "9px solid #767676",
      }} />
      <div style={{
        position: "absolute",
        bottom: -8,
        right: 33,
        width: 0,
        height: 0,
        borderLeft: "8px solid transparent",
        borderRight: "8px solid transparent",
        borderTop: "8px solid white",
      }} />
    </div>
  );
}
