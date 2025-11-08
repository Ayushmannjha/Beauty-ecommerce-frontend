import { motion, useInView } from "motion/react";
import { useRef } from "react";

import rings from "../assets/rings.jpeg";
import skincare from "../assets/skinCare.jpeg";
import bangles from "../assets/bangles.jpeg";
import kitchen from "../assets/Kitchenessentials.jpeg";
import home from "../assets/homedecor.jpeg";
import electronics from "../assets/electronics.png";
import earing from "../assets/Earing.jpeg";
import birthday from "../assets/birthday.jpeg";
import hair from "../assets/Hair_accesories.jpg";
import stationary from "../assets/Stationary.jpeg";
import makeup from "../assets/Makeupessentials.jpeg";

interface FeaturedProductsProps {
  setCurrentPage: (page: string, options?: { category?: string }) => void;
}

const AnimatedSection = ({ children, delay = 0 }: any) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.section
      ref={ref}
      className="py-7 px-6 relative overflow-hidden bg-[#1a0f1a]"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.section>
  );
};

const CategoryCard = ({
  category,
  onClick,
  index,
}: {
  category: { name: string; image: string };
  onClick: (name: string) => void;
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: index * 0.05 }}
    whileHover={{ scale: 1.08, rotate: 1 }}
    whileTap={{ scale: 0.96 }}
    className="cursor-pointer relative rounded-2xl overflow-hidden shadow-[0_0_25px_rgba(255,211,105,0.15)] hover:shadow-[0_0_40px_rgba(255,211,105,0.4)] w-full aspect-[4/5] max-w-[220px] group bg-[#2C1E4A]/40 backdrop-blur-md border border-[#FFD369]/20 transition-all duration-300"
    onClick={() => onClick(category.name)}
  >
    {/* Image with Hover Zoom */}
    <motion.img
      src={category.image}
      alt={category.name}
      className="w-full h-full object-cover absolute inset-0 transition-transform duration-700 group-hover:scale-110"
    />

    {/* Overlay gradient */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

    {/* Text */}
    <div className="absolute bottom-0 left-0 right-0 text-center p-3">
      <motion.p
        className="text-[#FFD369] font-bold text-base uppercase tracking-wide relative inline-block"
        whileHover={{ scale: 1.05 }}
      >
        {category.name}
        <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#FFD369] group-hover:w-full transition-all duration-300"></span>
      </motion.p>
    </div>

    {/* Shine effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
  </motion.div>
);

export default function ShopByCategory({
  setCurrentPage,
}: FeaturedProductsProps) {
  const categories = [
    { id: 1, name: "Earrings", image: earing },
    { id: 2, name: "Skincare", image: skincare },
    { id: 3, name: "Bangles", image: bangles },
    { id: 4, name: "Makeup Essentials", image: makeup },
    { id: 5, name: "Home Decor", image: home },
    { id: 6, name: "Hair Accessories", image: hair },
    { id: 7, name: "Birthday Party Items", image: birthday },
    { id: 8, name: "Electronics", image: electronics },
    { id: 9, name: "Kitchen Essentials", image: kitchen },
    { id: 10, name: "Stationery", image: stationary },
    { id: 11, name: "Rings", image: rings },
  ];

  return (
    <AnimatedSection delay={0.2}>
      {/* Floating Motion Blobs */}
      <motion.div
        className="absolute w-[400px] h-[400px] bg-[#FFD369]/10 rounded-full blur-3xl -top-10 -left-20"
        animate={{ x: [0, 30, -30, 0], y: [0, 20, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[350px] h-[350px] bg-[#7DFFB1]/10 rounded-full blur-3xl bottom-10 right-10"
        animate={{ x: [0, -30, 30, 0], y: [0, -20, 20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-[1300px] mx-auto relative z-10">
        {/* Section Header */}
        

        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 justify-items-center px-2">
          {categories.map((category, index) => (
            <CategoryCard
              key={category.id}
              category={category}
              onClick={(name: string) =>
                setCurrentPage("search", { category: name })
              }
              index={index}
            />
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
