import type { TCategoria } from "../../../types/categoria.type";
import BaseStorage from "./Base.store";

export default class CategoriaStorage extends BaseStorage {
  static get() {
    return this.localGet();
  }

  static save(categorias: TCategoria[]) {
    return this.localSave(categorias);
  }

  static getByNome(nome: string) {
    const categorias = this.get();
    return categorias?.find((c) => c.nome === nome);
  }

  static saveByNome(categoria: TCategoria) {
    const categorias = this.get() || [];

    const id = categorias.findIndex((c) => c.nome === categoria.nome);

    if (id === -1) {
      categorias.push(categoria);
      categorias.sort((a, b) => a.nome.localeCompare(b.nome));
    } else {
      categorias[id] = categoria;
    }

    return this.save(categorias);
  }
}
