import styles from "./styles.module.scss";
import { useLoaderData } from "react-router";
import type { TCategoria } from "../../../types/categoria.type";
import { useContext } from "react";
import { FotosContext } from "../../../config/Context/createContext";
import LoadFoto from "../../LoadFoto";

function Categorias() {
  const allFotos = useContext(FotosContext);

  const routeCategoria: TCategoria | undefined = useLoaderData();
  const nome = routeCategoria?.nome || "Todas as fotos";
  const fotos = routeCategoria?.fotos || allFotos.slice(0, 50);

  return (
    <div className={styles.categorias}>
      <h2>{nome}</h2>

      <div className={styles.galeria}>
        {fotos.map((f) => (
          <LoadFoto key={f.arquivo} foto={f} className={styles.foto} />
        ))}
      </div>
    </div>
  );
}

export default Categorias;
