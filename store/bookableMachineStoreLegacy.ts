import { create } from "domain";
import { atomWithMachine } from "jotai-xstate";
import createBookableMachine from "../state/bookableMachine";
import bookableMachine from "../state/bookableMachine";

const bookableMachineAtom = atomWithMachine(() => bookableMachine);

export default bookableMachineAtom;
