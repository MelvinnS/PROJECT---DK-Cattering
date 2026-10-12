// Ikon brand sederhana (inline SVG) — lucide-react versi baru tidak lagi
// menyertakan ikon brand, jadi dibuat sendiri supaya tidak tergantung versi.
const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export const InstagramIcon = ({ size = 16, ...props }) => (
  <svg width={size} height={size} {...base} {...props}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" />
  </svg>
);

export const FacebookIcon = ({ size = 16, ...props }) => (
  <svg width={size} height={size} {...base} {...props}>
    <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8.5A.5.5 0 0 1 14 8Z" />
  </svg>
);

export const YoutubeIcon = ({ size = 16, ...props }) => (
  <svg width={size} height={size} {...base} {...props}>
    <rect x="2.5" y="5" width="19" height="14" rx="4" />
    <path d="m10 9.5 5 2.5-5 2.5Z" fill="currentColor" />
  </svg>
);

export const XIcon = ({ size = 16, ...props }) => (
  <svg width={size} height={size} {...base} {...props}>
    <path d="M4 4l16 16M20 4 4 20" />
  </svg>
);
