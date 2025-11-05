import React, { useEffect, useState, useRef } from "react";
import { Search, ShoppingBag, Store, LogIn, User } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { useCart } from "../contexts/CartContext";
import { HomePageApi } from "./services/homepage";
import logo from "../assets/aura_shree_logo.png";
interface HeaderProps {
  currentPage: string;
  setCurrentPage: (
    page: string,
    options?: { category?: string; price?: number; brand?: string; name?: string }
  ) => void;
}

interface TokenPayload {
  User: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

export default function Header({ setCurrentPage }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<TokenPayload["User"] | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { getCartCount } = useCart();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    try {
      const response = await HomePageApi.searchProductsByName(query);
      console.log("Search results:", response.data);
      setCurrentPage("search", { name: query });
    } catch (err) {
      console.error("Search API error:", err);
    }
  };

  useEffect(() => {
    const tokenString = localStorage.getItem("token");
    if (!tokenString) return;
    let jwt = "";
    try {
      const parsed = JSON.parse(tokenString);
      jwt = parsed.token || tokenString;
    } catch {
      jwt = tokenString;
    }
    try {
      const decoded: TokenPayload = jwtDecode(jwt);
      setUser(decoded.User);
    } catch (err) {
      console.error("Failed to decode token:", err);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setCurrentPage("home");
  };

  return (
    <header className="bg-[rgba(75,28,63,0.95)] sticky top-0 z-50 backdrop-blur-md shadow-md border-b border-[rgba(255,211,105,0.2)]">
      {/* Desktop Header */}
      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setCurrentPage("home")}
        >
          <img
            src={logo}
            alt="Logo"
            width={42}
            height={42}
            className="rounded-full"
          />
          <span className="text-2xl font-bold text-[#FFD369]">ShreeAura</span>
        </div>

        {/* Search Bar (Desktop only) */}
        {!isMobile && (
          <form
            onSubmit={handleSearch}
            className="flex-1 max-w-[650px] mx-5 relative hidden md:block"
          >
            <input
              type="text"
              placeholder="Search for products"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-3 pl-5 pr-12 text-white bg-[rgba(44,30,74,0.8)] border border-[rgba(255,211,105,0.4)] rounded-xl outline-none transition duration-300 focus:border-[#FFD369]"
            />
            <div
              onClick={handleSearch as any}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#FFD369] cursor-pointer"
            >
              <Search size={22} />
            </div>
          </form>
        )}

        {/* Right Section */}
        <div className="flex items-center gap-5 relative">
          {/* Seller */}
          <button
            onClick={() => setCurrentPage("seller")}
            className="flex items-center gap-2 text-[#FFD369] hover:text-yellow-300"
          >
            <Store size={20} />
            {!isMobile && (
              <a href="https://seller.shreeaura.in" className="text-sm">
                Become a Seller
              </a>
            )}
          </button>

          {/* Login or User */}
          {!user ? (
            <button
              onClick={() => setCurrentPage("login")}
              className="flex items-center gap-2 text-[#FFD369] hover:text-yellow-300"
            >
              <LogIn size={20} />
              {!isMobile && <span>Login</span>}
            </button>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown((prev) => !prev)}
                className="flex items-center gap-2 text-[#FFD369] hover:text-yellow-300"
              >
                <User size={20} />
                {!isMobile && <span>{user.name}</span>}
              </button>
              {showDropdown && (
                <div className="absolute top-12 right-0 bg-[rgba(33,21,57,0.98)] border border-[rgba(255,211,105,0.3)] rounded-lg shadow-xl min-w-[180px] z-2000">
                  <button
                    className="w-full text-left px-4 py-3 text-[#FFD369] hover:bg-[rgba(255,211,105,0.15)]"
                    onClick={() => setCurrentPage("profile")}
                  >
                    Profile
                  </button>
                  <button
                    className="w-full text-left px-4 py-3 text-[#FFD369] hover:bg-[rgba(255,211,105,0.15)]"
                    onClick={() => setCurrentPage("orders")}
                  >
                    My Orders
                  </button>
                  <button
                    className="w-full text-left px-4 py-3 text-[#FFD369] hover:bg-[rgba(255,211,105,0.15)]"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Cart */}
          <button
            onClick={() => setCurrentPage("cart")}
            className="relative flex items-center gap-2 text-[#FFD369] hover:text-yellow-300"
          >
            <ShoppingBag size={20} />
            {!isMobile && <span>Cart</span>}
            {getCartCount() > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#A30B37] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {getCartCount()}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search */}
      {isMobile && (
        <form
          onSubmit={handleSearch}
          className="relative block md:hidden px-4 py-2 bg-[rgba(75,28,63,0.95)]"
        >
          <input
            type="text"
            placeholder="Search for products"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-3 pl-5 pr-12 text-[#FFD369] bg-[rgba(33,21,57,0.95)] border border-[rgba(255,211,105,0.3)] rounded-xl outline-none shadow-inner shadow-[rgba(255,211,105,0.05)]"
          />
          <div
            onClick={handleSearch as any}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-[#FFD369] cursor-pointer"
          >
            <Search size={20} />
          </div>
        </form>
      )}
    </header>
  );
}
