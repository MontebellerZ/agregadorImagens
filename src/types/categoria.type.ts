import type { TFoto } from "./foto.type";

export type TCategoria = {
  nome: string;
  fotos: TFoto[];
  cor?: string;
};
