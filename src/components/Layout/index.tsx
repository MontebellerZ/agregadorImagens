import Cabecalho from "./Cabecalho";
import Conteudo from "./Conteudo";
import Rodape from "./Rodape";
import styles from "./styles.module.scss";

function Layout() {
  return (
    <div className={styles.holder}>
      <Cabecalho />
      <hr />
      <Conteudo />
      <hr />
      <Rodape />
    </div>
  );
}

export default Layout;
