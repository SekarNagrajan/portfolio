import { renderBrandMark } from "@/lib/brand-mark";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** iOS home-screen icon — square; iOS applies its own corner mask. */
export default function AppleIcon() {
  return renderBrandMark(size.width, { rounded: false });
}
