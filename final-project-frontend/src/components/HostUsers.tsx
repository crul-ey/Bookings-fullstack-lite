// src/components/HostUsers.tsx
import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Heading,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  HStack,
  Avatar,
  Divider,
  Badge,
  useColorModeValue,
  VStack,
  Button,
  Icon,
  Stack,
} from "@chakra-ui/react";
import {
  FaEuroSign,
  FaMapMarkerAlt,
  FaCalendarCheck,
  FaTrash,
  FaPlus,
  FaEdit,
  FaHome,
  FaUsers,
} from "react-icons/fa";
import api from "../api";
import { useAuth } from "../context/useAuth";

interface Host {
  id: string;
  username: string;
  name: string | null;
  email: string;
  phoneNumber: string | null;
  profilePicture: string | null;
  aboutMe?: string | null;
}

interface Booking {
  id: string;
  checkinDate: string;
  checkoutDate: string;
  user: { name: string; email: string };
}

interface Property {
  id: string;
  title: string;
  location: string;
  pricePerNight: number;
  hostId: string;
  bookings: Booking[];
}

export default function HostUsers() {
  const { user } = useAuth();
  const [host, setHost] = useState<Host | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cardBg = useColorModeValue("white", "gray.700");

  const fetchData = useCallback(async () => {
    if (!user) return;

    try {
      const [hostRes, propertiesRes] = await Promise.all([
        api.get(`/users/${user.id}`),
        api.get("/properties"),
      ]);

      const ownProperties = propertiesRes.data
        .filter((p: Property) => p.hostId === user.id)
        .map((p: Property) => ({
          ...p,
          bookings: p.bookings || [],
        }));

      setHost(hostRes.data);
      setProperties(ownProperties);
    } catch (err) {
      console.error("❌ Fout bij ophalen hostgegevens:", err);
      setError("Fout bij ophalen van je gegevens.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Weet je zeker dat je deze property wilt verwijderen?"))
      return;

    try {
      await api.delete(`/properties/${id}`);
      fetchData();
    } catch (err) {
      console.error("❌ Fout bij verwijderen property:", err);
    }
  };

  const handleEdit = (id: string) => {
    console.log("✏️ Bewerken property:", id);
    // 🔄 eventueel navigeren of modal openen
  };

  const handleAdd = () => {
    console.log("➕ Nieuwe property toevoegen");
    // 🔄 eventueel navigeren of modal openen
  };

  // 📌 Alle bookings samenvoegen in één lijst
  const allBookings = properties.flatMap((p) =>
    p.bookings.map((b) => ({
      id: b.id,
      checkinDate: b.checkinDate,
      checkoutDate: b.checkoutDate,
      propertyTitle: p.title,
      location: p.location,
      guest: b.user,
    }))
  );

  return (
    <Box>
      <Heading mb={6}>Host Dashboard</Heading>

      {loading ? (
        <Spinner />
      ) : error ? (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      ) : (
        <>
          {/* 👤 Host Profiel */}
          {host && (
            <Box
              p={5}
              borderWidth={1}
              borderRadius="md"
              shadow="sm"
              bg={cardBg}
              mb={8}
            >
              <HStack spacing={4}>
                <Avatar
                  size="lg"
                  name={host.name || host.username}
                  src={host.profilePicture || undefined}
                />
                <Box>
                  <Text fontWeight="bold" fontSize="lg">
                    {host.name || host.username}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    📧 {host.email}
                  </Text>
                  {host.phoneNumber && (
                    <Text fontSize="sm" color="gray.500">
                      📞 {host.phoneNumber}
                    </Text>
                  )}
                  <Badge mt={2} colorScheme="orange">
                    Host
                  </Badge>
                </Box>
              </HStack>
              {host.aboutMe && (
                <>
                  <Divider my={3} />
                  <Text fontSize="sm" color="gray.600">
                    {host.aboutMe}
                  </Text>
                </>
              )}
            </Box>
          )}

          {/* 🏠 Eigendommen */}
          <Stack
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align="center"
            mb={4}
          >
            <Heading size="md">
              <Icon as={FaHome} mr={2} />
              Mijn Verhuurproperties
            </Heading>
            <Button
              onClick={handleAdd}
              colorScheme="teal"
              leftIcon={<FaPlus />}
            >
              Nieuwe toevoegen
            </Button>
          </Stack>

          {properties.length === 0 ? (
            <Alert status="info">
              <AlertIcon />
              Je hebt nog geen properties toegevoegd.
            </Alert>
          ) : (
            <VStack spacing={6} align="stretch">
              {properties.map((p) => (
                <Box
                  key={p.id}
                  p={5}
                  borderWidth={1}
                  borderRadius="md"
                  shadow="sm"
                  bg={cardBg}
                >
                  <HStack justify="space-between" mb={1}>
                    <Text fontSize="lg" fontWeight="bold">
                      {p.title}
                    </Text>
                    <HStack spacing={2}>
                      <Button
                        size="sm"
                        leftIcon={<FaEdit />}
                        onClick={() => handleEdit(p.id)}
                      >
                        Bewerken
                      </Button>
                      <Button
                        size="sm"
                        leftIcon={<FaTrash />}
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => handleDelete(p.id)}
                      >
                        Verwijderen
                      </Button>
                    </HStack>
                  </HStack>

                  <Text>
                    <Icon as={FaMapMarkerAlt} mr={1} />
                    {p.location}
                  </Text>
                  <Text>
                    <Icon as={FaEuroSign} mr={1} />€{p.pricePerNight} per nacht
                  </Text>

                  <Divider my={3} />
                  <Heading size="sm" mb={2}>
                    📅 Boekingen voor dit verblijf
                  </Heading>
                  {p.bookings.length === 0 ? (
                    <Text fontSize="sm" color="gray.500">
                      Geen boekingen op dit moment.
                    </Text>
                  ) : (
                    <VStack align="start" spacing={2}>
                      {p.bookings.map((b) => (
                        <Box key={b.id}>
                          <Text fontSize="sm">
                            <Icon as={FaCalendarCheck} mr={1} />
                            {new Date(b.checkinDate).toLocaleDateString(
                              "nl-NL"
                            )}{" "}
                            →{" "}
                            {new Date(b.checkoutDate).toLocaleDateString(
                              "nl-NL"
                            )}{" "}
                            | {b.user.name} ({b.user.email})
                          </Text>
                        </Box>
                      ))}
                    </VStack>
                  )}
                </Box>
              ))}
            </VStack>
          )}

          {/* 🔍 Totaaloverzicht van alle boekingen */}
          <Box mt={10}>
            <Heading size="md" mb={3}>
              <Icon as={FaUsers} mr={2} />
              Overzicht van alle boekingen op jouw accommodaties
            </Heading>
            {allBookings.length === 0 ? (
              <Text fontSize="sm" color="gray.500">
                Nog geen boekingen gevonden.
              </Text>
            ) : (
              <VStack align="start" spacing={3}>
                {allBookings.map((b) => (
                  <Box key={b.id}>
                    <Text fontSize="sm">
                      <Icon as={FaCalendarCheck} mr={1} />
                      {new Date(b.checkinDate).toLocaleDateString(
                        "nl-NL"
                      )} →{" "}
                      {new Date(b.checkoutDate).toLocaleDateString("nl-NL")} |{" "}
                      {b.propertyTitle} – {b.location} | {b.guest.name} (
                      {b.guest.email})
                    </Text>
                  </Box>
                ))}
              </VStack>
            )}
          </Box>
        </>
      )}
    </Box>
  );
}
