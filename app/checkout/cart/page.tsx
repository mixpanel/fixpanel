"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import {
  ShoppingCartIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
  TagIcon,
  ArrowLeftIcon,
  CreditCardIcon
} from "lucide-react";

// Product data from main checkout page (should be shared)
const products = [
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
  }
];

export default function CartPage() {
  const [cartData, setCartData] = useState<Array<{id: number, quantity: number}>>([]);
  const [cartItems, setCartItems] = useState<Array<{id: number, name: string, price: number, quantity: number, image: string}>>([]);

  // Load cart from localStorage and convert to full product data
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cheapstuff_cart');
      if (savedCart) {
        try {
          const cartData = JSON.parse(savedCart);
          setCartData(cartData);

          // Convert cart data to full product info
          const fullCartItems = cartData.map((cartItem: {id: number, quantity: number}) => {
            const product = products.find(p => p.id === cartItem.id);
            if (product) {
              return {
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: cartItem.quantity,
                image: product.image
              };
            }
            return null;
          }).filter(Boolean);

          setCartItems(fullCartItems);
        } catch (e) {
          console.error('Error loading cart from localStorage:', e);
        }
      }
    }
  }, []);

  // Update localStorage when cart changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cheapstuff_cart', JSON.stringify(cartData));
    }
  }, [cartData]);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(id);
      return;
    }

    // Update cart data
    setCartData(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );

    // Update cart items display
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );

    // Track quantity update
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track('Cart Quantity Updated', {
        product_id: id,
        new_quantity: newQuantity
      });
    }
  };

  const removeItem = (id: number) => {
    const item = cartItems.find(item => item.id === id);

    // Update cart data
    setCartData(prev => prev.filter(item => item.id !== id));

    // Update cart items display
    setCartItems(prev => prev.filter(item => item.id !== id));

    // Track item removal
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track('Remove from Cart', {
        product_id: id,
        product_name: item?.name
      });
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = couponApplied ? subtotal * 0.15 : 0; // 15% discount
  const shipping = subtotal > 50 ? 0 : 8.99;
  const tax = (subtotal - discount) * 0.08; // 8% tax
  const total = subtotal - discount + shipping + tax;

  // THE BROKEN COUPON BUTTON! 🐛
  // This will only work 10% of the time, simulating a real UX issue
  const applyCoupon = () => {
    setIsApplyingCoupon(true);
    setCouponError("");

    // Track coupon attempt
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track('Coupon Apply Attempted', {
        coupon_code: couponCode,
        cart_value: subtotal
      });
    }

    // Simulate network delay
    setTimeout(() => {
      // 90% failure rate - this is the UX issue we're demonstrating!
      const shouldWork = Math.random() < 0.1;

      if (shouldWork && couponCode.toLowerCase() === 'save15') {
        setCouponApplied(true);
        setCouponError("");

        // Track successful coupon application
        if (typeof window !== 'undefined' && window.mixpanel) {
          window.mixpanel.track('Coupon Applied Successfully', {
            coupon_code: couponCode,
            discount_amount: subtotal * 0.15,
            cart_value: subtotal
          });
        }
      } else {
        setCouponError("Unable to apply coupon. Please try again.");

        // Track coupon failure
        if (typeof window !== 'undefined' && window.mixpanel) {
          window.mixpanel.track('Coupon Apply Failed', {
            coupon_code: couponCode,
            cart_value: subtotal,
            error_reason: "system_error"
          });
        }
      }

      setIsApplyingCoupon(false);
    }, 1000);
  };

  // Track page view
  useEffect(() => {
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track('View Cart', {
        cart_item_count: cartItems.length,
        cart_value: subtotal
      });
    }
  }, [cartItems.length, subtotal]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          <div className="mb-6">
            <Link href="/checkout" className="flex items-center text-[#07B096] hover:underline">
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>
          </div>

          <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCartIcon className="h-24 w-24 mx-auto text-gray-300 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
              <Link href="/checkout">
                <Button className="bg-[#07B096] hover:bg-[#07B096]/90">
                  Start Shopping
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="text-4xl">{item.image}</div>

                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-[#07B096] font-semibold">${item.price}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <MinusIcon className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <PlusIcon className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="border rounded-lg p-6 sticky top-6">
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                  {/* Coupon Section - THE BROKEN FEATURE! */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <TagIcon className="h-4 w-4 text-[#07B096]" />
                      <span className="font-medium">Promo Code</span>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter code (try: SAVE15)"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        disabled={couponApplied}
                      />
                      <Button
                        onClick={applyCoupon}
                        disabled={isApplyingCoupon || couponApplied || !couponCode}
                        className="bg-[#07B096] hover:bg-[#07B096]/90"
                      >
                        {isApplyingCoupon ? "..." : "Apply"}
                      </Button>
                    </div>
                    {couponError && (
                      <p className="text-red-500 text-sm mt-2">{couponError}</p>
                    )}
                    {couponApplied && (
                      <p className="text-green-600 text-sm mt-2">
                        ✓ Coupon applied! 15% off
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      💡 Hint: The coupon button only works 10% of the time - this demonstrates UX friction!
                    </p>
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    {couponApplied && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount (15%)</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Link href="/checkout/payment" className="w-full">
                    <Button className="w-full bg-[#07B096] hover:bg-[#07B096]/90 mb-4">
                      <CreditCardIcon className="h-4 w-4 mr-2" />
                      Proceed to Checkout
                    </Button>
                  </Link>

                  <div className="text-center text-sm text-gray-500">
                    <p>🔒 Secure checkout</p>
                    <p>30-day return policy</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}