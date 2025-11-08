import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { fetchUserProfile, placeOrder, type User } from "../components/services/costumer";
import { isLoggedIn, getUserIdFromToken } from "../components/services/auth";
import { jwtDecode } from "jwt-decode";
import type { TokenPayload } from "./ProfilePage";

interface CheckoutPageProps {
  setCurrentPage: (page: string) => void;
}

export default function CheckoutPage({ setCurrentPage }: CheckoutPageProps) {
  const { items, getCartTotal, clearCart } = useCart();
  const [suser, setSuser] = useState<User | null>(null);
  const { user } = useAuth();
  const subtotal = getCartTotal();
  const tax = subtotal * 0.18;
  const total = subtotal + tax;
  const [isProcessing, setIsProcessing] = useState(false);
 useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded: TokenPayload = jwtDecode(token);
      fetchUserProfile(decoded.User.id)
        .then((profile) => {
          setSuser(profile);
          
        })
        .catch((err) => console.error("Failed to fetch profile:", err));
    } catch (err) {
      console.error("Failed to decode token:", err);
    }
  }, []);
  const [shipping, setShipping] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    pincode: user?.pincode || "",
  });

  const [coords, setCoords] = useState({ lat: 0, lng: 0 });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [locationWarning, setLocationWarning] = useState("");

  const handlePlaceOrder = async () => {
    if (!isLoggedIn()) {
      toast.error("Please log in to place an order");
      setCurrentPage("login");
      return;
    }

    if (!shipping.name || !shipping.address || !shipping.city || !shipping.pincode) {
      toast.error("Please fill all shipping details");
      return;
    }

    if (shipping.state !== "Bihar" || shipping.city !== "Patna") {
      toast.error("We currently deliver only in Patna, Bihar");
      return;
    }

    setIsProcessing(true);
    try {
      const userId = getUserIdFromToken() || user?.id;
      const products = items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      await placeOrder(
        {
          userId: userId!,
          products,
          address: `${shipping.address}, ${shipping.city}, ${shipping.state}`,
          pincode: parseInt(shipping.pincode),
          price: total,
          phone: shipping.phone,
          paymentMethod,
        },
        coords.lat,
        coords.lng
      );

      toast.success("Order placed successfully!");
      clearCart();
      setCurrentPage("orders");
    } catch (err: any) {
      toast.error(err.message || "Failed to place order");
    } finally {
      setIsProcessing(false);
    }
  };

  const fetchLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lng: longitude });
        toast.success("Location fetched successfully!");
      },
      () => toast.error("Unable to fetch location")
    );
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setShipping({ ...shipping, state: value });
    if (value !== "Bihar") {
      setLocationWarning("⚠️ We currently deliver only in Bihar (Patna).");
    } else {
      setLocationWarning("");
    }
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setShipping({ ...shipping, city: value });
    if (value !== "Patna") {
      setLocationWarning("⚠️ We currently deliver only in Patna, Bihar.");
    } else {
      setLocationWarning("");
    }
  };

  const isOrderDisabled =
    isProcessing ||
    !shipping.name ||
    !shipping.address ||
    !shipping.city ||
    !shipping.pincode ||
    shipping.state !== "Bihar" ||
    shipping.city !== "Patna";

  return (
    <div className="min-h-screen bg-[#1a0f1a] flex items-center justify-center py-12 px-4">
      <div className="bg-[#2C1E4A]/90 backdrop-blur-md p-8 rounded-2xl w-full max-w-2xl border border-[#FFD369]/30 shadow-xl shadow-black/40">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          
          <h2 className="text-3xl font-bold text-[#FFD369] text-center flex-1">
            Checkout
          </h2>
        </div>

        {/* Shipping Info */}
        <div className="space-y-5 mb-8">
          <h3 className="text-xl font-semibold text-[#FFD369]">
            Shipping Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["name", "email", "phone", "address", "pincode"].map((field) => (
              <div key={field} className="flex flex-col">
                <Label className="capitalize text-white/80 mb-1">{field}</Label>
                <Input
  value={
    // Check shipping first, then suser safely, fallback to empty string
    shipping[field as keyof typeof shipping] || suser?.[field as keyof User] || ""
  }
  onChange={(e) =>
    setShipping({
      ...shipping,
      [field]: e.target.value,
    })
  }
  className="bg-[#1a0f1a] border border-[#FFD369]/30 text-white placeholder:text-gray-400 rounded-md p-2"
  placeholder={`Enter ${field}`}
/>

              </div>
            ))}

            {/* State */}
            <div className="flex flex-col">
              <Label className="text-white/80 mb-1">State</Label>
              <select
                value={shipping.state}
                onChange={handleStateChange}
                className="bg-[#1a0f1a] border border-[#FFD369]/30 text-white rounded-md p-2"
              >
                <option value="">Select State</option>
                <option value="Bihar">Bihar</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* City */}
            <div className="flex flex-col">
              <Label className="text-white/80 mb-1">City</Label>
              <select
                value={shipping.city}
                onChange={handleCityChange}
                className="bg-[#1a0f1a] border border-[#FFD369]/30 text-white rounded-md p-2"
              >
                <option value="">Select City</option>
                <option value="Patna">Patna</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {locationWarning && (
            <p className="text-red-400 text-sm mt-2 text-center">
              {locationWarning}
            </p>
          )}
        </div>

        {/* Payment Method */}
        <div className="mb-8 space-y-3">
          <h3 className="text-xl font-semibold text-[#FFD369]">
            Payment Method
          </h3>
          <div className="flex flex-col md:flex-row gap-4">
            <label className="flex items-center space-x-2 text-white">
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span>Cash on Delivery</span>
            </label>
            <label className="flex items-center space-x-2 text-white">
              <input
                type="radio"
                name="payment"
                value="online"
                checked={paymentMethod === "online"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span>Online Payment</span>
            </label>
          </div>
        </div>

        {/* Location */}
        <div className="mb-8 space-y-2">
  <h3 className="text-xl font-semibold text-[#FFD369]">Location</h3>
  <Button
    onClick={fetchLocation}
    className="w-full bg-[#4B1C3F] text-[#FFD369] hover:bg-[#FFD369]/20"
  >
    📍 Share My Location
  </Button>
  <p className="text-white/70 text-sm mt-1">
    Please share your location — it will help our delivery partner reach you faster!
  </p>
</div>


        {/* Summary */}
        <div className="bg-[#1a0f1a] border border-[#FFD369]/30 rounded-xl p-5 mb-8">
          <h3 className="text-lg font-semibold text-[#FFD369] mb-3">
            Order Summary
          </h3>
          <div className="space-y-2 text-white">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (18%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-[#FFD369] pt-2 border-t border-white/10">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <Button
          onClick={handlePlaceOrder}
          disabled={isOrderDisabled}
          className={`w-full py-3 text-lg font-semibold ${
            isOrderDisabled
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-[#FFD369] text-[#1a0f1a] hover:bg-[#ffcb47]"
          }`}
        >
          {isProcessing
            ? "Processing..."
            : `Place Order ₹${total.toFixed(2)}`}
        </Button>
      </div>
    </div>
  );
}
