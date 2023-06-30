import React, { useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  Flex,
  Image,
  Center,
} from "@chakra-ui/react";
// import { Link } from "react-router-dom";
import { useSpring, animated } from "react-spring";
// import { auth, googleAuthProvider } from "../firebase/firebaseConfig";
// import { signInWithPopup } from "firebase/auth";
import { useAtom } from "jotai";
import {
  userAtom,
  userNameAtom,
  emailAtom,
  picAtom,
  loginAtom,
} from "../Atoms";
import { useNavigate } from "react-router-dom";
// import { onAuthStateChanged } from "firebase/auth";
// import { browserLocalPersistence, setPersistence } from "firebase/auth";
import { useGoogleLogin } from "@react-oauth/google";

const Home = () => {
  const [user, setUser] = useAtom(userAtom);
  const [email, setEmail] = useAtom(emailAtom);
  const [pic, setPic] = useAtom(picAtom);
  const [userName, setUserName] = useAtom(userNameAtom);
  const [loginn, setLogin] = useAtom(loginAtom);

  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      setEmail(tokenResponse.access_token);
      navigate("/todos");
      setLogin(true);
    },
  });

  const fadeIn = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 1000 },
  });


  return (
    <Flex
      h={{ base: "100vh", md: "100vh" }}
      direction={{ base: "column", md: "row" }}
      alignItems="center"
      justifyContent="center"
    >
      <Box flex={{ base: "7", md: "7" }} h={{ md: "100vh" }}>
        <Image
          src="https://media.discordapp.net/attachments/1094098003071090888/1102838285673443388/catplotlib_Sakura_cherry_blossom_tree_with_Fuji_mountain_sunris_ce316ad4-6562-4886-af6c-9bf74f779ffb.png?width=1026&height=1026"
          alt="Tasktastic"
          objectFit="cover"
          w="100%"
          h="100%"
        />
      </Box>
      <Box flex={{ base: "5", md: "3" }} bg="#EACBBC" h={{ md: "100vh" }}>
        <VStack
          spacing={8}
          alignItems="center"
          justifyContent="center"
          h="100%"
          minHeight={{ base: "calc(100vh - 50vh)", md: "auto" }}
          minWidth={{ base: "100vw", md: "auto" }}
        >
          <animated.div style={fadeIn}>
            <Heading
              as="h1"
              fontSize={{ base: "4xl", md: "6xl" }}
              color="#DA6174"
              textAlign="center"
              fontFamily="Comfortaa, sans-serif"
              fontWeight="700"
            >
              Tasktastic
            </Heading>
            <Text
              color="#27334D"
              textAlign="center"
              fontSize={{ base: "xl", md: "2xl" }}
              maxW="lg"
              mx="auto"
            >
              Conquer Your Day, One Task at a Time!
            </Text>
            <Center>
              <Button
                onClick={() => login()}
                colorScheme="whiteAlpha"
                size="lg"
                border="2px solid #1F324E"
                mt="30px"
                color={"#1F324E"}
              >
                Get Started
              </Button>
            </Center>
          </animated.div>
        </VStack>
      </Box>
    </Flex>
  );
};

export default Home;
