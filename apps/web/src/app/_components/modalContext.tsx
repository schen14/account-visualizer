import { SetStateAction, createContext } from "react";

type Dispatch<A> = (value: A) => void;

interface IContextProps {
  activeAccount: Account | null;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

export const ModalContext = createContext({} as IContextProps);