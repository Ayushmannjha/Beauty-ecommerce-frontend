import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import scrunchies from "../assets/srunchies.jpeg";
import nosepin from "../assets/nosepins.jpeg";
import clutcher from "../assets/Clutcher.jpg";
import napkins from "../assets/Synatry napkins.jpg";

interface FeaturedProductsProps {
  setCurrentPage: (
    page: string,
    options?: { category?: string; price?: number; brand?: string; name?: string }
  ) => void;
}

const AnimatedSection = ({ children, delay = 0 }: any) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.section
      ref={ref}
      className="py-8 bg-[#1a0f1a]"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.section>
  );
};

interface NameCard {
  name: string;
  image: string;
}

export default function ShopByName({ setCurrentPage }: FeaturedProductsProps) {
  const [searchQuery] = useState("");

  const predefinedNames: NameCard[] = [
    { name: "Scrunchies", image: scrunchies },
    { name: "Nosepin", image: nosepin },
    { name: "Clutcher", image: clutcher },
    { name: "Sanitary Napkins", image: napkins },
  ];

  const handleSearch = (query?: string) => {
    const finalQuery = (query || searchQuery).trim();
    if (!finalQuery) return;
    setCurrentPage("search", { name: finalQuery });
  };

  return (
    <AnimatedSection delay={0.2}>
      <div className="max-w-6xl mx-auto px-4 text-center">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-8 justify-items-center">
          {predefinedNames.map((item) => (
            <motion.div
              key={item.name}
              whileHover={{ scale: 1.08, y: -5 }}
              whileTap={{ scale: 0.96 }}
              className="cursor-pointer rounded-2xl overflow-hidden w-full max-w-[200px] aspect-3/4 relative shadow-lg hover:shadow-xl transition-shadow duration-300"
              onClick={() => handleSearch(item.name)}
            >
              <motion.img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-400"
              />
              <div className="absolute inset-0 flex items-end justify-center p-4">
                <p className="text-[#FFD369] font-bold text-sm uppercase tracking-wide">
                  {item.name}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
