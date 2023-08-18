import { useInterpret } from "@xstate/react";
import { FC, PropsWithChildren, createContext } from "react";
import bookableMachine from "../state/bookableMachine";

export const BookableMachineContext =
  createContext<BookableMachineContextType>(null);

export type BookableMachineContextType = null | ReturnType<typeof useInterpret>;

export const BookableMachineContextProvider: FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  const bookableMachineService = useInterpret(bookableMachine);
  return (
    <BookableMachineContext.Provider value={bookableMachineService}>
      {children}
    </BookableMachineContext.Provider>
  );
};
