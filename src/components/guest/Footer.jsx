import { Coffee, Phone, MessageCircle, MapPin, AtSign } from "lucide-react";
import { Link } from "react-router-dom";
import siteConfig, { getWhatsappLink } from "../../data/siteConfig";

const footerNav = [
  { label: "Beranda", to: "/" },
  { label: "Menu", to: "/menu" },
  { label: "Tentang", to: "#" },
  { label: "FAQ", to: "#" },
  { label: "Kontak", to: "#" },
];

const footerServices = ["Catering Harian", "Catering Event", "Pemesanan Khusus"];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-20 bg-gradient-to-b from-accent-500 via-coffee-600 to-coffee-800 text-cream-50 overflow-hidden">
      {/* Lengkungan dekoratif di bagian atas footer */}
      <div className="absolute -top-10 left-0 right-0 h-16 bg-cream-50 rounded-b-[100%]" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-cream-50 text-coffee-700">
              <Coffee size={18} />
            </span>
            <span className="font-extrabold tracking-wide">
              {siteConfig.brandFullName}
            </span>
          </div>
          <p className="text-sm text-cream-50/80 max-w-xs">
            {siteConfig.tagline}
          </p>
          <div className="flex gap-3 mt-4">
            <span className="w-9 h-9 flex items-center justify-center rounded-full bg-coffee-800/40 hover:bg-coffee-800/60 transition-colors cursor-pointer">
              <AtSign size={16} />
            </span>
            <a
              href={getWhatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-coffee-800/40 hover:bg-coffee-800/60 transition-colors"
              aria-label="WhatsApp"
            >
              <MessageCircle size={16} />
            </a>
            <span className="w-9 h-9 flex items-center justify-center rounded-full bg-coffee-800/40 hover:bg-coffee-800/60 transition-colors cursor-pointer">
              <MapPin size={16} />
            </span>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Navigasi</h4>
          <ul className="space-y-2 text-sm text-cream-50/80">
            {footerNav.map((item) => (
              <li key={item.label}>
                <Link to={item.to} className="hover:text-cream-50 transition-colors">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Layanan</h4>
          <ul className="space-y-2 text-sm text-cream-50/80">
            {footerServices.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Hubungi Kami</h4>
          <ul className="space-y-3 text-sm text-cream-50/80">
            <li className="flex items-center gap-2">
              <Phone size={16} />
              <a href={`tel:+${siteConfig.whatsappNumber}`} className="hover:text-cream-50">
                {siteConfig.whatsappDisplay}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MessageCircle size={16} />
              <a
                href={getWhatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cream-50"
              >
                {siteConfig.whatsappDisplay}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={16} />
              <span>{siteConfig.location}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-cream-50/15 py-4 text-center text-xs text-cream-50/60">
        © {year} {siteConfig.brandFullName}. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
