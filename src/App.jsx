import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { OrderProvider } from "./context/OrderContext";
import { MenuProvider } from "./context/MenuContext";
import { AdminOrderProvider } from "./context/AdminOrderContext";
import { SlotProvider } from "./context/SlotContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MenuProvider>
          <OrderProvider>
            <AdminOrderProvider>
              <SlotProvider>
                <AppRoutes />
              </SlotProvider>
            </AdminOrderProvider>
          </OrderProvider>
        </MenuProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
