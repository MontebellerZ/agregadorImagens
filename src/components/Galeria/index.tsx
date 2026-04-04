import { useEffect, useState } from "react";
import type { TFoto } from "../../types/foto.type";
import styles from "./styles.module.scss";

const LIMIT_STEP = 50;

interface IGaleria {
  fotos: TFoto[];
}

function Galeria(props: IGaleria) {
  const [limit, setLimit] = useState(LIMIT_STEP);
  const [loaded, setLoaded] = useState<TFoto[]>([]);

  useEffect(() => {
    const newFotos = props.fotos.slice(limit - LIMIT_STEP, LIMIT_STEP);

    const loads = newFotos.map(async (f) => {
      const data = await f.data();
      const src = data.default;
      const img = new Image();

      return await new Promise<TFoto>((res) => {
        img.onload = () => {
          f.loaded = {
            src: img.src,
            width: img.width,
            height: img.height,
            aspect: img.width / img.height,
          };
          res(f);
        };
        img.src = src;
      });
    });

    Promise.all(loads).then(setLoaded);
  }, [limit, props.fotos]);

  return (
    <div className={styles.galeria}>
      {loaded.map((f) => (
        <img
          key={f.arquivo}
          src={f.loaded?.src}
          decoding="sync"
          className={styles.foto}
          style={{
            aspectRatio: f.loaded?.aspect,
            height: 200,
            width: undefined,
          }}
        />
      ))}
    </div>
  );
}

export default Galeria;
