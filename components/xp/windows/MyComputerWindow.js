export default function MyComputerWindow() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", fontFamily: "Tahoma, sans-serif" }}>
      {/* Address bar */}
      <div
        style={{
          padding: "3px 6px",
          background: "#ece9d8",
          borderBottom: "1px solid #aca899",
          fontSize: "11px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          flexShrink: 0,
        }}
      >
        <span>Address:</span>
        <div
          style={{
            flex: 1,
            background: "white",
            border: "1px solid #7f9db9",
            padding: "1px 6px",
            fontSize: "11px",
          }}
        >
          My Computer
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflow: "auto", padding: "12px" }}>
        <fieldset style={{ marginBottom: "12px" }}>
          <legend>System Information</legend>
          <table style={{ fontSize: "11px", width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td style={{ padding: "3px 8px", fontWeight: "bold", width: "140px" }}>OS:</td>
                <td style={{ padding: "3px 8px" }}>Windows XP Professional</td>
              </tr>
              <tr>
                <td style={{ padding: "3px 8px", fontWeight: "bold" }}>Version:</td>
                <td style={{ padding: "3px 8px" }}>irhamputra.com v2.0</td>
              </tr>
              <tr>
                <td style={{ padding: "3px 8px", fontWeight: "bold" }}>Registered to:</td>
                <td style={{ padding: "3px 8px" }}>Irham Putra</td>
              </tr>
            </tbody>
          </table>
        </fieldset>

        <fieldset style={{ marginBottom: "12px" }}>
          <legend>Hard Disk Drives</legend>
          <div style={{ display: "flex", gap: "16px", padding: "8px", flexWrap: "wrap" }}>
            <DriveItem label="Local Disk (C:)" tech="Next.js 16" usedPercent={42} />
            <DriveItem label="Projects (D:)" tech="React 19" usedPercent={67} />
            <DriveItem label="Styles (E:)" tech="Tailwind + XP.css" usedPercent={28} />
          </div>
        </fieldset>

        <fieldset>
          <legend>Tech Stack</legend>
          <div style={{ fontSize: "11px", padding: "8px", lineHeight: "1.8" }}>
            <div><strong>Framework:</strong> Next.js 16 (Pages Router)</div>
            <div><strong>Runtime:</strong> React 19</div>
            <div><strong>Styling:</strong> Tailwind CSS + XP.css</div>
            <div><strong>Data Source:</strong> GitHub API</div>
            <div><strong>HTTP Client:</strong> Axios</div>
            <div><strong>Deployment:</strong> Vercel</div>
          </div>
        </fieldset>
      </div>
    </div>
  );
}

function DriveItem({ label, tech, usedPercent }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", fontSize: "11px", minWidth: "80px" }}>
      <div
        style={{
          width: "40px", height: "32px", background: "#c0c0c0",
          border: "1px solid #888", borderRadius: "2px",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "9px", fontWeight: "bold",
        }}
      >
        HDD
      </div>
      <div style={{ fontWeight: "bold", textAlign: "center" }}>{label}</div>
      <div style={{ width: "80px", height: "8px", background: "#fff", border: "1px solid #888", borderRadius: "1px" }}>
        <div
          style={{
            width: `${usedPercent}%`, height: "100%",
            background: usedPercent > 80 ? "#c00" : "#0054e3",
            borderRadius: "1px",
          }}
        />
      </div>
      <div style={{ color: "#555", textAlign: "center" }}>{tech}</div>
    </div>
  );
}
