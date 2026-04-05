import type { TFoto } from "../types/foto.type";
import calcAspectWidth from "./calcAspectWidth";

function copyFoto(foto: TFoto, newHeight?: number) {
  if (!foto.loaded) return { ...foto };

  const aspect = foto.loaded.aspect;
  const src = foto.loaded.src;

  let height = foto.loaded.height;
  let width = foto.loaded.width;

  if (newHeight) {
    height = newHeight;
    width = calcAspectWidth(height, aspect);
  }

  const copy: TFoto = {
    arquivo: foto.arquivo,
    data: foto.data,
    loaded: {
      src: src,
      height: height,
      width: width,
      aspect: aspect,
    },
  };

  return copy;
}

export default copyFoto;
