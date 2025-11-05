import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Truck,
  CreditCard,
  Shield,
  CheckCircle,
  ArrowLeft,
  
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { isLoggedIn, getUserIdFromToken } from "./services/auth";
import { placeOrder } from "./services/costumer";

interface CartPageProps {
  setCurrentPage: (page: string) => void;
}

export default function CartPage({ setCurrentPage }: CartPageProps) {
  const { items, updateQuantity, removeFromCart, getCartTotal, clearCart } =
    useCart();
  const { user } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    street: user?.address?.street || "",
    pincode: user?.pincode || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    country: user?.address?.country || "INDIA",
  });

  const [paymentInfo, setPaymentInfo] = useState({
    type: "cod" as "card" | "paypal" | "apple_pay" | "online" | "cod",
  });

  const [coordinates, setCoordinates] = useState({
    latitude: 0,
    longitude: 0,
  });

  const subtotal = getCartTotal();
  const shipping = subtotal > 75 ? 0 : 8.99;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  const handleCheckout = async () => {
    if (!isLoggedIn()) {
      toast.error("Please log in to place an order");
      setCurrentPage("login");
      return;
    }

    if (
      !shippingInfo.name ||
      !shippingInfo.email ||
      !shippingInfo.street ||
      !shippingInfo.city ||
      !shippingInfo.pincode
    ) {
      toast.error("Please fill in all shipping information");
      return;
    }

    setIsCheckingOut(true);

    try {
      const userId = getUserIdFromToken() || user?.id;
      const products = items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      const getCoordinates = (): Promise<{
        latitude: number;
        longitude: number;
      }> =>
        new Promise((resolve) => {
          if (!navigator.geolocation)
            return resolve({ latitude: 0, longitude: 0 });
          navigator.geolocation.getCurrentPosition(
            (pos) =>
              resolve({
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
              }),
            () => resolve({ latitude: 0, longitude: 0 })
          );
        });

      const { latitude, longitude } = await getCoordinates();

      const orderRequest = {
        userId,
        products,
        address: `${shippingInfo.street}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.country}`,
        pincode: parseInt(shippingInfo.pincode),
        price: total,
        phone: shippingInfo.phone,
        paymentMethod: paymentInfo.type,
      };

      const response = await placeOrder(orderRequest, latitude, longitude);
      toast.success(response);
      clearCart();
      setCurrentPage("orders");
    } catch (error: any) {
      toast.error(error.message || "Failed to place order");
    } finally {
      setIsCheckingOut(false);
    }
  };

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoordinates({ latitude, longitude });
        toast.success(
          `Location fetched! Latitude: ${latitude.toFixed(
            4
          )}, Longitude: ${longitude.toFixed(4)}`
        );
      },
      () => toast.error("Failed to get location. Please allow access."),
      { timeout: 5000 }
    );
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#1a0f1a] flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-6"
        >
          <ShoppingBag className="w-24 h-24 text-[#FFD369] mx-auto animate-bounce" />
          <h2 className="text-3xl font-bold text-white">Your cart is empty</h2>
          <p className="text-white/70 max-w-md mx-auto">
            Looks like you haven't added any items to your cart yet. Start
            shopping to fill it up!
          </p>
          <Button
            className="bg-[#FFD369] text-[#1a0f1a] hover:bg-[#FFD369]/90 px-8 py-3"
            onClick={() => setCurrentPage("home")}
          >
            Continue Shopping
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a0f1a] pt-20 pb-12">
      <div className="container mx-auto px-4">
        <motion.div initial="hidden" animate="visible">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <Button
                variant="outline"
                onClick={() => setCurrentPage("home")}
                className="border-[#FFD369] text-[#FFD369] hover:bg-[#FFD369] hover:text-[#1a0f1a]"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
            </div>
            <h1 className="text-4xl font-bold text-[#FFD369] mb-4">
              Shopping Cart
            </h1>
            <p className="text-white/80">
              {items.length} item{items.length !== 1 ? "s" : ""} in your cart
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.productId}
                    initial="hidden"
                    animate="visible"
                    exit={{ x: -300, opacity: 0 }}
                  >
                    <Card className="bg-[#2C1E4A] border-[#FFD369]/20 hover:border-[#FFD369] transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                          <ImageWithFallback
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full sm:w-24 h-32 sm:h-24 object-cover rounded-lg"
                          />

                          <div className="flex-1 space-y-3">
                            <div>
                              {item.brand && (
                                <p className="text-sm text-[#FFD369]">
                                  {item.brand}
                                </p>
                              )}
                              <h3 className="font-semibold text-white text-lg">
                                {item.name}
                              </h3>
                              {!item.stock && (
                                <p className="text-sm text-red-400 font-medium">
                                  Currently out of stock
                                </p>
                              )}
                            </div>

                            <div className="flex justify-between items-center">
                              <div className="flex items-center space-x-2">
                                <span className="text-xl font-bold text-[#FFD369]">
                                  ₹{item.price.toFixed(2)}
                                </span>
                                {item.originalPrice &&
                                  item.originalPrice > item.price && (
                                    <span className="text-sm text-white/50 line-through">
                                      ₹{item.originalPrice.toFixed(2)}
                                    </span>
                                  )}
                              </div>

                              <div className="flex items-center space-x-4">
                                <div className="flex items-center bg-[#4B1C3F] rounded-lg">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      updateQuantity(
                                        item.productId,
                                        item.quantity - 1
                                      )
                                    }
                                    className="text-white hover:text-[#FFD369]"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </Button>
                                  <span className="px-3 text-white">
                                    {item.quantity}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      updateQuantity(
                                        item.productId,
                                        item.quantity + 1
                                      )
                                    }
                                    className="text-white hover:text-[#FFD369]"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromCart(item.productId)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="bg-[#2C1E4A] border-[#FFD369]/20 sticky top-24">
                <CardContent className="p-6 space-y-6">
                  <h2 className="text-2xl font-bold text-[#FFD369]">
                    Order Summary
                  </h2>
                  <Separator className="bg-white/20" />
                  <div className="space-y-3 text-white">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>₹{tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-[#FFD369] text-lg">
                      <span>Total</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-[#FFD369] text-[#1a0f1a] hover:bg-[#FFD369]/90 py-3">
                        Proceed to Checkout
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#2C1E4A] border-[#FFD369]/20 max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-[#FFD369]">
                          Checkout
                        </DialogTitle>
                        <DialogDescription className="text-white/70">
                          Complete your order
                        </DialogDescription>
                      </DialogHeader>

                      {/* Shipping Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <Label className="text-white">Full Name</Label>
                          <Input
                            value={shippingInfo.name}
                            onChange={(e) =>
                              setShippingInfo({
                                ...shippingInfo,
                                name: e.target.value,
                              })
                            }
                            className="bg-[#1a0f1a] border-[#FFD369]/30 text-white"
                          />
                        </div>
                        <div>
                          <Label className="text-white">Email</Label>
                          <Input
                            value={shippingInfo.email}
                            onChange={(e) =>
                              setShippingInfo({
                                ...shippingInfo,
                                email: e.target.value,
                              })
                            }
                            className="bg-[#1a0f1a] border-[#FFD369]/30 text-white"
                          />
                        </div>
                      </div>

                      {/* Payment Method */}
                      <div className="mt-6 space-y-2">
                        <h3 className="font-semibold text-white">
                          Payment Method
                        </h3>
                        <label className="flex items-center space-x-2 text-white">
                          <input
                            type="radio"
                            value="cod"
                            checked={paymentInfo.type === "cod"}
                            onChange={() =>
                              setPaymentInfo({ ...paymentInfo, type: "cod" })
                            }
                            className="accent-[#FFD369]"
                          />
                          <span>Cash on Delivery</span>
                        </label>
                      </div>

                      <Button
                        onClick={getLocation}
                        className="w-full bg-[#4B1C3F] text-[#FFD369] hover:bg-[#FFD369]/20 mt-4"
                      >
                        Share your location
                      </Button>

                      {coordinates.latitude !== 0 && (
                        <p className="text-white text-sm mt-2">
                          Lat: {coordinates.latitude.toFixed(4)}, Lng:{" "}
                          {coordinates.longitude.toFixed(4)}
                        </p>
                      )}

                      <Button
                        onClick={handleCheckout}
                        disabled={isCheckingOut}
                        className="w-full bg-[#FFD369] text-[#1a0f1a] hover:bg-[#FFD369]/90 mt-6"
                      >
                        {isCheckingOut ? "Processing..." : "Place Order"}
                      </Button>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
