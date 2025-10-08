"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useColorScheme } from "./ColorSchemeProvider";
import Link from "next/link";
import {
  ShoppingCartIcon,
  SearchIcon,
  FilterIcon,
  StarIcon,
  HeartIcon,
  TruckIcon,
  XIcon,
  FlagIcon,
  PaletteIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Import products from the original page
import { products } from "./products";

const categories = ["All", "Electronics", "Fitness", "Kitchen", "Home & Garden", "Accessories", "Books & Media"];

export function TheyBuyContent() {
  const { variant, colors } = useColorScheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState<Array<{id: number, quantity: number}>>([]);
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    document.title = "theyBuy";

    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('theybuy_cart');
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (e) {
          console.error('Error loading cart from localStorage:', e);
        }
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theybuy_cart', JSON.stringify(cart));
    }
  }, [cart]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (productId: number) => {
    // Track add to cart event
    if (typeof window !== 'undefined' && window.mixpanel) {
      const product = products.find(p => p.id === productId);
      window.mixpanel.track('Add to Cart', {
        product_id: productId,
        product_name: product?.name,
        product_price: product?.price,
        product_category: product?.category,
        color_scheme_variant: variant,
      });
    }

    setCart(prev => {
      const existing = prev.find(item => item.id === productId);
      if (existing) {
        return prev.map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { id: productId, quantity: 1 }];
    });
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const openProductModal = (product: typeof products[0]) => {
    setSelectedProduct(product);

    // Track product view
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track('Product Viewed', {
        product_id: product.id,
        product_name: product.name,
        product_price: product.price,
        product_category: product.category,
        color_scheme_variant: variant,
      });
    }
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
  };

  // Dynamic styles based on color scheme
  const dynamicStyles = variant ? {
    backgroundColor: colors.background,
    color: colors.text,
  } : {};

  return (
    <div className="flex flex-col min-h-screen" style={dynamicStyles}>
      <Header />

      {/* Color Scheme Indicator */}
      {variant && variant !== "control (C)" && (
        <div className="bg-opacity-90 backdrop-blur-sm py-2 px-4 text-center text-sm flex items-center justify-center gap-2" style={{ backgroundColor: colors.accent, color: colors.buttonText }}>
          <FlagIcon className="h-4 w-4" />
          <PaletteIcon className="h-4 w-4" />
          <span className="font-medium">
            Color Scheme Feature: {variant === "dark mode (A)" ? "Dark Mode" : "Chaos Mode"}
          </span>
        </div>
      )}

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-6 md:py-10 lg:py-12 text-white" style={{ backgroundColor: colors.primary }}>
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <motion.div
                className="space-y-2"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <motion.h1
                  className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  style={{ color: colors.buttonText }}
                >
                  theyBuy
                </motion.h1>
                <motion.p
                  className="mx-auto max-w-[700px] text-lg md:text-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  style={{ color: colors.buttonText }}
                >
                  Your favorite products, delivered fast. Discover amazing deals today!
                </motion.p>
              </motion.div>
              <motion.div
                className="flex items-center space-x-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <motion.div
                  className="flex items-center space-x-2 rounded-lg px-4 py-2"
                  style={{ backgroundColor: `${colors.buttonText}20` }}
                  whileHover={{ scale: 1.05 }}
                >
                  <TruckIcon className="h-5 w-5" style={{ color: colors.buttonText }} />
                  <span className="text-sm" style={{ color: colors.buttonText }}>Free shipping on orders $50+</span>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="w-full py-6" style={{ backgroundColor: colors.cardBg, borderBottom: `1px solid ${colors.border}` }}>
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: colors.text }} />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    style={{ backgroundColor: colors.background, color: colors.text, borderColor: colors.border }}
                  />
                </div>
              </div>

              <div className="flex gap-2 items-center">
                <FilterIcon className="h-4 w-4" style={{ color: colors.text }} />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border rounded-md text-sm"
                  style={{ backgroundColor: colors.background, color: colors.text, borderColor: colors.border }}
                >
                  {categories.map(category => {
                    const count = category === "All" ? products.length : products.filter(p => p.category === category).length;
                    return (
                      <option key={category} value={category}>
                        {category} ({count})
                      </option>
                    );
                  })}
                </select>
              </div>

              <Link href="/checkout/cart">
                <Button style={{ backgroundColor: colors.buttonBg, color: colors.buttonText }}>
                  <ShoppingCartIcon className="h-4 w-4 mr-2" />
                  Cart ({getCartItemCount()})
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="w-full py-8" style={{ backgroundColor: colors.background }}>
          <div className="container px-4 md:px-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold" style={{ color: colors.text }}>
                {selectedCategory === "All" ? "All Products" : selectedCategory}
              </h2>
              <p style={{ color: colors.text, opacity: 0.7 }}>
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <motion.div
                  key={product.id}
                  className="border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => openProductModal(product)}
                >
                  <div className="text-center">
                    <div className="text-6xl mb-4">{product.image}</div>
                    <h3 className="text-xl font-semibold mb-2" style={{ color: colors.text }}>{product.name}</h3>
                    <p className="text-sm mb-4" style={{ color: colors.text, opacity: 0.7 }}>{product.description}</p>

                    <div className="flex items-center justify-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`}
                          style={{ color: i < Math.floor(product.rating) ? colors.accent : colors.border }}
                        />
                      ))}
                      <span className="text-sm ml-1" style={{ color: colors.text, opacity: 0.7 }}>
                        {product.rating} ({product.reviews} reviews)
                      </span>
                    </div>

                    <div className="text-2xl font-bold mb-4" style={{ color: colors.primary }}>
                      ${product.price}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product.id);
                        }}
                        className="flex-1"
                        style={{ backgroundColor: colors.buttonBg, color: colors.buttonText }}
                      >
                        <ShoppingCartIcon className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={(e) => e.stopPropagation()}
                        style={{ borderColor: colors.border, color: colors.text }}
                      >
                        <HeartIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p style={{ color: colors.text, opacity: 0.7 }}>No products found matching your criteria.</p>
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12" style={{ backgroundColor: colors.cardBg, borderTop: `1px solid ${colors.border}` }}>
          <div className="container px-4 md:px-6">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: TruckIcon, title: "Fast Delivery", desc: "Free shipping on orders over $50" },
                { icon: ShoppingCartIcon, title: "Easy Returns", desc: "30-day return policy" },
                { icon: StarIcon, title: "Quality Products", desc: "Curated selection of top-rated items" },
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  className="text-center"
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <feature.icon className="h-12 w-12 mx-auto mb-4" style={{ color: colors.primary }} />
                  <h3 className="font-semibold mb-2" style={{ color: colors.text }}>{feature.title}</h3>
                  <p className="text-sm" style={{ color: colors.text, opacity: 0.7 }}>{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />

      {/* Product Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center p-4 z-50"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeProductModal}
          >
            <motion.div
              className="rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              style={{ backgroundColor: colors.cardBg }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold" style={{ color: colors.text }}>{selectedProduct.name}</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={closeProductModal}
                    style={{ color: colors.text }}
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-[200px] mb-4">{selectedProduct.image}</div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <span className="inline-block px-3 py-1 rounded-full text-sm" style={{ backgroundColor: colors.primary, color: colors.buttonText }}>
                        {selectedProduct.category}
                      </span>
                    </div>

                    <p className="text-lg" style={{ color: colors.text }}>{selectedProduct.description}</p>

                    <div className="flex items-center gap-2">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-5 w-5 ${i < Math.floor(selectedProduct.rating) ? 'fill-current' : ''}`}
                          style={{ color: i < Math.floor(selectedProduct.rating) ? colors.accent : colors.border }}
                        />
                      ))}
                      <span className="ml-2" style={{ color: colors.text }}>
                        {selectedProduct.rating} ({selectedProduct.reviews} reviews)
                      </span>
                    </div>

                    <div className="text-3xl font-bold mb-4" style={{ color: colors.primary }}>
                      ${selectedProduct.price}
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={() => addToCart(selectedProduct.id)}
                        className="flex-1 text-lg py-3"
                        style={{ backgroundColor: colors.buttonBg, color: colors.buttonText }}
                      >
                        <ShoppingCartIcon className="h-5 w-5 mr-2" />
                        Add to Cart
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        style={{ borderColor: colors.border, color: colors.text }}
                      >
                        <HeartIcon className="h-5 w-5" />
                      </Button>
                    </div>

                    <div className="rounded-lg p-4" style={{ backgroundColor: colors.background }}>
                      <h4 className="font-semibold mb-2" style={{ color: colors.text }}>Product Features:</h4>
                      <ul className="text-sm space-y-1" style={{ color: colors.text, opacity: 0.8 }}>
                        <li>• High quality materials</li>
                        <li>• Fast shipping available</li>
                        <li>• 30-day return policy</li>
                        <li>• Customer satisfaction guaranteed</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
