function getAllFotos() {
  const files = import.meta.glob("/src/assets/fotos/*");
  if (!files) throw Error("Nenhuma foto encontrada em /src/assets/fotos/*");
  return files;
}

export default getAllFotos;
