import { Coffee } from "lucide-react";
import { Link } from "react-router-dom";
import siteConfig from "../../data/siteConfig";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="flex items-center justify-center w-9 h-9 rounded-full bg-coffee-600 text-cream-50">
        <Coffee size={18} />
      </span>
      <span className="leading-tight">
        <span className="block font-extrabold text-coffee-700 text-sm tracking-wide">
          {siteConfig.brandName}
        </span>
        <span className="block font-semibold text-coffee-500 text-[10px] tracking-widest -mt-1">
          {siteConfig.brandNameSecondary}
        </span>
      </span>
    </Link>
  );
};

export default Logo;
