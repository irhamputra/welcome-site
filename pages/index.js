import styles from "../styles/Home.module.css";
import { DefaultSeo } from "next-seo";

export default function Home() {
  return (
    <>
      <DefaultSeo
        title="Irham Putra Prasetyo"
        description="Irham Putra Prasetyo Website"
      />

      <div className={styles.bg} />
    </>
  );
}

export const getServerSideProps = () => {
  return {
    props: {},
  };
};
