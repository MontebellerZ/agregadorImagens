import BaseStorage from "./Base.store";

export default class LixeiraStorage extends BaseStorage {
  static get() {
    return this.localGet<"LixeiraStorage">() || [];
  }

  static save(fotos: string[]) {
    const unicas = [...new Set(fotos)];
    return this.localSave(unicas);
  }

  static has(fotoSrc: string) {
    return this.get().includes(fotoSrc);
  }

  static moveToTrash(fotoSrc: string) {
    if (!fotoSrc) return;
    if (this.has(fotoSrc)) return;

    this.save([...this.get(), fotoSrc]);
  }

  static restore(fotoSrc: string) {
    if (!fotoSrc) return;

    this.save(this.get().filter((src) => src !== fotoSrc));
  }
}
