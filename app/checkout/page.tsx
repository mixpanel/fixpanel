"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { trackMicrositeSession } from "@/lib/analytics";
import {
  ShoppingCartIcon,
  SearchIcon,
  FilterIcon,
  StarIcon,
  HeartIcon,
  TruckIcon,
  XIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CouponDrawer } from "./CouponDrawer";
import { ChatbotWidget } from "./ChatbotWidget";
import { DynamicCTAButton } from "./DynamicCTAButton";
import { products } from "./products";

export default function WeBuyHomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState<Array<{id: number, quantity: number}>>([]);
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);

  // Load cart from sessionStorage on mount
  useEffect(() => {
    document.title = "weBuy";

    // Track session start
    trackMicrositeSession('weBuy');

    if (typeof window !== 'undefined') {
      const savedCart = sessionStorage.getItem('theybuy_cart');
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (e) {
          console.error('Error loading cart from sessionStorage:', e);
        }
      }
    }
  }, []);

  // Save cart to sessionStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('theybuy_cart', JSON.stringify(cart));
    }
  }, [cart]);

  const categories = ["All", "Electronics", "Fitness", "Kitchen", "Home & Garden", "Accessories", "Books & Media"];

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
        product_category: product?.category
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
        product_category: product.category
      });
    }
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <CouponDrawer />
      <ChatbotWidget />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-6 md:py-10 lg:py-12 text-white" style={{ backgroundColor: "#6B46C1" }}>
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
                >
                  weBuy
                </motion.h1>
                <motion.p
                  className="mx-auto max-w-[700px] text-lg md:text-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
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
                  className="flex items-center space-x-2 bg-white/10 rounded-lg px-4 py-2"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
                >
                  <TruckIcon className="h-5 w-5" />
                  <span className="text-sm">Free shipping on orders $50+</span>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="w-full py-6" style={{ backgroundColor: "#ffffff" }}>
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <motion.div whileFocus={{ scale: 1.01 }}>
                    <Input
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                      style={{ backgroundColor: "#ffffff", borderColor: "#e5e5e5", color: "#333333" }}
                    />
                  </motion.div>
                </div>
              </div>

              <div className="flex gap-2 items-center">
                <FilterIcon className="h-4 w-4 text-gray-600" />
                <motion.select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border rounded-md text-sm"
                  style={{ backgroundColor: "#ffffff", borderColor: "#e5e5e5", color: "#333333" }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {categories.map(category => {
                    const count = category === "All" ? products.length : products.filter(p => p.category === category).length;
                    return (
                      <option key={category} value={category}>
                        {category} ({count})
                      </option>
                    );
                  })}
                </motion.select>
              </div>

              <div className="flex gap-3 items-center">
                <DynamicCTAButton />
                <Link href="/checkout/cart">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button style={{ backgroundColor: "#7856FF", color: "#ffffff" }}>
                      <ShoppingCartIcon className="h-4 w-4 mr-2" />
                      Cart ({getCartItemCount()})
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="w-full py-8" style={{ backgroundColor: "#f5f5f5" }}>
          <div className="container px-4 md:px-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {selectedCategory === "All" ? "All Products" : selectedCategory}
              </h2>
              <p className="text-gray-600">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <motion.div
                  key={product.id}
                  className="border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  style={{ backgroundColor: "#ffffff", borderColor: "#e5e5e5" }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => openProductModal(product)}
                >
                  <div className="text-center">
                    <div className="text-6xl mb-4">{product.image}</div>
                    <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{product.description}</p>

                    <div className="flex items-center justify-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          whileHover={{ scale: 1.3, rotate: 360 }}
                          transition={{ duration: 0.2 }}
                        >
                          <StarIcon
                            className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        </motion.div>
                      ))}
                      <span className="text-sm text-gray-600 ml-1">
                        {product.rating} ({product.reviews} reviews)
                      </span>
                    </div>

                    <motion.div
                      className="text-2xl font-bold mb-4"
                      style={{ color: "#7856FF" }}
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      ${product.price}
                    </motion.div>

                    <div className="flex gap-2">
                      <motion.div
                        className="flex-1"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product.id);
                          }}
                          className="w-full"
                          style={{ backgroundColor: "#7856FF", color: "#ffffff" }}
                        >
                          <ShoppingCartIcon className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (typeof window !== 'undefined' && window.mixpanel) {
                              window.mixpanel.track('Button Clicked', {
                                button_name: 'Favorite Product',
                                product_id: product.id,
                                product_name: product.name,
                                page: 'weBuy Home'
                              });
                            }
                          }}
                          className="hover:bg-opacity-90 active:scale-95 transition-all"
                          style={{ backgroundColor: "#ffffff", borderColor: "#e5e5e5", color: "#333333" }}
                        >
                          <HeartIcon className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No products found matching your criteria.</p>
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12" style={{ backgroundColor: "#ffffff" }}>
          <div className="container px-4 md:px-6">
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                className="text-center"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ y: -5 }}
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.3 }}
                >
                  <TruckIcon className="h-12 w-12 mx-auto mb-4" style={{ color: "#7856FF" }} />
                </motion.div>
                <h3 className="font-semibold mb-2">Fast Delivery</h3>
                <p className="text-gray-600 text-sm">Free shipping on orders over $50</p>
              </motion.div>
              <motion.div
                className="text-center"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ y: -5 }}
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.3 }}
                >
                  <ShoppingCartIcon className="h-12 w-12 mx-auto mb-4" style={{ color: "#7856FF" }} />
                </motion.div>
                <h3 className="font-semibold mb-2">Easy Returns</h3>
                <p className="text-gray-600 text-sm">30-day return policy</p>
              </motion.div>
              <motion.div
                className="text-center"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ y: -5 }}
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.3 }}
                >
                  <StarIcon className="h-12 w-12 mx-auto mb-4" style={{ color: "#7856FF" }} />
                </motion.div>
                <h3 className="font-semibold mb-2">Quality Products</h3>
                <p className="text-gray-600 text-sm">Curated selection of top-rated items</p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      {/* Product Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeProductModal}
          >
            <motion.div
              className="rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              style={{ backgroundColor: "#ffffff" }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={closeProductModal}
                      className="hover:bg-gray-100 hover:bg-opacity-90 active:scale-95 transition-all"
                    >
                      <XIcon className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-[200px] mb-4">{selectedProduct.image}</div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <span className="inline-block bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">
                        {selectedProduct.category}
                      </span>
                    </div>

                    <p className="text-gray-600 text-lg">{selectedProduct.description}</p>

                    <div className="flex items-center gap-2">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          whileHover={{ scale: 1.2, rotate: 360 }}
                          transition={{ duration: 0.3 }}
                        >
                          <StarIcon
                            className={`h-5 w-5 ${
                              i < Math.floor(selectedProduct.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        </motion.div>
                      ))}
                      <span className="text-gray-600 ml-2">
                        {selectedProduct.rating} ({selectedProduct.reviews} reviews)
                      </span>
                    </div>

                    <motion.div
                      className="text-3xl font-bold mb-4"
                      style={{ color: "#7856FF" }}
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      ${selectedProduct.price}
                    </motion.div>

                    <div className="flex gap-3">
                      <motion.div
                        className="flex-1"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          onClick={() => addToCart(selectedProduct.id)}
                          className="w-full text-lg py-3"
                          style={{ backgroundColor: "#7856FF", color: "#ffffff" }}
                        >
                          <ShoppingCartIcon className="h-5 w-5 mr-2" />
                          Add to Cart
                        </Button>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (typeof window !== 'undefined' && window.mixpanel) {
                              window.mixpanel.track('Button Clicked', {
                                button_name: 'Favorite Product Modal',
                                product_id: selectedProduct.id,
                                product_name: selectedProduct.name,
                                page: 'weBuy Product Modal'
                              });
                            }
                          }}
                          className="hover:bg-opacity-90 active:scale-95 transition-all"
                          style={{ backgroundColor: "#ffffff", borderColor: "#e5e5e5", color: "#333333" }}
                        >
                          <HeartIcon className="h-5 w-5" />
                        </Button>
                      </motion.div>
                    </div>

                    <div className="p-4 rounded-lg" style={{ backgroundColor: "#f5f5f5", borderColor: "#e5e5e5", border: '1px solid' }}>
                      <h4 className="font-semibold mb-2">Product Features:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
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