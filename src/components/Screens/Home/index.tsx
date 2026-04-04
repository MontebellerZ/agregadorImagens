import { Button } from "react-bootstrap";
import styles from "./styles.module.scss";
import CategoriaStorage from "../../../config/Storage/Stores/Categoria.store";

function Home() {
  const categorias = CategoriaStorage.get() || [];

  return (
    <div className={styles.home}>
      <Button variant="secondary">Ver tudo</Button>
      {categorias?.map((c) => (
        <div key={c.nome}></div>
      ))}
    </div>
  );
}

export default Home;
