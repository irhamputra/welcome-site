import { DefaultSeo } from "next-seo";
import Image from "next/image";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import Stories from "react-insta-stories";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  useDisclosure,
  ModalBody,
} from "@chakra-ui/react";
import Story from "../components/Stories";

export default function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <DefaultSeo
        title="Irham Putra Prasetyo"
        description="Irham Putra Prasetyo Website"
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
