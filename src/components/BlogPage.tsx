import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { HomePageApi } from "./services/homepage"; // ✅ import your API

export default function BlogPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await HomePageApi.getAllBlogs();
        setBlogs(response.data || []);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

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

      {/* Loading State */}
      {loading ? (
        <p className="text-center text-white/70 text-lg pb-20">
          Loading blogs...
        </p>
      ) : blogs.length === 0 ? (
        <p className="text-center text-white/70 text-lg pb-20">
          No blogs available right now.
        </p>
      ) : (
        <section className="container mx-auto px-4 pb-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((post, index) => (
            <motion.div
              key={post.id || index}
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
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
                <CardContent className="p-5 flex flex-col flex-1">
                  <p className="text-sm text-[#FFD369] mb-2 font-medium">
                    {new Date(post.createAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <h3 className="font-bold text-xl mb-2">{post.title}</h3>
                  <p className="text-white/70 text-sm flex-1 mb-4 line-clamp-3">
                    {post.description?.slice(0, 120)}...
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
      )}

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
                  src={selectedPost.imageUrl}
                  alt={selectedPost.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
              <p className="text-white/80 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                {selectedPost.description}
              </p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
