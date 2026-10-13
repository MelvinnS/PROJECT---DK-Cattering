import { forwardRef } from "react";
import { Coffee } from "lucide-react";
import { formatCurrency } from "../../utils/formatters";
import { orderStatusLabel } from "../../context/OrderContext";

/**
 * Komponen struk cetak (Printable Receipt).
 * Ditampilkan di layar sebagai preview/modal atau disematkan langsung untuk @media print.
 */
const OrderReceiptPrint = forwardRef(({ order }, ref) => {
  if (!order) return null;

  const formattedDate = new Date(order.createdAt).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      ref={ref}
      className="receipt-print-area bg-white text-coffee-900 p-6 sm:p-8 max-w-md mx-auto border border-coffee-200 rounded-2xl font-sans"
    >
      {/* Header Struk */}
      <div className="text-center pb-4 border-b border-dashed border-coffee-300">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-coffee-800 text-cream-50 mb-2">
          <Coffee size={20} />
        </div>
        <h2 className="text-lg font-black tracking-wide text-coffee-800 uppercase">
          DK Cattering
        </h2>
        <p className="text-xs text-coffee-600">Layanan Katering Harian & Kantor</p>
        <p className="text-[11px] text-coffee-500 mt-0.5">
          WhatsApp: 0812-3456-7890 • IG: @dkcatering
        </p>
      </div>

      {/* Info Order */}
      <div className="py-3 text-xs border-b border-dashed border-coffee-300 space-y-1.5">
        <div className="flex justify-between">
          <span className="text-coffee-500">No. Pesanan:</span>
          <span className="font-bold text-coffee-800">{order.id}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-coffee-500">Waktu Order:</span>
          <span className="text-coffee-800">{formattedDate}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-coffee-500">Pelanggan:</span>
          <span className="font-semibold text-coffee-800">
            {order.customerId} ({order.customerName})
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-coffee-500">Telepon:</span>
          <span className="text-coffee-800">{order.customerPhone}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-coffee-500">Jadwal Pengiriman:</span>
          <span className="font-semibold text-coffee-800">{order.deliverySlot}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-coffee-500">Status:</span>
          <span className="font-semibold text-coffee-800">
            {orderStatusLabel[order.status] || order.status}
          </span>
        </div>
      </div>

      {/* Alamat Pengiriman */}
      <div className="py-3 text-xs border-b border-dashed border-coffee-300">
        <p className="text-coffee-500 font-semibold mb-1">Alamat Pengantaran:</p>
        <p className="text-coffee-800 leading-relaxed">{order.deliveryAddress}</p>
        {order.notes && (
          <div className="mt-2 bg-cream-50 p-2 rounded border border-coffee-100 text-[11px] text-coffee-700">
            <span className="font-bold">Catatan: </span>
            {order.notes}
          </div>
        )}
      </div>

      {/* Daftar Item */}
      <div className="py-3 text-xs border-b border-dashed border-coffee-300">
        <p className="font-bold text-coffee-800 mb-2">Rincian Menu:</p>
        <div className="space-y-2">
          {order.items?.map((item, idx) => (
            <div key={idx} className="flex justify-between items-start gap-2">
              <div className="flex-1">
                <p className="font-semibold text-coffee-800">
                  {item.name} <span className="text-coffee-500">×{item.qty}</span>
                </p>
                {item.notes && (
                  <p className="text-[10px] text-coffee-500 italic">- {item.notes}</p>
                )}
              </div>
              <p className="font-medium text-coffee-800 shrink-0">
                {formatCurrency(item.price * item.qty)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Rincian Total */}
      <div className="py-3 text-xs border-b border-dashed border-coffee-300 space-y-1.5">
        <div className="flex justify-between text-coffee-600">
          <span>Subtotal Item:</span>
          <span>{formatCurrency(order.subtotal || order.totalPrice)}</span>
        </div>
        {order.deliveryFee > 0 && (
          <div className="flex justify-between text-coffee-600">
            <span>Ongkos Kirim:</span>
            <span>{formatCurrency(order.deliveryFee)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm font-black text-coffee-900 pt-1 border-t border-coffee-200">
          <span>TOTAL:</span>
          <span>{formatCurrency(order.totalPrice)}</span>
        </div>
        <div className="flex justify-between text-[11px] text-coffee-500 pt-0.5">
          <span>Metode Pembayaran:</span>
          <span className="font-semibold text-coffee-700">{order.paymentMethod}</span>
        </div>
      </div>

      {/* Footer Struk */}
      <div className="pt-4 text-center text-[11px] text-coffee-500 space-y-1">
        <p className="font-semibold text-coffee-700">Terima Kasih Atas Pesanan Anda!</p>
        <p>Semoga hidangan kami berkenan di lidah Anda 🙏</p>
      </div>
    </div>
  );
});

OrderReceiptPrint.displayName = "OrderReceiptPrint";

export default OrderReceiptPrint;
