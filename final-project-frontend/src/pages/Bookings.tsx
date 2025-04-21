import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Heading,
  Spinner,
  VStack,
  Alert,
  AlertIcon,
  useToast,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import api from "../api";
import { useAuth } from "../context/useAuth";
import BookingForm from "../components/BookingForm";
import BookingCard from "../components/BookingCard";

interface Booking {
  id: string;
  checkinDate: string;
  checkoutDate: string;
  numberOfGuests: number;
  totalPrice: number;
  bookingStatus: string;
  user: { id: string; name: string; email: string };
  property: { id: string; title: string; location: string };
}

interface Property {
  id: string;
  title: string;
  location: string;
  pricePerNight: number;
}

export default function Bookings() {
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    propertyId: "",
    checkinDate: "",
    checkoutDate: "",
    numberOfGuests: 1,
  });

  const [editId, setEditId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) return;

    try {
      const [bookingRes, propertyRes] = await Promise.all([
        user.role === "user"
          ? api.get("/bookings", { params: { userId: user.id } })
          : api.get("/bookings"),
        api.get("/properties"),
      ]);
      setBookings(bookingRes.data);
      setProperties(propertyRes.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Fout bij laden van gegevens.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchData();
    } else {
      setError("Je moet ingelogd zijn om boekingen te zien.");
      setLoading(false);
    }
  }, [isAuthenticated, user, fetchData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () =>
    setForm({
      propertyId: "",
      checkinDate: "",
      checkoutDate: "",
      numberOfGuests: 1,
    });

  const calculateTotal = () => {
    const property = properties.find((p) => p.id === form.propertyId);
    if (!property) return 0;

    const nights =
      (new Date(form.checkoutDate).getTime() -
        new Date(form.checkinDate).getTime()) /
      (1000 * 60 * 60 * 24);

    return Math.max(nights, 1) * property.pricePerNight;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const totalPrice = calculateTotal();

    try {
      await api.post("/bookings", {
        ...form,
        totalPrice,
      });
      toast({
        title: "✅ Boeking toegevoegd",
        status: "success",
        isClosable: true,
      });
      resetForm();
      fetchData();
      onClose();
    } catch (err) {
      console.error(err);
      toast({ title: "❌ Fout bij boeken", status: "error", isClosable: true });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/bookings/${id}`);
      toast({ title: "Boeking verwijderd", status: "info", isClosable: true });
      fetchData();
    } catch {
      toast({
        title: "Fout bij verwijderen",
        status: "error",
        isClosable: true,
      });
    }
  };

  const handleEdit = (id: string) => {
    const booking = bookings.find((b) => b.id === id);
    if (!booking) return;

    setForm({
      propertyId: booking.property.id,
      checkinDate: booking.checkinDate.split("T")[0],
      checkoutDate: booking.checkoutDate.split("T")[0],
      numberOfGuests: booking.numberOfGuests,
    });
    setEditId(id);
    onOpen();
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const totalPrice = calculateTotal();

    try {
      await api.put(`/bookings/${editId}`, {
        ...form,
        totalPrice,
      });
      toast({
        title: "Boeking bijgewerkt",
        status: "success",
        isClosable: true,
      });
      setEditId(null);
      resetForm();
      fetchData();
      onClose();
    } catch {
      toast({ title: "Fout bij bijwerken", status: "error", isClosable: true });
    }
  };

  return (
    <Box>
      <Heading mb={6}>
        {user?.role === "admin"
          ? "📋 Alle Boekingen"
          : user?.role === "host"
          ? "🏨 Boekingen bij jouw locaties"
          : "🧳 Mijn Boekingen"}
      </Heading>

      <Button onClick={onOpen} colorScheme="blue" mb={4}>
        ➕ Nieuwe boeking
      </Button>

      <Modal
        isOpen={isOpen || !!editId}
        onClose={() => {
          setEditId(null);
          resetForm();
          onClose();
        }}
        isCentered
        size="lg"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editId ? "✏️ Boeking bewerken" : "➕ Nieuwe boeking"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <BookingForm
              form={form}
              onChange={handleChange}
              onSubmit={editId ? handleUpdate : handleSubmit}
              editId={editId}
              properties={properties}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      {loading ? (
        <Spinner />
      ) : error ? (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      ) : bookings.length === 0 ? (
        <Alert status="info" mb={4}>
          <AlertIcon />
          Geen boekingen gevonden.
        </Alert>
      ) : (
        <VStack align="start" spacing={6}>
          {bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </VStack>
      )}
    </Box>
  );
}
