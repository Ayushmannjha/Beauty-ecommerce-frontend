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
      className="py-8 px-4 bg-[#1a0f1a] border-t-4 border-[#FFD369]"
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
}: {
  category: { name: string; image: string };
  onClick: (name: string) => void;
}) => (
  <motion.div
    whileHover={{ scale: 1.06 }}
    whileTap={{ scale: 0.96 }}
    className="cursor-pointer relative rounded-2xl overflow-hidden shadow-lg w-full aspect-3/4 max-w-[220px] transition-transform duration-300"
    onClick={() => onClick(category.name)}
  >
    <motion.img
      src={category.image}
      alt={category.name}
      className="w-full h-full object-cover block"
      whileHover={{ scale: 1.1 }}
    />
    <div className="absolute bottom-0 left-0 right-0 bg-gradient from-black/80 to-black/20 p-3 text-center">
      <p className="text-[#FFD369] font-bold text-base uppercase tracking-wide">
        {category.name}
      </p>
    </div>
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
    { id: 5, name: "Home decorative items", image: home },
    { id: 6, name: "Hair accessories", image: hair },
    { id: 7, name: "Birthday Party items", image: birthday },
    { id: 8, name: "Electronics", image: electronics },
    { id: 9, name: "Kitchen essentials", image: kitchen },
    { id: 10, name: "Stationary", image: stationary },
    { id: 11, name: "Rings", image: rings },
  ];

  return (
    <AnimatedSection delay={0.2}>
      <div className="max-w-[1300px] mx-auto">
        {/* Header divider */}
        <div className="text-center mb-4">
          <div className="w-20 h-1 bg-[#FFD369] mx-auto rounded"></div>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 justify-items-center px-2">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onClick={(name: string) =>
                setCurrentPage("search", { category: name })
              }
            />
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
