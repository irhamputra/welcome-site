import { DefaultSeo } from "next-seo";
import Image from "next/image";
import { Box, Button, Flex } from "@chakra-ui/react";

import { useDisclosure } from "@chakra-ui/react";
import Story from "../components/Stories";

export default function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure();

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

      <Flex alignItems="center" justify="center" minH="100%">
        <Box>
          <Image src="/me.png" width={250} height={250} alt="pic" />
          <Flex justify="center">
            <Button onClick={onOpen} variant="outline">
              Get to know me 🤔
            </Button>
          </Flex>
        </Box>
      </Flex>

      <Story onClose={onClose} isOpen={isOpen} />
    </>
  );
}

export const getServerSideProps = () => {
  return {
    props: {},
  };
};
