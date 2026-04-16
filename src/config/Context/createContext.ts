import { createContext } from "react";
import getAllFotos from "../../utils/getAllFotos";

export const FotosContext = createContext<ReturnType<typeof getAllFotos>>([]);

export interface ICategoriasViewContext {
	apenasSemCategoria: boolean;
	setApenasSemCategoria: (value: boolean) => void;
	apenasComMultiplasCategorias: boolean;
	setApenasComMultiplasCategorias: (value: boolean) => void;
}

export const CategoriasViewContext = createContext<ICategoriasViewContext>({
	apenasSemCategoria: false,
	setApenasSemCategoria: () => {},
	apenasComMultiplasCategorias: false,
	setApenasComMultiplasCategorias: () => {},
});
