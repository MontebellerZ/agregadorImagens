import type { TFoto } from "../types/foto.type";

function getAllFotos(): TFoto[] {
  const files = import.meta.glob("/src/assets/fotos/*");
  if (!files) throw Error("Nenhuma foto encontrada em /src/assets/fotos/*");
  return Object.keys(files).map((src): TFoto => ({ src }));
}

export default getAllFotos;
