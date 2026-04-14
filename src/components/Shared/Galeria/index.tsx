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
  const [limitByKey, setLimitByKey] = useState<Record<string, number>>({});
  const [loadedState, setLoadedState] = useState<{ key: string; fotos: TFoto[] }>({
    key: "",
    fotos: [],
  });
  const [modalFotoSrc, setModalFotoSrc] = useState<string | null>(null);
  const [categoriasVersion, setCategoriasVersion] = useState(0);
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
    [props.fotos, props.showOnlyTrashed, recentlyTrashed],
  );

  const fotosKey = useMemo(
    () => fotosFiltradas.map((foto) => foto.src).join("|"),
    [fotosFiltradas],
  );

  const limit = useMemo(
    () => limitByKey[fotosKey] ?? Math.min(LIMIT_STEP, fotosFiltradas.length),
    [limitByKey, fotosKey, fotosFiltradas.length],
  );

  const loaded = useMemo(
    () => (loadedState.key === fotosKey ? loadedState.fotos : []),
    [loadedState, fotosKey],
  );

  const ended = useMemo(() => limit >= fotosFiltradas.length, [limit, fotosFiltradas]);

  const modalFotoIndex = useMemo(() => {
    if (!modalFotoSrc) return -1;
    return fotosFiltradas.findIndex((foto) => foto.src === modalFotoSrc);
  }, [modalFotoSrc, fotosFiltradas]);

  const modalFoto = useMemo(() => {
    if (modalFotoIndex < 0) return null;
    return fotosFiltradas[modalFotoIndex] || null;
  }, [fotosFiltradas, modalFotoIndex]);

  const handleAbrirModal = (foto: TFoto) => {
    setModalFotoSrc(foto.src);
  };

  const handleNavegar = (direction: "prev" | "next") => {
    const newIndex = direction === "next" ? modalFotoIndex + 1 : modalFotoIndex - 1;
    if (newIndex >= 0 && newIndex < fotosFiltradas.length) {
      setModalFotoSrc(fotosFiltradas[newIndex].src);
    }
  };

  const handleFecharModal = () => {
    setModalFotoSrc(null);
  };

  const handleCategoriasChange = () => {
    setCategoriasVersion((current) => current + 1);
  };

  const handleTrashStateChange = (fotoSrc?: string) => {
    setRecentlyTrashed((current) => {
      const next = new Set(current);
      if (fotoSrc) {
        next.add(fotoSrc);
      }
      return next;
    });
  };

  useEffect(() => {
    if (containerWidth === 0 || limit === 0) return;

    const currentKey = fotosKey;
    const currentVersion = ++loadVersionRef.current;
    let cancelled = false;

    loadFotos(fotosFiltradas, limit)
      .then((fotos) => calcRowFotos(fotos, DESIRED_HEIGHT, containerWidth, GALLERY_GAP))
      .then((fotos) => {
        if (cancelled) return;
        if (currentVersion !== loadVersionRef.current) return;
        setLoadedState({ key: currentKey, fotos });
      });

    return () => {
      cancelled = true;
    };
  }, [limit, fotosKey, fotosFiltradas, containerWidth]);

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
        if (!entry.isIntersecting) return;

        setLimitByKey((current) => {
          const currentLimit = current[fotosKey] ?? Math.min(LIMIT_STEP, fotosFiltradas.length);
          const nextLimit = Math.min(currentLimit + LIMIT_STEP, fotosFiltradas.length);

          if (nextLimit === currentLimit) return current;

          return {
            ...current,
            [fotosKey]: nextLimit,
          };
        });
      },
      {
        root: null,
        rootMargin: `0px 0px ${200}px 0px`,
        threshold: 0,
      },
    );

    visibleObserver.observe(loadingRef.current);

    return () => visibleObserver.disconnect();
  }, [fotosKey, fotosFiltradas.length]);

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
        fotoIndex={modalFotoIndex < 0 ? 0 : modalFotoIndex}
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
