import { useState } from "react";
import { format, parseISO } from "date-fns";

const ITEMS_PER_PAGE = 10;

export default function ReposWindow({ repos = [] }) {
  const [page, setPage] = useState(0);
  const [sortField, setSortField] = useState("updated_at");
  const [sortDir, setSortDir] = useState("desc");

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
      </div>

      {/* Pagination — pinned to bottom */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            padding: "4px 8px",
            background: "#ece9d8",
            borderTop: "1px solid #aca899",
            fontSize: "11px",
            flexShrink: 0,
          }}
        >
          <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}>
            &lt; Back
          </button>
          <span>Page {page + 1} of {totalPages}</span>
          <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1}>
            Next &gt;
          </button>
        </div>
      )}
    </div>
  );
}
