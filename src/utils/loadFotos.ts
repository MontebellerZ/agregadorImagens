import type { TFoto } from "../types/foto.type";

async function loadFotos(fotos: TFoto[], limit: number) {
  const newFotos = fotos.slice(0, limit);

  const loads = newFotos.map(async (f) => {
    if (f.loaded) return f;

    return await new Promise<TFoto>((res) => {
      const img = new Image();
      img.onload = () => {
        f.width = img.width;
        f.height = img.height;
        f.aspect = img.width / img.height;
        f.loaded = true;
        res(f);
      };
      img.src = f.src;
    });
  });

  await Promise.all(loads);

  return newFotos;
}

export default loadFotos;
