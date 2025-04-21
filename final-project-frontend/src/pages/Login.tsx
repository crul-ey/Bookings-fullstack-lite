import { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Alert,
  AlertIcon,
  VStack,
  useToast,
} from "@chakra-ui/react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const toast = useToast();

  const { login, isAuthenticated, user } = useAuth();

  // ✅ Als al ingelogd → redirect
  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath =
        user.role === "admin"
          ? "/users"
          : user.role === "host"
          ? "/properties"
          : "/bookings";
      navigate(redirectPath);
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", { username, password });
      const { token } = res.data;

      localStorage.setItem("token", token);
      await login();

      toast({
        title: "Welkom terug!",
        description: "Je bent succesvol ingelogd.",
        status: "success",
        duration: 2500,
        isClosable: true,
      });
    } catch (err) {
      console.error("❌ Login error:", err);
      setError("Ongeldige gebruikersnaam of wachtwoord.");
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={6} borderWidth={1} borderRadius="md">
      <Heading mb={6} textAlign="center">
        Inloggen
      </Heading>

      {error && (
        <Alert status="error" mb={6}>
          <AlertIcon />
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Gebruikersnaam</FormLabel>
            <Input
              placeholder="Voer je gebruikersnaam in"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Wachtwoord</FormLabel>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>

          <Button type="submit" colorScheme="teal" width="full">
            Inloggen
          </Button>
        </VStack>
      </form>
    </Box>
  );
}
