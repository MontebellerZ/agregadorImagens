import { useEffect, useRef, useState } from "react";
import type { TFoto } from "../../types/foto.type";
import styles from "./styles.module.scss";
import loadFotos from "../../utils/loadFotos";
import calcRowFotos from "../../utils/calcRowFotos";
import Foto from "./Foto";

const GALLERY_GAP = 7;
const LIMIT_STEP = 50;
const DESIRED_HEIGHT = 240;

interface IGaleria {
  fotos: TFoto[];
}

function Galeria(props: IGaleria) {
  const containerRef = useRef(null);

  const [containerWidth, setContainerWidth] = useState(0);
  const [limit, setLimit] = useState(LIMIT_STEP);
  const [loaded, setLoaded] = useState<TFoto[]>([]);

  useEffect(() => {
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

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.galeria} style={{ gap: GALLERY_GAP }}>
      {loaded.map((f) => (
        <Foto
          key={f.arquivo}
          src={f.loaded?.src}
          decoding="sync"
          className={styles.foto}
          style={{
            aspectRatio: f.loaded?.aspect,
            height: f.loaded?.height,
            borderRadius: GALLERY_GAP,
          }}
        />
      ))}
    </div>
  );
}

export default Galeria;
