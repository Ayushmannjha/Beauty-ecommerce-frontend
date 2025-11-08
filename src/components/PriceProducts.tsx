import { motion } from "motion/react";

interface PriceProduct {
  id: number;
  price: number;
  currency?: string;
  subtitle?: string;
  note?: string;
}

interface PriceProductsProps {
  products: PriceProduct[];
  onSelectPrice: (price: number) => void;
}

export default function PriceProducts({
  products,
  onSelectPrice,
}: PriceProductsProps) {
  return (
    <div className="py-8 px-4 bg-[#1a0f1a] text-center">
      <h2 className="text-2xl font-bold text-[#FFD369] mb-8">
        Explore by Price
      </h2>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6 max-w-5xl mx-auto">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.03 }}
            onClick={() => onSelectPrice(product.price)}
            className="group relative rounded-xl border border-[#FFD369]/30 bg-[#2C1E4A]/70 backdrop-blur-sm shadow-md hover:shadow-[#FFD369]/30 transition-all duration-300 p-6 cursor-pointer"
          >
            <div className="flex flex-col items-center justify-center space-y-2">
              <p className="text-3xl font-bold text-[#FFD369]">
                {product.currency || "₹"}
                {product.price}
              </p>
              {product.subtitle && (
                <p className="text-white/80 text-sm font-medium">
                  {product.subtitle}
                </p>
              )}
              {product.note && (
                <p className="text-xs text-white/60">{product.note}</p>
              )}
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              className="mt-5 px-5 py-2 rounded-lg bg-[#FFD369] text-[#1a0f1a] font-semibold text-sm transition-all duration-300 group-hover:bg-[#ffcc4d]"
            >
              View Products
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
