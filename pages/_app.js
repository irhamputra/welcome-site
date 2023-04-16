import "../styles/globals.css";
import { QueryClientProvider, QueryClient } from "react-query";
import Navigation from "../components/navigation";
import Layout from "../components/layout";
import UserProvider from "../context/user";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  return (
    <div className="debug-screens">
      <UserProvider value={pageProps.user}>
        <QueryClientProvider client={queryClient}>
          <Layout>
            <Navigation />
            <Component {...pageProps} />
          </Layout>
        </QueryClientProvider>
      </UserProvider>
    </div>
  );
}

export default MyApp;
