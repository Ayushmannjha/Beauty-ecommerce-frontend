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
    <div className="relative py-12 px-4 text-center overflow-hidden">
      {/* Background glow circles */}
      <div className="absolute top-[10%] left-[5%] w-[220px] h-[220px] rounded-full bg-[radial-gradient(circle,rgba(147,51,234,0.35),transparent_70%)] blur-[90px] -z-10" />
      <div className="absolute bottom-[10%] right-[5%] w-[250px] h-[250px] rounded-full bg-[radial-gradient(circle,rgba(79,70,229,0.35),transparent_70%)] blur-[120px] -z-10" />

      {/* Cards Grid */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6 justify-center items-center max-w-[1100px] mx-auto">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            viewport={{ once: true }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 30px rgba(147, 51, 234, 0.5)",
            }}
            onClick={() => onSelectPrice(product.price)}
            className="relative w-full min-h-[200px] rounded-2xl shadow-lg flex flex-col justify-center items-center text-center p-5 cursor-pointer transition-all duration-300 bg-[linear-gradient(135deg,#e0c3fc_0%,#8ec5fc_25%,#cfd9df_50%,#e0c3fc_75%,#fbc2eb_100%)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)]"
          >
            {index === 1 && (
              <div className="absolute -top-3 bg-gradient from-purple-600 to-indigo-600 text-white px-3 py-1 rounded-xl text-[12px] font-semibold uppercase">
                Popular
              </div>
            )}

            <p className="text-[clamp(28px,4vw,38px)] font-extrabold text-purple-700 m-0">
              {product.currency || "₹"}
              {product.price}
            </p>

            {product.subtitle && (
              <p className="text-[clamp(13px,2vw,15px)] font-semibold text-purple-600 mt-1.5">
                {product.subtitle}
              </p>
            )}

            {product.note && (
              <p className="text-[clamp(12px,1.8vw,14px)] text-purple-500 mt-1.5">
                {product.note}
              </p>
            )}

            <button className="mt-3 px-5 py-2.5 w-full max-w-160px rounded-lg bg-gradient from-purple-600 to-indigo-600 text-white font-semibold text-[clamp(13px,2vw,15px)] transition-all duration-300 hover:opacity-90">
              Get Started
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
