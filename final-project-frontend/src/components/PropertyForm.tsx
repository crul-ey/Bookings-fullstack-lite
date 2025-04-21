// src/components/PropertyForm.tsx
import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  Spinner,
  Stack,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import api from "../api";

export interface PropertyFormData {
  title: string;
  description: string;
  location: string;
  pricePerNight: number;
  bedroomCount: number;
  bathRoomCount: number;
  maxGuestCount: number;
  rating: number;
  amenityIds: string[];
}

interface Amenity {
  id: string;
  name: string;
  icon?: string;
}

interface Props {
  onSubmit: (form: PropertyFormData) => void;
  defaultFormData?: PropertyFormData;
}

export default function PropertyForm({ onSubmit, defaultFormData }: Props) {
  const [form, setForm] = useState<PropertyFormData>({
    title: "",
    description: "",
    location: "",
    pricePerNight: 100,
    bedroomCount: 1,
    bathRoomCount: 1,
    maxGuestCount: 1,
    rating: 5,
    amenityIds: [],
  });

  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loadingAmenities, setLoadingAmenities] = useState(true);

  useEffect(() => {
    api
      .get("/amenities")
      .then((res) => setAmenities(res.data))
      .catch((err) => console.error("Fout bij ophalen voorzieningen:", err))
      .finally(() => setLoadingAmenities(false));
  }, []);

  useEffect(() => {
    if (defaultFormData) {
      setForm(defaultFormData);
    }
  }, [defaultFormData]);

  const bg = useColorModeValue("white", "gray.800");
  const border = useColorModeValue("gray.200", "gray.700");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (name: keyof PropertyFormData, value: string) => {
    setForm((prev) => ({
      ...prev,
      [name]: isNaN(parseFloat(value)) ? 0 : parseFloat(value),
    }));
  };

  const handleAmenityChange = (values: string[]) => {
    setForm((prev) => ({ ...prev, amenityIds: values }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const isEditing = !!defaultFormData;

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      p={5}
      borderWidth={1}
      borderRadius="md"
      shadow="sm"
      bg={bg}
      borderColor={border}
      maxW="xl"
    >
      <Stack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Titel</FormLabel>
          <Input name="title" value={form.title} onChange={handleChange} />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Beschrijving</FormLabel>
          <Input
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Locatie</FormLabel>
          <Input
            name="location"
            value={form.location}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Prijs per nacht (€)</FormLabel>
          <NumberInput
            min={1}
            value={form.pricePerNight}
            onChange={(v) => handleNumberChange("pricePerNight", v)}
          >
            <NumberInputField name="pricePerNight" />
          </NumberInput>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Slaapkamers</FormLabel>
          <NumberInput
            min={1}
            value={form.bedroomCount}
            onChange={(v) => handleNumberChange("bedroomCount", v)}
          >
            <NumberInputField name="bedroomCount" />
          </NumberInput>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Badkamers</FormLabel>
          <NumberInput
            min={1}
            value={form.bathRoomCount}
            onChange={(v) => handleNumberChange("bathRoomCount", v)}
          >
            <NumberInputField name="bathRoomCount" />
          </NumberInput>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Max aantal gasten</FormLabel>
          <NumberInput
            min={1}
            value={form.maxGuestCount}
            onChange={(v) => handleNumberChange("maxGuestCount", v)}
          >
            <NumberInputField name="maxGuestCount" />
          </NumberInput>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Rating (0–5)</FormLabel>
          <NumberInput
            min={0}
            max={5}
            step={0.1}
            value={form.rating}
            onChange={(v) => handleNumberChange("rating", v)}
          >
            <NumberInputField name="rating" />
          </NumberInput>
        </FormControl>

        {/* ✅ Voorzieningen */}
        <FormControl>
          <FormLabel>Voorzieningen</FormLabel>
          {loadingAmenities ? (
            <Spinner />
          ) : (
            <CheckboxGroup
              value={form.amenityIds}
              onChange={handleAmenityChange}
            >
              <VStack align="start">
                {amenities.map((a) => (
                  <Checkbox key={a.id} value={a.id}>
                    {a.name}
                  </Checkbox>
                ))}
              </VStack>
            </CheckboxGroup>
          )}
        </FormControl>

        <Button type="submit" colorScheme="blue">
          {isEditing ? "Opslaan" : "Toevoegen"}
        </Button>
      </Stack>
    </Box>
  );
}
