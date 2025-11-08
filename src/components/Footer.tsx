import {
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
} from "lucide-react";
import { motion } from "motion/react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden text-[#FFD369] bg-gradient-to-b from-[#300020] via-[#4B1C3F] to-[#300020]">
      {/* Soft Glow Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#FFD369]/20 blur-[150px] rounded-full opacity-30" />
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-14">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"
        >
          {/* Brand Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white tracking-wide">
              LuxeBeauty
            </h3>
            <p className="text-sm text-[#FFD369]/80 leading-relaxed">
              Your destination for premium beauty and cosmetics. Discover luxury
              products that enhance your natural glow and confidence.
            </p>
            <div className="flex space-x-5 pt-3">
              {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  className="bg-white/10 p-2 rounded-full hover:bg-[#FFD369]/30 transition-colors cursor-pointer"
                >
                  <Icon className="w-5 h-5 text-[#FFD369]" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white text-lg relative after:content-[''] after:absolute after:left-0 after:bottom-[-6px] after:w-10 after:h-[2px] after:bg-[#FFD369]">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              {["About Us", "Beauty Guide", "Gift Cards", "Store Locator", "Careers"].map(
                (link, i) => (
                  <motion.li
                    key={i}
                    whileHover={{ x: 6 }}
                    className="transition-all duration-300"
                  >
                    <a
                      href="#"
                      className="hover:text-white text-[#FFD369]/80 transition-colors"
                    >
                      {link}
                    </a>
                  </motion.li>
                )
              )}
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white text-lg relative after:content-[''] after:absolute after:left-0 after:bottom-[-6px] after:w-10 after:h-[2px] after:bg-[#FFD369]">
              Customer Care
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                "Contact Us",
                "Shipping Info",
                "Returns & Exchanges",
                "Size Guide",
                "FAQ",
              ].map((item, i) => (
                <motion.li
                  key={i}
                  whileHover={{ x: 6 }}
                  className="transition-all duration-300"
                >
                  <a
                    href="#"
                    className="hover:text-white text-[#FFD369]/80 transition-colors"
                  >
                    {item}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white text-lg relative after:content-[''] after:absolute after:left-0 after:bottom-[-6px] after:w-10 after:h-[2px] after:bg-[#FFD369]">
              Stay Updated
            </h4>
            <p className="text-sm text-[#FFD369]/80">
              Subscribe to receive special offers and beauty tips.
            </p>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex space-x-2 mt-4"
            >
              <Input
                type="email"
                placeholder="Your email"
                className="bg-[#592A4E] border border-[#FFD369]/30 text-white placeholder-[#FFD369]/60 focus:ring-2 focus:ring-[#FFD369]/40 transition-all"
              />
              <Button className="bg-[#FFD369] text-[#A30B37] hover:bg-[#FFD369]/90 transition-all duration-300">
                Subscribe
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-[#FFD369]/20 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm"
        >
          <div className="flex items-center space-x-2 justify-center md:justify-start">
            <Phone className="w-4 h-4 text-[#FFD369]" />
            <span>+91 85440 90329</span>
          </div>
          <div className="flex items-center space-x-2 justify-center md:justify-start">
            <Mail className="w-4 h-4 text-[#FFD369]" />
            <span>Shreeaura.fashion@gmail.com</span>
          </div>
          <div className="flex items-center space-x-2 justify-center md:justify-start">
            <MapPin className="w-4 h-4 text-[#FFD369]" />
            <span>Maurya Lok Complex, Dak Bangla Chauraha</span>
          </div>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="bg-[#2D0D28] border-t border-[#FFD369]/20"
      >
        <div className="container mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between text-sm text-[#FFD369]/80 space-y-3 md:space-y-0">
          <div>© 2025 Shreeaura.in. All rights reserved.</div>
          <div className="flex space-x-5">
            <a
              href="#"
              className="hover:text-white transition-colors duration-300"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="hover:text-white transition-colors duration-300"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
