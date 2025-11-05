import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export default function BlogPage() {
  const blogPosts = [
    {
      title: "Summer Makeup Trends 2025",
      excerpt: "Discover the hottest makeup looks for the summer season.",
      image:
        "https://images.unsplash.com/photo-1688953228417-8ec4007eb532?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      date: "Dec 15, 2024",
    },
    {
      title: "Skincare Routine Guide",
      excerpt: "Build the perfect skincare routine for your skin type.",
      image:
        "https://images.unsplash.com/photo-1665763630810-e6251bdd392d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      date: "Dec 12, 2024",
    },
    {
      title: "Fragrance Layering Tips",
      excerpt: "Learn how to layer fragrances like a professional.",
      image:
        "https://images.unsplash.com/photo-1757313202626-8b763ce254a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      date: "Dec 10, 2024",
    },
  ];

  return (
    <div className="min-h-screen bg-brand-background text-white">
      {/* Hero Section */}
      <section className="py-16 text-center bg-brand-section">
        <h1 className="text-4xl lg:text-5xl font-bold text-brand-accent mb-4">
          Beauty Blog
        </h1>
        <p className="text-lg lg:text-xl text-white/80 max-w-2xl mx-auto">
          Explore the latest trends, beauty tips, and skincare secrets.
        </p>
      </section>

      {/* Blog List */}
      <section className="container mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.03 }}
          >
            <Card className="bg-brand-card border-brand-accent/20 overflow-hidden hover:border-brand-accent transition-all duration-300 h-full flex flex-col">
              <div className="overflow-hidden">
                <ImageWithFallback
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-4 lg:p-6 flex flex-col flex-1">
                <p className="text-sm text-brand-accent mb-2">{post.date}</p>
                <h3 className="font-bold text-white text-lg mb-3">
                  {post.title}
                </h3>
                <p className="text-white/80 mb-4 text-sm lg:text-base flex-1">
                  {post.excerpt}
                </p>
                <Button
                  variant="ghost"
                  className="text-brand-accent hover:text-white p-0"
                >
                  Read More <ArrowRight className="ml-1 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
