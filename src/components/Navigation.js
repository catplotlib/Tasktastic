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
import Tasktastic from "../assets/Tasktastic.png";
import { useAtom } from "jotai";
import { userAtom,loginAtom } from "../Atoms";
import { googleLogout } from "@react-oauth/google";

const Navigation = () => {
  const [user, setUser] = useAtom(userAtom);
  const [loginn, setLogin] = useAtom(loginAtom);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      googleLogout();
      setLogin(false);
      navigate("/");
    } catch (error) {
      console.log("Logout Failed", error);
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
          size={{ md: "md", base: "xs" }}
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
