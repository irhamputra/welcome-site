import "xp.css/dist/XP.css";
import "../styles/globals.css";
import Head from "next/head";
import { WindowManagerProvider } from "../context/windowManager";

export default function MyApp({ Component, pageProps }) {
  return (
    <WindowManagerProvider>
      <Head>
        <title>Irham Putra | Windows XP</title>
        <meta name="description" content="Irham Putra - Software Engineer - Personal Portfolio (Windows XP Edition)" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href={pageProps.user?.avatar_url || "https://avatars.githubusercontent.com/irhamputra"} />
      </Head>
      <Component {...pageProps} />
    </WindowManagerProvider>
  );
}
