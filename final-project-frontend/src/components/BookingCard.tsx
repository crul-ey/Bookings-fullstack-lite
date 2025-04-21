// src/components/BookingCard.tsx
import {
  Box,
  HStack,
  Text,
  Divider,
  Button,
  useColorModeValue,
  VStack,
  Badge,
  Icon,
} from "@chakra-ui/react";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUserFriends,
  FaEuroSign,
} from "react-icons/fa";

interface Booking {
  id: string;
  checkinDate: string;
  checkoutDate: string;
  numberOfGuests: number;
  totalPrice: number;
  bookingStatus: string;
  property: {
    id: string;
    title: string;
    location: string;
  };
}

interface Props {
  booking: Booking;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function BookingCard({ booking, onEdit, onDelete }: Props) {
  const bg = useColorModeValue("white", "gray.800");
  const border = useColorModeValue("gray.200", "gray.700");
  const muted = useColorModeValue("gray.600", "gray.400");

  const isPast = new Date(booking.checkoutDate) < new Date();

  const statusColor =
    booking.bookingStatus === "confirmed"
      ? "green"
      : booking.bookingStatus === "pending"
      ? "yellow"
      : booking.bookingStatus === "cancelled"
      ? "red"
      : isPast
      ? "gray"
      : "purple";

  return (
    <Box
      p={5}
      borderWidth={1}
      borderColor={border}
      borderRadius="xl"
      boxShadow="base"
      bg={bg}
      w="100%"
      transition="all 0.2s"
      _hover={{ shadow: "lg" }}
    >
      <HStack justify="space-between" align="start">
        <Text fontWeight="bold" fontSize="lg">
          📦 {booking.property?.title || "Onbekend verblijf"}
        </Text>
        <Badge colorScheme={statusColor} fontSize="0.8em">
          {isPast ? "Verlopen" : booking.bookingStatus}
        </Badge>
      </HStack>

      <Divider my={3} />

      <VStack align="start" spacing={2}>
        <HStack>
          <Icon as={FaMapMarkerAlt} />
          <Text color={muted}>
            {booking.property?.location || "Onbekende locatie"}
          </Text>
        </HStack>

        <HStack>
          <Icon as={FaCalendarAlt} />
          <Text>
            {new Date(booking.checkinDate).toLocaleDateString("nl-NL")} →{" "}
            {new Date(booking.checkoutDate).toLocaleDateString("nl-NL")}
          </Text>
        </HStack>

        <HStack>
          <Icon as={FaUserFriends} />
          <Text>{booking.numberOfGuests} gast(en)</Text>
        </HStack>

        <HStack>
          <Icon as={FaEuroSign} />
          <Text>€ {booking.totalPrice.toFixed(2)}</Text>
        </HStack>
      </VStack>

      <HStack spacing={4} mt={5}>
        <Button
          size="sm"
          colorScheme="yellow"
          onClick={() => onEdit(booking.id)}
          aria-label={`Bewerk boeking ${booking.property.title}`}
        >
          ✏️ Bewerken
        </Button>
        <Button
          size="sm"
          colorScheme="red"
          onClick={() => onDelete(booking.id)}
          aria-label={`Verwijder boeking ${booking.property.title}`}
        >
          🗑️ Verwijderen
        </Button>
      </HStack>
    </Box>
  );
}
