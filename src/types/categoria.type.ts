import type { TFoto } from "./foto.type";

export type TCategoria = {
  id: string;
  nome: string;
  fotos: TFoto[];
  cor?: string;
};
