import { useState, useRef, useEffect } from "react";

const I = (name) => `/xp/icons/Windows XP Icons/${name}.png`;

const SONGS = [
  { id: 1,  title: "In The End",            artist: "Linkin Park",       album: "Hybrid Theory",      duration: "3:36", year: 2001, size: "3.31 MB" },
  { id: 2,  title: "Complicated",           artist: "Avril Lavigne",     album: "Let Go",             duration: "4:04", year: 2002, size: "3.73 MB" },
  { id: 3,  title: "Without Me",            artist: "Eminem",            album: "The Eminem Show",    duration: "4:50", year: 2002, size: "4.43 MB" },
  { id: 4,  title: "Bring Me To Life",      artist: "Evanescence",       album: "Fallen",             duration: "3:57", year: 2003, size: "3.62 MB" },
  { id: 5,  title: "In Da Club",            artist: "50 Cent",           album: "Get Rich or Die Tryin'", duration: "3:13", year: 2003, size: "2.95 MB" },
  { id: 6,  title: "Hey Ya!",               artist: "Outkast",           album: "Speakerboxxx",       duration: "3:55", year: 2003, size: "3.59 MB" },
  { id: 7,  title: "Dragostea Din Tei",     artist: "O-Zone",            album: "Disco Zone",         duration: "3:33", year: 2003, size: "3.26 MB" },
  { id: 8,  title: "Dan",                   artist: "Sheila On 7",       album: "Kisah Klasik",       duration: "4:21", year: 2004, size: "3.99 MB" },
  { id: 9,  title: "Since U Been Gone",     artist: "Kelly Clarkson",    album: "Breakaway",          duration: "3:09", year: 2004, size: "2.89 MB" },
  { id: 10, title: "Yeah!",                 artist: "Usher",             album: "Confessions",        duration: "4:11", year: 2004, size: "3.84 MB" },
  { id: 11, title: "Axel F",               artist: "Crazy Frog",        album: "Crazy Hits",         duration: "3:24", year: 2005, size: "3.12 MB" },
  { id: 12, title: "Bad Day",              artist: "Daniel Powter",     album: "Daniel Powter",      duration: "3:58", year: 2005, size: "3.63 MB" },
  { id: 13, title: "My Humps",             artist: "Black Eyed Peas",   album: "Monkey Business",    duration: "5:28", year: 2005, size: "5.01 MB" },
  { id: 14, title: "Semua Tentang Kita",   artist: "Peterpan",          album: "Bintang di Surga",   duration: "4:15", year: 2005, size: "3.90 MB" },
  { id: 15, title: "Seberapa Pantas",      artist: "Sheila On 7",       album: "Pejantan Tangguh",   duration: "4:02", year: 2004, size: "3.70 MB" },
  { id: 16, title: "Welcome To My Life",   artist: "Simple Plan",       album: "Still Not Getting Any", duration: "3:31", year: 2004, size: "3.23 MB" },
  { id: 17, title: "Everytime We Touch",   artist: "Cascada",           album: "Everytime We Touch", duration: "3:37", year: 2006, size: "3.32 MB" },
  { id: 18, title: "Crazy In Love",        artist: "Beyoncé",           album: "Dangerously in Love", duration: "3:56", year: 2003, size: "3.61 MB" },
];

function SidePanel({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ marginBottom: 6 }}>
      <div
        onClick={() => setOpen((o) => !o)}
        style={{
          background: "linear-gradient(180deg,#3169c4 0%,#1d4ea0 100%)",
          color: "white", fontSize: 11, fontWeight: "bold",
          padding: "3px 8px", cursor: "default",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          userSelect: "none", borderRadius: open ? "4px 4px 0 0" : 4,
        }}
      >
        <span>{title}</span>
        <span style={{ fontSize: 8 }}>{open ? "▼" : "▶"}</span>
      </div>
      {open && (
        <div style={{
          background: "#dce4f5", border: "1px solid #7a96c2",
          borderTop: "none", padding: "6px 8px", borderRadius: "0 0 4px 4px",
        }}>
          {children}
        </div>
      )}
    </div>
  );
}

function SideAction({ icon, label, disabled, onClick }) {
  return (
    <div
      onClick={disabled ? undefined : onClick}
      style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "2px 0", cursor: disabled ? "default" : "pointer",
        fontSize: 11, color: disabled ? "#888" : "#0033a0",
        opacity: disabled ? 0.5 : 1,
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.textDecoration = "underline"; }}
      onMouseLeave={(e) => { e.currentTarget.style.textDecoration = "none"; }}
    >
      {icon && <img src={icon} alt="" style={{ width: 16, height: 16, flexShrink: 0 }} />}
      <span>{label}</span>
    </div>
  );
}

const COLS = [
  { key: "title",    label: "Name",     width: "30%" },
  { key: "artist",   label: "Artist",   width: "22%" },
  { key: "album",    label: "Album",    width: "25%" },
  { key: "duration", label: "Duration", width: "10%" },
  { key: "size",     label: "Size",     width: "13%" },
];

