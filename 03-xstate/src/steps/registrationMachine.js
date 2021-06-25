import { createMachine, assign } from "xstate";

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

function createParticipant() {
  return { username: "", id: makeid(6) };
}

function fakeSubmit() {
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

export const registrationMachine = createMachine(
  {
    id: "registration",
    initial: "incomplete",
    context: {
      participants: [createParticipant()],
      result: null,
    },
    states: {
      incomplete: {
        initial: "readingLength",
        on: {
          UPDATE_PARTICIPANT: {
            target: ".readingLength",
            actions: ["updateParticipant"],
          },
          SUBMIT: "validating",
        },
        states: {
          readingLength: {
            always: [
              { target: "minLength", cond: "isMinLength" },
              { target: "maxLength", cond: "isMaxLength" },
              { target: "midLength" },
            ],
          },
          minLength: {
            on: {
              ADD_PARTICIPANT: {
                target: "readingLength",
                actions: ["addParticipant"],
              },
            },
          },
          midLength: {
            on: {
              ADD_PARTICIPANT: {
                target: "readingLength",
                actions: ["addParticipant"],
              },
              DELETE_PARTICIPANT: {
                target: "readingLength",
                actions: ["deleteParticipant"],
              },
            },
          },
          maxLength: {
            on: {
              DELETE_PARTICIPANT: {
                target: "readingLength",
                actions: ["deleteParticipant"],
              },
            },
          },
        },
      },
      validating: {
        entry: "validateParticipants",
        initial: "processing",
        states: {
          processing: {
            always: [
              { target: "#registration.incomplete", cond: "isValid" },
              { target: "#registration.submitting" },
            ],
          },
        },
      },
      submitting: {
        invoke: {
          id: "fakeSubmit",
          src: (context, event) => fakeSubmit(context, event),
          onDone: {
            target: "done",
            actions: assign({ result: (context, event) => event.data }),
          },
          onError: {
            target: "done",
            actions: assign({ result: (context, event) => event.data }),
          },
        },
      },
      done: {
        on: {
          RETRY: { target: "incomplete", actions: ["reset"] },
        },
      },
    },
  },
  {
    actions: {
      updateParticipant: assign({
        participants: (context, { id, username }) => {
          const participantIdx = context.participants.findIndex(
            (participant) => participant.id === id
          );
          context.participants[participantIdx].username = username;
          return context.participants;
        },
      }),
      addParticipant: assign({
        participants: (context) => {
          return [...context.participants, createParticipant()];
        },
      }),
      deleteParticipant: assign({
        participants: (context, { id }) => {
          return context.participants.filter(
            (participant) => participant.id !== id
          );
        },
      }),
      validateParticipants: assign({
        participants: (context, { id }) => {
          return context.participants.map((participant) => {
            participant.error =
              participant.username.length < 3 ? "Username is too short 🤏" : "";
            return participant;
          });
        },
      }),
      reset: assign({
        participants: [createParticipant()],
        result: null,
      }),
    },
    guards: {
      isMinLength: (context) => context.participants.length === 1,
      isMaxLength: (context) => context.participants.length === 4,
      isValid: (context) =>
        !!context.participants.find((participant) => participant.error),
    },
  }
);
