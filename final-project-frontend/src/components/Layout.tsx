import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import {
  Box,
  Container,
  Spinner,
  Center,
  useColorModeValue,
} from "@chakra-ui/react";
import { useAuth } from "../context/useAuth";

export default function Layout() {
  const { isAuthenticated, user } = useAuth();

  const bg = useColorModeValue("gray.50", "#0F1117"); // Licht voor lightmode, diep donker in darkmode

  // ✅ Laad spinner zolang auth bezig is
  if (isAuthenticated && !user) {
    return (
      <Center h="100vh" bg={bg}>
        <Spinner size="xl" color="brand.400" />
      </Center>
    );
  }

  return (
    <Box minH="100vh" bg={bg}>
      <Navbar />
      <Container maxW="container.lg" py={{ base: 6, md: 10 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
