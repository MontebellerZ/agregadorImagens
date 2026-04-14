import type { TFoto } from "../types/foto.type";
import type { TCategoria } from "../types/categoria.type";
import CategoriaStorage from "../config/Storage/Stores/Categoria.store";

export function getCategoriasFoto(foto: TFoto): TCategoria[] {
  const categorias = CategoriaStorage.get() || [];
  return categorias.filter((cat) => cat.fotos.some((f) => f.src === foto.src));
}

export function assignCategoriaAFoto(foto: TFoto, categoriaId: string) {
  const categoria = CategoriaStorage.getById(categoriaId);

  if (!categoria) return;

  // Remove a foto se já estiver nesta categoria
  const fotoJaEsta = categoria.fotos.some((f) => f.src === foto.src);
  if (fotoJaEsta) {
    categoria.fotos = categoria.fotos.filter((f) => f.src !== foto.src);
  } else {
    // Adiciona a foto
    categoria.fotos.push(foto);
  }

  CategoriaStorage.saveById(categoria);
}

export function removeFotoDeCategoria(foto: TFoto, categoriaId: string) {
  const categoria = CategoriaStorage.getById(categoriaId);

  if (!categoria) return;

  categoria.fotos = categoria.fotos.filter((f) => f.src !== foto.src);
  CategoriaStorage.saveById(categoria);
}

export function createCategory(nome: string, cor?: string) {
  return CategoriaStorage.create(nome, cor);
}
