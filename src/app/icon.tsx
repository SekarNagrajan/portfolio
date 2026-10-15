import { renderBrandMark } from "@/lib/brand-mark";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

/** Browser tab / PWA icon — the "SN" monogram tile. */
export default function Icon() {
  return renderBrandMark(size.width);
}
