import type { TFoto } from "../types/foto.type";
import type { TCategoria } from "../types/categoria.type";
import CategoriaStorage from "../config/Storage/Stores/Categoria.store";

export function getCategoriasFoto(foto: TFoto): TCategoria[] {
  const categorias = CategoriaStorage.get() || [];
  return categorias.filter((cat) => cat.fotos.some((f) => f.src === foto.src));
}

export function assignCategoriaAFoto(foto: TFoto, categoriaNome: string) {
  const categorias = CategoriaStorage.get() || [];
  const categoria = categorias.find((c) => c.nome === categoriaNome);

  if (!categoria) return;

  // Remove a foto se já estiver nesta categoria
  const fotoJaEsta = categoria.fotos.some((f) => f.src === foto.src);
  if (fotoJaEsta) {
    categoria.fotos = categoria.fotos.filter((f) => f.src !== foto.src);
  } else {
    // Adiciona a foto
    categoria.fotos.push(foto);
  }

  CategoriaStorage.saveByNome(categoria);
}

export function removeFotoDeCategoria(foto: TFoto, categoriaNome: string) {
  const categorias = CategoriaStorage.get() || [];
  const categoria = categorias.find((c) => c.nome === categoriaNome);

  if (!categoria) return;

  categoria.fotos = categoria.fotos.filter((f) => f.src !== foto.src);
  CategoriaStorage.saveByNome(categoria);
}

export function createCategory(nome: string, cor?: string) {
  const categorias = CategoriaStorage.get() || [];
  const nomeNormalizado = nome.trim();

  if (!nomeNormalizado || categorias.some((c) => c.nome === nomeNormalizado)) {
    return; // Categoria já existe
  }

  CategoriaStorage.save([
    ...categorias,
    {
      nome: nomeNormalizado,
      fotos: [],
      cor,
    },
  ]);
}
