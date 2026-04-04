import { type PropsWithChildren } from "react";
import getAllFotos from "../../utils/getAllFotos";
import { FotosContext } from "./createContext";

const fotos = getAllFotos();

function AppContext(props: PropsWithChildren) {
  return <FotosContext value={fotos}>{props.children}</FotosContext>;
}

export default AppContext;
