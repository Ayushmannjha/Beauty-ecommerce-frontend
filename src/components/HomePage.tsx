import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

import girlsProduct from "../assets/girlsproducts.png";
import birthday from "../assets/birthday.jpeg";
import electronics from "../assets/electronics.png";

import FeaturedProducts from "./Featured";
import PriceProducts from "./PriceProducts";
import SearchPage from "./SearchPage";
import ShopByName from "./ShopByName";
import BlogPage from "./BlogPage";

interface HomePageProps {
  setCurrentPage: (
    page: string,
    options?: { category?: string; price?: number; brand?: string }
  ) => void;
}

export default function HomePage({ setCurrentPage }: HomePageProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoSliding, setIsAutoSliding] = useState(true);
  const [selectedPrice] = useState<number | null>(null);

  const heroSlides = [
    { id: 1, image: girlsProduct },
    { id: 2, image: electronics },
    { id: 3, image: birthday },
  ];

  const pricePlans = [
    { id: 1, price: 99, subtitle: "STORE", note: "LIVE NOW" },
    { id: 2, price: 199, subtitle: "STORE", note: "LIVE NOW" },
    { id: 3, price: 299, subtitle: "STORE", note: "LIVE NOW" },
  ];

  // Auto-slide
  useEffect(() => {
    if (!isAutoSliding) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoSliding, heroSlides.length]);

  const nextSlide = () => {
    setIsAutoSliding(false);
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    setTimeout(() => setIsAutoSliding(true), 10000);
  };

  const prevSlide = () => {
    setIsAutoSliding(false);
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    setTimeout(() => setIsAutoSliding(true), 10000);
  };

  const handlePriceClick = (price: number) => {
    setCurrentPage("search", { price });
  };

  return (
    <div className="min-h-screen bg-[#1a0f1a]">
      {/* Hero Section */}
      <section className="relative min-h-[50vh] overflow-hidden">
        <AnimatePresence mode="wait">
          {heroSlides.map(
            (slide, index) =>
              index === currentSlide && (
                <motion.div
                  key={slide.id}
                  className="absolute inset-0 w-full h-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  {/* Background Image */}
                  <ImageWithFallback
                    src={slide.image}
                    className="absolute inset-0 w-full h-full object-cover"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient from-black/30 via-black/20 to-black/50 opacity-70"></div>

                  {/* Content */}
                  <div className="relative z-10 flex items-center h-full max-w-[1200px] mx-auto px-5">
                    <motion.div
                      className="max-w-[600px]"
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    >
                      <div className="bg-[#FFD369] text-[#1a0f1a] px-5 py-2 inline-flex items-center font-semibold rounded-full mb-4"></div>

                      <h1 className="text-[clamp(2rem,5vw,4.5rem)] font-bold text-[#370c82] bg-white leading-tight my-5 max-w-[800px]">
                      </h1>

                      <p className="text-[clamp(1rem,1.5vw,1.4rem)] text-white/90 max-w-[600px] leading-relaxed mb-8"></p>
                    </motion.div>
                  </div>
                </motion.div>
              )
          )}
        </AnimatePresence>

        {/* Left Button */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-5 -translate-y-1/2 bg-black/40 backdrop-blur-sm text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-[#FFD369] transition-all duration-300"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Right Button */}
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-5 -translate-y-1/2 bg-black/40 backdrop-blur-sm text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-[#FFD369] transition-all duration-300"
        >
          <ChevronRight size={24} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {heroSlides.map((_, index) => (
            <div
              key={index}
              onClick={() => {
                setCurrentSlide(index);
                setIsAutoSliding(false);
                setTimeout(() => setIsAutoSliding(true), 10000);
              }}
              className={`rounded-full cursor-pointer transition-all duration-300 ${
                index === currentSlide
                  ? "w-4 h-4 bg-[#FFD369] shadow-[0_0_10px_#FFD369]"
                  : "w-3 h-3 bg-white/40"
              }`}
            ></div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <FeaturedProducts setCurrentPage={setCurrentPage} />

      {/* Price-based Products */}
      <div className="p-4 bg-[#f9fafb02]">
        <PriceProducts products={pricePlans} onSelectPrice={handlePriceClick} />
        {selectedPrice && (
          <SearchPage
            setCurrentPage={setCurrentPage}
            setSelectedProduct={() => {}}
            onAddToCart={() => {}}
          />
        )}
      </div>

      {/* Shop by Name */}
      <ShopByName
        setCurrentPage={
          setCurrentPage as (page: string, options?: { name?: string }) => void
        }
      />

      {/* Blog Section */}
      <BlogPage />
    </div>
  );
}
