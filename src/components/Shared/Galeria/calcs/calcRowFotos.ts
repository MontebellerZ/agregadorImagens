import type { TFoto } from "../../../../types/foto.type";
import calcAddWidth from "./calcAddWidth";
import copyFoto from "./copyFoto";
import resizeFullRow from "./resizeFullRow";

function calcRowFotos(
  fotos: TFoto[],
  desiredHeight: number,
  availableWidth: number,
  gap: number = 0,
) {
  const resizedFotos: TFoto[] = [];

  let row: TFoto[] = [];
  let rowWidth = 0;
  let index = 0;
  let pending: TFoto | null = null;

  while (index < fotos.length || pending) {
    const foto: TFoto | undefined = pending ?? fotos[index++];
    pending = null;

    if (!foto) continue;

    const copy = copyFoto(foto, desiredHeight);

    const newRowWidth = calcAddWidth(copy, rowWidth, gap);
    const spaceAfter = availableWidth - newRowWidth;

    if (!row.length || spaceAfter > 0) {
      row.push(copy);
      rowWidth = newRowWidth;
      continue;
    }

    const spaceBefore = availableWidth - rowWidth;
    const deveIncluir = -spaceAfter < spaceBefore;

    if (deveIncluir) {
      row.push(copy);
      rowWidth = newRowWidth;
    } else {
      pending = foto;
    }

    resizedFotos.push(...resizeFullRow(row, availableWidth, rowWidth));

    row = [];
    rowWidth = 0;
  }

  if (row.length) {
    resizedFotos.push(...resizeFullRow(row, availableWidth, rowWidth));
  }

  return resizedFotos;
}

export default calcRowFotos;
