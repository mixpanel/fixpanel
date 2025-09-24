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

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

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
              <Button className="bg-[#07B096] hover:bg-[#07B096]/90">
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
            <Link href="/checkout/cart" className="flex items-center text-[#07B096] hover:underline">
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Cart
            </Link>
          </div>

          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 1 ? 'bg-[#07B096] text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <div className="w-12 h-1 bg-gray-200">
                <div className={`h-full bg-[#07B096] transition-all ${currentStep >= 2 ? 'w-full' : 'w-0'}`}></div>
              </div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 2 ? 'bg-[#07B096] text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <div className="w-12 h-1 bg-gray-200">
                <div className={`h-full bg-[#07B096] transition-all ${currentStep >= 3 ? 'w-full' : 'w-0'}`}></div>
              </div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 3 ? 'bg-[#07B096] text-white' : 'bg-gray-200'}`}>
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
                    className="bg-[#07B096] hover:bg-[#07B096]/90"
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
                    >
                      Back
                    </Button>
                    <Button
                      onClick={() => setCurrentStep(3)}
                      disabled={!address || !city || !zipCode}
                      className="bg-[#07B096] hover:bg-[#07B096]/90"
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
                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(2)}
                      disabled={isProcessing}
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleSubmitPayment}
                      disabled={!cardNumber || !expiryDate || !cvv || isProcessing}
                      className="bg-[#07B096] hover:bg-[#07B096]/90"
                    >
                      <CreditCardIcon className="h-4 w-4 mr-2" />
                      {isProcessing ? "Processing..." : `Complete Order ($${orderTotal.toFixed(2)})`}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="border rounded-lg p-6 sticky top-6">
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