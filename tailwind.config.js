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
        // Palet halaman utama (mengikuti video konsep): krim, cokelat, hijau.
        scoop: {
          cream: "#FFF0CD",
<<<<<<< HEAD
          tan: "#BA7E55", // warna latar section menu = warna gelombang section quotes
          ribbon: "#AA6D45",
=======
          tan: "#C28862",
>>>>>>> 8a55db0e6b2fec7204f09fd09dfaa4a54f6c88ca
          brown: "#B35F3E",
          green: "#3F9060",
          greenDark: "#2F6E48",
          mint: "#C1F1CB",
          ink: "#151515",
          maroon: "#5B1A0C",
        },
      },
      fontFamily: {
        sans: ["Poppins", "system-ui", "sans-serif"],
<<<<<<< HEAD
        display: ['"Bagel Fat One"', '"Arial Rounded MT Bold"', "Poppins", "system-ui", "sans-serif"],
=======
        display: ['"Bagel Fat One"', "Poppins", "system-ui", "sans-serif"],
>>>>>>> 8a55db0e6b2fec7204f09fd09dfaa4a54f6c88ca
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
        waveSway: {
          "0%, 100%": { transform: "translateX(0) scaleY(1)" },
          "50%": { transform: "translateX(-1.5%) scaleY(1.06)" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-14px) rotate(3deg)" },
        },
      },
      animation: {
        "blob-rotate": "blobRotate 70s linear infinite",
        "fade-slide-up": "fadeSlideUp 0.6s cubic-bezier(0.22,1,0.36,1) both",
        "fade-in": "fadeIn 0.4s ease-out both",
        "wave-sway": "waveSway 7s ease-in-out infinite",
        "float-slow": "floatSlow 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
