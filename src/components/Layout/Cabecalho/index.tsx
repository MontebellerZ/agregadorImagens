import { Button } from "react-bootstrap";
import styles from "./styles.module.scss";
import { IoMenu } from "react-icons/io5";
import { useContext } from "react";
import { FotosContext } from "../../../config/Context/createContext";

function Cabecalho() {
  const fotos = useContext(FotosContext);

  return (
    <section className={styles.header}>
      <div>
        <Button variant="outline-secondary">
          <IoMenu />
        </Button>
      </div>

      <div>
        <h1>Agrupador de Imagens</h1>
      </div>

      <div>
        <span>Imagens: {Object.keys(fotos).length}</span>
      </div>
    </section>
  );
}

export default Cabecalho;
