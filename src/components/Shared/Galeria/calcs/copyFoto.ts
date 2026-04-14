import type { TFoto } from "../../../types/foto.type";
import calcAspectWidth from "./calcAspectWidth";

function copyFoto(foto: TFoto, newHeight?: number) {
  if (!foto.loaded) return { ...foto };

  const aspect = foto.aspect;
  const src = foto.src;

  let height = foto.height;
  let width = foto.width;

  if (newHeight) {
    height = newHeight;
    width = calcAspectWidth(height, aspect!);
  }

  const copy: TFoto = {
    src: src,
    height: height,
    width: width,
    aspect: aspect,
  };

  return copy;
}

export default copyFoto;
