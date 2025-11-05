import React, { useState, useEffect } from "react";

interface Slide {
  image: string;
  title?: string; // Brand name
  subtitle?: string;
}

interface BrandCarouselProps {
  slides: Slide[];
  setCurrentPage: (
    page: string,
    options?: { category?: string; price?: number; brand?: string }
  ) => void;
}

const BrandCarousel: React.FC<BrandCarouselProps> = ({
  slides,
  setCurrentPage,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const prevSlide = () =>
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);

  const nextSlide = () =>
    setCurrentIndex((prev) => (prev + 1) % slides.length);

  const handleSlideClick = () => {
    const brand = slides[currentIndex].title || "";
    if (brand) setCurrentPage("search", { brand });
  };

  return (
    <div
      onClick={handleSlideClick}
      className="relative w-full max-w-[1200px] mx-auto overflow-hidden rounded-lg aspect-video max-h-[400px] cursor-pointer"
    >
      {/* Slide Image */}
      <div className="relative w-full h-full overflow-hidden rounded-lg">
        <img
          src={slides[currentIndex].image}
          alt={slides[currentIndex].title || "slide"}
          className="w-full h-full object-cover transition-transform duration-700 ease-in-out"
        />

        {/* Overlay */}
        {(slides[currentIndex].title || slides[currentIndex].subtitle) && (
          <div className="absolute inset-0 flex justify-center items-center">
            <div className="bg-black/40 text-white p-4 rounded-md text-center">
              {slides[currentIndex].title && (
                <h2 className="text-2xl md:text-3xl font-semibold text-white leading-tight">
                  {slides[currentIndex].title}
                </h2>
              )}
              {slides[currentIndex].subtitle && (
                <p className="text-base font-semibold text-white bg-blue-900 px-4 py-2 rounded-md shadow-[0_0_10px_#3b82f6,0_0_20px_#3b82f6,0_0_30px_#3b82f6] mt-2 inline-block">
                  {slides[currentIndex].subtitle}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          prevSlide();
        }}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full text-2xl hover:bg-black/60 transition"
      >
        &#10094;
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          nextSlide();
        }}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full text-2xl hover:bg-black/60 transition"
      >
        &#10095;
      </button>

      {/* Dots */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <span
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(i);
            }}
            className={`w-3 h-3 rounded-full cursor-pointer ${
              i === currentIndex ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default BrandCarousel;
