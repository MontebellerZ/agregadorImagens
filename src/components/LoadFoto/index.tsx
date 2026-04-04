import { useEffect, useState } from "react";
import type { TFoto } from "../../types/foto.type";
import type { ImageProps } from "react-bootstrap";

interface IFoto extends ImageProps {
  foto: TFoto;
}

function LoadFoto(props: IFoto) {
  const [loaded, setLoaded] = useState<string>();

  useEffect(() => {
    props.foto.data().then((res) => setLoaded(res.default));
  }, [props.foto]);

  if (!loaded) return <></>;

  return <img {...props} src={loaded} />;
}

export default LoadFoto;
