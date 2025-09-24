"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCardIcon, ArrowRightIcon, ArrowLeftIcon } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import mixpanel from "mixpanel-browser";

export default function SignUpPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    financialGoal: "",
    incomeRange: "",
    investmentExperience: "",
    economicOutlook: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {

  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.financialGoal !== "" && formData.incomeRange !== "";
      case 2:
        // THIS IS THE BUG... LOL
        // return false;
        return formData.investmentExperience !== "";
      case 3:
        return formData.email !== "" && formData.password !== "" && formData.confirmPassword !== "";
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (isStepValid()) {
      setStep((prevStep) => prevStep + 1);
    }
  };

  const handlePrevious = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log("Sign up form submitted", formData);

      const formTrackingProps = Object.assign({}, formData);
      formTrackingProps?.password === "*********";
      mixpanel.track("sign up submit", formTrackingProps);
    
  };

  return (
    <div className="text-4xl">
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-3xl space-y-8 px-4 py-8">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">Create an Account</h1>
              <p className="text-gray-500 dark:text-gray-400">Let's get to know you better</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {step === 1 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="financialGoal">What's your primary financial goal? *</Label>
                    <Select
                      name="financialGoal"
                      value={formData.financialGoal}
                      onValueChange={(value) => handleSelectChange("financialGoal", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your goal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="saving">Saving for the future</SelectItem>
                        <SelectItem value="investing">Growing my investments</SelectItem>
                        <SelectItem value="budgeting">Better budgeting</SelectItem>
                        <SelectItem value="debt">Paying off debt</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="incomeRange">What's your annual income range? *</Label>
                    <Select
                      name="incomeRange"
                      value={formData.incomeRange}
                      onValueChange={(value) => handleSelectChange("incomeRange", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select income range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-25k">$0 - $25,000</SelectItem>
                        <SelectItem value="25k-50k">$25,001 - $50,000</SelectItem>
                        <SelectItem value="50k-100k">$50,001 - $100,000</SelectItem>
                        <SelectItem value="100k+">$100,001+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
              {step === 2 && (
                <div className="flex space-x-20 justify-center text-4xl">
                  <div className="space-y-2">
                    <Label>Your investment experience? *</Label>
                    <RadioGroup
                      name="investmentExperience"
                      value={formData.investmentExperience}
                      onValueChange={(value) => handleSelectChange("investmentExperience", value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="beginner" id="beginner" />
                        <Label htmlFor="beginner">🐣 Newb</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="intermediate" id="intermediate" />
                        <Label htmlFor="intermediate">🦈 Pro</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="advanced" id="advanced" />
                        <Label htmlFor="advanced">♟️ Grand Master</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="space-y-2">
                    <Label>Your economic outlook? </Label>
                    <RadioGroup
                      name="economicOutlook"
                      value={formData.economicOutlook}
                      onValueChange={(value) => handleSelectChange("economicOutlook", value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="optimistic" id="optimistic" />
                        <Label htmlFor="optimistic">👍 Optimistic</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="pessimistic" id="pessimistic" />
                        <Label htmlFor="pessimistic">👎 Pessimistic</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="agnostic" id="agnostic" />
                        <Label htmlFor="agnostic">🤭 Agnostic</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              )}
              {step === 3 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      placeholder="m@example.com"
                      required
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      required
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      name="confirmPassword"
                      required
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                    />
                  </div>
                </>
              )}
              <div className="flex justify-between pt-20">
                {step > 1 && (
                  <Button
                    type="button"
					id="previous"
                    onClick={(e) => {
                      handlePrevious();
                    
                    }}
                    variant="outline"                    
                  >
                    <ArrowLeftIcon className="mr-2 h-4 w-4" /> Previous
                  </Button>
                )}
                {step < 3 ? (
                  <Button
                    type="button"
					id="next"
                    onClick={(e) => {
                      handleNext();
                    
                    }}
                    disabled={!isStepValid()}
                    className="ml-auto"
                  >
                    Next <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={!isStepValid()} id="signUp" className="ml-auto">
                    Sign Up
                  </Button>
                )}
              </div>
            </form>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link className="underline" href="/login">
                Log in
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
