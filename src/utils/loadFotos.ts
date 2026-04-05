import type { TFoto } from "../types/foto.type";

async function loadFotos(fotos: TFoto[], limit: number) {
  const newFotos = fotos.slice(0, limit);

  const loads = newFotos.map(async (f) => {
    if (f.loaded) return f;

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

  await Promise.all(loads);

  return newFotos;
}

export default loadFotos;
