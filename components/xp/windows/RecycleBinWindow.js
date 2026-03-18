export default function RecycleBinWindow() {
  return (
    <div>
      <div
        style={{
          padding: "4px 8px",
          background: "#ece9d8",
          borderBottom: "1px solid #aca899",
          fontSize: "11px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span>Address:</span>
        <div
          style={{
            flex: 1,
            background: "white",
            border: "1px solid #7f9db9",
            padding: "2px 6px",
            borderRadius: "1px",
          }}
        >
          Recycle Bin
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 16px",
          color: "#888",
          fontSize: "12px",
          textAlign: "center",
        }}
      >
        <img
          src="/xp/icons/Windows XP Icons/Recycle Bin (empty).png"
          alt="Recycle Bin"
          style={{ width: "64px", height: "64px", opacity: 0.5, marginBottom: "16px" }}
        />
        <div>Recycle Bin is empty.</div>
        <div style={{ marginTop: "8px", fontSize: "11px" }}>
          No deleted items to display.
        </div>
      </div>
    </div>
  );
}
