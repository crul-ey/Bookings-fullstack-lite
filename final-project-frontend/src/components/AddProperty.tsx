import { useToast, Box, Alert, AlertIcon, Heading } from "@chakra-ui/react";
import { useState } from "react";
import api from "../api";
import { useAuth } from "../context/useAuth";
import PropertyForm, { PropertyFormData } from "./PropertyForm";
import { useNavigate } from "react-router-dom";

export default function AddProperty() {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleAddProperty = async (form: PropertyFormData) => {
    if (!user) return;

    try {
      await api.post("/properties", {
        ...form,
        hostId: user.id, // ✅ automatisch koppelen aan host
      });

      toast({
        title: "Property succesvol toegevoegd!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      navigate("/properties");
    } catch (err) {
      console.error("❌ Fout bij toevoegen:", err);
      setError("Fout bij het opslaan van de property.");
    }
  };

  return (
    <Box>
      <Heading mb={6}>➕ Nieuwe Property Aanmaken</Heading>
      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}

      <PropertyForm onSubmit={handleAddProperty} />
    </Box>
  );
}
