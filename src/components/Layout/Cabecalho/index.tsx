import { Button, Offcanvas } from "react-bootstrap";
import styles from "./styles.module.scss";
import { IoMenu } from "react-icons/io5";
import { useContext, useState } from "react";
import { FotosContext } from "../../../config/Context/createContext";
import { NavLink } from "react-router";
import CategoriaStorage from "../../../config/Storage/Stores/Categoria.store";

function Cabecalho() {
  const fotos = useContext(FotosContext);
  const [showMenu, setShowMenu] = useState(false);

  const categorias = CategoriaStorage.get() || [];

  const getLinkClassName = ({ isActive }: { isActive: boolean }) =>
    `${styles.drawerLink} ${isActive ? styles.active : ""}`.trim();

  return (
    <>
      <section className={styles.header}>
        <div>
          <Button
            variant="outline-secondary"
            className={styles.menuButton}
            onClick={() => setShowMenu(true)}
            aria-label="Abrir menu"
          >
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

      <Offcanvas
        show={showMenu}
        onHide={() => setShowMenu(false)}
        placement="start"
        className={styles.drawer}
      >
        <Offcanvas.Header
          closeButton
          closeVariant="white"
          className={styles.drawerHeader}
        >
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body className={styles.drawerBody}>
          <div>
            <div className={styles.drawerTitle}>Atalhos</div>

            <nav className={styles.drawerNav}>
              <NavLink
                to="/"
                end
                className={getLinkClassName}
                onClick={() => setShowMenu(false)}
              >
                Home
              </NavLink>

              <NavLink
                to="/categorias"
                end
                className={getLinkClassName}
                onClick={() => setShowMenu(false)}
              >
                Ver tudo
              </NavLink>

              {categorias.map((categoria) => (
                <NavLink
                  key={categoria.id}
                  to={`/categorias/${encodeURIComponent(categoria.nome)}`}
                  className={getLinkClassName}
                  style={
                    categoria.cor
                      ? {
                          borderColor: categoria.cor,
                          boxShadow: `inset 4px 0 0 ${categoria.cor}`,
                        }
                      : undefined
                  }
                  onClick={() => setShowMenu(false)}
                >
                  <span className={styles.drawerLinkLabel}>{categoria.nome}</span>
                  {categoria.validado && (
                    <span className={styles.validadoBadge} aria-hidden="true" title="Categoria validada">
                      ✓
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className={styles.drawerFooter}>
            <NavLink
              to="/lixeira"
              end
              className={({ isActive }) =>
                `${getLinkClassName({ isActive })} ${styles.drawerTrashLink}`.trim()
              }
              onClick={() => setShowMenu(false)}
            >
              Lixeira
            </NavLink>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default Cabecalho;
