import { atomWithMachine } from "jotai-xstate";

import bookableMachine from "../state/bookableMachine";

const bookableMachineAtom = atomWithMachine(() => bookableMachine);

export default bookableMachineAtom;
