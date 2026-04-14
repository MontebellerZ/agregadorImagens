import { useContext } from "react";
import Galeria from "../../Shared/Galeria";
import styles from "./styles.module.scss";
import { FotosContext } from "../../../config/Context/createContext";
import LixeiraStorage from "../../../config/Storage/Stores/Lixeira.store.ts";

function Lixeira() {
  const allFotos = useContext(FotosContext);
  const totalLixeira = allFotos.filter((foto) => LixeiraStorage.has(foto.src)).length;

  return (
    <div className={styles.lixeira}>
      <h2>Lixeira</h2>

      {totalLixeira === 0 ? (
        <div className={styles.emptyState}>Nenhuma foto está na lixeira no momento.</div>
      ) : (
        <Galeria fotos={allFotos} showOnlyTrashed />
      )}
    </div>
  );
}

export default Lixeira;
