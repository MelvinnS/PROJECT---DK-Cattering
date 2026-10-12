import { Link, useLocation } from "react-router-dom";
import siteConfig, { getWhatsappLink } from "../../data/siteConfig";

const quickLinks = [
  { label: "Beranda", to: "/" },
  { label: "Menu", to: "/menu" },
  { label: "Tentang", to: "/#tentang" },
  { label: "Pesan Online", to: "/menu" },
];

const socials = [
  { label: "Instagram", href: "#" },
  { label: "Facebook", href: "#" },
  { label: "WhatsApp", href: getWhatsappLink() },
];

const Footer = () => {
  const year = new Date().getFullYear();
  const { pathname } = useLocation();
  // Warna latar di atas gelombang disamakan dengan halaman yang sedang tampil.
  const topBg = pathname === "/" ? "bg-scoop-cream" : "bg-cream-50";

  return (
    <footer id="kontak" data-nav="light" className="relative">
      <div className={topBg}>
        <svg
          aria-hidden="true"
          className="block w-full h-14 lg:h-24"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <path
            fill="#3F9060"
            d="M0,70 C120,30 230,20 350,55 C470,90 540,105 680,70 C800,40 880,10 1010,22 C1130,34 1210,75 1320,62 C1380,55 1415,42 1440,35 L1440,120 L0,120 Z"
          />
        </svg>
      </div>

      <div className="bg-scoop-green text-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 pt-4 pb-8">
          <Link to="/" className="font-display text-4xl lg:text-5xl">
            {siteConfig.brandFullName}
          </Link>

          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 text-[13px]">
            <div>
              <h4 className="font-bold text-sm mb-3">Alamat</h4>
              <ul className="space-y-1.5 text-white/65 leading-relaxed">
                <li>{siteConfig.address}</li>
                <li>
                  <a href={`tel:+${siteConfig.whatsappNumber}`} className="hover:text-white">
                    {siteConfig.whatsappDisplay}
                  </a>
                </li>
                <li>{siteConfig.email}</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm mb-3">Jam Operasional</h4>
              <ul className="space-y-1.5 text-white/65">
                {siteConfig.openingHours.map((h) => (
                  <li key={h.days}>
                    {h.days}: {h.time}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm mb-3">Tautan Cepat</h4>
              <ul className="space-y-1.5 text-white/65">
                {quickLinks.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="hover:text-white transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm mb-3">Media Sosial</h4>
              <ul className="space-y-1.5 text-white/65">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target={s.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="mt-12 text-center text-[11px] text-white/45">
            Copyright © {year} {siteConfig.brandFullName}. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
