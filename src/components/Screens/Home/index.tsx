import styles from "./styles.module.scss";
import CategoriaStorage from "../../../config/Storage/Stores/Categoria.store";
import { useMemo, useState } from "react";
import { NavLink } from "react-router";
import type { TCategoria } from "../../../types/categoria.type";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import LixeiraStorage from "../../../config/Storage/Stores/Lixeira.store.ts";

const DEFAULT_COLOR = "#746baf";

function Home() {
  const [categorias, setCategorias] = useState<TCategoria[]>(() => CategoriaStorage.get() || []);
  const [categoriaEditandoId, setCategoriaEditandoId] = useState<string | null>(null);
  const [categoriaExcluindo, setCategoriaExcluindo] = useState<TCategoria | null>(null);
  const [nomeEditado, setNomeEditado] = useState("");
  const [corEditada, setCorEditada] = useState(DEFAULT_COLOR);
  const [erroEdicao, setErroEdicao] = useState("");

  const categoriaEditando = useMemo(
    () => categorias.find((categoria) => categoria.id === categoriaEditandoId) || null,
    [categorias, categoriaEditandoId],
  );

  const refreshCategorias = () => {
    setCategorias(CategoriaStorage.get() || []);
  };

  const abrirModalEdicao = (categoria: TCategoria) => {
    setCategoriaEditandoId(categoria.id);
    setNomeEditado(categoria.nome);
    setCorEditada(categoria.cor || DEFAULT_COLOR);
    setErroEdicao("");
  };

  const fecharModalEdicao = () => {
    setCategoriaEditandoId(null);
    setNomeEditado("");
    setCorEditada(DEFAULT_COLOR);
    setErroEdicao("");
  };

  const salvarEdicao = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!categoriaEditando) return;

    const nomeNormalizado = nomeEditado.trim();
    if (!nomeNormalizado) {
      setErroEdicao("Informe um nome válido para a categoria.");
      return;
    }

    if (CategoriaStorage.existsNome(nomeNormalizado, categoriaEditando.id)) {
      setErroEdicao("Já existe uma categoria com esse nome.");
      return;
    }

    CategoriaStorage.saveById({
      ...categoriaEditando,
      nome: nomeNormalizado,
      cor: corEditada,
    });

    refreshCategorias();
    fecharModalEdicao();
  };

  const confirmarExclusao = () => {
    if (!categoriaExcluindo) return;
    CategoriaStorage.deleteById(categoriaExcluindo.id);
    refreshCategorias();
    setCategoriaExcluindo(null);
  };

  return (
    <div className={styles.home}>
      <div className={styles.topRow}>
        <h2>Categorias</h2>
        <div className={styles.topActions}>
          <NavLink to="/categorias" className={styles.viewAllLink}>
            Ver tudo
          </NavLink>
          <NavLink to="/lixeira" className={`${styles.viewAllLink} ${styles.trashLink}`}>
            Lixeira
          </NavLink>
        </div>
      </div>

      {categorias.length === 0 ? (
        <div className={styles.emptyState}>
          Nenhuma categoria criada ainda. Abra uma foto para criar sua primeira categoria.
        </div>
      ) : (
        <div className={styles.gridCategorias}>
          {categorias.map((categoria) => {
            const fotosAtivas = categoria.fotos.filter((foto) => !LixeiraStorage.has(foto.src));
            const previewFotos = fotosAtivas.slice(0, 8);

            return (
              <article
                key={categoria.id}
                className={styles.cardCategoria}
                style={
                  {
                    "--categoria-cor": categoria.cor || DEFAULT_COLOR,
                  } as React.CSSProperties
                }
              >
                <NavLink
                  to={`/categorias/${encodeURIComponent(categoria.nome)}`}
                  className={styles.cardContent}
                >
                  <h3>{categoria.nome}</h3>
                  <p>
                    {fotosAtivas.length} {fotosAtivas.length === 1 ? "foto" : "fotos"}
                  </p>

                  <div className={styles.preview}>
                    {previewFotos.map((foto, index) => (
                      <img
                        key={`${categoria.id}_${foto.src}`}
                        src={foto.src}
                        alt={`Preview ${index + 1} da categoria ${categoria.nome}`}
                        className={styles.previewThumb}
                        loading="lazy"
                        decoding="async"
                      />
                    ))}
                  </div>
                </NavLink>

                <div className={styles.cardActions}>
                  <button
                    type="button"
                    className={styles.actionBtn}
                    onClick={() => abrirModalEdicao(categoria)}
                    aria-label={`Editar categoria ${categoria.nome}`}
                  >
                    <FiEdit2 />
                  </button>

                  <button
                    type="button"
                    className={`${styles.actionBtn} ${styles.deleteBtn}`}
                    onClick={() => setCategoriaExcluindo(categoria)}
                    aria-label={`Excluir categoria ${categoria.nome}`}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {categoriaEditando && (
        <div className={styles.modalBackdrop} onClick={fecharModalEdicao}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h4>Editar categoria</h4>

            <form onSubmit={salvarEdicao} className={styles.formEdicao}>
              <label htmlFor="categoriaNome">Nome</label>
              <input
                id="categoriaNome"
                type="text"
                value={nomeEditado}
                onChange={(e) => {
                  setNomeEditado(e.target.value);
                  if (erroEdicao) setErroEdicao("");
                }}
                placeholder="Nome da categoria"
                autoFocus
              />

              <label htmlFor="categoriaCor">Cor de destaque</label>
              <input
                id="categoriaCor"
                type="color"
                value={corEditada}
                onChange={(e) => setCorEditada(e.target.value)}
                className={styles.colorInput}
              />

              {erroEdicao && <span className={styles.errorText}>{erroEdicao}</span>}

              <div className={styles.modalActions}>
                <button type="button" className={styles.secondaryBtn} onClick={fecharModalEdicao}>
                  Cancelar
                </button>
                <button type="submit" className={styles.primaryBtn}>
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {categoriaExcluindo && (
        <div className={styles.modalBackdrop} onClick={() => setCategoriaExcluindo(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h4>Excluir categoria</h4>
            <p>
              Deseja realmente excluir <strong>{categoriaExcluindo.nome}</strong>? Esta ação remove a
              categoria das fotos vinculadas.
            </p>

            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => setCategoriaExcluindo(null)}
              >
                Cancelar
              </button>
              <button type="button" className={styles.dangerBtn} onClick={confirmarExclusao}>
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
