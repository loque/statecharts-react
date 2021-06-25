import { Container, Heading } from "@chakra-ui/react";
import RegisterParticipants from "./steps/RegisterParticipants";

export default function App() {
  return (
    <Container>
      <Heading as="h1" size="4xl" py={10}>
        The Boring Game (r)
      </Heading>
      <RegisterParticipants />
    </Container>
  );
}
