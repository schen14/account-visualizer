import type { Dispatch, SetStateAction } from "react";
import { createContext } from "react";

interface IContextProps {
  activeAccount: Account | null;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

export const ModalContext = createContext({} as IContextProps);