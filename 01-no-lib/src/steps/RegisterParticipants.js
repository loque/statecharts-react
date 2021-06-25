import { useState } from "react";
import { Heading, Box, Input, Text, Button, Flex } from "@chakra-ui/react";

function Participant({ username, error, onUpdate, onDelete, canDelete }) {
  return (
    <Box>
      <Flex alignItems="flex-end" gridColumnGap={2}>
        <label style={{ flex: 1 }}>
          <Text>Username</Text>
          <Box style={{ position: "relative" }}>
            <Input
              value={username}
              onChange={(e) => onUpdate(e.target.value)}
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
        <Button onClick={onDelete} disabled={!canDelete}>
          Delete
        </Button>
      </Flex>
    </Box>
  );
}

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function fakeAsync() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.round(Math.random())) {
        resolve("You win 🥳");
      } else {
        reject("You lose 😭");
      }
    }, 2000);
  });
}

const minParticipants = 1;
const maxParticipants = 4;
const initialState = [{ username: "", id: makeid(6) }];

export default function RegisterParticipants() {
  const [participants, setParticipants] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const canDelete = participants.length > minParticipants;
  const canAdd = participants.length < maxParticipants;

  function updateName(participantId) {
    return (newName) => {
      setParticipants((oldParticipants) => {
        const participantIdx = oldParticipants.findIndex(
          (participant) => participant.id === participantId
        );
        oldParticipants[participantIdx].username = newName;
        return [...oldParticipants];
      });
    };
  }

  function deleteParticipant(participantId) {
    return () => {
      if (!canDelete) return;
      setParticipants((oldParticipants) => {
        return [
          ...oldParticipants.filter(
            (participant) => participant.id !== participantId
          ),
        ];
      });
    };
  }

  function addParticipant() {
    if (!canAdd) return;
    setParticipants((oldParticipants) => {
      return [...oldParticipants, { username: "", id: makeid(6) }];
    });
  }

  function doSubmit() {
    let errors = false;
    participants.forEach((participant) => {
      if (participant.username.length < 3) {
        setError(participant.id, "Username is too short 🤏");
        errors = true;
      } else {
        setError(participant.id, "");
      }
    });

    if (!errors) {
      setLoading(true);
      fakeAsync()
        .then((msg) => {
          setLoading(false);
          setResponse(msg);
        })
        .catch((error) => {
          setLoading(false);
          setResponse(error);
        });
    }
  }

  function setError(participantId, error) {
    setParticipants((oldParticipants) => {
      const participantIdx = oldParticipants.findIndex(
        (participant) => participant.id === participantId
      );
      oldParticipants[participantIdx].error = error;
      return [...oldParticipants];
    });
  }

  function canSubmit() {
    if (participants.length > maxParticipants) {
      return false;
    }

    if (participants.length < minParticipants) {
      return false;
    }

    return true;
  }

  return (
    <Flex direction="column" gridRowGap={14}>
      <Heading as="h2" size="2xl">
        Register Participants
      </Heading>
      <Box>
        <Button onClick={addParticipant} disabled={!canAdd}>
          Add Participant
        </Button>
      </Box>
      <Flex direction="column" gridRowGap={10}>
        {participants.map(({ id, username, error }) => (
          <Participant
            key={id}
            username={username}
            error={error}
            onUpdate={updateName(id)}
            onDelete={deleteParticipant(id)}
            canDelete={canDelete}
          />
        ))}
      </Flex>
      <Box>
        {canSubmit() && (
          <Button
            onClick={doSubmit}
            isLoading={loading}
            loadingText="Submitting"
          >
            Submit
          </Button>
        )}
      </Box>
      <Box>{response && <Text>{response}</Text>}</Box>
    </Flex>
  );
}
