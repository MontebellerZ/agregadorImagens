import type { TFoto } from "../../../types/foto.type";
import calcAspectWidth from "./calcAspectWidth";

function resizeFullRow(row: TFoto[], availableWidth: number, rowWidth: number) {
  const widthPerHeight = row.reduce((sum, f) => sum + calcAspectWidth(1, f.aspect!), 0);
  const diff = availableWidth - rowWidth;

  const changeHeight = Math.floor(diff / widthPerHeight);
  const newRowHeight = Math.min(row[0].height! + changeHeight, 400);

  row.forEach((f) => {
    f.height = newRowHeight;
    f.width = calcAspectWidth(newRowHeight, f.aspect!);
  });

  return row;
}

export default resizeFullRow;
