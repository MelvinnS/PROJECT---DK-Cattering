import { useLocation, useNavigate } from "react-router-dom";
import { formatPrice } from "../../data/menuData";
import { Plus, Minus } from "lucide-react";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import { useOrder } from "../../context/OrderContext";
import { useMenu } from "../../context/MenuContext";

const MenuPage = () => {
  const { availableMenus } = useMenu();
  const { isAuthenticated } = useAuth();
  const { cartItems, addToCart, incrementQty, decrementQty } = useOrder();
  const navigate = useNavigate();
  const location = useLocation();

  const handleAdd = (menu) => {
    if (!isAuthenticated) {
      // Belum login -> arahkan ke halaman Masuk, lalu kembali ke sini setelah berhasil.
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    addToCart(menu);
  };

  const getQty = (menuId) =>
    cartItems.find((item) => item.menuId === menuId)?.qty || 0;

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-10 py-14">
      <h1 className="text-3xl md:text-4xl font-extrabold text-coffee-800 mb-2">
        Menu Kami
      </h1>
      <p className="text-coffee-500/90 mb-10 max-w-xl">
        Pilih menu favoritmu untuk catering harianmu. Menu diperbarui setiap
        hari dengan bahan segar dan berkualitas.
      </p>

      {availableMenus.length === 0 ? (
        <div className="bg-white border border-coffee-100/60 rounded-2xl p-12 text-center text-coffee-500/70">
          Menu belum tersedia hari ini. Silakan cek lagi nanti.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableMenus.map((menu) => {
            const qty = getQty(menu.id);

            return (
              <div
                key={menu.id}
                className="bg-white rounded-2xl overflow-hidden shadow-[0_16px_40px_-20px_rgba(42,33,24,0.25)] border border-coffee-100/60 flex flex-col"
              >
                <div className="relative">
                  <img
                    src={menu.image}
                    alt={menu.name}
                    className="w-full h-44 object-cover"
                  />
                </div>
                <div className="p-5 flex flex-col gap-2 flex-1">
                  <h3 className="font-bold text-coffee-800 text-lg">
                    {menu.name}
                  </h3>
                  <p className="text-accent-600 font-semibold">
                    {formatPrice(menu.price)}
                  </p>
                  <p className="text-sm text-coffee-500/80 flex-1">
                    {menu.description}
                  </p>

                  {qty === 0 ? (
                    <Button
                      variant="primary"
                      icon={Plus}
                      className="mt-2 w-full"
                      onClick={() => handleAdd(menu)}
                    >
                      Tambah Pesanan
                    </Button>
                  ) : (
                    <div className="mt-2 flex items-center justify-between bg-cream-100 rounded-full p-1.5">
                      <button
                        type="button"
                        onClick={() => decrementQty(menu.id)}
                        aria-label={`Kurangi ${menu.name}`}
                        className="w-9 h-9 rounded-full bg-white text-coffee-700 shadow-sm flex items-center justify-center transition-transform active:scale-90"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="font-bold text-coffee-800 min-w-[1.5rem] text-center">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => incrementQty(menu.id)}
                        aria-label={`Tambah ${menu.name}`}
                        className="w-9 h-9 rounded-full bg-accent-600 text-cream-50 shadow-sm flex items-center justify-center transition-transform active:scale-90"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default MenuPage;
