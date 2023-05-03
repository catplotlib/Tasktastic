import React from "react";
import {
  Box,
  Button,
  Flex,
  HStack,
  Spacer,
  Link as ChakraLink,
  Text,
  Image,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import Tasktastic from "../assets/Tasktastic.png";
import { useAtom } from "jotai";
import { userAtom } from "../Atoms";

const Navigation = () => {
  const [user, setUser] = useAtom(userAtom);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const authInstance = getAuth();
    try {
      await signOut(authInstance);
      setUser(null);
      navigate("/");
    } catch (error) {
      console.log("Error signing out:", error);
    }
  };

  return (
    <Flex
      as="nav"
      p={4}
      position="absolute"
      top={0}
      left={0}
      right={0}
      zIndex={10}
      bg="rgba(255, 255, 255, 0.1)"
      backdropFilter="blur(10px)"
      borderRadius="md"
      boxShadow="md"
    >
      <Flex justifyContent="center" alignItems="center">
        {/* <Text fontFamily="comfortaa">Tasktastic</Text> */}
        <Image
          src={Tasktastic}
          alt="Tasktastic"
          h={{ md: "50px", base: "20px" }}
        />
      </Flex>
      <Spacer />
      <HStack spacing={4}>
        <Button
          // as={NavLink}
          // to="/"
          colorScheme="whiteAlpha"
          size={{md:"md",base:"xs"}}
          border="1px solid #1F324E"
          onClick={handleLogout}
          color={"#1F324E"}
        >
          Logout
        </Button>
      </HStack>
    </Flex>
  );
};

export default Navigation;
