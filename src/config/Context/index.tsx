import { type PropsWithChildren, useEffect, useState } from "react";
import getAllFotos from "../../utils/getAllFotos";
import { CategoriasViewContext, FotosContext } from "./createContext";

const fotos = getAllFotos();
const STORAGE_KEY_FILTRO_VER_TUDO = "categorias_filtro_ver_tudo";
type TCategoriasFiltroVerTudo = "todas" | "semCategoria" | "multiplasCategorias";

function AppContext(props: PropsWithChildren) {
  const [filtroVerTudo, setFiltroVerTudo] = useState<TCategoriasFiltroVerTudo>(() => {
    try {
      const persisted = localStorage.getItem(STORAGE_KEY_FILTRO_VER_TUDO);
      if (persisted === "semCategoria" || persisted === "multiplasCategorias" || persisted === "todas") {
        return persisted;
      }

      // Compatibilidade com a chave legada do filtro "apenas sem categoria".
      if (localStorage.getItem("categorias_apenas_sem_categoria") === "1") {
        return "semCategoria";
      }

      return "todas";
    } catch {
      return "todas";
    }
  });

  const apenasSemCategoria = filtroVerTudo === "semCategoria";
  const apenasComMultiplasCategorias = filtroVerTudo === "multiplasCategorias";

  const setApenasSemCategoria = (value: boolean) => {
    setFiltroVerTudo(value ? "semCategoria" : "todas");
  };

  const setApenasComMultiplasCategorias = (value: boolean) => {
    setFiltroVerTudo(value ? "multiplasCategorias" : "todas");
  };

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FILTRO_VER_TUDO, filtroVerTudo);
    } catch {
      // Ignora falhas de persistencia e mantem o valor em memoria.
    }
  }, [filtroVerTudo]);

  return (
    <CategoriasViewContext
      value={{
        apenasSemCategoria,
        setApenasSemCategoria,
        apenasComMultiplasCategorias,
        setApenasComMultiplasCategorias,
      }}
    >
      <FotosContext value={fotos}>{props.children}</FotosContext>
    </CategoriasViewContext>
  );
}

export default AppContext;
