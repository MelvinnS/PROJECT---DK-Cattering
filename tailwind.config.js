/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Palet netral hangat (ivory) — elegan & tenang untuk latar.
        cream: {
          50: "#FBF8F3",
          100: "#F4EDE0",
          200: "#EAE0C9",
        },
        // Netral gelap kecoklatan — dipakai untuk teks & elemen gelap.
        coffee: {
          50: "#F5F0E9",
          100: "#E4D5C3",
          200: "#D3BFA6",
          400: "#8C7660",
          500: "#6B5744",
          600: "#4E3F31",
          700: "#3A2E23",
          800: "#2A2118",
          900: "#1C160F",
        },
        // Satu warna aksen tunggal (terracotta muted) — dipakai konsisten
        // untuk semua elemen interaktif/CTA supaya tampilan tetap simple.
        accent: {
          300: "#E7B98C",
          400: "#D89A61",
          500: "#C17F45",
          600: "#A66432",
          700: "#824C25",
        },
      },
      fontFamily: {
        sans: ["Poppins", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.5rem",
      },
      keyframes: {
        blobRotate: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        fadeSlideUp: {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
      animation: {
        "blob-rotate": "blobRotate 70s linear infinite",
        "fade-slide-up": "fadeSlideUp 0.6s cubic-bezier(0.22,1,0.36,1) both",
        "fade-in": "fadeIn 0.4s ease-out both",
      },
    },
  },
  plugins: [],
};
