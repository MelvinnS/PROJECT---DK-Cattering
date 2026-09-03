import { ChevronRight } from "lucide-react";

/**
 * Reusable Button component.
 *
 * variant: "primary" | "secondary" | "whatsapp"
 * withArrow: menampilkan icon panah di kanan
 */
const Button = ({
  children,
  variant = "primary",
  withArrow = false,
  icon: Icon,
  className = "",
  ...props
}) => {
  const baseStyle =
    "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-sm md:text-base transition-all duration-200 active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100";

  const variants = {
    primary:
      "bg-accent-600 text-cream-50 hover:bg-accent-700 shadow-[0_10px_24px_-8px_rgba(130,76,37,0.55)]",
    secondary:
      "bg-transparent border border-coffee-300 text-coffee-700 hover:bg-coffee-50",
    whatsapp: "bg-coffee-800 text-cream-50 hover:bg-coffee-900 shadow-sm",
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {Icon && <Icon size={18} />}
      {children}
      {withArrow && <ChevronRight size={18} />}
    </button>
  );
};

export default Button;
