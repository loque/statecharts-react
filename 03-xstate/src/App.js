import { Container, Heading } from "@chakra-ui/react";
import { inspect } from "@xstate/inspect";
import RegisterParticipants from "./steps/RegisterParticipants";

inspect({
  url: "https://statecharts.io/inspect",
  iframe: false,
});

export default function App() {
  return (
    <Container>
      <Heading as="h1" size="4xl" py={10}>
        The Boring Game (x)
      </Heading>
      <RegisterParticipants />
    </Container>
  );
}
