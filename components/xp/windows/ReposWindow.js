import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";

const ITEMS_PER_PAGE = 10;

export default function ReposWindow({ repos = [] }) {
  const [page, setPage] = useState(0);
  const [sortField, setSortField] = useState("updated_at");
  const [sortDir, setSortDir] = useState("desc");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const sorted = [...repos].sort((a, b) => {
    const aVal = a[sortField] || "";
    const bVal = b[sortField] || "";
    if (sortDir === "desc") return bVal > aVal ? 1 : -1;
    return aVal > bVal ? 1 : -1;
  });

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const paged = sorted.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const formatDate = (dateStr) => {
    try {
      return format(parseISO(dateStr), "MM/dd/yyyy");
    } catch {
      return dateStr;
    }
  };

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
          C:\My Documents\Repositories
        </div>
      </div>

      {/* Table — scrollable */}
      <div style={{ flex: 1, overflow: "auto" }}>
        {isMobile ? (
          /* Mobile: card list view */
          <div>
            {paged.map((repo) => (
              <div key={repo.id || repo.name} style={{ borderBottom: "1px solid #f0ede4", padding: "10px 12px", background: "white" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                  <a href={repo.html_url} target="_blank" rel="noopener noreferrer" style={{ color: "#0054e3", textDecoration: "none", fontSize: 13, fontWeight: 600, flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {repo.name}
                  </a>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                    {repo.language && <span className="xp-lang-chip">{repo.language}</span>}
                    {repo.stargazers_count > 0 && <span style={{ fontSize: 11, color: "#555" }}>⭐ {repo.stargazers_count}</span>}
                  </div>
                </div>
                {repo.description && (
                  <div style={{ fontSize: 11, color: "#555", marginTop: 3, lineHeight: 1.4 }}>
                    {repo.description.length > 80 ? repo.description.slice(0, 80) + "..." : repo.description}
                  </div>
                )}
                {repo.updated_at && (
                  <div style={{ fontSize: 10, color: "#888", marginTop: 4 }}>Updated: {formatDate(repo.updated_at)}</div>
                )}
              </div>
            ))}
            {paged.length === 0 && (
              <div style={{ textAlign: "center", padding: "20px", color: "#888", fontSize: 12 }}>
                No repositories found
              </div>
            )}
          </div>
        ) : (
          /* Desktop: table view */
          <table className="xp-explorer-list" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th onClick={() => handleSort("name")} style={{ width: "28%" }}>
                  Name {sortField === "name" ? (sortDir === "asc" ? "▲" : "▼") : ""}
                </th>
                <th style={{ width: "36%" }}>Description</th>
                <th onClick={() => handleSort("language")} style={{ width: "12%" }}>
                  Language
                </th>
                <th onClick={() => handleSort("stargazers_count")} style={{ width: "9%" }}>
                  Stars {sortField === "stargazers_count" ? (sortDir === "asc" ? "▲" : "▼") : ""}
                </th>
                <th onClick={() => handleSort("updated_at")} style={{ width: "15%" }}>
                  Modified {sortField === "updated_at" ? (sortDir === "asc" ? "▲" : "▼") : ""}
                </th>
              </tr>
            </thead>
            <tbody>
              {paged.map((repo) => (
                <tr key={repo.id || repo.name}>
                  <td>
                    <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                      {repo.name}
                    </a>
                  </td>
                  <td style={{ color: "#555" }}>
                    {repo.description
                      ? repo.description.length > 60
                        ? repo.description.slice(0, 60) + "..."
                        : repo.description
                      : "-"}
                  </td>
                  <td>
                    {repo.language ? (
                      <span className="xp-lang-chip">{repo.language}</span>
                    ) : "-"}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {repo.stargazers_count > 0 ? `⭐ ${repo.stargazers_count}` : "0"}
                  </td>
                  <td>{repo.updated_at ? formatDate(repo.updated_at) : "-"}</td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "20px", color: "#888" }}>
                    No repositories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination — pinned to bottom */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            padding: isMobile ? "6px 8px" : "4px 8px",
            background: "#ece9d8",
            borderTop: "1px solid #aca899",
            fontSize: "11px",
            flexShrink: 0,
          }}
        >
          <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0} style={{ padding: isMobile ? "4px 10px" : undefined }}>
            &lt; Back
          </button>
          <span>Page {page + 1} of {totalPages}</span>
          <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1} style={{ padding: isMobile ? "4px 10px" : undefined }}>
            Next &gt;
          </button>
        </div>
      )}
    </div>
  );
}
