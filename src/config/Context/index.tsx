import { type PropsWithChildren, useEffect, useState } from "react";
import getAllFotos from "../../utils/getAllFotos";
import { CategoriasViewContext, FotosContext } from "./createContext";

const fotos = getAllFotos();
const STORAGE_KEY_APENAS_SEM_CATEGORIA = "categorias_apenas_sem_categoria";

function AppContext(props: PropsWithChildren) {
  const [apenasSemCategoria, setApenasSemCategoria] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_APENAS_SEM_CATEGORIA) === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_APENAS_SEM_CATEGORIA, apenasSemCategoria ? "1" : "0");
    } catch {
      // Ignora falhas de persistencia e mantem o valor em memoria.
    }
  }, [apenasSemCategoria]);

  return (
    <CategoriasViewContext value={{ apenasSemCategoria, setApenasSemCategoria }}>
      <FotosContext value={fotos}>{props.children}</FotosContext>
    </CategoriasViewContext>
  );
}

export default AppContext;
