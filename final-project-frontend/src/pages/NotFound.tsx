import { Box, Heading, Text, Button, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Box textAlign="center" py={16} px={6}>
      <VStack spacing={6}>
        <Heading fontSize="6xl">😵 404</Heading>

        <Heading as="h2" size="xl">
          Oeps... Deze pagina bestaat niet!
        </Heading>

        <Text color="gray.600" maxW="lg">
          Misschien heb je verdwaald in cyberspace, of is deze pagina verhuisd.
          In ieder geval... hij is er niet. 🤷‍♂️
        </Text>

        <Button
          colorScheme="teal"
          onClick={() => navigate("/")}
          size="lg"
          mt={4}
        >
          Terug naar de homepagina
        </Button>
      </VStack>
    </Box>
  );
}
