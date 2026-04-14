import styles from "./styles.module.scss";
import { useLoaderData } from "react-router";
import type { TCategoria } from "../../../types/categoria.type";
import { useContext, useMemo } from "react";
import { CategoriasViewContext, FotosContext } from "../../../config/Context/createContext";
import Galeria from "../../Shared/Galeria";
import CategoriaStorage from "../../../config/Storage/Stores/Categoria.store";

function Categorias() {
  const allFotos = useContext(FotosContext);
  const { apenasSemCategoria, setApenasSemCategoria } = useContext(CategoriasViewContext);

  const routeCategoria: TCategoria | undefined = useLoaderData();

  const isVerTudo = !routeCategoria;

  const fotosSemCategoria = useMemo(() => {
    const categorias = CategoriaStorage.get() || [];
    const fotosComCategoria = new Set(
      categorias.flatMap((categoria) => categoria.fotos.map((foto) => foto.src)),
    );

    return allFotos.filter((foto) => !fotosComCategoria.has(foto.src));
  }, [allFotos]);

  const mostrarSomenteSemCategoria = isVerTudo && apenasSemCategoria;
  const nome = routeCategoria?.nome || (mostrarSomenteSemCategoria ? "Fotos sem categoria" : "Todas as fotos");
  const fotos = routeCategoria?.fotos || (mostrarSomenteSemCategoria ? fotosSemCategoria : allFotos);

  return (
    <div className={styles.categorias}>
      <div className={styles.topRow}>
        <h2>{nome}</h2>

        {isVerTudo && (
          <label className={styles.switchHolder}>
            <input
              type="checkbox"
              checked={mostrarSomenteSemCategoria}
              onChange={(e) => setApenasSemCategoria(e.target.checked)}
            />
            <span>Apenas sem categoria</span>
          </label>
        )}
      </div>

      <Galeria fotos={fotos} />
    </div>
  );
}

export default Categorias;
