export default function BSODScreen({ onDismiss }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#0000aa",
        color: "white",
        fontFamily: "'Courier New', monospace",
        fontSize: 14,
        padding: "40px 60px",
        zIndex: 99999,
        cursor: "default",
        userSelect: "none",
      }}
      onClick={onDismiss}
      onKeyDown={onDismiss}
      tabIndex={0}
    >
      <p style={{ marginBottom: 24 }}>
        A problem has been detected and Windows has been shut down to prevent damage
        to your computer.
      </p>

      <p style={{ marginBottom: 24, fontWeight: "bold" }}>
        IRRECOVERABLY_AWESOME_DEVELOPER
      </p>

      <p style={{ marginBottom: 24 }}>
        If this is the first time you&apos;ve seen this Stop error screen,<br />
        restart your computer. If this screen appears again, follow<br />
        these steps:
      </p>

      <p style={{ marginBottom: 24 }}>
        Check to make sure any new hardware or software is properly installed.<br />
        If this is a new installation, ask your hardware or software manufacturer<br />
        for any Windows updates you might need.
      </p>

      <p style={{ marginBottom: 24 }}>
        If problems continue, disable or remove any newly installed hardware<br />
        or software. Disable BIOS memory options such as caching or shadowing.<br />
        If you need to use Safe Mode to remove or disable components, restart<br />
        your computer, press F8 to select Advanced Startup Options, and then<br />
        select Safe Mode.
      </p>

      <p style={{ marginBottom: 32 }}>
        Technical information:
      </p>

      <p style={{ marginBottom: 24 }}>
        *** STOP: 0x000000CE (0xFEEDC0DE, 0xDEADBEEF, 0x00000000, 0xCAFEBABE)
      </p>

      <p style={{ marginBottom: 32 }}>
        *** irhamputra.com (personal_portfolio+0x00000001)
      </p>

      <p style={{ color: "#aaaaff" }}>
        Beginning dump of physical memory...<br />
        Physical memory dump complete.<br />
        <br />
        Contact your system administrator or technical support group for<br />
        further assistance. Press any key to restart.
      </p>
    </div>
  );
}
