import { useEffect, useRef, useState } from "react";
import menu1 from "../../assets/images/menu1.jpg";
import menu2 from "../../assets/images/menu2.jpg";
import menu3 from "../../assets/images/menu3.jpg";
import menu4 from "../../assets/images/menu4.jpg";

const showcaseItems = [
  { id: 1, image: menu1, name: "Menu 1" },
  { id: 2, image: menu2, name: "Menu 2" },
  { id: 3, image: menu3, name: "Menu 3" },
  { id: 4, image: menu4, name: "Menu 4" },
];

const AUTOPLAY_INTERVAL = 3200; // jeda antar foto (ms)
const EXIT_DURATION = 700; // harus sinkron dengan durasi animasi .showcase-exit di index.css

/**
 * Menampilkan foto menu satu per satu, berganti otomatis setiap beberapa detik.
 * Foto lama keluar ke kiri-bawah (rotate + fade), foto baru masuk dari kanan-bawah
 * lalu "settle" dengan sedikit efek pantul — meniru referensi video product slider.
 */
const RotatingMenuShowcase = () => {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(null);
  const exitTimeoutRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((c) => {
        setPrev(c);
        return (c + 1) % showcaseItems.length;
      });
    }, AUTOPLAY_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (prev === null) return undefined;

    exitTimeoutRef.current = setTimeout(() => setPrev(null), EXIT_DURATION);
    return () => clearTimeout(exitTimeoutRef.current);
  }, [prev]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {prev !== null && (
        <img
          key={`exit-${prev}-${current}`}
          src={showcaseItems[prev].image}
          alt={showcaseItems[prev].name}
          className="showcase-exit absolute w-[74%] max-w-[360px] drop-shadow-2xl select-none pointer-events-none"
        />
      )}
      <img
        key={`enter-${current}`}
        src={showcaseItems[current].image}
        alt={showcaseItems[current].name}
        className="showcase-enter absolute w-[74%] max-w-[360px] drop-shadow-2xl select-none pointer-events-none"
      />
    </div>
  );
};

export default RotatingMenuShowcase;
