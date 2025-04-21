// src/components/AdminUsers.tsx
import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Spinner,
  VStack,
  Avatar,
  HStack,
  Alert,
  AlertIcon,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Badge,
  SimpleGrid,
} from "@chakra-ui/react";
import api from "../api";

export interface User {
  id: string;
  username: string;
  name: string | null;
  email: string;
  phoneNumber?: string | null;
  profilePicture?: string | null;
  role: "user" | "host" | "admin";
}

export default function AdminUsers() {
  const toast = useToast();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    name: "",
    phoneNumber: "",
    profilePicture: "",
    role: "user",
  });

  const fetchUsers = () => {
    setLoading(true);
    api
      .get("/users")
      .then((res) => {
        setUsers(res.data);
        setError("");
      })
      .catch((err) => {
        console.error("❌ Fout bij ophalen gebruikers:", err);
        setError("Kan gebruikers niet ophalen.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/users", formData);
      toast({
        title: "✅ Gebruiker toegevoegd!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setFormData({
        username: "",
        password: "",
        email: "",
        name: "",
        phoneNumber: "",
        profilePicture: "",
        role: "user",
      });
      fetchUsers();
    } catch (err) {
      console.error("❌ Fout bij toevoegen gebruiker:", err);
      toast({
        title: "Fout bij toevoegen",
        description: "Controleer of alle velden correct zijn.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/users/${id}`);
      toast({
        title: "Gebruiker verwijderd",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
      fetchUsers();
    } catch (err) {
      console.error("❌ Fout bij verwijderen gebruiker:", err);
      toast({
        title: "Fout bij verwijderen",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const roleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "red";
      case "host":
        return "orange";
      default:
        return "blue";
    }
  };

  return (
    <Box>
      <Heading mb={6}>👑 Admin: Gebruikersbeheer</Heading>

      {/* ➕ Toevoegen formulier */}
      <Box
        as="form"
        onSubmit={handleAddUser}
        mb={10}
        p={5}
        borderWidth={1}
        borderRadius="md"
        shadow="sm"
      >
        <Heading size="md" mb={4}>
          ➕ Nieuwe gebruiker toevoegen
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
          <FormControl isRequired>
            <FormLabel>Gebruikersnaam</FormLabel>
            <Input
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Wachtwoord</FormLabel>
            <Input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Naam</FormLabel>
            <Input name="name" value={formData.name} onChange={handleChange} />
          </FormControl>
          <FormControl>
            <FormLabel>Telefoon</FormLabel>
            <Input
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Profielfoto URL</FormLabel>
            <Input
              name="profilePicture"
              value={formData.profilePicture}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Rol</FormLabel>
            <Input
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="user | host | admin"
            />
          </FormControl>
        </SimpleGrid>
        <Button type="submit" colorScheme="teal" mt={6}>
          Toevoegen
        </Button>
      </Box>

      {/* 👥 Gebruikerslijst */}
      {loading ? (
        <Spinner />
      ) : error ? (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      ) : (
        <VStack align="stretch" spacing={6}>
          {users.map((u) => (
            <Box
              key={u.id}
              p={5}
              borderWidth={1}
              borderRadius="md"
              shadow="sm"
              position="relative"
            >
              <HStack spacing={4} mb={2}>
                <Avatar
                  name={u.name || u.username}
                  src={u.profilePicture || undefined}
                />
                <Box>
                  <Text fontWeight="bold">
                    {u.name || "Naam onbekend"} ({u.username})
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    📧 {u.email}
                  </Text>
                  {u.phoneNumber && (
                    <Text fontSize="sm" color="gray.600">
                      📞 {u.phoneNumber}
                    </Text>
                  )}
                  <Badge mt={2} colorScheme={roleColor(u.role)}>
                    Rol: {u.role}
                  </Badge>
                </Box>
              </HStack>
              <Divider />
              <Text fontSize="xs" color="gray.500" mt={2}>
                Gebruiker ID: {u.id}
              </Text>

              <Button
                size="sm"
                colorScheme="red"
                mt={3}
                onClick={() => handleDelete(u.id)}
              >
                Verwijderen
              </Button>
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
}
