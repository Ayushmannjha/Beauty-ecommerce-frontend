import { motion, AnimatePresence } from "motion/react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";

import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./components/HomePage";

import CartPage from "./components/CartPage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import ProfilePage from "./components/ProfilePage";
import OrdersPage from "./components/OrdersPage";
import SearchPage from "./components/SearchPage";

import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import CheckoutPage from "./components/CheckoutPage";

function AnimatedRoutes() {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Same function name — now using navigate()
  const setCurrentPage = (
    page: string,
    options?: { category?: string; price?: number; brand?: string; name?: string }
  ) => {
    console.log("➡️ Navigating:", page, "with options:", options);

    const params = new URLSearchParams();
    if (options?.category) params.append("category", options.category);
    if (options?.brand) params.append("brand", options.brand);
    if (options?.price) params.append("price", String(options.price));
    if (options?.name) params.append("name", options.name);

    switch (page) {
      case "home":
        navigate("/");
        break;
      case "product-detail":
        navigate("/product-detail");
        break;
      case "cart":
        navigate("/cart");
        break;
      case "login":
        navigate("/login");
        break;
      case "register":
        navigate("/register");
        break;
      case "profile":
        navigate("/profile");
        break;
      case "orders":
        navigate("/orders");
        break;
      case "search":
        navigate(`/search?${params.toString()}`);
        break;
      case "checkout":
        navigate("/checkout");
        break; 
      default:
        navigate("/");
        break;
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20, scale: 0.98 },
    in: { opacity: 1, y: 0, scale: 1 },
    out: { opacity: 0, y: -20, scale: 1.02 },
  };

  const pageTransition: any = {
    type: "tween",
    ease: "anticipate",
    duration: 0.4,
  };

  const isSpecialPage =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="min-h-screen bg-[#1a0f1a]">
      {/* ✅ Header only if not login/register */}
      {!isSpecialPage && (
        <Header currentPage={location.pathname} setCurrentPage={setCurrentPage} />
      )}

      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          className={!isSpecialPage ? "" : "min-h-screen"}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
        >
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={<HomePage setCurrentPage={setCurrentPage} />}
            />
            
            <Route
              path="/cart"
              element={<CartPage setCurrentPage={setCurrentPage} />}
            />
            <Route
              path="/login"
              element={<LoginPage setCurrentPage={setCurrentPage} />}
            />
            <Route
              path="/register"
              element={<RegisterPage setCurrentPage={setCurrentPage} />}
            />
            <Route
              path="/profile"
              element={<ProfilePage setCurrentPage={setCurrentPage} />}
            />
            <Route
              path="/orders"
              element={<OrdersPage setCurrentPage={setCurrentPage} />}
            />
            <Route path="/checkout" element={<CheckoutPage setCurrentPage={setCurrentPage}></CheckoutPage>}></Route>
            <Route
              path="/search"
              element={
                <SearchPage
                  setCurrentPage={setCurrentPage}
                  setSelectedProduct={(product) => {
                    console.log("Selected product:", product);
                    setCurrentPage("product-detail");
                  }}
                  onAddToCart={(product, quantity = 1) => {
                    console.log("Added to cart:", product, "Quantity:", quantity);
                  }}
                />
              }
            />
          </Routes>
        </motion.main>
      </AnimatePresence>

      {/* ✅ Footer only if not login/register */}
      {!isSpecialPage && <Footer />}

      {/* ✅ Back to Home button on login/register */}
      {isSpecialPage && (
        <div className="fixed top-4 left-4 z-50">
          <button
            onClick={() => setCurrentPage("home")}
            className="bg-[#FFD369] text-[#1a0f1a] px-6 py-3 rounded-lg hover:bg-[#FFD369]/90 transition-all duration-300 font-semibold shadow-lg"
          >
            ← Back to Home
          </button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <AnimatedRoutes />
          <Toaster
            richColors
            position="top-right"
            toastOptions={{
              style: {
                background: "#2C1E4A",
                border: "1px solid #FFD369",
                color: "#f5f1f5",
                borderRadius: "12px",
              },
            }}
          />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
