import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Spinner,
  VStack,
  HStack,
  Button,
  Input,
  FormControl,
  FormLabel,
  useToast,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import api from "../api";
import { useAuth } from "../context/useAuth";

interface Amenity {
  id: string;
  name: string;
}

export default function Amenities() {
  const { user } = useAuth();
  const toast = useToast();

  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAmenity, setNewAmenity] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const isAdmin = user?.role === "admin";

  const fetchAmenities = useCallback(async () => {
    try {
      const res = await api.get("/amenities");
      setAmenities(res.data);
    } catch (err) {
      console.error("Fout bij ophalen voorzieningen:", err);
      toast({
        title: "Fout",
        description: "Kon voorzieningen niet ophalen",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchAmenities();
  }, [fetchAmenities]);

  const handleAdd = async () => {
    if (!newAmenity.trim()) return;

    try {
      await api.post("/amenities", { name: newAmenity });
      setNewAmenity("");
      fetchAmenities();
      toast({
        title: "Toegevoegd",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (err) {
      console.error("Fout bij toevoegen:", err);
      toast({
        title: "Fout",
        description: "Alleen admins mogen voorzieningen toevoegen",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/amenities/${id}`);
      fetchAmenities();
      toast({
        title: "Verwijderd",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
    } catch (err) {
      console.error("Fout bij verwijderen:", err);
      toast({
        title: "Fout",
        description: "Alleen admins mogen voorzieningen verwijderen",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEdit = async (id: string) => {
    if (!editValue.trim()) return;

    try {
      await api.put(`/amenities/${id}`, { name: editValue });
      setEditingId(null);
      setEditValue("");
      fetchAmenities();
      toast({
        title: "Bijgewerkt",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (err) {
      console.error("Fout bij bijwerken:", err);
    }
  };

  if (loading) return <Spinner />;

  return (
    <Box>
      <Heading mb={6}>Voorzieningen (Amenities)</Heading>

      {!isAdmin && (
        <Alert status="info" mb={6}>
          <AlertIcon />
          Alleen admins kunnen voorzieningen toevoegen, wijzigen of verwijderen.
        </Alert>
      )}

      {isAdmin && (
        <HStack mb={6}>
          <FormControl>
            <FormLabel>Nieuwe voorziening</FormLabel>
            <Input
              placeholder="Bijv. Airco, WiFi, Zwembad"
              value={newAmenity}
              onChange={(e) => setNewAmenity(e.target.value)}
            />
          </FormControl>
          <Button colorScheme="teal" mt={6} onClick={handleAdd}>
            Toevoegen
          </Button>
        </HStack>
      )}

      <VStack align="stretch" spacing={4}>
        {amenities.map((a) => (
          <Box key={a.id} p={4} borderWidth={1} borderRadius="md">
            {editingId === a.id ? (
              <HStack>
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                />
                <Button colorScheme="green" onClick={() => handleEdit(a.id)}>
                  Opslaan
                </Button>
                <Button onClick={() => setEditingId(null)}>Annuleren</Button>
              </HStack>
            ) : (
              <HStack justify="space-between">
                <Text>{a.name}</Text>
                {isAdmin && (
                  <HStack>
                    <Button
                      size="sm"
                      onClick={() => {
                        setEditingId(a.id);
                        setEditValue(a.name);
                      }}
                    >
                      Bewerken
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleDelete(a.id)}
                    >
                      Verwijderen
                    </Button>
                  </HStack>
                )}
              </HStack>
            )}
          </Box>
        ))}
      </VStack>
    </Box>
  );
}
