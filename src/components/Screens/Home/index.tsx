import styles from "./styles.module.scss";
import CategoriaStorage from "../../../config/Storage/Stores/Categoria.store";
import LinkCategoria from "../../Shared/LinkCategoria";

function Home() {
  const categorias = CategoriaStorage.get() || [];

  return (
    <div className={styles.home}>
      <div className={styles.buttons}>
        <LinkCategoria />
        {categorias?.map((c) => (
          <LinkCategoria key={c.nome} categoria={c} />
        ))}
      </div>
    </div>
  );
}

export default Home;
