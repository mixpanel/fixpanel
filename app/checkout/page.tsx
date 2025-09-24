"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import {
  ShoppingCartIcon,
  SearchIcon,
  FilterIcon,
  StarIcon,
  HeartIcon,
  TruckIcon
} from "lucide-react";

// Mock product data - Expanded catalog for better demo
const products = [
  // Electronics
  {
    id: 1,
    name: "Wireless Headphones",
    price: 99.99,
    rating: 4.5,
    reviews: 128,
    category: "Electronics",
    image: "🎧",
    description: "High-quality wireless headphones with noise cancellation"
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 249.99,
    rating: 4.3,
    reviews: 89,
    category: "Electronics",
    image: "⌚",
    description: "Feature-rich smartwatch with health tracking"
  },
  {
    id: 3,
    name: "Bluetooth Speaker",
    price: 79.99,
    rating: 4.6,
    reviews: 203,
    category: "Electronics",
    image: "🔊",
    description: "Portable waterproof speaker with rich bass"
  },
  {
    id: 4,
    name: "Wireless Mouse",
    price: 34.99,
    rating: 4.2,
    reviews: 156,
    category: "Electronics",
    image: "🖱️",
    description: "Ergonomic wireless mouse with long battery life"
  },
  {
    id: 5,
    name: "USB-C Hub",
    price: 59.99,
    rating: 4.4,
    reviews: 92,
    category: "Electronics",
    image: "🔌",
    description: "7-in-1 USB-C hub with HDMI, USB 3.0, and SD card slots"
  },
  {
    id: 6,
    name: "Portable Charger",
    price: 39.99,
    rating: 4.7,
    reviews: 312,
    category: "Electronics",
    image: "🔋",
    description: "20,000mAh portable power bank with fast charging"
  },
  {
    id: 7,
    name: "Webcam HD",
    price: 89.99,
    rating: 4.3,
    reviews: 178,
    category: "Electronics",
    image: "📹",
    description: "1080p HD webcam with auto-focus and built-in microphone"
  },
  {
    id: 8,
    name: "Phone Stand",
    price: 24.99,
    rating: 4.5,
    reviews: 234,
    category: "Electronics",
    image: "📱",
    description: "Adjustable aluminum phone and tablet stand"
  },

  // Fitness
  {
    id: 9,
    name: "Yoga Mat",
    price: 29.99,
    rating: 4.7,
    reviews: 256,
    category: "Fitness",
    image: "🧘",
    description: "Premium non-slip yoga mat for all fitness levels"
  },
  {
    id: 10,
    name: "Resistance Bands Set",
    price: 19.99,
    rating: 4.6,
    reviews: 189,
    category: "Fitness",
    image: "💪",
    description: "5-piece resistance band set with varying resistance levels"
  },
  {
    id: 11,
    name: "Foam Roller",
    price: 34.99,
    rating: 4.4,
    reviews: 145,
    category: "Fitness",
    image: "🏋️",
    description: "High-density foam roller for muscle recovery and stretching"
  },
  {
    id: 12,
    name: "Water Bottle",
    price: 22.99,
    rating: 4.8,
    reviews: 412,
    category: "Fitness",
    image: "🥤",
    description: "32oz stainless steel insulated water bottle"
  },
  {
    id: 13,
    name: "Gym Towel Set",
    price: 16.99,
    rating: 4.3,
    reviews: 87,
    category: "Fitness",
    image: "🏃",
    description: "Quick-dry microfiber towel set for gym and travel"
  },
  {
    id: 14,
    name: "Workout Gloves",
    price: 18.99,
    rating: 4.1,
    reviews: 134,
    category: "Fitness",
    image: "🥊",
    description: "Breathable workout gloves with wrist support"
  },

  // Kitchen
  {
    id: 15,
    name: "Coffee Maker",
    price: 89.99,
    rating: 4.4,
    reviews: 167,
    category: "Kitchen",
    image: "☕",
    description: "Programmable coffee maker with thermal carafe"
  },
  {
    id: 16,
    name: "Air Fryer",
    price: 129.99,
    rating: 4.6,
    reviews: 298,
    category: "Kitchen",
    image: "🍟",
    description: "5.5Qt digital air fryer with preset cooking functions"
  },
  {
    id: 17,
    name: "Blender",
    price: 79.99,
    rating: 4.5,
    reviews: 203,
    category: "Kitchen",
    image: "🥤",
    description: "High-speed blender perfect for smoothies and soups"
  },
  {
    id: 18,
    name: "Knife Set",
    price: 59.99,
    rating: 4.7,
    reviews: 156,
    category: "Kitchen",
    image: "🔪",
    description: "6-piece professional kitchen knife set with wooden block"
  },
  {
    id: 19,
    name: "Cutting Board Set",
    price: 34.99,
    rating: 4.4,
    reviews: 123,
    category: "Kitchen",
    image: "🍽️",
    description: "Bamboo cutting board set with different sizes"
  },
  {
    id: 20,
    name: "Food Storage Containers",
    price: 24.99,
    rating: 4.6,
    reviews: 267,
    category: "Kitchen",
    image: "📦",
    description: "10-piece glass food storage container set with lids"
  },
  {
    id: 21,
    name: "Spice Rack",
    price: 42.99,
    rating: 4.3,
    reviews: 89,
    category: "Kitchen",
    image: "🧂",
    description: "Rotating spice rack with 16 glass jars and labels"
  },

  // Home & Garden
  {
    id: 22,
    name: "LED Desk Lamp",
    price: 49.99,
    rating: 4.5,
    reviews: 178,
    category: "Home & Garden",
    image: "💡",
    description: "Adjustable LED desk lamp with USB charging port"
  },
  {
    id: 23,
    name: "Plant Pot Set",
    price: 27.99,
    rating: 4.4,
    reviews: 145,
    category: "Home & Garden",
    image: "🪴",
    description: "Set of 4 ceramic plant pots with drainage holes"
  },
  {
    id: 24,
    name: "Essential Oil Diffuser",
    price: 39.99,
    rating: 4.6,
    reviews: 234,
    category: "Home & Garden",
    image: "🌸",
    description: "Ultrasonic aromatherapy diffuser with 7 LED colors"
  },
  {
    id: 25,
    name: "Throw Pillows Set",
    price: 32.99,
    rating: 4.2,
    reviews: 67,
    category: "Home & Garden",
    image: "🛋️",
    description: "Set of 2 decorative throw pillows with removable covers"
  },
  {
    id: 26,
    name: "Wall Clock",
    price: 28.99,
    rating: 4.3,
    reviews: 98,
    category: "Home & Garden",
    image: "🕐",
    description: "Modern minimalist wall clock with silent movement"
  },

  // Accessories
  {
    id: 27,
    name: "Reading Glasses",
    price: 19.99,
    rating: 4.1,
    reviews: 45,
    category: "Accessories",
    image: "👓",
    description: "Stylish blue light blocking reading glasses"
  },
  {
    id: 28,
    name: "Baseball Cap",
    price: 24.99,
    rating: 4.4,
    reviews: 123,
    category: "Accessories",
    image: "🧢",
    description: "Adjustable cotton baseball cap with embroidered logo"
  },
  {
    id: 29,
    name: "Leather Wallet",
    price: 49.99,
    rating: 4.6,
    reviews: 189,
    category: "Accessories",
    image: "👛",
    description: "Genuine leather bifold wallet with RFID blocking"
  },
  {
    id: 30,
    name: "Sunglasses",
    price: 79.99,
    rating: 4.5,
    reviews: 234,
    category: "Accessories",
    image: "🕶️",
    description: "UV400 polarized sunglasses with lightweight frame"
  },
  {
    id: 31,
    name: "Backpack",
    price: 59.99,
    rating: 4.7,
    reviews: 156,
    category: "Accessories",
    image: "🎒",
    description: "Water-resistant laptop backpack with multiple compartments"
  },
  {
    id: 32,
    name: "Belt",
    price: 34.99,
    rating: 4.3,
    reviews: 89,
    category: "Accessories",
    image: "⚫",
    description: "Genuine leather dress belt with classic buckle"
  },

  // Books & Media
  {
    id: 33,
    name: "Notebook Set",
    price: 18.99,
    rating: 4.5,
    reviews: 167,
    category: "Books & Media",
    image: "📓",
    description: "3-pack lined notebooks with hardcover and elastic band"
  },
  {
    id: 34,
    name: "Pen Set",
    price: 22.99,
    rating: 4.4,
    reviews: 98,
    category: "Books & Media",
    image: "✒️",
    description: "Premium ballpoint pen set with gift box"
  },
  {
    id: 35,
    name: "Bookends",
    price: 29.99,
    rating: 4.6,
    reviews: 76,
    category: "Books & Media",
    image: "📚",
    description: "Heavy-duty metal bookends with non-slip base"
  },
  {
    id: 36,
    name: "Reading Light",
    price: 26.99,
    rating: 4.3,
    reviews: 134,
    category: "Books & Media",
    image: "🔦",
    description: "Clip-on LED reading light with adjustable brightness"
  }
];

