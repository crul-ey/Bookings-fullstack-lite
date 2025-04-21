import {
  Box,
  Heading,
  Text,
  VStack,
  Avatar,
  HStack,
  Divider,
  Badge,
  useColorModeValue,
  Icon,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Input,
  FormControl,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useAuth } from "../context/useAuth";
import { FaUser, FaEdit } from "react-icons/fa";
import { useState } from "react";
import api from "../api";

const MotionBox = motion(Box);
const MotionAvatar = motion(Avatar);

export default function UserProfile() {
  const { user, login } = useAuth(); // login gebruiken om opnieuw profiel op te halen
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const bg = useColorModeValue("white", "gray.800");
  const border = useColorModeValue("gray.200", "gray.700");
  const text = useColorModeValue("gray.700", "gray.100");
  const subtext = useColorModeValue("gray.500", "gray.400");

  const [editData, setEditData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
  });

  const handleSave = async () => {
    try {
      await api.put(`/users/${user?.id}`, editData);
      await login(); // ✅ opnieuw ophalen van geüpdatet profiel
      toast({
        title: "Profiel bijgewerkt",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (err) {
      console.error("❌ Fout bij updaten profiel:", err);
      toast({
        title: "Fout bij opslaan",
        description: "Controleer je invoer of probeer opnieuw.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  if (!user) {
    return (
      <Box>
        <Heading size="md" mb={4}>
          Geen profiel gevonden
        </Heading>
        <Text>Log in om je profiel te bekijken.</Text>
      </Box>
    );
  }

  return (
    <MotionBox
      p={8}
      borderWidth={1}
      borderRadius="2xl"
      shadow="lg"
      bg={bg}
      borderColor={border}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <HStack justify="space-between" mb={4}>
        <Heading size="lg" color="brand.500">
          Mijn Profiel
        </Heading>
        <Button
          leftIcon={<FaEdit />}
          size="sm"
          colorScheme="blue"
          onClick={onOpen}
        >
          Bewerken
        </Button>
      </HStack>

      <HStack spacing={6} mb={6} align="center">
        <MotionAvatar
          size="2xl"
          name={user.name || user.username}
          src={user.profilePicture || undefined}
          icon={<Icon as={FaUser} fontSize="2xl" />}
          whileHover={{ scale: 1.1 }}
        />
        <VStack align="start" spacing={1}>
          <Text fontWeight="bold" fontSize="lg" color={text}>
            {user.name || "Geen naam ingevuld"}{" "}
            <Text as="span" color={subtext}>
              ({user.username})
            </Text>
          </Text>
          <Text color={subtext}>📧 {user.email}</Text>
          {user.phoneNumber && (
            <Text color={subtext}>📞 {user.phoneNumber}</Text>
          )}
          <Badge
            bgGradient="linear(to-r, blue.400, teal.400)"
            color="white"
            px={2}
            py={1}
            borderRadius="full"
          >
            Rol: {user.role}
          </Badge>
        </VStack>
      </HStack>

      <Divider />
      <Text mt={4} fontSize="sm" color={subtext}>
        Gebruikers-ID: <strong>{user.id}</strong>
      </Text>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Profiel bewerken</ModalHeader>
          <ModalCloseButton />
          <ModalBody as={VStack} spacing={4}>
            <FormControl>
              <FormLabel>Naam</FormLabel>
              <Input
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
              />
            </FormControl>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                value={editData.email}
                onChange={(e) =>
                  setEditData({ ...editData, email: e.target.value })
                }
              />
            </FormControl>
            <FormControl>
              <FormLabel>Telefoonnummer</FormLabel>
              <Input
                value={editData.phoneNumber}
                onChange={(e) =>
                  setEditData({ ...editData, phoneNumber: e.target.value })
                }
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSave}>
              Opslaan
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Annuleren
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </MotionBox>
  );
}
