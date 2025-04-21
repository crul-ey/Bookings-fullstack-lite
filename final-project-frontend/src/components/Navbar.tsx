// src/components/Navbar.tsx
import {
  Box,
  Flex,
  HStack,
  Link,
  IconButton,
  useDisclosure,
  Stack,
  Button,
  Text,
  useColorModeValue,
  Avatar,
  Divider,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const NavLink = ({ name, path }: { name: string; path: string }) => {
  const hoverBg = useColorModeValue("gray.100", "gray.700");
  return (
    <Link
      as={RouterLink}
      to={path}
      px={3}
      py={2}
      rounded="md"
      fontWeight="medium"
      _hover={{ textDecoration: "none", bg: hoverBg }}
      transition="0.2s ease"
    >
      {name}
    </Link>
  );
};

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const bg = useColorModeValue("white", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const usernameColor = useColorModeValue("gray.600", "gray.300");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const renderLinks = () => {
    if (!isAuthenticated || !user) return [];

    const baseLinks = [{ name: "Home", path: "/" }];
    const roleLinks =
      user.role === "admin"
        ? [
            { name: "Gebruikers", path: "/users" },
            { name: "Voorzieningen", path: "/amenities" },
          ]
        : user.role === "host"
        ? [{ name: "Verhuren", path: "/properties" }]
        : user.role === "user"
        ? [{ name: "Mijn Boekingen", path: "/bookings" }]
        : [];

    return [...baseLinks, ...roleLinks];
  };

  return (
    <Box
      bg={bg}
      borderBottom="1px solid"
      borderColor={borderColor}
      px={4}
      py={2}
      shadow="sm"
      zIndex={10}
      position="sticky"
      top={0}
    >
      <Flex h={16} alignItems="center" justifyContent="space-between">
        {/* Hamburger Menu (mobiel) */}
        <IconButton
          size="md"
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label="Menu"
          display={{ md: "none" }}
          onClick={isOpen ? onClose : onOpen}
        />

        {/* Logo + links desktop */}
        <HStack spacing={8} alignItems="center">
          <HStack>
            <Avatar size="sm" bg="blue.400" />
            <Text fontSize="lg" fontWeight="bold">
              BookingsApp
            </Text>
          </HStack>

          <HStack as="nav" spacing={4} display={{ base: "none", md: "flex" }}>
            {renderLinks().map((link) => (
              <NavLink key={link.name} {...link} />
            ))}
          </HStack>
        </HStack>

        {/* User info + login/logout knop */}
        <HStack spacing={4}>
          {isAuthenticated && user && (
            <Text fontSize="sm" color={usernameColor}>
              👤 {user.username} ({user.role})
            </Text>
          )}
          {isAuthenticated ? (
            <Button size="sm" colorScheme="red" onClick={handleLogout}>
              Uitloggen
            </Button>
          ) : (
            <Button
              size="sm"
              colorScheme="blue"
              onClick={() => navigate("/login")}
            >
              Inloggen
            </Button>
          )}
        </HStack>
      </Flex>

      {/* Mobiele links */}
      {isOpen && (
        <Box mt={4} display={{ md: "none" }}>
          <Stack as="nav" spacing={2}>
            {renderLinks().map((link) => (
              <NavLink key={link.name} {...link} />
            ))}
          </Stack>
          <Divider my={2} />
          {isAuthenticated ? (
            <Button size="sm" colorScheme="red" onClick={handleLogout} w="full">
              Uitloggen
            </Button>
          ) : (
            <Button
              size="sm"
              colorScheme="blue"
              onClick={() => navigate("/login")}
              w="full"
            >
              Inloggen
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
}