export default function MyMusicWindow() {
  const [selected, setSelected]     = useState(null);
  const [playing, setPlaying]       = useState(null);   // song id currently playing
  const [loading, setLoading]       = useState(false);  // fetching preview
  const [previewNull, setPreviewNull] = useState(false); // preview not available
  const [albumArt, setAlbumArt]     = useState(null);
  const [sortKey, setSortKey]       = useState("artist");
  const [sortAsc, setSortAsc]       = useState(true);
  const audioRef = useRef(null);

  // Stop and reset audio
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    setPlaying(null);
    setAlbumArt(null);
    setPreviewNull(false);
  };

  // Clean up audio on unmount
  useEffect(() => () => stopAudio(), []);

  const handleSort = (key) => {
    if (sortKey === key) setSortAsc((a) => !a);
    else { setSortKey(key); setSortAsc(true); }
  };

  const playSong = async (song) => {
    // If same song is playing, stop it
    if (playing === song.id) {
      stopAudio();
      return;
    }

    // Stop previous song
    stopAudio();
    setLoading(true);
    setPreviewNull(false);

    try {
      const params = new URLSearchParams({ title: song.title, artist: song.artist });
      const res = await fetch(`/api/spotify/preview?${params}`);
      const data = await res.json();

      if (!data.preview_url) {
        setPreviewNull(true);
        setLoading(false);
        return;
      }

      setAlbumArt(data.album_image ?? null);
      audioRef.current.src = data.preview_url;
      audioRef.current.play();
      setPlaying(song.id);
    } catch {
      setPreviewNull(true);
    } finally {
      setLoading(false);
    }
  };

  const sorted = [...SONGS].sort((a, b) => {
    const va = a[sortKey] ?? "";
    const vb = b[sortKey] ?? "";
    const cmp = String(va).localeCompare(String(vb));
    return sortAsc ? cmp : -cmp;
  });

  const selectedSong = SONGS.find((s) => s.id === selected) ?? null;
  const playingSong  = SONGS.find((s) => s.id === playing)  ?? null;

  const statusText = () => {
    if (loading)      return "⏳ Loading preview...";
    if (previewNull)  return "⚠ Preview not available for this track";
    if (playingSong)  return `♪ Now Playing: ${playingSong.artist} — ${playingSong.title}`;
    return "Double-click a song to play";
  };

  const statusColor = () => {
    if (loading)     return "#888";
    if (previewNull) return "#c04a00";
    if (playingSong) return "#316ac5";
    return "#888";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", fontFamily: "Tahoma, sans-serif", fontSize: 12, background: "#ece9d8" }}>

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onEnded={() => { setPlaying(null); setAlbumArt(null); }}
      />

      {/* Toolbar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 2, padding: "2px 4px",
        background: "#ece9d8", borderBottom: "1px solid #aca899", flexShrink: 0,
      }}>
        <button
          onClick={() => selected && playSong(SONGS.find((s) => s.id === selected))}
          disabled={!selected || loading}
          title={playing === selected ? "Stop" : "Play"}
          style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 1,
            padding: "2px 8px", background: "transparent",
            border: "1px solid transparent", borderRadius: 2,
            cursor: selected && !loading ? "pointer" : "default",
            opacity: selected && !loading ? 1 : 0.4, fontSize: 10, color: "#222",
          }}
          onMouseEnter={(e) => { if (selected && !loading) e.currentTarget.style.border = "1px solid #7a96c2"; }}
          onMouseLeave={(e) => { e.currentTarget.style.border = "1px solid transparent"; }}
        >
          <img src={I("Windows Media Player 10")} alt="Play" style={{ width: 20, height: 20 }} />
          <span>{playing === selected ? "Stop" : "Play"}</span>
        </button>
      </div>

      {/* Address bar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 6, padding: "2px 6px",
        background: "#ece9d8", borderBottom: "1px solid #aca899", flexShrink: 0,
      }}>
        <span style={{ fontSize: 11, color: "#444" }}>Address</span>
        <div style={{
          flex: 1, display: "flex", alignItems: "center", gap: 4,
          background: "white", border: "1px solid #7f9db9", padding: "1px 6px",
        }}>
          <img src={I("My Music")} alt="" style={{ width: 16, height: 16 }} />
          <span style={{ fontSize: 11 }}>C:\Documents and Settings\irham\My Documents\My Music</span>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* Sidebar */}
        <div style={{
          width: 160, flexShrink: 0, background: "#dce4f5",
          borderRight: "1px solid #7a96c2", overflowY: "auto", padding: 6,
        }}>
          <SidePanel title="Music Tasks">
            <SideAction
              icon={I("Windows Media Player 10")}
              label="Play all"
              onClick={() => playSong(sorted[0])}
            />
            <SideAction icon={I("WMP Import Playlist")} label="Shop for music" disabled />
          </SidePanel>

          <SidePanel title="Other Places">
            <SideAction icon={I("My Documents")} label="My Documents" disabled />
            <SideAction icon={I("My Computer")}  label="My Computer"  disabled />
          </SidePanel>

          {/* Now Playing art in sidebar */}
          {playingSong && (
            <SidePanel title="Now Playing">
              <div style={{ fontSize: 10, color: "#333", lineHeight: 1.7, textAlign: "center" }}>
                {albumArt ? (
                  <img
                    src={albumArt}
                    alt="album art"
                    style={{ width: 96, height: 96, objectFit: "cover", marginBottom: 4, border: "1px solid #7a96c2" }}
                  />
                ) : (
                  <img src={I("Generic Audio")} alt="" style={{ width: 48, height: 48, marginBottom: 4 }} />
                )}
                <div style={{ fontWeight: "bold", wordBreak: "break-word" }}>{playingSong.title}</div>
                <div style={{ color: "#555" }}>{playingSong.artist}</div>
                <div style={{ color: "#888", fontSize: 9 }}>30s preview</div>
                <div
                  onClick={stopAudio}
                  style={{ marginTop: 4, color: "#0033a0", cursor: "pointer", fontSize: 10 }}
                  onMouseEnter={(e) => { e.currentTarget.style.textDecoration = "underline"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.textDecoration = "none"; }}
                >
                  ■ Stop
                </div>
              </div>
            </SidePanel>
          )}

          {selectedSong && !playingSong && (
            <SidePanel title="Details">
              <div style={{ fontSize: 10, color: "#333", lineHeight: 1.7 }}>
                <div style={{ textAlign: "center", marginBottom: 4 }}>
                  <img src={I("Generic Audio")} alt="" style={{ width: 32, height: 32 }} />
                </div>
                <div style={{ fontWeight: "bold", wordBreak: "break-word" }}>{selectedSong.title}</div>
                <div style={{ color: "#555" }}>{selectedSong.artist}</div>
                <div style={{ color: "#555" }}>{selectedSong.album}</div>
                <div style={{ color: "#777", marginTop: 2 }}>{selectedSong.year} · {selectedSong.duration}</div>
                <div style={{ color: "#777" }}>{selectedSong.size}</div>
              </div>
            </SidePanel>
          )}
        </div>

        {/* File list */}
        <div
          style={{ flex: 1, background: "white", overflow: "auto" }}
          onClick={(e) => { if (e.target === e.currentTarget) setSelected(null); }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
            <thead>
              <tr>
                {COLS.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    style={{
                      width: col.width,
                      padding: "2px 8px", textAlign: "left",
                      background: sortKey === col.key
                        ? "linear-gradient(180deg,#dce4f5,#b8c8e8)"
                        : "linear-gradient(180deg,#f0ede4,#ddd9c8)",
                      borderRight: "1px solid #aca899", borderBottom: "1px solid #aca899",
                      fontSize: 11, fontWeight: "normal", cursor: "pointer",
                      userSelect: "none", whiteSpace: "nowrap",
                    }}
                  >
                    {col.label}
                    {sortKey === col.key && (
                      <span style={{ marginLeft: 4, fontSize: 9 }}>{sortAsc ? "▲" : "▼"}</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((song) => {
                const isSelected = selected === song.id;
                const isPlaying  = playing  === song.id;
                const isLoading  = loading  && selected === song.id;
                return (
                  <tr
                    key={song.id}
                    onClick={(e) => { e.stopPropagation(); setSelected(song.id); }}
                    onDoubleClick={() => playSong(song)}
                    style={{
                      background: isSelected ? "#316ac5" : "transparent",
                      color: isSelected ? "white" : "#000",
                      cursor: "default",
                    }}
                    onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = "#eef3fb"; }}
                    onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = ""; }}
                  >
                    <td style={{ padding: "2px 8px", whiteSpace: "nowrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <img
                          src={isPlaying ? I("Windows Media Player 10") : I("Generic Audio")}
                          alt=""
                          style={{ width: 16, height: 16, flexShrink: 0 }}
                        />
                        <span style={{ fontWeight: isPlaying ? "bold" : "normal" }}>
                          {song.title}
                          {isLoading && (
                            <span style={{ marginLeft: 6, fontSize: 10, color: isSelected ? "#adf" : "#888" }}>
                              loading...
                            </span>
                          )}
                          {isPlaying && !isLoading && (
                            <span style={{ marginLeft: 6, fontSize: 10, color: isSelected ? "#adf" : "#316ac5" }}>
                              ♪ playing
                            </span>
                          )}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "2px 8px", whiteSpace: "nowrap" }}>{song.artist}</td>
                    <td style={{ padding: "2px 8px", whiteSpace: "nowrap", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis" }}>{song.album}</td>
                    <td style={{ padding: "2px 8px", whiteSpace: "nowrap", textAlign: "right" }}>{song.duration}</td>
                    <td style={{ padding: "2px 8px", whiteSpace: "nowrap", textAlign: "right" }}>{song.size}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status bar */}
      <div style={{
        padding: "2px 8px", background: "#ece9d8", borderTop: "1px solid #aca899",
        fontSize: 11, color: "#444", flexShrink: 0,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span>{SONGS.length} objects</span>
        <span style={{ color: statusColor(), fontWeight: playingSong ? "bold" : "normal" }}>
          {statusText()}
        </span>
      </div>
    </div>
  );
}
