import { useEffect, useMemo, useRef, useState } from "react";
import type { TFoto } from "../../../types/foto.type";
import styles from "./styles.module.scss";
import loadFotos from "../../../utils/loadFotos";
import calcRowFotos from "./calcs/calcRowFotos";
import Foto from "./Foto";
import FotoModal from "./FotoModal";
import LixeiraStorage from "../../../config/Storage/Stores/Lixeira.store.ts";

const GALLERY_GAP = 6;
const LIMIT_STEP = 50;
const DESIRED_HEIGHT = 240;

interface IGaleria {
  fotos: TFoto[];
  showOnlyTrashed?: boolean;
}

function Galeria(props: IGaleria) {
  const containerRef = useRef(null);
  const loadingRef = useRef(null);
  const loadVersionRef = useRef(0);

  const [containerWidth, setContainerWidth] = useState(0);
  const [limit, setLimit] = useState(0);
  const [loaded, setLoaded] = useState<TFoto[]>([]);
  const [modalFoto, setModalFoto] = useState<TFoto | null>(null);
  const [modalFotoIndex, setModalFotoIndex] = useState(0);
  const [categoriasVersion, setCategoriasVersion] = useState(0);
  const [trashVersion, setTrashVersion] = useState(0);
  const [recentlyTrashed, setRecentlyTrashed] = useState<Set<string>>(() => new Set());

  const fotosFiltradas = useMemo(
    () =>
      props.fotos.filter((foto) => {
        const isInTrash = LixeiraStorage.has(foto.src);

        if (props.showOnlyTrashed) {
          return isInTrash;
        }

        return !isInTrash || recentlyTrashed.has(foto.src);
      }),
    [props.fotos, props.showOnlyTrashed, trashVersion, recentlyTrashed],
  );

  const fotosKey = useMemo(
    () => fotosFiltradas.map((foto) => foto.src).join("|"),
    [fotosFiltradas],
  );

  const ended = useMemo(() => limit >= fotosFiltradas.length, [limit, fotosFiltradas]);

  const handleAbrirModal = (foto: TFoto) => {
    setModalFoto(foto);
    const index = fotosFiltradas.findIndex((f) => f.src === foto.src);
    setModalFotoIndex(index);
  };

  const handleNavegar = (direction: "prev" | "next") => {
    const newIndex = direction === "next" ? modalFotoIndex + 1 : modalFotoIndex - 1;
    if (newIndex >= 0 && newIndex < fotosFiltradas.length) {
      setModalFoto(fotosFiltradas[newIndex]);
      setModalFotoIndex(newIndex);
    }
  };

  const handleFecharModal = () => {
    setModalFoto(null);
  };

  const handleCategoriasChange = () => {
    setCategoriasVersion((current) => current + 1);
  };

  const handleTrashStateChange = (fotoSrc?: string) => {
    if (fotoSrc) {
      setRecentlyTrashed((current) => {
        const next = new Set(current);
        next.add(fotoSrc);
        return next;
      });
    }

    setTrashVersion((current) => current + 1);
  };

  useEffect(() => {
    setLoaded([]);
    setLimit(Math.min(LIMIT_STEP, fotosFiltradas.length));
  }, [fotosKey, fotosFiltradas.length]);

  useEffect(() => {
    if (!modalFoto) return;

    const nextIndex = fotosFiltradas.findIndex((foto) => foto.src === modalFoto.src);
    if (nextIndex === -1) {
      setModalFoto(null);
      return;
    }

    setModalFotoIndex(nextIndex);
  }, [fotosFiltradas, modalFoto]);

  useEffect(() => {
    if (containerWidth === 0 || limit === 0) return;

    const currentVersion = ++loadVersionRef.current;
    let cancelled = false;

    loadFotos(fotosFiltradas, limit)
      .then((fotos) => calcRowFotos(fotos, DESIRED_HEIGHT, containerWidth, GALLERY_GAP))
      .then((fotos) => {
        if (cancelled) return;
        if (currentVersion !== loadVersionRef.current) return;
        setLoaded(fotos);
      });

    return () => {
      cancelled = true;
    };
  }, [limit, fotosKey, containerWidth]);

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
        {loaded.map((f) => {
          const isRecentlyTrashed = recentlyTrashed.has(f.src) && LixeiraStorage.has(f.src);

          return (
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
                filter: isRecentlyTrashed ? "grayscale(1) brightness(0.6)" : undefined,
                pointerEvents: isRecentlyTrashed ? "none" : undefined,
                opacity: isRecentlyTrashed ? 0.88 : undefined,
                transition: "filter 180ms ease, opacity 180ms ease",
              }}
              onClick={isRecentlyTrashed ? undefined : () => handleAbrirModal(f)}
            />
          );
        })}
        {loaded.length ? <div style={{ flex: 1 }}></div> : <></>}
        <h3 ref={loadingRef} className={styles.loadingText}>
          {ended ? "Isso é tudo!" : "Carregando..."}
        </h3>
      </div>
      <FotoModal
        key={modalFoto?.src || "sem-foto"}
        foto={modalFoto}
        fotoIndex={modalFotoIndex}
        totalFotos={fotosFiltradas.length}
        onCategoriasChange={handleCategoriasChange}
        onTrashStateChange={handleTrashStateChange}
        onClose={handleFecharModal}
        onNavigate={handleNavegar}
      />
    </>
  );
}

export default Galeria;
