import * as React from "react";
import { DefaultSeo } from "next-seo";
import Image from "next/image";
import { Flex } from "@chakra-ui/react";

const links = [
  "https://github.com/irhamputra",
  "https://twitter.com/irhmptra",
  "https://www.linkedin.com/in/muhamad-irham-prasetyo/",
];

export default function Home() {
  const handleOpenLink = React.useCallback(() => {
    window.open(links[Math.floor(Math.random() * links.length)], "_blank");
  }, []);

  return (
    <>
      <DefaultSeo
        title="Irham Putra Prasetyo"
        description="Get to know me first by looking this site with Stories"
        twitter={{
          handle: "@IRHMPTRA",
          site: "@IRHMPTRA",
          cardType: "summary_large_image",
        }}
        openGraph={{
          site_name: "Irham Putra Prasetyo",
          url: "https://irhamputra.com",
          title: "Irham Putra Prasetyo",
          description:
            "Get to know me first by looking my Instagram Stories look like",
          images: [
            {
              url:
                "https://irhamputra.com/_next/image?url=%2Firhamputra.jpg&w=256&q=75",
              width: 800,
              height: 600,
              alt: "Irham Putra",
            },
          ],
        }}
      />

      <Flex justifyItems="center" justifyContent="center" minH="100%">
        <Image
          onClick={handleOpenLink}
          src="/me-computer.svg"
          width={700}
          height={700}
          alt="pic"
        />
      </Flex>
    </>
  );
}

export const getServerSideProps = () => {
  return {
    props: {},
  };
};
