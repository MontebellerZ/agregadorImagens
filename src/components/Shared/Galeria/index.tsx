import { useEffect, useMemo, useRef, useState } from "react";
import type { TFoto } from "../../../types/foto.type";
import styles from "./styles.module.scss";
import loadFotos from "../../../utils/loadFotos";
import calcRowFotos from "./calcs/calcRowFotos";
import Foto from "./Foto";
import FotoModal from "./FotoModal";

const GALLERY_GAP = 6;
const LIMIT_STEP = 50;
const DESIRED_HEIGHT = 240;

interface IGaleria {
  fotos: TFoto[];
}

function Galeria(props: IGaleria) {
  const containerRef = useRef(null);
  const loadingRef = useRef(null);

  const [containerWidth, setContainerWidth] = useState(0);
  const [limit, setLimit] = useState(0);
  const [loaded, setLoaded] = useState<TFoto[]>([]);
  const [modalFoto, setModalFoto] = useState<TFoto | null>(null);
  const [modalFotoIndex, setModalFotoIndex] = useState(0);
  const [categoriasVersion, setCategoriasVersion] = useState(0);

  const ended = useMemo(() => limit >= props.fotos.length, [limit, props.fotos]);

  const handleAbrirModal = (foto: TFoto) => {
    setModalFoto(foto);
    const index = props.fotos.findIndex((f) => f.src === foto.src);
    setModalFotoIndex(index);
  };

  const handleNavegar = (direction: "prev" | "next") => {
    const newIndex =
      direction === "next" ? modalFotoIndex + 1 : modalFotoIndex - 1;
    if (newIndex >= 0 && newIndex < props.fotos.length) {
      setModalFoto(props.fotos[newIndex]);
      setModalFotoIndex(newIndex);
    }
  };

  const handleFecharModal = () => {
    setModalFoto(null);
  };

  const handleCategoriasChange = () => {
    setCategoriasVersion((current) => current + 1);
  };

  useEffect(() => {
    if (containerWidth === 0 || limit === 0) return;

    loadFotos(props.fotos, limit)
      .then((fotos) => calcRowFotos(fotos, DESIRED_HEIGHT, containerWidth, GALLERY_GAP))
      .then(setLoaded);
  }, [limit, props.fotos, containerWidth]);

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!loadingRef.current) return;

    const visibleObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setLimit((l) => l + LIMIT_STEP);
      },
      {
        root: null,
        rootMargin: `0px 0px ${200}px 0px`,
        threshold: 0,
      },
    );

    visibleObserver.observe(loadingRef.current);

    return () => visibleObserver.disconnect();
  }, []);

  return (
      <>
    <div ref={containerRef} className={styles.galeria} style={{ gap: GALLERY_GAP }}>
      {loaded.map((f) => (
        <Foto
          key={f.src}
          fotoObj={f}
          categoriasVersion={categoriasVersion}
          src={f.src}
          decoding="sync"
          className={styles.foto}
          style={{
            aspectRatio: f.aspect,
            height: f.height,
            borderRadius: GALLERY_GAP,
          }}
          onClick={() => handleAbrirModal(f)}
        />
      ))}
      {loaded.length && <div style={{ flex: 1 }}></div>}
      <h3 ref={loadingRef} className={styles.loadingText}>
        {ended ? "Isso é tudo!" : "Carregando..."}
      </h3>
    </div>
    <FotoModal
      key={modalFoto?.src || "sem-foto"}
      foto={modalFoto}
      fotoIndex={modalFotoIndex}
      totalFotos={props.fotos.length}
      onCategoriasChange={handleCategoriasChange}
      onClose={handleFecharModal}
      onNavigate={handleNavegar}
    />
    </>
  );
}

export default Galeria;
