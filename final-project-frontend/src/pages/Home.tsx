import {
  Box,
  Heading,
  Text,
  Stack,
  Icon,
  Button,
  SimpleGrid,
  useColorModeValue,
  Divider,
  useToast,
  Avatar,
  HStack,
  useDisclosure,
} from "@chakra-ui/react";
import {
  FaUserShield,
  FaHome,
  FaBriefcase,
  FaPlus,
  FaListUl,
  FaSignInAlt,
} from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import api from "../api";
import Hero from "../components/Hero";
import PublicProperties from "../components/PublicProperties";
import LoginPromptModal from "../components/LoginPromptModal";

type Property = {
  id: string;
  title: string;
  description: string;
  location: string;
};

type Host = {
  id: string;
  name: string;
  aboutMe?: string;
  profilePicture?: string;
};

export default function Home() {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [hosts, setHosts] = useState<Host[]>([]);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const roleIcons: Record<string, JSX.Element> = {
    admin: <Icon as={FaUserShield} boxSize={6} color="red.400" />,
    host: <Icon as={FaBriefcase} boxSize={6} color="orange.300" />,
    user: <Icon as={FaHome} boxSize={6} color="blue.400" />,
  };

  const bg = useColorModeValue("white", "gray.900");
  const text = useColorModeValue("gray.700", "gray.100");
  const subtext = useColorModeValue("gray.600", "gray.400");
  const cardBg = useColorModeValue("gray.50", "gray.800");

  useEffect(() => {
    if (!user) {
      onOpen();
      return;
    }

    api
      .get("/properties")
      .then((res) => {
        setProperties(res.data.slice(0, 3));
      })
      .catch((err) =>
        toast({
          title: "Kan properties niet ophalen",
          description: err.response?.data?.message || "Er ging iets mis.",
          status: "error",
          duration: 4000,
          isClosable: true,
        })
      );

    if (user.role === "user") {
      api
        .get("/users/hosts")
        .then((res) => setHosts(res.data.slice(0, 4)))
        .catch((err) =>
          toast({
            title: "Kan hosts niet laden",
            description: err.response?.data?.message || "Er ging iets mis.",
            status: "error",
            duration: 4000,
            isClosable: true,
          })
        );
    }
  }, [user, toast, onOpen]);

  return (
    <Box bg={bg} p={8} borderRadius="xl" shadow="md">
      {/* ✅ Toegevoegde publieke onderdelen */}
      <Hero />
      <PublicProperties />
      <LoginPromptModal isOpen={isOpen} onClose={onClose} />
      <Divider my={10} />

      <Stack spacing={4} mb={8}>
        <Heading size="lg" color={text}>
          Welkom op het Booking Platform 👋
        </Heading>
        <Text fontSize="md" color={subtext}>
          Zoek en boek unieke verblijven, beheer jouw eigendommen of beheer het
          platform als admin. Of je nu huurder, host of beheerder bent — dit is
          jouw startpunt.
        </Text>
      </Stack>

      {user && (
        <Stack mb={10}>
          <Heading size="md" color={text}>
            Uitgelichte Verblijven
          </Heading>
          {properties.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5} mt={4}>
              {properties.map((prop) => (
                <Box
                  key={prop.id}
                  p={4}
                  bg={cardBg}
                  borderRadius="md"
                  shadow="sm"
                  borderWidth={1}
                  borderColor="gray.200"
                >
                  <Heading size="sm" mb={2}>
                    {prop.title}
                  </Heading>
                  <Text fontSize="sm" color={subtext}>
                    {prop.description || "Geen beschrijving beschikbaar."}
                  </Text>
                  <Text fontSize="sm" color={text} mt={2}>
                    📍 {prop.location}
                  </Text>
                </Box>
              ))}
            </SimpleGrid>
          ) : (
            <Text fontSize="sm" color={subtext}>
              Geen properties beschikbaar.
            </Text>
          )}
        </Stack>
      )}

      {user?.role === "user" && (
        <Stack mb={10}>
          <Heading size="md" color={text}>
            Ontmoet onze hosts
          </Heading>
          {hosts.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5} mt={4}>
              {hosts.map((host) => (
                <Box
                  key={host.id}
                  p={4}
                  bg={cardBg}
                  borderRadius="md"
                  shadow="sm"
                  borderWidth={1}
                  borderColor="gray.200"
                >
                  <HStack mb={2}>
                    <Avatar
                      size="md"
                      name={host.name}
                      src={host.profilePicture}
                    />
                    <Heading size="sm">{host.name}</Heading>
                  </HStack>
                  <Text fontSize="sm" color={subtext} mb={3}>
                    {host.aboutMe || "Deze host heeft nog geen beschrijving."}
                  </Text>
                  <Button
                    as={RouterLink}
                    to={`/properties?hostId=${host.id}`}
                    size="sm"
                    colorScheme="blue"
                    variant="outline"
                  >
                    Bekijk alle verblijven
                  </Button>
                </Box>
              ))}
            </SimpleGrid>
          ) : (
            <Text fontSize="sm" color={subtext}>
              Geen hosts beschikbaar.
            </Text>
          )}
        </Stack>
      )}

      <Divider my={10} />

      {user ? (
        <Stack spacing={5}>
          <Heading size="md" color={text}>
            Welkom terug, {user.name || "gebruiker"}!
          </Heading>
          <Stack direction="row" align="center">
            {roleIcons[user.role]}
            <Text color={text}>
              Je bent ingelogd als{" "}
              <Text as="span" fontWeight="bold">
                {user.role}
              </Text>
            </Text>
          </Stack>

          {user.role === "user" && (
            <Button
              as={RouterLink}
              to="/bookings"
              colorScheme="blue"
              leftIcon={<FaListUl />}
            >
              Mijn Boekingen
            </Button>
          )}
          {user.role === "host" && (
            <Button
              as={RouterLink}
              to="/properties"
              colorScheme="orange"
              leftIcon={<FaBriefcase />}
            >
              Mijn Verhuur
            </Button>
          )}
          {user.role === "admin" && (
            <Stack direction="row" spacing={3}>
              <Button
                as={RouterLink}
                to="/users"
                colorScheme="red"
                leftIcon={<FaUserShield />}
              >
                Gebruikersbeheer
              </Button>
              <Button
                as={RouterLink}
                to="/amenities"
                colorScheme="purple"
                leftIcon={<FaPlus />}
              >
                Voorzieningen
              </Button>
            </Stack>
          )}
        </Stack>
      ) : (
        <Stack spacing={5}>
          <Text fontSize="md" color={subtext}>
            Je bent niet ingelogd. Log in om meer te ontdekken.
          </Text>
          <Stack direction="row">
            <Button
              as={RouterLink}
              to="/login"
              colorScheme="teal"
              leftIcon={<FaSignInAlt />}
            >
              Inloggen
            </Button>
          </Stack>
        </Stack>
      )}
    </Box>
  );
}
