// Ikon brand sederhana (inline SVG)
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

export const WhatsAppIcon = ({ size = 16, ...props }) => (
  <svg width={size} height={size} {...base} {...props}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

export const GlobeIcon = ({ size = 16, ...props }) => (
  <svg width={size} height={size} {...base} {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20M12 2a14.5 14.5 0 0 1 0 20M2 12h20" />
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
