import {
  Box,
  Heading,
  Text,
  Button,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

export default function Hero() {
  const bg = useColorModeValue("gray.50", "gray.800");
  const text = useColorModeValue("gray.700", "gray.100");

  return (
    <Box
      bg={bg}
      py={{ base: 10, md: 20 }}
      px={6}
      textAlign="center"
      borderRadius="xl"
      shadow="md"
    >
      <Stack spacing={5} maxW="3xl" mx="auto">
        <Heading as="h1" size="2xl" color={text}>
          Vind jouw ideale verblijf
        </Heading>
        <Text fontSize="lg" color="gray.500">
          Boek unieke accommodaties van vertrouwde hosts – snel, veilig en
          zonder gedoe.
        </Text>
        <Button as={RouterLink} to="/properties" size="lg" colorScheme="blue">
          Bekijk aanbod
        </Button>
      </Stack>
    </Box>
  );
}
