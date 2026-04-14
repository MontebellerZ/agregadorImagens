import type { TCategoria } from "../../../types/categoria.type";
import generateId from "../../../utils/generateId";
import normalizeString from "../../../utils/normalizeString";
import BaseStorage from "./Base.store";

export default class CategoriaStorage extends BaseStorage {
  static get() {
    return this.localGet() || [];
  }

  static save(categorias: TCategoria[]) {
    return this.localSave(categorias);
  }

  static create(nome: string, cor?: string) {
    const categorias = this.get() || [];
    const nomeNormalizado = nome.trim();

    if (!nomeNormalizado || this.existsNome(nomeNormalizado)) {
      return;
    }

    const categoria: TCategoria = {
      id: generateId(),
      nome: nomeNormalizado,
      fotos: [],
      cor,
    };

    this.save([...categorias, categoria].sort((a, b) => a.nome.localeCompare(b.nome)));
    return categoria;
  }

  static getByNome(nome: string) {
    const categorias = this.get();
    return categorias?.find((c) => normalizeString(c.nome) === normalizeString(nome));
  }

  static getById(id: string) {
    const categorias = this.get();
    return categorias?.find((c) => c.id === id);
  }

  static existsNome(nome: string, ignoreId?: string) {
    const categorias = this.get() || [];
    const nomeNormalizado = normalizeString(nome);

    return categorias.some((c) => normalizeString(c.nome) === nomeNormalizado && c.id !== ignoreId);
  }

  static saveById(categoria: TCategoria) {
    const categorias = this.get() || [];

    const index = categorias.findIndex((c) => c.id === categoria.id);

    if (index === -1) {
      categorias.push(categoria);
    } else {
      categorias[index] = categoria;
    }

    categorias.sort((a, b) => a.nome.localeCompare(b.nome));
    return this.save(categorias);
  }

  static deleteById(id: string) {
    const categorias = this.get() || [];
    const next = categorias.filter((categoria) => categoria.id !== id);
    this.save(next);
  }
}
