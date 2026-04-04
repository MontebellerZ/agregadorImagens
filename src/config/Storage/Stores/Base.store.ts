import type { StorageMap } from "../StorageMap";

export default abstract class BaseStorage {
  protected static localSave<K extends keyof StorageMap>(value: StorageMap[K]): void {
    localStorage.setItem(this.name, JSON.stringify(value));
  }

  protected static localGet<K extends keyof StorageMap>(): StorageMap[K] | undefined {
    const value = localStorage.getItem(this.name);
    if (!value) return;

    try {
      return JSON.parse(value) as StorageMap[K];
    } catch {
      console.warn(`Erro ao fazer parse da chave ${this.name}`);
      return;
    }
  }
}
