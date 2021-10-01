import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  CloseButton,
  Spacer,
} from "@chakra-ui/react";
import Stories, { WithSeeMore } from "react-insta-stories";

const contentStyle = {
  background: "whitesmoke",
  width: "100%",
  color: "#333",
  height: "100%",
};

const Username = () => (
  <>
    <Flex pt={5} px={2} align="center">
      <Avatar size="sm" src="/irhamputra.jpg" />
      <Text ml={2} fontWeight="700">
        irhamputra
      </Text>
    </Flex>
  </>
);

const stories = [
  {
    content: ({ action, isPaused }) => {
      return (
        <Box sx={contentStyle}>
          <Username />
          <Box padding={10} mt={70}>
            <Heading fontWeight="700">Hey! 👋</Heading>
            <Heading fontWeight="700">My name is Irham Putra Prasetyo.</Heading>
            <Heading>
              I'm from Indonesia 🇮🇩 and based out in Leipzig, Germany
            </Heading>
          </Box>
        </Box>
      );
    },
  },
  {
    content: () => {
      return (
        <Box sx={contentStyle}>
          <Username />
          <Box padding={10} mt={70}>
            <Heading fontWeight="700">
              Currently work as Staff Senior Software Engineer & Architect 👨🏻‍💻 in
              Germany 🇩🇪
            </Heading>
          </Box>
        </Box>
      );
    },
  },
  {
    content: ({ action, story }) => {
      return (
        <WithSeeMore
          action={action}
          story={story}
          customCollapsed={() => {
            return (
              <Text
                cursor="pointer"
                textAlign="center"
                py={5}
                onClick={() => {
                  action("pause");
                  window.open("https://github.com/irhamputra", "_blank");
                }}
              >
                Go to my Github →
              </Text>
            );
          }}
        >
          <Box sx={contentStyle}>
            <Username />
            <Box padding={10}>
              <Heading fontWeight="700">
                I work usually with React, TypeScript, Node.js and Rust 🦀
              </Heading>
              <br />
              <Heading>
                Github and Gitlab is my daily routine to manage my work 🌟
              </Heading>
            </Box>
          </Box>
        </WithSeeMore>
      );
    },
    seeMore: () => <div />,
  },
  {
    content: () => {
      return (
        <Box sx={contentStyle}>
          <Username />
          <Box padding={10} mt={70}>
            <Heading>Thank you for seeing my Stories! 🎉</Heading>
            <Heading>You can catch me in Twitter @IRHMPTRA</Heading>
          </Box>
        </Box>
      );
    },
  },
];

const Story = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalOverlay />
      <ModalContent>
        <ModalBody padding={0} borderRadius={8}>
          <Stories
            onAllStoriesEnd={onClose}
            width="100%"
            defaultInterval={4000}
            storyContainerStyles={{ borderRadius: 8 }}
            stories={stories}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default Story;
