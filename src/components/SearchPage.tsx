import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import ProductCard, { type Product } from "./ProductCard";
import { Slider } from "./ui/slider";
import { Checkbox } from "./ui/checkbox";
import { Separator } from "./ui/separator";
import { Star } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { HomePageApi } from "../components/services/homepage";

interface SearchPageProps {
  setCurrentPage: (page: string, options?: any) => void;
  setSelectedProduct?: (product: Product) => void;
  onAddToCart?: (product: Product, quantity?: number) => void;
}

interface FilterState {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  rating: number;
  inStock: boolean;
}

export default function SearchPage({
  setCurrentPage,
  onAddToCart,
}: SearchPageProps) {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const qName = params.get("name") || "";
  const qCategory = params.get("category") || "";
  const qBrand = params.get("brand") || "";
  const qPrice = params.get("price") ? Number(params.get("price")) : undefined;

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { addToCart, items: cartItems } = useCart();

  const categoryOptions = [
    "Hair accessories",
    "Make-up essentials",
    "Rings",
    "Hair care",
    "Earrings",
    "Perfumes",
    "Hand-wash",
    "Electronics",
    "Sanitary pads",
    "Hair removal",
    "Skincare",
    "Home decorative items",
    "Kitchen essentials",
    "Oral care",
    "Basic needs",
    "Personal care",
    "Bangles",
  ];

  const brandOptions = [
    "LuxeBeauty",
    "ColorPro",
    "SkinLux",
    "Elegance",
    "FlawlessBase",
    "GlossyBeauty",
  ];

  const [filters, setFilters] = useState<FilterState>({
    categories: qCategory ? [qCategory] : [],
    brands: qBrand ? [qBrand] : [],
    priceRange: [0, qPrice ?? 200],
    rating: 0,
    inStock: false,
  });

  // Keep filters in sync with URL params
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      categories: qCategory ? [qCategory] : prev.categories,
      brands: qBrand ? [qBrand] : prev.brands,
      priceRange: [0, qPrice ?? prev.priceRange[1]],
    }));
  }, [qCategory, qBrand, qPrice]);

  const activeFiltersCount =
    filters.categories.length +
    filters.brands.length +
    (filters.rating > 0 ? 1 : 0) +
    (filters.inStock ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 200 ? 1 : 0);

  // Fetch products based on initial URL filters
  useEffect(() => {
    const fetchProducts = async () => {
      if (!qName && !qCategory && !qBrand && qPrice === undefined) {
        setAllProducts([]);
        setProducts([]);
        return;
      }

      setLoading(true);
      try {
        let results: Product[] = [];

        if (qName.trim()) {
          const res = await HomePageApi.searchProductsByName(qName.trim());
          results = res.data;
        } else if (qCategory) {
          const res = await HomePageApi.getProductsByCategory(qCategory);
          results = res.data;
        } else if (qBrand) {
          const res = await HomePageApi.searchByBrand(qBrand);
          results = res.data;
        } else if (qPrice !== undefined) {
          const res = await HomePageApi.searchByPrice(qPrice);
          results = res.data;
        }

        setAllProducts(results || []);
        setProducts(results || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setAllProducts([]);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [qName, qCategory, qBrand, qPrice]);

  // Apply client-side filters
  useEffect(() => {
    let filtered = [...allProducts];

    if (filters.categories.length > 0) {
      filtered = filtered.filter((p) =>
        filters.categories.includes(p.category || "")
      );
    }

    if (filters.brands.length > 0) {
      filtered = filtered.filter((p) =>
        filters.brands.includes(p.brand || "")
      );
    }

    const [minPrice, maxPrice] = filters.priceRange;
    filtered = filtered.filter(
      (p) => p.price >= minPrice && p.price <= maxPrice
    );

    if (filters.rating > 0) {
      filtered = filtered.filter((p) => p.rating >= filters.rating);
    }

    if (filters.inStock) {
      filtered = filtered.filter((p) => !!p.stock);
    }

    setProducts(filtered);
  }, [filters, allProducts]);

  const handleFilterChange = (key: keyof FilterState, value: any) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const toggleFilter = (
    key: "categories" | "brands",
    value: string
  ): void => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  };

  const clearAllFilters = () =>
    setFilters({
      categories: [],
      brands: [],
      priceRange: [0, 200],
      rating: 0,
      inStock: false,
    });

  const handleAddToCart = (product: Product) => {
    if (!product.stock) return;

    const inCart = cartItems.some((i) => i.productId === product.productId);
    if (inCart) {
      setCurrentPage("cart");
    } else {
      addToCart(product);
      onAddToCart?.(product, 1);
    }
  };

  const FilterSidebar = () => (
    <div className="space-y-6 text-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filters</h3>
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            Clear All ({activeFiltersCount})
          </Button>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-2">
        <h4 className="font-medium">Categories</h4>
        {categoryOptions.map((cat) => (
          <label
            key={cat}
            htmlFor={`cat-${cat}`}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <Checkbox
              id={`cat-${cat}`}
              checked={filters.categories.includes(cat)}
              onCheckedChange={() => toggleFilter("categories", cat)}
            />
            <span>{cat}</span>
          </label>
        ))}
      </div>

      <Separator />

      {/* Brands */}
      <div className="space-y-2">
        <h4 className="font-medium">Brands</h4>
        {brandOptions.map((brand) => (
          <label
            key={brand}
            htmlFor={`brand-${brand}`}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <Checkbox
              id={`brand-${brand}`}
              checked={filters.brands.includes(brand)}
              onCheckedChange={() => toggleFilter("brands", brand)}
            />
            <span>{brand}</span>
          </label>
        ))}
      </div>

      <Separator />

      {/* Price */}
      <div className="space-y-2">
        <h4 className="font-medium">Price Range</h4>
        <Slider
          value={filters.priceRange}
          onValueChange={(v) =>
            handleFilterChange("priceRange", v as [number, number])
          }
          min={0}
          max={200}
          step={5}
          className="w-full"
        />
        <div className="flex justify-between text-muted-foreground">
          <span>₹{filters.priceRange[0]}</span>
          <span>₹{filters.priceRange[1]}</span>
        </div>
      </div>

      <Separator />

      {/* Rating */}
      <div className="space-y-2">
        <h4 className="font-medium">Minimum Rating</h4>
        {[4, 3, 2, 1].map((r) => (
          <label
            key={r}
            htmlFor={`rating-${r}`}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <Checkbox
              id={`rating-${r}`}
              checked={filters.rating === r}
              onCheckedChange={() =>
                handleFilterChange("rating", filters.rating === r ? 0 : r)
              }
            />
            <span className="flex items-center">
              {Array.from({ length: r }).map((_, i) => (
                <Star
                  key={i}
                  className="w-3 h-3 fill-yellow-400 text-yellow-400"
                />
              ))}
              <span className="ml-1">& Up</span>
            </span>
          </label>
        ))}
      </div>

      <Separator />

      {/* In Stock */}
      <label
        htmlFor="in-stock"
        className="flex items-center space-x-2 cursor-pointer"
      >
        <Checkbox
          id="in-stock"
          checked={filters.inStock}
          onCheckedChange={(c) => handleFilterChange("inStock", c)}
        />
        <span>In Stock Only</span>
      </label>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f0a10] text-white">
      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* Mobile Filter */}
        <div className="lg:hidden mb-4">
          <Button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full justify-between bg-[#4b1c4f] hover:bg-[#632a68]"
          >
            Filters {dropdownOpen ? "▲" : "▼"}
          </Button>
          {dropdownOpen && (
            <div className="mt-2 p-4 border rounded-lg bg-[#1a0f1a] shadow-md">
              <FilterSidebar />
            </div>
          )}
        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-24">
          <FilterSidebar />
        </aside>

        {/* Products */}
        <main className="flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-lg">
              Loading...
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 lg:gap-6 justify-items-center">
              {products.map((product) => {
                const inCart = cartItems.some(
                  (i) => i.productId === product.productId
                );
                const isOutOfStock = !product.stock;
                const buttonText = isOutOfStock
                  ? "Out of Stock"
                  : inCart
                  ? "Go to Cart"
                  : "Add to Cart";

                return (
                  <div key={product.productId} className="w-full">
                    <div className="cursor-pointer">
                      <ProductCard
                        product={product}
                        onAddToCart={() => {
                          if (!isOutOfStock) handleAddToCart(product);
                        }}
                        buttonText={buttonText}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-lg py-10 text-gray-400">
              No products found.
            </p>
          )}
        </main>
      </div>
    </div>
  );
}
