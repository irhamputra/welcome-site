import "../styles/globals.css";
import { QueryClientProvider, QueryClient } from "react-query";
import SEO from "../components/SEO";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  return (
    <div
      className={
        process.env.NODE_ENV === "development"
          ? "debug-screens h-full"
          : "h-full"
      }
    >
      <QueryClientProvider client={queryClient}>
        <SEO />
        <Component {...pageProps} />
      </QueryClientProvider>
    </div>
  );
}

export default MyApp;
