import type { SVGProps } from "react";

/**
 * Brand mark SVGs — Lucide 1.x removed trademarked brand icons, so we
 * inline the minimal official glyphs here. They match the sizing &
 * stroke conventions of other lucide icons via `currentColor` + `size`.
 */

type IconProps = SVGProps<SVGSVGElement> & { size?: number | string };

function withDefaults({ size = 16, ...rest }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    "aria-hidden": true as const,
    focusable: false,
    ...rest,
  };
}

export function GithubIcon(props: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" {...withDefaults(props)}>
      <path d="M12 .5C5.73.5.75 5.48.75 11.75c0 4.98 3.23 9.2 7.71 10.69.56.1.77-.24.77-.54 0-.27-.01-1.17-.02-2.12-3.13.68-3.79-1.33-3.79-1.33-.51-1.3-1.25-1.64-1.25-1.64-1.02-.7.08-.68.08-.68 1.13.08 1.72 1.16 1.72 1.16 1 1.72 2.63 1.22 3.27.93.1-.73.39-1.22.71-1.5-2.5-.28-5.13-1.25-5.13-5.56 0-1.23.44-2.23 1.16-3.02-.12-.28-.5-1.43.11-2.97 0 0 .94-.3 3.09 1.15.9-.25 1.86-.37 2.82-.38.96 0 1.92.13 2.82.38 2.15-1.45 3.09-1.15 3.09-1.15.61 1.54.23 2.69.11 2.97.72.79 1.16 1.79 1.16 3.02 0 4.32-2.64 5.28-5.15 5.56.4.35.76 1.03.76 2.08 0 1.5-.01 2.71-.01 3.07 0 .3.2.65.78.54 4.47-1.49 7.7-5.71 7.7-10.69C23.25 5.48 18.27.5 12 .5Z" />
    </svg>
  );
}

export function LinkedinIcon(props: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" {...withDefaults(props)}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .78 0 1.74v20.52C0 23.22.79 24 1.77 24h20.45C23.21 24 24 23.22 24 22.26V1.74C24 .78 23.21 0 22.22 0Z" />
    </svg>
  );
}
