import { createContext } from "react";
import getAllFotos from "../../utils/getAllFotos";

export const FotosContext = createContext<ReturnType<typeof getAllFotos>>([]);
