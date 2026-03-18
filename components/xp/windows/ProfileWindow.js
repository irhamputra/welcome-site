export default function ProfileWindow({ user }) {
  if (!user) {
    return <div style={{ padding: "16px" }}>No user data available.</div>;
  }

  return (
    <div style={{ fontFamily: "Tahoma, sans-serif", padding: "8px", height: "100%", overflow: "auto", boxSizing: "border-box" }}>
      <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
        <img
          src={user.avatar_url}
          alt={user.login}
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "4px",
            border: "1px solid #aca899",
          }}
        />
        <div>
          <div style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "4px" }}>
            {user.name || user.login}
          </div>
          <div style={{ fontSize: "12px", color: "#555" }}>@{user.login}</div>
          {user.bio && (
            <div style={{ fontSize: "11px", marginTop: "8px", color: "#333" }}>
              {user.bio}
            </div>
          )}
        </div>
      </div>

      <fieldset>
        <legend>Details</legend>
        <table style={{ fontSize: "11px", width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            {user.location && (
              <tr>
                <td style={{ padding: "3px 8px", fontWeight: "bold", width: "100px" }}>Location:</td>
                <td style={{ padding: "3px 8px" }}>{user.location}</td>
              </tr>
            )}
            {user.company && (
              <tr>
                <td style={{ padding: "3px 8px", fontWeight: "bold" }}>Company:</td>
                <td style={{ padding: "3px 8px" }}>{user.company}</td>
              </tr>
            )}
            {user.blog && (
              <tr>
                <td style={{ padding: "3px 8px", fontWeight: "bold" }}>Website:</td>
                <td style={{ padding: "3px 8px" }}>
                  <a href={user.blog.startsWith("http") ? user.blog : `https://${user.blog}`} target="_blank" rel="noopener noreferrer">
                    {user.blog}
                  </a>
                </td>
              </tr>
            )}
            {user.twitter_username && (
              <tr>
                <td style={{ padding: "3px 8px", fontWeight: "bold" }}>Twitter:</td>
                <td style={{ padding: "3px 8px" }}>
                  <a href={`https://twitter.com/${user.twitter_username}`} target="_blank" rel="noopener noreferrer">
                    @{user.twitter_username}
                  </a>
                </td>
              </tr>
            )}
            <tr>
              <td style={{ padding: "3px 8px", fontWeight: "bold" }}>GitHub:</td>
              <td style={{ padding: "3px 8px" }}>
                <a href={user.html_url} target="_blank" rel="noopener noreferrer">
                  {user.html_url}
                </a>
              </td>
            </tr>
            <tr>
              <td style={{ padding: "3px 8px", fontWeight: "bold" }}>Repos:</td>
              <td style={{ padding: "3px 8px" }}>{user.public_repos}</td>
            </tr>
            <tr>
              <td style={{ padding: "3px 8px", fontWeight: "bold" }}>Followers:</td>
              <td style={{ padding: "3px 8px" }}>{user.followers}</td>
            </tr>
            <tr>
              <td style={{ padding: "3px 8px", fontWeight: "bold" }}>Following:</td>
              <td style={{ padding: "3px 8px" }}>{user.following}</td>
            </tr>
          </tbody>
        </table>
      </fieldset>
    </div>
  );
}
