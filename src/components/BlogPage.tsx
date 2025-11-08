import { motion } from "motion/react";
import { ArrowRight} from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export default function BlogPage() {
  const [selectedPost, setSelectedPost] = useState<any | null>(null);

  const blogPosts = [
    {
      title: "Summer Makeup Trends 2025",
      excerpt: "Discover the hottest makeup looks for the summer season.",
      fullContent: `Summer 2025 is all about embracing radiant, glowing skin with minimalist yet bold touches.
      
Expect lightweight foundations, dewy highlighters, and bold eyeliner contrasts. Coral lips, peach blush, and cream-based eyeshadows are making a comeback.
      
For a natural summer glow, focus on skin hydration, SPF, and a soft shimmer mist to finish off your look.`,
      image:
        "https://images.unsplash.com/photo-1688953228417-8ec4007eb532?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      date: "Dec 15, 2024",
    },
    {
      title: "Skincare Routine Guide",
      excerpt: "Build the perfect skincare routine for your skin type.",
      fullContent: `Finding your ideal skincare routine starts with knowing your skin type.
      
1️⃣ **Cleanser:** Choose a gentle, pH-balanced face wash.
2️⃣ **Toner:** Helps restore moisture and prep your skin.
3️⃣ **Serum:** Apply Vitamin C for brightness and hyaluronic acid for hydration.
4️⃣ **Moisturizer:** Lock in hydration with a cream suited for your skin type.
5️⃣ **Sunscreen:** Never skip SPF 30+ — your daily defense.`,
      image:
        "https://images.unsplash.com/photo-1665763630810-e6251bdd392d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      date: "Dec 12, 2024",
    },
    {
      title: "Fragrance Layering Tips",
      excerpt: "Learn how to layer fragrances like a professional.",
      fullContent: `Fragrance layering is an art form — combine scents to create your own signature aroma.
      
✨ Start with a scented body lotion.
🌸 Add a subtle base perfume (woody or musky).
🍊 Finish with a top note spray (floral or citrus) for freshness.
      
Pro tip: Keep the same fragrance family for a balanced scent that lasts all day.`,
      image:
        "https://images.unsplash.com/photo-1757313202626-8b763ce254a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      date: "Dec 10, 2024",
    },
  ];

  return (
    <div className="min-h-screen bg-[#12091E] text-white relative overflow-hidden">
      {/* Soft Gradient Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-pink-700/30 to-indigo-900/40 blur-3xl -z-10" />

      {/* Hero Section */}
      <section className="py-16 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl lg:text-5xl font-extrabold text-[#FFD369] mb-4"
        >
          Beauty & Lifestyle Blog
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-lg lg:text-xl text-white/80 max-w-2xl mx-auto"
        >
          Explore beauty tips, skincare routines, and wellness inspiration.
        </motion.p>
      </section>

      {/* Blog List */}
      <section className="container mx-auto px-4 pb-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.04 }}
            className="group"
          >
            <Card className="bg-white/10 border border-white/10 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg hover:shadow-[0_0_25px_rgba(255,211,105,0.3)] transition-all duration-500 flex flex-col">
              <div className="overflow-hidden relative">
                <ImageWithFallback
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
              <CardContent className="p-5 flex flex-col flex-1">
                <p className="text-sm text-[#FFD369] mb-2 font-medium">
                  {post.date}
                </p>
                <h3 className="font-bold text-xl mb-2">{post.title}</h3>
                <p className="text-white/70 text-sm flex-1 mb-4">
                  {post.excerpt}
                </p>
                <Button
                  variant="ghost"
                  className="text-[#FFD369] hover:text-white hover:bg-[#FFD369]/10 w-fit"
                  onClick={() => setSelectedPost(post)}
                >
                  Read More <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>

      {/* Dialog for Full Blog Content */}
      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="max-w-2xl bg-[#1E1432] text-white border border-[#FFD369]/20 rounded-2xl p-6">
          <DialogHeader className="flex justify-between items-center mb-4">
            <DialogTitle className="text-2xl font-bold text-[#FFD369]">
              {selectedPost?.title}
            </DialogTitle>
            
          </DialogHeader>

          {selectedPost && (
            <>
              <div className="rounded-lg overflow-hidden mb-5">
                <img
                  src={selectedPost.image}
                  alt={selectedPost.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
              <p className="text-white/80 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                {selectedPost.fullContent}
              </p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
