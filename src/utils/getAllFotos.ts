import type { TFoto } from "../types/foto.type";

function getAllFotos(): TFoto[] {
  const files = import.meta.glob("/src/assets/fotos/*");
  if (!files) throw Error("Nenhuma foto encontrada em /src/assets/fotos/*");
  const entries = Object.entries(files) as [string, () => Promise<{ default: string }>][];
  return entries.map(([arquivo, data]): TFoto => ({ arquivo, data }));
}

export default getAllFotos;