export default function CheapStuffHomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState<Array<{id: number, quantity: number}>>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cheapstuff_cart');
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
      localStorage.setItem('cheapstuff_cart', JSON.stringify(cart));
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

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-6 md:py-10 lg:py-12 bg-[#07B096] text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  CheapStuff
                </h1>
                <p className="mx-auto max-w-[700px] text-lg md:text-xl">
                  Your favorite products, delivered fast. Discover amazing deals today!
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-4 py-2">
                  <TruckIcon className="h-5 w-5" />
                  <span className="text-sm">Free shipping on orders $50+</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="w-full py-6 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex gap-2 items-center">
                <FilterIcon className="h-4 w-4 text-gray-600" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border rounded-md text-sm"
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
                <Button className="bg-[#07B096] hover:bg-[#07B096]/90">
                  <ShoppingCartIcon className="h-4 w-4 mr-2" />
                  Cart ({getCartItemCount()})
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="w-full py-8 bg-white">
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
                <div key={product.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="text-center">
                    <div className="text-6xl mb-4">{product.image}</div>
                    <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{product.description}</p>

                    <div className="flex items-center justify-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-1">
                        {product.rating} ({product.reviews} reviews)
                      </span>
                    </div>

                    <div className="text-2xl font-bold text-[#07B096] mb-4">
                      ${product.price}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => addToCart(product.id)}
                        className="flex-1 bg-[#07B096] hover:bg-[#07B096]/90"
                      >
                        <ShoppingCartIcon className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button variant="outline" size="icon">
                        <HeartIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
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
        <section className="w-full py-12 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <TruckIcon className="h-12 w-12 text-[#07B096] mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Fast Delivery</h3>
                <p className="text-gray-600 text-sm">Free shipping on orders over $50</p>
              </div>
              <div className="text-center">
                <ShoppingCartIcon className="h-12 w-12 text-[#07B096] mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Easy Returns</h3>
                <p className="text-gray-600 text-sm">30-day return policy</p>
              </div>
              <div className="text-center">
                <StarIcon className="h-12 w-12 text-[#07B096] mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Quality Products</h3>
                <p className="text-gray-600 text-sm">Curated selection of top-rated items</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}