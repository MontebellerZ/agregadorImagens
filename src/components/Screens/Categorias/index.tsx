import styles from "./styles.module.scss";
import { useLoaderData } from "react-router";
import type { TCategoria } from "../../../types/categoria.type";
import { useContext } from "react";
import { FotosContext } from "../../../config/Context/createContext";
import Galeria from "../../Galeria";

function Categorias() {
  const allFotos = useContext(FotosContext);

  const routeCategoria: TCategoria | undefined = useLoaderData();
  const nome = routeCategoria?.nome || "Todas as fotos";
  const fotos = routeCategoria?.fotos || allFotos;

  return (
    <div className={styles.categorias}>
      <h2>{nome}</h2>

      <Galeria fotos={fotos} />
    </div>
  );
}

export default Categorias;
