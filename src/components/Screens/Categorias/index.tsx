import styles from "./styles.module.scss";
import { useLoaderData } from "react-router";
import type { TCategoria } from "../../../types/categoria.type";
import { useContext, useMemo, useState } from "react";
import { CategoriasViewContext, FotosContext } from "../../../config/Context/createContext";
import Galeria from "../../Shared/Galeria";
import CategoriaStorage from "../../../config/Storage/Stores/Categoria.store";

function Categorias() {
  const allFotos = useContext(FotosContext);
  const { apenasSemCategoria, setApenasSemCategoria } = useContext(CategoriasViewContext);

  const routeCategoria: TCategoria | undefined = useLoaderData();
  const [validadoUI, setValidadoUI] = useState<{ categoriaId: string | null; value: boolean }>(() => ({
    categoriaId: routeCategoria?.id ?? null,
    value: routeCategoria?.validado ?? false,
  }));

  const isVerTudo = !routeCategoria;

  const categoriaValidada =
    validadoUI.categoriaId === (routeCategoria?.id ?? null)
      ? validadoUI.value
      : (routeCategoria?.validado ?? false);

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

  const handleValidadoChange = (checked: boolean) => {
    if (!routeCategoria) return;

    setValidadoUI({
      categoriaId: routeCategoria.id,
      value: checked,
    });

    const categoriaPersistida = CategoriaStorage.getById(routeCategoria.id);
    if (!categoriaPersistida) return;

    CategoriaStorage.saveById({
      ...categoriaPersistida,
      validado: checked,
    });
  };

  return (
    <div className={styles.categorias}>
      <div className={styles.topRow}>
        <h2>{nome}</h2>

        {!isVerTudo && routeCategoria && (
          <label className={styles.validadoHolder}>
            <span>Categoria validada</span>
            <input
              type="checkbox"
              checked={categoriaValidada}
              onChange={(e) => handleValidadoChange(e.target.checked)}
            />
          </label>
        )}

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
