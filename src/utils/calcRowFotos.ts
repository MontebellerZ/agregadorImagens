import type { TFoto } from "../types/foto.type";
import calcAspectWidth from "./calcAspectWidth";
import copyFoto from "./copyFoto";

function calcAddWidth(foto: TFoto, rowWidth: number, gap: number) {
  if (rowWidth > 0) rowWidth += gap;
  rowWidth += foto.loaded!.width;
  return rowWidth;
}

function calcRowFotos(
  fotos: TFoto[],
  desiredHeight: number,
  availableWidth: number,
  gap: number = 0,
) {
  const resizedFotos: TFoto[] = [];

  let row: TFoto[] = [];
  let rowWidth = 0;
  while (fotos.length) {
    const foto = fotos.shift()!;
    const copy = copyFoto(foto, desiredHeight);

    const newRowWidth = calcAddWidth(copy, rowWidth, gap);

    const spaceBefore = availableWidth - rowWidth;
    const spaceAfter = availableWidth - newRowWidth;

    if (!row.length || spaceAfter > 0) {
      row.push(copy);
      rowWidth = calcAddWidth(copy, rowWidth, gap);
      continue;
    }

    const deveIncluir = -spaceAfter < spaceBefore;

    if (deveIncluir) {
      row.push(copy);
      rowWidth = calcAddWidth(copy, rowWidth, gap);
    } else {
      fotos.unshift(foto);
    }

    const widthPerHeight = row.reduce((sum, f) => sum + calcAspectWidth(1, f.loaded!.aspect), 0);
    const diff = availableWidth - rowWidth;

    const changeHeight = Math.floor(diff / widthPerHeight);
    const newRowHeight = row[0].loaded!.height + changeHeight;

    row.forEach((f) => {
      f.loaded!.height = newRowHeight;
      f.loaded!.width = calcAspectWidth(newRowHeight, f.loaded!.aspect);
    });

    resizedFotos.push(...row);
    row = [];
    rowWidth = 0;
  }

  return resizedFotos;
}

export default calcRowFotos;
