"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import {
  CreditCardIcon,
  ArrowLeftIcon,
  ShieldCheckIcon,
  CheckCircleIcon
} from "lucide-react";
import { products } from "../products";

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  // State for checkout button with timeout and click requirement
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const [buttonTimeRemaining, setButtonTimeRemaining] = useState(0);
  const [checkoutClickCount, setCheckoutClickCount] = useState(0);

  // Form states
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  // Real cart data from sessionStorage
  const [cartItems, setCartItems] = useState<Array<{id: number, name: string, price: number, quantity: number, image: string, category: string}>>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [tax, setTax] = useState(0);
  const [orderTotal, setOrderTotal] = useState(0);

  // Load cart from sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = sessionStorage.getItem('theybuy_cart');
      if (savedCart) {
        try {
          const cartData = JSON.parse(savedCart);

          // Convert cart data to full product info
          const fullCartItems = cartData.map((cartItem: {id: number, quantity: number}) => {
            const product = products.find(p => p.id === cartItem.id);
            if (product) {
              return {
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: cartItem.quantity,
                image: product.image,
                category: product.category
              };
            }
            return null;
          }).filter(Boolean);

          setCartItems(fullCartItems);

          // Calculate totals
          const calculatedSubtotal = fullCartItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
          const calculatedDiscount = calculatedSubtotal * 0.15; // 15% discount (from coupon)
          const calculatedShipping = calculatedSubtotal > 50 ? 0 : 8.99;
          const calculatedTax = (calculatedSubtotal - calculatedDiscount) * 0.08; // 8% tax
          const calculatedTotal = calculatedSubtotal - calculatedDiscount + calculatedShipping + calculatedTax;

          setSubtotal(calculatedSubtotal);
          setDiscount(calculatedDiscount);
          setShipping(calculatedShipping);
          setTax(calculatedTax);
          setOrderTotal(calculatedTotal);
        } catch (e) {
          console.error('Error loading cart from sessionStorage:', e);
        }
      }
    }
  }, []);

  // Track page views for each step
  useEffect(() => {
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track('View Checkout', {
        step: currentStep,
        order_value: orderTotal,
        item_count: cartItems.length,
        cart_items: cartItems.map(item => item.name).join(', ')
      });
    }
  }, [currentStep, orderTotal, cartItems]);

  // CHECKOUT BUTTON TIMEOUT - Random 30-45 second delay (only on step 3)
  useEffect(() => {
    if (currentStep !== 3 || isProcessing || orderComplete) return;

    // Set random timeout between 30-45 seconds
    const timeoutSeconds = Math.floor(Math.random() * 16) + 30; // 30-45 seconds
    setButtonTimeRemaining(timeoutSeconds);
    setButtonEnabled(false);
    setCheckoutClickCount(0);

    console.log(`[CHECKOUT]: Button will be enabled in ${timeoutSeconds} seconds`);

    // Count down every second
    const interval = setInterval(() => {
      setButtonTimeRemaining((prev) => {
        if (prev <= 1) {
          setButtonEnabled(true);
          console.log('[CHECKOUT]: Button is now enabled - requires 10 clicks');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentStep, isProcessing, orderComplete]);

  const handleSubmitPayment = () => {
    // Require 10 clicks before actually processing
    const newClickCount = checkoutClickCount + 1;
    setCheckoutClickCount(newClickCount);

    // Track each click
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track('Checkout Button Clicked', {
        order_value: orderTotal,
        clickCount: newClickCount,
        clicksRemaining: 10 - newClickCount,
        item_count: cartItems.length
      });
    }

    if (newClickCount < 10) {
      console.log(`[CHECKOUT]: Click ${newClickCount}/10 - ${10 - newClickCount} more clicks needed`);
      return;
    }

    // After 10 clicks, actually process the order
    setIsProcessing(true);

    // Track checkout attempt
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track('Checkout Attempted', {
        order_value: orderTotal,
        payment_method: 'credit_card',
        item_count: cartItems.length,
        items: cartItems.map(item => ({
          product_id: item.id,
          name: item.name,
          category: item.category,
          price: item.price,
          quantity: item.quantity
        }))
      });
    }

    // Simulate payment processing
    setTimeout(() => {
      setOrderComplete(true);
      setIsProcessing(false);

      // Track successful purchase with real cart data
      if (typeof window !== 'undefined' && window.mixpanel) {
        window.mixpanel.track('Purchase Completed', {
          order_value: orderTotal,
          order_id: `ORD-${Date.now()}`,
          item_count: cartItems.length,
          items: cartItems.map(item => ({
            product_id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            category: item.category
          })),
          subtotal: subtotal,
          discount: discount,
          shipping: shipping,
          tax: tax
        });
      }
    }, 3000);
  };

  if (orderComplete) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 py-8">
          <div className="container px-4 md:px-6 max-w-2xl mx-auto text-center">
            <CheckCircleIcon className="h-24 w-24 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">Order Complete!</h1>
            <p className="text-gray-600 mb-8">
              Thank you for your purchase. Your order has been confirmed and will be shipped soon.
            </p>
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="font-semibold mb-4">Order Summary</h3>
              <div className="space-y-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.name} (x{item.quantity})</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <hr />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${orderTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <Link href="/checkout">
              <Button
                style={{ backgroundColor: '#9333EA', color: '#FFFFFF' }}
                className="hover:bg-opacity-90 active:scale-95 transition-all"
              >
                Continue Shopping
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6 max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/checkout/cart" className="flex items-center hover:underline" style={{ color: '#9333EA' }}>
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Cart
            </Link>
          </div>

          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 1 ? '' : 'bg-gray-200'}`} style={currentStep >= 1 ? { backgroundColor: '#9333EA', color: '#FFFFFF' } : {}}>
                1
              </div>
              <div className="w-12 h-1 bg-gray-200">
                <div className="h-full transition-all" style={{ backgroundColor: '#9333EA', width: currentStep >= 2 ? '100%' : '0' }}></div>
              </div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 2 ? '' : 'bg-gray-200'}`} style={currentStep >= 2 ? { backgroundColor: '#9333EA', color: '#FFFFFF' } : {}}>
                2
              </div>
              <div className="w-12 h-1 bg-gray-200">
                <div className="h-full transition-all" style={{ backgroundColor: '#9333EA', width: currentStep >= 3 ? '100%' : '0' }}></div>
              </div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 3 ? '' : 'bg-gray-200'}`} style={currentStep >= 3 ? { backgroundColor: '#9333EA', color: '#FFFFFF' } : {}}>
                3
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Step 1: Contact Info */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Contact Information</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                    <Input
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                  <Input
                    placeholder="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Button
                    onClick={() => setCurrentStep(2)}
                    disabled={!firstName || !lastName || !email}
                    style={{ backgroundColor: '#9333EA', color: '#FFFFFF' }}
                    className="hover:bg-opacity-90 active:scale-95 transition-all"
                  >
                    Continue to Shipping
                  </Button>
                </div>
              )}

              {/* Step 2: Shipping */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Shipping Address</h2>
                  <Input
                    placeholder="Street Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                    <Input
                      placeholder="ZIP Code"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(1)}
                      className="hover:bg-opacity-90 active:scale-95 transition-all"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={() => setCurrentStep(3)}
                      disabled={!address || !city || !zipCode}
                      style={{ backgroundColor: '#9333EA', color: '#FFFFFF' }}
                      className="hover:bg-opacity-90 active:scale-95 transition-all"
                    >
                      Continue to Payment
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Payment Information</h2>
                  <div className="flex items-center gap-2 mb-4">
                    <ShieldCheckIcon className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-600">Your payment information is secure</span>
                  </div>
                  <Input
                    placeholder="Card Number"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                    />
                    <Input
                      placeholder="CVV"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(2)}
                      disabled={isProcessing}
                      className="hover:bg-opacity-90 active:scale-95 transition-all"
                    >
                      Back
                    </Button>

                    {/* Stationary Checkout Button with Timeout */}
                    <Button
                      onClick={handleSubmitPayment}
                      disabled={!cardNumber || !expiryDate || !cvv || !buttonEnabled || isProcessing}
                      className="shadow-lg hover:bg-opacity-90 active:scale-95 transition-all"
                      style={{ backgroundColor: '#9333EA', color: '#FFFFFF' }}
                    >
                      <CreditCardIcon className="h-4 w-4 mr-2" />
                      {isProcessing
                        ? "Processing..."
                        : !buttonEnabled
                          ? `Please wait (${buttonTimeRemaining}s)`
                          : checkoutClickCount > 0
                            ? `Complete Order (${checkoutClickCount}/10) - $${orderTotal.toFixed(2)}`
                            : `Complete Order ($${orderTotal.toFixed(2)})`
                      }
                    </Button>
                  </div>

                  {/* Demo Note */}
                  <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      💡 <strong>Demo Note:</strong> The checkout button is disabled for 30-45 seconds (random), then requires 10 clicks to complete the order. This simulates frustrating friction that analytics can help identify!
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="border rounded-lg p-6 sticky top-6" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}>
                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                <div className="space-y-3 mb-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.name} (x{item.quantity})</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <hr className="mb-4" />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount (15%)</span>
                    <span className="text-green-600">-${discount.toFixed(2)}</span>
                  </div>
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
                    <span>${orderTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}