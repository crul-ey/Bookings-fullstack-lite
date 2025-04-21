// src/pages/Users.tsx
import { Box, Heading, Text } from "@chakra-ui/react";
import { useAuth } from "../context/useAuth";

// 🔁 Import componenten per rol
import AdminUsers from "../components/AdminUsers";
import HostUsers from "../components/HostUsers";
import UserProfile from "../components/UserProfile";

export default function Users() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Box>
        <Heading size="md" mb={2}>
          Niet ingelogd
        </Heading>
        <Text>Log in om toegang te krijgen tot deze pagina.</Text>
      </Box>
    );
  }

  let content;
  switch (user.role) {
    case "admin":
      content = <AdminUsers />;
      break;
    case "host":
      content = <HostUsers />;
      break;
    case "user":
      content = <UserProfile />;
      break;
    default:
      content = (
        <Box>
          <Heading size="md" mb={2}>
            Onbekende rol
          </Heading>
          <Text>Je rol is niet herkend: {user.role}</Text>
        </Box>
      );
  }

  return <Box>{content}</Box>;
}
