import Desktop from "../components/xp/Desktop";
import GithubInstance from "../service/github";

export default function DesktopPage({ user, repos }) {
  return <Desktop user={user} repos={repos} />;
}

export async function getServerSideProps() {
  try {
    const [userRes, reposRes] = await Promise.all([
      GithubInstance.get("/irhamputra"),
      GithubInstance.get("/irhamputra/repos?per_page=100"),
    ]);

    const repos = reposRes.data.sort(
      (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
    );

    return {
      props: {
        user: userRes.data,
        repos,
      },
    };
  } catch {
    return {
      props: {
        user: null,
        repos: [],
      },
    };
  }
}
