import { Link } from "react-router-dom";
import Button from "../common/Button";
import RotatingMenuShowcase from "./RotatingMenuShowcase";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-cream-50">
      {/* Blob gradient di sisi kanan — bleeding sampai tepi layar (desktop) */}
      <div
        className="hidden md:block absolute top-[-15%] right-[-12%] w-[68%] h-[130%] rounded-[45%_55%_60%_40%/55%_45%_55%_45%] bg-gradient-to-br from-accent-400 via-accent-600 to-coffee-800 shadow-2xl animate-blob-rotate"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center px-6 lg:px-10 py-14 md:py-24">
        {/* Left content */}
        <div className="relative z-10">
          <span className="inline-block text-xs md:text-sm font-semibold tracking-[0.2em] text-accent-600 uppercase mb-4">
            Catering Harian Terpercaya
          </span>
          <h1 className="relative text-4xl md:text-6xl font-extrabold text-coffee-800 leading-[1.08] tracking-tight">
            MAKAN ENAK,
            <br />
            TINGGAL <span className="text-accent-600">PESAN.</span>
            {/* Aksen spark kecil */}
            <span
              className="absolute -top-3 right-6 md:-top-4 md:right-10 flex items-end gap-1 rotate-[15deg]"
              aria-hidden="true"
            >
              <span className="w-[3px] h-6 md:h-8 bg-accent-500 rounded-full" />
              <span className="w-[3px] h-4 md:h-5 bg-accent-500 rounded-full" />
              <span className="w-[3px] h-3 md:h-4 bg-accent-500 rounded-full" />
            </span>
          </h1>

          <p className="mt-5 text-coffee-600/80 max-w-md text-base md:text-lg leading-relaxed">
            Catering harian dengan menu pilihan dan bahan berkualitas, diantar
            sesuai jadwal pilihanmu.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/menu">
              <Button variant="primary" withArrow>
                Lihat Menu Hari Ini
              </Button>
            </Link>
            <a href="#cara-pemesanan">
              <Button variant="secondary">Cara Pesan</Button>
            </a>
          </div>
        </div>

        {/* Right visual — foto menu tampil bergantian otomatis (auto-slide) */}
        <div className="relative z-10 mt-4 md:mt-0">
          <div className="relative w-[85%] sm:w-[70%] md:w-full max-w-[520px] mx-auto aspect-square">
            {/* Blob gradient untuk versi mobile (di dalam kolom, tidak bleeding) */}
            <div
              className="md:hidden absolute inset-0 rounded-[55%_45%_60%_40%/55%_45%_55%_45%] bg-gradient-to-br from-accent-400 via-accent-600 to-coffee-700 shadow-xl animate-blob-rotate"
              aria-hidden="true"
            />
            <RotatingMenuShowcase />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
