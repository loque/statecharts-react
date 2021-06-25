import { Heading, Box, Input, Text, Button, Flex } from "@chakra-ui/react";
import { useMachine } from "@xstate/react";
import { registrationMachine } from "./registrationMachine";

function Participant({
  username,
  error,
  onUpdate,
  disableUpdate,
  onDelete,
  disableDelete,
}) {
  return (
    <Box>
      <Flex alignItems="flex-end" gridColumnGap={2}>
        <label style={{ flex: 1 }}>
          <Text>Username</Text>
          <Box style={{ position: "relative" }}>
            <Input
              value={username}
              onChange={(e) => onUpdate(e.target.value)}
              disabled={disableUpdate}
            />
            {error && (
              <Text
                color="#f2386d"
                position="absolute"
                align="center"
                width="100%"
                fontSize="sm"
                p={1}
              >
                {error}
              </Text>
            )}
          </Box>
        </label>
        <Button onClick={onDelete} disabled={disableDelete}>
          Delete
        </Button>
      </Flex>
    </Box>
  );
}

export default function RegisterParticipants() {
  const [state, send] = useMachine(registrationMachine, { devTools: true });

  return (
    <Flex direction="column" gridRowGap={14}>
      {!state.matches("done") && (
        <>
          <Heading as="h2" size="2xl">
            Register Participants
          </Heading>
          <Box>
            <Button
              onClick={() => send("ADD_PARTICIPANT")}
              disabled={!state.nextEvents.includes("ADD_PARTICIPANT")}
            >
              Add Participant
            </Button>
          </Box>
          <Flex direction="column" gridRowGap={10}>
            {state.context.participants.map(({ id, username, error }) => (
              <Participant
                key={id}
                username={username}
                error={error}
                onUpdate={(username) =>
                  send({ type: "UPDATE_PARTICIPANT", id, username })
                }
                disableUpdate={!state.nextEvents.includes("UPDATE_PARTICIPANT")}
                onDelete={() => send({ type: "DELETE_PARTICIPANT", id })}
                disableDelete={!state.nextEvents.includes("DELETE_PARTICIPANT")}
              />
            ))}
          </Flex>
          <Box>
            <Button
              onClick={() => send("SUBMIT")}
              disabled={!state.nextEvents.includes("SUBMIT")}
              isLoading={state.matches("submitting")}
              loadingText="Submitting"
            >
              Submit
            </Button>
          </Box>
        </>
      )}
      {state.matches("done") && (
        <>
          <Heading as="h2" size="2xl" align="center">
            {state.context.result}
          </Heading>
          <Box align="center">
            <Button onClick={() => send("RETRY")}>Retry</Button>
          </Box>
        </>
      )}
    </Flex>
  );
}
