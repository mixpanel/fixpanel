// Shared product data for weBuy ecommerce demo

export interface Product {
  id: number;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  category: string;
  image: string;
  description: string;
}

export const products: Product[] = [
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
