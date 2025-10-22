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
import { useColorScheme } from "../ColorSchemeProvider";

export default function CheckoutPage() {
  const { colors } = useColorScheme();

  // Debug: log colors when they change
  useEffect(() => {
    console.log("[PAYMENT PAGE]: Received colors", colors);
  }, [colors]);

  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  // State for moving checkout button
  const [checkoutButtonVisible, setCheckoutButtonVisible] = useState(true);
  const [buttonPosition, setButtonPosition] = useState(0); // 0 = default, 1-4 = alternate positions

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

  // Mock order data
  const orderTotal = 387.97;
  const orderItems = [
    { name: "Wireless Headphones", price: 99.99, quantity: 1 },
    { name: "Smart Watch", price: 249.99, quantity: 1 }
  ];

  // Track page views for each step
  useEffect(() => {
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track('View Checkout', {
        step: currentStep,
        order_value: orderTotal
      });
    }
  }, [currentStep]);

  // THE MOVING CHECKOUT BUTTON! 🐛
  // Button disappears and reappears in a new location every 5 seconds (only on step 3)
  useEffect(() => {
    if (currentStep !== 3 || isProcessing || orderComplete) return;

    const interval = setInterval(() => {
      // Hide button
      setCheckoutButtonVisible(false);

      // Track button disappearance
      if (typeof window !== 'undefined' && window.mixpanel) {
        // window.mixpanel.track('Checkout Button Disappeared', {
        //   order_value: orderTotal,
        //   previous_position: buttonPosition
        // });
      }

      // After 500ms, show in new position
      setTimeout(() => {
        const newPosition = Math.floor(Math.random() *85); // 0-4 random positions
        setButtonPosition(newPosition);
        setCheckoutButtonVisible(true);

        // Track button reappearance
        if (typeof window !== 'undefined' && window.mixpanel) {
        //   window.mixpanel.track('Checkout Button Appeared', {
        //     order_value: orderTotal,
        //     new_position: newPosition
        //   });
        }
      }, 500);
    }, 2500); // Every 2.5 seconds

    return () => clearInterval(interval);
  }, [currentStep, isProcessing, orderComplete, buttonPosition]);

  const handleSubmitPayment = () => {
    setIsProcessing(true);

    // Track checkout attempt
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track('Checkout Attempted', {
        order_value: orderTotal,
        payment_method: 'credit_card'
      });
    }

    // Simulate payment processing
    setTimeout(() => {
      setOrderComplete(true);
      setIsProcessing(false);

      // Track successful purchase
      if (typeof window !== 'undefined' && window.mixpanel) {
        window.mixpanel.track('Purchase Completed', {
          order_value: orderTotal,
          order_id: `ORD-${Date.now()}`,
          items: orderItems.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity
          }))
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
                {orderItems.map((item, index) => (
                  <div key={index} className="flex justify-between">
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
                style={{ backgroundColor: colors.buttonBg, color: colors.buttonText }}
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
            <Link href="/checkout/cart" className="flex items-center hover:underline" style={{ color: colors.primary }}>
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Cart
            </Link>
          </div>

          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 1 ? '' : 'bg-gray-200'}`} style={currentStep >= 1 ? { backgroundColor: colors.buttonBg, color: colors.buttonText } : {}}>
                1
              </div>
              <div className="w-12 h-1 bg-gray-200">
                <div className="h-full transition-all" style={{ backgroundColor: colors.buttonBg, width: currentStep >= 2 ? '100%' : '0' }}></div>
              </div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 2 ? '' : 'bg-gray-200'}`} style={currentStep >= 2 ? { backgroundColor: colors.buttonBg, color: colors.buttonText } : {}}>
                2
              </div>
              <div className="w-12 h-1 bg-gray-200">
                <div className="h-full transition-all" style={{ backgroundColor: colors.buttonBg, width: currentStep >= 3 ? '100%' : '0' }}></div>
              </div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 3 ? '' : 'bg-gray-200'}`} style={currentStep >= 3 ? { backgroundColor: colors.buttonBg, color: colors.buttonText } : {}}>
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
                    style={{ backgroundColor: colors.buttonBg, color: colors.buttonText }}
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
                      style={{ backgroundColor: colors.buttonBg, color: colors.buttonText }}
                      className="hover:bg-opacity-90 active:scale-95 transition-all"
                    >
                      Continue to Payment
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <div className="space-y-6 relative min-h-[500px]">
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

                  {/* Back Button - Always visible */}
                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(2)}
                      disabled={isProcessing}
                      className="hover:bg-opacity-90 active:scale-95 transition-all"
                    >
                      Back
                    </Button>
                  </div>

                  {/* Moving Checkout Button - Appears in different positions */}
                  {checkoutButtonVisible && (
                    <div
                      className={`absolute transition-all duration-300 ${
                        buttonPosition === 0 ? 'top-64 left-0' : ''
                      } ${
                        buttonPosition === 1 ? 'top-64 right-0' : ''
                      } ${
                        buttonPosition === 2 ? 'top-96 left-1/4' : ''
                      } ${
                        buttonPosition === 3 ? 'top-96 right-1/4' : ''
                      } ${
                        buttonPosition === 4 ? 'top-80 left-1/2 -translate-x-1/2' : ''
                      }`}
                      style={{
                        opacity: checkoutButtonVisible ? 1 : 0,
                        transform: checkoutButtonVisible ? 'scale(1)' : 'scale(0.8)'
                      }}
                    >
                      <Button
                        onClick={handleSubmitPayment}
                        disabled={!cardNumber || !expiryDate || !cvv || isProcessing}
                        className="shadow-lg hover:bg-opacity-90 active:scale-95 transition-all"
                        style={{ backgroundColor: colors.buttonBg, color: colors.buttonText }}
                      >
                        <CreditCardIcon className="h-4 w-4 mr-2" />
                        {isProcessing ? "Processing..." : `Complete Order ($${orderTotal.toFixed(2)})`}
                      </Button>
                    </div>
                  )}

                  {/* Demo Note */}
                  <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      💡 <strong>Demo Note:</strong> The checkout button disappears and reappears in a random location every 5 seconds to simulate a frustrating UX bug that analytics can help identify!
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="border rounded-lg p-6 sticky top-6" style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}>
                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                <div className="space-y-3 mb-4">
                  {orderItems.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.name} (x{item.quantity})</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <hr className="mb-4" />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>$349.98</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount (15%)</span>
                    <span className="text-green-600">-$52.50</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>$23.80</span>
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