import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  Heading,
  useColorModeValue,
  InputGroup,
  InputLeftElement,
  Text,
} from "@chakra-ui/react";
import { FaCalendarAlt, FaUsers, FaMapMarkerAlt } from "react-icons/fa";
import { useEffect, useRef } from "react";

interface Property {
  id: string;
  title: string;
  location: string;
  pricePerNight: number;
}

interface BookingFormProps {
  form: {
    propertyId: string;
    checkinDate: string;
    checkoutDate: string;
    numberOfGuests: number;
  };
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  editId: string | null;
  properties: Property[];
}

export default function BookingForm({
  form,
  onChange,
  onSubmit,
  editId,
  properties,
}: BookingFormProps) {
  const bg = useColorModeValue("white", "gray.800");
  const border = useColorModeValue("gray.200", "gray.700");

  const firstInputRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (editId && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [editId]);

  const calculateTotal = () => {
    const selected = properties.find((p) => p.id === form.propertyId);
    if (!selected || !form.checkinDate || !form.checkoutDate) return null;

    const checkin = new Date(form.checkinDate).getTime();
    const checkout = new Date(form.checkoutDate).getTime();

    const nights = Math.max(
      Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24)),
      1
    );

    return nights * selected.pricePerNight;
  };

  const total = calculateTotal();

  return (
    <Box
      as="form"
      onSubmit={onSubmit}
      mb={8}
      p={5}
      borderWidth={1}
      borderRadius="lg"
      shadow="base"
      bg={bg}
      borderColor={border}
    >
      <Heading size="md" mb={4}>
        {editId ? "✏️ Boeking bewerken" : "➕ Nieuwe boeking maken"}
      </Heading>
      <Stack spacing={4}>
        <FormControl isRequired>
          <FormLabel htmlFor="propertyId">Locatie</FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <FaMapMarkerAlt />
            </InputLeftElement>
            <Select
              id="propertyId"
              name="propertyId"
              ref={firstInputRef}
              value={form.propertyId}
              onChange={onChange}
              placeholder="Kies een locatie"
              pl="2.5rem"
            >
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} – {p.location}
                </option>
              ))}
            </Select>
          </InputGroup>
        </FormControl>

        <FormControl isRequired>
          <FormLabel htmlFor="checkinDate">Check-in datum</FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <FaCalendarAlt />
            </InputLeftElement>
            <Input
              id="checkinDate"
              type="date"
              name="checkinDate"
              value={form.checkinDate}
              onChange={onChange}
              pl="2.5rem"
            />
          </InputGroup>
        </FormControl>

        <FormControl isRequired>
          <FormLabel htmlFor="checkoutDate">Check-out datum</FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <FaCalendarAlt />
            </InputLeftElement>
            <Input
              id="checkoutDate"
              type="date"
              name="checkoutDate"
              value={form.checkoutDate}
              onChange={onChange}
              pl="2.5rem"
            />
          </InputGroup>
        </FormControl>

        <FormControl isRequired>
          <FormLabel htmlFor="numberOfGuests">Aantal gasten</FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <FaUsers />
            </InputLeftElement>
            <Input
              id="numberOfGuests"
              type="number"
              name="numberOfGuests"
              min={1}
              value={form.numberOfGuests}
              onChange={onChange}
              pl="2.5rem"
            />
          </InputGroup>
        </FormControl>

        <Button type="submit" colorScheme="blue">
          {editId ? "💾 Boeking opslaan" : "🛎️ Boek nu"}
        </Button>

        {total !== null && (
          <Text fontWeight="medium" color="gray.600" pt={2}>
            💶 Totale prijs: € {total.toFixed(2)}
          </Text>
        )}
      </Stack>
    </Box>
  );
}
