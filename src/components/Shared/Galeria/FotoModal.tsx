import { useEffect, useState } from "react";
import type { TFoto } from "../../../types/foto.type";
import styles from "./fotoModal.module.scss";
import CategoriaStorage from "../../../config/Storage/Stores/Categoria.store";
import {
  assignCategoriaAFoto,
  createCategory,
  getCategoriasFoto,
} from "../../../utils/getCategoriasFoto";

interface IFotoModal {
  foto: TFoto | null;
  fotoIndex: number;
  totalFotos: number;
  onCategoriasChange: () => void;
  onClose: () => void;
  onNavigate: (direction: "prev" | "next") => void;
}

function FotoModal({
  foto,
  fotoIndex,
  totalFotos,
  onCategoriasChange,
  onClose,
  onNavigate,
}: IFotoModal) {
  const [novaCategoria, setNovaCategoria] = useState("");
  const [novaCor, setNovaCor] = useState("#746baf");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const todasCategorias = CategoriaStorage.get() || [];
  const categoriasFoto = foto ? getCategoriasFoto(foto) : [];
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<Set<string>>(
    () => new Set(categoriasFoto.map((categoria) => categoria.id)),
  );

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!foto) return;

      if (e.key === "Escape") {
        if (isCreateModalOpen) {
          setIsCreateModalOpen(false);
          return;
        }
        onClose();
        return;
      }

      if (isCreateModalOpen) {
        return;
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        onNavigate("prev");
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        onNavigate("next");
      }
    };

    if (foto) {
      window.addEventListener("keydown", handleKeyPress);
      return () => window.removeEventListener("keydown", handleKeyPress);
    }
  }, [foto, isCreateModalOpen, onClose, onNavigate]);

  if (!foto) return null;

  const handleToggleCategoria = (categoriaId: string) => {
    setCategoriasSelecionadas((current) => {
      const next = new Set(current);
      if (next.has(categoriaId)) {
        next.delete(categoriaId);
      } else {
        next.add(categoriaId);
      }
      return next;
    });

    assignCategoriaAFoto(foto, categoriaId);
    onCategoriasChange();
  };

  const handleCreateCategory = () => {
    const nomeCategoria = novaCategoria.trim();
    if (!nomeCategoria) return;

    const categoriaExiste = CategoriaStorage.existsNome(nomeCategoria);
    if (categoriaExiste) {
      return;
    }

    const categoriaCriada = createCategory(nomeCategoria, novaCor);
    if (!categoriaCriada) return;

    assignCategoriaAFoto(foto, categoriaCriada.id);
    setCategoriasSelecionadas((current) => new Set(current).add(categoriaCriada.id));
    onCategoriasChange();
    setNovaCategoria("");
    setNovaCor("#746baf");
    setIsCreateModalOpen(false);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <span className={styles.counter}>
            {fotoIndex + 1} de {totalFotos}
          </span>

          <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar modal">
            ✕
          </button>
        </div>

        <div className={styles.showImage}>
          <div className={styles.imageContainer}>
            <img src={foto.src} alt="Foto ampliada" className={styles.image} />
          </div>

          <div className={styles.navigation}>
            <button
              onClick={() => onNavigate("prev")}
              disabled={fotoIndex === 0}
              className={styles.navBtn}
            >
              ← Anterior
            </button>
            <button
              onClick={() => onNavigate("next")}
              disabled={fotoIndex === totalFotos - 1}
              className={styles.navBtn}
            >
              Próxima →
            </button>
          </div>
        </div>

        <div className={styles.categoriasSection}>
          <h3>Categorias</h3>

          <div className={styles.categoriasList}>
            {todasCategorias.map((categoria) => {
              const isChecked = categoriasSelecionadas.has(categoria.id);
              return (
                <button
                  type="button"
                  key={categoria.id}
                  onClick={() => handleToggleCategoria(categoria.id)}
                  className={styles.categoriaBtn}
                  data-selected={isChecked}
                  style={
                    categoria.cor
                      ? ({
                          "--categoria-cor": categoria.cor,
                        } as React.CSSProperties)
                      : undefined
                  }
                  aria-pressed={isChecked}
                >
                  {categoria.nome}
                </button>
              );
            })}
            <button
              type="button"
              className={`${styles.categoriaBtn} ${styles.addCategoriaBtn}`}
              onClick={() => setIsCreateModalOpen(true)}
            >
              + Nova categoria
            </button>
          </div>

          {isCreateModalOpen && (
            <div className={styles.innerBackdrop} onClick={() => setIsCreateModalOpen(false)}>
              <div className={styles.innerModal} onClick={(e) => e.stopPropagation()}>
                <h4>Criar categoria</h4>
                <div className={styles.novaCategoria}>
                  <div className={styles.inputGroup}>
                    <input
                      type="text"
                      value={novaCategoria}
                      onChange={(e) => setNovaCategoria(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleCreateCategory();
                        }
                      }}
                      placeholder="Digite o nome da categoria..."
                      className={styles.input}
                      autoFocus
                    />
                    <input
                      type="color"
                      value={novaCor}
                      onChange={(e) => setNovaCor(e.target.value)}
                      className={styles.colorInput}
                    />
                  </div>
                </div>
                <div className={styles.innerActions}>
                  <button
                    type="button"
                    className={styles.secondaryBtn}
                    onClick={() => setIsCreateModalOpen(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateCategory}
                    className={styles.createBtn}
                    disabled={!novaCategoria.trim()}
                  >
                    Confirmar criação
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FotoModal;
