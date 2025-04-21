// src/pages/Properties.tsx
import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Heading,
  Text,
  Spinner,
  VStack,
  HStack,
  Divider,
  Alert,
  AlertIcon,
  Badge,
  Icon,
  Button,
  Avatar,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import {
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaUsers,
  FaStar,
  FaEuroSign,
  FaEdit,
  FaTrash,
  FaUser,
  FaPlus,
  FaTimes,
  FaCalendarCheck,
} from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/useAuth";
import PropertyForm, { PropertyFormData } from "../components/PropertyForm";

interface Property {
  id: string;
  title: string;
  description: string;
  location: string;
  pricePerNight: number;
  bedroomCount: number;
  bathRoomCount: number;
  maxGuestCount: number;
  rating: number;
  hostId: string;
  host?: {
    name: string;
    email: string;
  };
  bookings?: {
    id: string;
    checkinDate: string;
    checkoutDate: string;
    user: {
      name: string;
      email: string;
    };
  }[];
  amenities?: {
    amenityId: string;
    amenity: {
      name: string;
    };
  }[];
}

export default function Properties() {
  const { user } = useAuth();
  const toast = useToast();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );

  const isHost = user?.role === "host";
  const isAdmin = user?.role === "admin";

  const fetchProperties = useCallback(async () => {
    try {
      const res = await api.get("/properties");
      const all = res.data;

      const filtered = isHost
        ? all.filter((p: Property) => p.hostId === user?.id)
        : all;

      setProperties(filtered);
    } catch (err) {
      console.error("❌ Fout bij ophalen properties:", err);
      setError("Er ging iets mis bij het ophalen van properties.");
    } finally {
      setLoading(false);
    }
  }, [isHost, user?.id]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleEdit = (id: string) => {
    const property = properties.find((p) => p.id === id);
    if (!property) return;
    setSelectedProperty(property);
    setIsEditing(true);
    setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Weet je zeker dat je deze property wilt verwijderen?"))
      return;
    try {
      await api.delete(`/properties/${id}`);
      toast({ title: "Verwijderd", status: "info", isClosable: true });
      fetchProperties();
    } catch (err) {
      console.error("❌ Verwijderfout:", err);
      toast({
        title: "Fout bij verwijderen",
        status: "error",
        isClosable: true,
      });
    }
  };

  const handleUpdate = async (form: PropertyFormData) => {
    if (!selectedProperty) return;

    try {
      await api.put(`/properties/${selectedProperty.id}`, {
        ...form,
        hostId: selectedProperty.hostId,
      });
      toast({ title: "Bijgewerkt", status: "success", isClosable: true });
      fetchProperties();
      setIsEditing(false);
      setSelectedProperty(null);
    } catch (err) {
      console.error("❌ Bijwerkfout:", err);
      toast({ title: "Fout bij bijwerken", status: "error", isClosable: true });
    }
  };

  const handleAdd = async (form: PropertyFormData) => {
    try {
      await api.post("/properties", {
        ...form,
        hostId: user?.id,
      });
      toast({
        title: "Property aangemaakt!",
        status: "success",
        isClosable: true,
      });
      fetchProperties();
      setIsAdding(false);
    } catch (err) {
      console.error("❌ Fout bij toevoegen:", err);
      toast({ title: "Toevoegen mislukt", status: "error", isClosable: true });
    }
  };

  const cardBg = useColorModeValue("white", "gray.700");

  return (
    <Box>
      <Heading mb={6}>
        {isHost
          ? "Mijn Verhuurproperties"
          : isAdmin
          ? "Alle Properties (Admin)"
          : "Beschikbare Accommodaties"}
      </Heading>

      {(isEditing || isAdding) && (
        <Box mb={6}>
          <PropertyForm
            onSubmit={isEditing ? handleUpdate : handleAdd}
            defaultFormData={
              isEditing && selectedProperty
                ? {
                    ...selectedProperty,
                    amenityIds:
                      selectedProperty.amenities?.map((a) => a.amenityId) || [],
                  }
                : undefined
            }
          />
          <Button
            onClick={() => {
              setIsEditing(false);
              setIsAdding(false);
              setSelectedProperty(null);
            }}
            mt={4}
            colorScheme="gray"
            leftIcon={<FaTimes />}
          >
            Annuleren
          </Button>
        </Box>
      )}

      {isHost && !isEditing && !isAdding && (
        <Button
          onClick={() => {
            setIsAdding(true);
            setSelectedProperty(null);
          }}
          colorScheme="green"
          leftIcon={<FaPlus />}
          mb={6}
        >
          Nieuwe Property Toevoegen
        </Button>
      )}

      {loading ? (
        <Spinner />
      ) : error ? (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      ) : properties.length === 0 ? (
        <Alert status="info" mb={4}>
          <AlertIcon />
          Geen properties gevonden.
        </Alert>
      ) : (
        <VStack align="stretch" spacing={6}>
          {properties.map((p) => (
            <Box
              key={p.id}
              p={5}
              borderWidth={1}
              borderRadius="xl"
              shadow="md"
              bg={cardBg}
              transition="all 0.2s"
              _hover={{ shadow: "lg" }}
            >
              <HStack justify="space-between" mb={2}>
                <Heading size="md">{p.title}</Heading>
                <Badge colorScheme="teal" fontSize="sm">
                  <Icon as={FaEuroSign} mr={1} />
                  {p.pricePerNight} / nacht
                </Badge>
              </HStack>

              <Divider mb={3} />

              <VStack align="start" spacing={1} fontSize="sm">
                <HStack>
                  <Icon as={FaMapMarkerAlt} />
                  <Text>{p.location}</Text>
                </HStack>
                <HStack>
                  <Icon as={FaBed} />
                  <Text>Slaapkamers: {p.bedroomCount}</Text>
                </HStack>
                <HStack>
                  <Icon as={FaBath} />
                  <Text>Badkamers: {p.bathRoomCount}</Text>
                </HStack>
                <HStack>
                  <Icon as={FaUsers} />
                  <Text>Max gasten: {p.maxGuestCount}</Text>
                </HStack>
                <HStack>
                  <Icon as={FaStar} />
                  <Text>Rating: {p.rating}/5</Text>
                </HStack>

                {/* ✅ Voorzieningen */}
                {p.amenities && p.amenities.length > 0 && (
                  <VStack align="start" spacing={1} mt={3}>
                    <Text fontWeight="medium">Voorzieningen:</Text>
                    <HStack flexWrap="wrap" spacing={2}>
                      {p.amenities.map((a) => (
                        <Badge
                          key={a.amenityId}
                          colorScheme="purple"
                          fontSize="xs"
                          px={2}
                          py={0.5}
                          borderRadius="full"
                        >
                          {a.amenity.name}
                        </Badge>
                      ))}
                    </HStack>
                  </VStack>
                )}

                <Divider my={3} />

                {/* Host info */}
                <HStack spacing={3} align="center">
                  <Avatar name={p.host?.name} size="sm" icon={<FaUser />} />
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="medium">{p.host?.name}</Text>
                    <Text fontSize="xs" color="gray.500">
                      {p.host?.email}
                    </Text>
                  </VStack>
                </HStack>
              </VStack>

              <Text mt={3} fontSize="sm" color="gray.600">
                {p.description}
              </Text>

              {user?.role === "user" && (
                <Button
                  as={RouterLink}
                  to="/bookings"
                  size="sm"
                  colorScheme="blue"
                  mt={4}
                >
                  Nu boeken
                </Button>
              )}

              {isHost && p.bookings && p.bookings.length > 0 && (
                <>
                  <Divider my={4} />
                  <Heading size="sm" mb={1}>
                    📅 Boekingen voor deze property
                  </Heading>
                  <VStack align="start" spacing={2}>
                    {p.bookings.map((b) => (
                      <Text key={b.id} fontSize="sm">
                        <Icon as={FaCalendarCheck} mr={1} />
                        {new Date(b.checkinDate).toLocaleDateString(
                          "nl-NL"
                        )} →{" "}
                        {new Date(b.checkoutDate).toLocaleDateString("nl-NL")} |{" "}
                        {b.user.name} ({b.user.email})
                      </Text>
                    ))}
                  </VStack>
                </>
              )}

              {(isHost || isAdmin) && p.hostId === user?.id && (
                <HStack mt={4} justify="flex-end" spacing={3}>
                  <Button
                    size="sm"
                    leftIcon={<FaEdit />}
                    colorScheme="blue"
                    variant="outline"
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
              )}
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
}
