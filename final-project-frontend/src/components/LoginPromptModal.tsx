// src/components/LoginPromptModal.tsx
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginPromptModal({ isOpen, onClose }: Props) {
  const navigate = useNavigate();

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="sm">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Login vereist</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={4}>
            Je moet eerst inloggen om deze actie uit te voeren. Heb je al een
            account?
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Annuleren
          </Button>
          <Button colorScheme="blue" onClick={() => navigate("/login")}>
            Inloggen
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
