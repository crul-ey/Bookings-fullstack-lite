// src/components/PublicProperties.tsx
import {
  Box,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Spinner,
  useColorModeValue,
  Button,
  HStack,
  Icon,
  Badge,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaEuroSign, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/useAuth";
import LoginPromptModal from "./LoginPromptModal";

interface Property {
  id: string;
  title: string;
  location: string;
  pricePerNight: number;
  rating: number;
  description?: string;
  amenities?: {
    amenityId: string;
    name?: string;
    amenity?: {
      name: string;
    };
  }[];
}

export default function PublicProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const cardBg = useColorModeValue("white", "gray.700");
  const border = useColorModeValue("gray.200", "gray.600");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("/properties");
        setProperties(res.data.slice(0, 6));
      } catch (err) {
        console.error("❌ Error bij ophalen properties:", err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  if (loading) return <Spinner />;

  return (
    <Box mt={10}>
      <Heading size="lg" mb={6}>
        Beschikbare accommodaties
      </Heading>

      {properties.length === 0 ? (
        <Text>Er zijn momenteel geen accommodaties beschikbaar.</Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {properties.map((p) => (
            <Box
              key={p.id}
              p={4}
              borderWidth={1}
              borderRadius="lg"
              bg={cardBg}
              borderColor={border}
              shadow="md"
            >
              <Heading size="md" mb={2}>
                {p.title}
              </Heading>
              <VStack align="start" spacing={1} fontSize="sm" mb={3}>
                <HStack>
                  <Icon as={FaMapMarkerAlt} />
                  <Text>{p.location}</Text>
                </HStack>
                <HStack>
                  <Icon as={FaEuroSign} />
                  <Text>€ {p.pricePerNight} per nacht</Text>
                </HStack>
                <HStack>
                  <Icon as={FaStar} />
                  <Text>Rating: {p.rating}/5</Text>
                </HStack>
              </VStack>

              {/* ✅ Voorzieningen */}
              {p.amenities && p.amenities.length > 0 && (
                <VStack align="start" spacing={1} mb={2}>
                  <Text fontSize="sm" fontWeight="medium">
                    Voorzieningen:
                  </Text>
                  <HStack wrap="wrap" spacing={2}>
                    {p.amenities.map((a) => (
                      <Badge
                        key={a.amenityId}
                        colorScheme="purple"
                        fontSize="xs"
                        px={2}
                        py={0.5}
                        borderRadius="full"
                      >
                        {a.amenity?.name || a.name}
                      </Badge>
                    ))}
                  </HStack>
                </VStack>
              )}

              <Text mb={3} color="gray.500">
                {p.description?.slice(0, 100) ||
                  "Geen beschrijving beschikbaar..."}
              </Text>

              {(!user || user.role === "user") && (
                <Button
                  size="sm"
                  colorScheme="blue"
                  onClick={() => {
                    if (!user) {
                      onOpen();
                    } else {
                      navigate("/bookings");
                    }
                  }}
                >
                  Boek nu
                </Button>
              )}
            </Box>
          ))}
        </SimpleGrid>
      )}

      <LoginPromptModal isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}
