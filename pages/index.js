import styles from "../styles/Home.module.css";
import Typed from "react-typed";
import { RiLinkedinFill, RiGithubFill } from "react-icons/ri";
import { useState } from "react";
import { DefaultSeo } from "next-seo";

export default function Home() {
  const [isComplete, setIsComplete] = useState(false);

  return (
    <div className={styles.container}>
      <DefaultSeo
        title="Irham Putra Prasetyo"
        description="Irham Putra Prasetyo Website"
      />

      <Typed
        className={styles.title}
        smartBackspace
        showCursor
        strings={[
          "Hi! I'm Irham Putra Prasetyo and I come from Indonesia. <br/> I currently work as Senior Software Engineer and <br/> Software Architect in Germany. <br/> My current tech stacks are React + TypeScript, <br/> Node.js, Vue.js and Rust. <br/> Thank you and stay healthy. Tschüß!",
        ]}
        typeSpeed={70}
        backSpeed={68}
        onComplete={() => {
          setInterval(() => {
            setIsComplete(true);
          }, 1200);
        }}
      />

      <div style={{ display: "flex", justifyContent: "end", margin: 20 }}>
        {isComplete ? (
          <>
            <a
              href="https://www.linkedin.com/in/muhamad-irham-prasetyo/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <RiLinkedinFill size={30} color="#0e76a8" />
            </a>

            <a
              href="https://github.com/irhamputra"
              target="_blank"
              style={{ marginLeft: 10 }}
              rel="noopener noreferrer"
            >
              <RiGithubFill size={30} color="black" />
            </a>
          </>
        ) : (
          <p />
        )}
      </div>

      <div className={styles.logo}>
        <img src="/me.png" width={280} alt="Vercel Logo" />
      </div>
    </div>
  );
}

export const getServerSideProps = () => {
  return {
    props: {},
  };
};
