import LoginScreen from "../components/xp/LoginScreen";
import GithubInstance from "../service/github";

export default function Home({ user }) {
  return <LoginScreen user={user} />;
}

export async function getServerSideProps() {
  try {
    const { data: user } = await GithubInstance.get("/irhamputra");
    return { props: { user } };
  } catch {
    return { props: { user: null } };
  }
}
