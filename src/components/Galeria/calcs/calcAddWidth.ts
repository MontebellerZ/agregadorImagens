import type { TFoto } from "../../../types/foto.type";

function calcAddWidth(foto: TFoto, rowWidth: number, gap: number) {
  if (rowWidth > 0) rowWidth += gap;
  rowWidth += foto.width!;
  return rowWidth;
}

export default calcAddWidth;
