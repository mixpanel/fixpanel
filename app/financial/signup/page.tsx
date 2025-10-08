"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowRightIcon, ArrowLeftIcon, Wand2Icon, FlagIcon } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { KYCAutoFillModal } from "../KYCAutoFillModal";
import { initMixpanelOnce, mixpanel } from "@/lib/analytics";

export default function SignUpPage() {
  const [step, setStep] = useState(1);
  const [showAutoFillModal, setShowAutoFillModal] = useState(false);

  useEffect(() => {
    initMixpanelOnce();
  }, []);

  const [formData, setFormData] = useState({
    // Page 1: Identity Verification
    citizenshipStatus: "",
    employmentStatus: "",

    // Page 2: Financial Information
    annualIncome: "",
    sourceOfFunds: "",

    // Page 3: Risk Assessment
    investmentExperience: "",
    riskTolerance: "",
  });

  // 20% success rate for radio button clicks (only on step 3)
  const handleRadioClick = (name: string, value: string) => {
    // Only apply the faulty behavior on step 3
    if (step === 3) {
      const successRate = 0.2; // 20% success rate
      const random = Math.random();

      if (random < successRate) {
        // Success! Update the form
        setFormData((prevData) => ({ ...prevData, [name]: value }));
      }
      // Otherwise, do nothing (80% of the time)
    } else {
      // Steps 1 and 2 work normally
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.citizenshipStatus !== "" && formData.employmentStatus !== "";
      case 2:
        return formData.annualIncome !== "" && formData.sourceOfFunds !== "";
      case 3:
        return formData.investmentExperience !== "" && formData.riskTolerance !== "";
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (isStepValid()) {
      mixpanel.track("KYC Next Button Clicked", { step, ...formData });
      setStep((prevStep) => prevStep + 1);
    }
  };

  const handlePrevious = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mixpanel.track("KYC Form Submitted", formData);
    console.log("KYC form submitted", formData);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-3xl space-y-8 px-4 py-12">
          <div className="space-y-2 text-center">
            <h1 className="text-4xl font-bold text-[#7856FF]">Know Your Customer</h1>
            <p className="text-xl text-gray-600">Step {step} of 3 - Complete your verification</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Auto-Fill Button */}
            <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <FlagIcon className="h-4 w-4 text-purple-600" />
                    <h3 className="font-semibold text-gray-900">Auto-Fill KYC Details</h3>
                  </div>
                  <p className="text-sm text-gray-600">Save time by automatically filling out your information</p>
                </div>
                <Button
                  type="button"
                  onClick={() => setShowAutoFillModal(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Wand2Icon className="mr-2 h-4 w-4" />
                  Auto-Fill
                </Button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {step === 1 && (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <Label className="text-2xl font-semibold text-gray-800">
                      What is your citizenship status? *
                    </Label>
                    <RadioGroup
                      name="citizenshipStatus"
                      value={formData.citizenshipStatus}
                      onValueChange={(value) => handleRadioClick("citizenshipStatus", value)}
                    >
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value="us-citizen" id="us-citizen" />
                        <Label htmlFor="us-citizen" className="text-xl cursor-pointer flex-1">
                          U.S. Citizen
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value="permanent-resident" id="permanent-resident" />
                        <Label htmlFor="permanent-resident" className="text-xl cursor-pointer flex-1">
                          Permanent Resident
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value="visa-holder" id="visa-holder" />
                        <Label htmlFor="visa-holder" className="text-xl cursor-pointer flex-1">
                          Visa Holder
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value="international" id="international" />
                        <Label htmlFor="international" className="text-xl cursor-pointer flex-1">
                          International/Non-resident
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-2xl font-semibold text-gray-800">
                      What is your current employment status? *
                    </Label>
                    <RadioGroup
                      name="employmentStatus"
                      value={formData.employmentStatus}
                      onValueChange={(value) => handleRadioClick("employmentStatus", value)}
                    >
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value="employed-full" id="employed-full" />
                        <Label htmlFor="employed-full" className="text-xl cursor-pointer flex-1">
                          Employed (Full-time)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value="employed-part" id="employed-part" />
                        <Label htmlFor="employed-part" className="text-xl cursor-pointer flex-1">
                          Employed (Part-time)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value="self-employed" id="self-employed" />
                        <Label htmlFor="self-employed" className="text-xl cursor-pointer flex-1">
                          Self-employed
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value="retired" id="retired" />
                        <Label htmlFor="retired" className="text-xl cursor-pointer flex-1">
                          Retired
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value="student" id="student" />
                        <Label htmlFor="student" className="text-xl cursor-pointer flex-1">
                          Student
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value="unemployed" id="unemployed" />
                        <Label htmlFor="unemployed" className="text-xl cursor-pointer flex-1">
                          Unemployed
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <Label className="text-2xl font-semibold text-gray-800">
                      What is your annual income? *
                    </Label>
                    <RadioGroup
                      name="annualIncome"
                      value={formData.annualIncome}
                      onValueChange={(value) => handleRadioClick("annualIncome", value)}
                    >
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value="0-25k" id="0-25k" />
                        <Label htmlFor="0-25k" className="text-xl cursor-pointer flex-1">
                          Less than $25,000
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value="25k-50k" id="25k-50k" />
                        <Label htmlFor="25k-50k" className="text-xl cursor-pointer flex-1">
                          $25,000 - $50,000
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value="50k-100k" id="50k-100k" />
                        <Label htmlFor="50k-100k" className="text-xl cursor-pointer flex-1">
                          $50,000 - $100,000
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value="100k-250k" id="100k-250k" />
                        <Label htmlFor="100k-250k" className="text-xl cursor-pointer flex-1">
                          $100,000 - $250,000
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value="250k+" id="250k+" />
                        <Label htmlFor="250k+" className="text-xl cursor-pointer flex-1">
                          More than $250,000
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-2xl font-semibold text-gray-800">
                      What is your primary source of funds? *
                    </Label>
                    <RadioGroup
                      name="sourceOfFunds"
                      value={formData.sourceOfFunds}
                      onValueChange={(value) => handleRadioClick("sourceOfFunds", value)}
                    >
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value="employment" id="employment" />
                        <Label htmlFor="employment" className="text-xl cursor-pointer flex-1">
                          Employment Income
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value="business" id="business" />
                        <Label htmlFor="business" className="text-xl cursor-pointer flex-1">
                          Business Income
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value="investments" id="investments" />
                        <Label htmlFor="investments" className="text-xl cursor-pointer flex-1">
                          Investment Returns
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value="inheritance" id="inheritance" />
                        <Label htmlFor="inheritance" className="text-xl cursor-pointer flex-1">
                          Inheritance/Gift
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value="retirement" id="retirement" />
                        <Label htmlFor="retirement" className="text-xl cursor-pointer flex-1">
                          Retirement/Pension
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value="other" id="other" />
                        <Label htmlFor="other" className="text-xl cursor-pointer flex-1">
                          Other
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <Label className="text-2xl font-semibold text-gray-800">
                      What is your investment experience level? *
                    </Label>
                    <RadioGroup
                      name="investmentExperience"
                      value={formData.investmentExperience}
                      onValueChange={(value) => handleRadioClick("investmentExperience", value)}
                    >
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value="none" id="none" />
                        <Label htmlFor="none" className="text-xl cursor-pointer flex-1">
                          No experience
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value="limited" id="limited" />
                        <Label htmlFor="limited" className="text-xl cursor-pointer flex-1">
                          Limited (less than 2 years)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value="moderate" id="moderate" />
                        <Label htmlFor="moderate" className="text-xl cursor-pointer flex-1">
                          Moderate (2-5 years)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value="experienced" id="experienced" />
                        <Label htmlFor="experienced" className="text-xl cursor-pointer flex-1">
                          Experienced (5-10 years)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value="expert" id="expert" />
                        <Label htmlFor="expert" className="text-xl cursor-pointer flex-1">
                          Expert (10+ years)
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-2xl font-semibold text-gray-800">
                      What is your risk tolerance? *
                    </Label>
                    <RadioGroup
                      name="riskTolerance"
                      value={formData.riskTolerance}
                      onValueChange={(value) => handleRadioClick("riskTolerance", value)}
                    >
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value="very-conservative" id="very-conservative" />
                        <Label htmlFor="very-conservative" className="text-xl cursor-pointer flex-1">
                          Very Conservative - Preserve capital, minimal risk
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value="conservative" id="conservative" />
                        <Label htmlFor="conservative" className="text-xl cursor-pointer flex-1">
                          Conservative - Low risk, stable returns
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value="moderate" id="moderate-risk" />
                        <Label htmlFor="moderate-risk" className="text-xl cursor-pointer flex-1">
                          Moderate - Balanced risk and reward
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value="aggressive" id="aggressive" />
                        <Label htmlFor="aggressive" className="text-xl cursor-pointer flex-1">
                          Aggressive - Higher risk for higher returns
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value="very-aggressive" id="very-aggressive" />
                        <Label htmlFor="very-aggressive" className="text-xl cursor-pointer flex-1">
                          Very Aggressive - Maximum risk for maximum returns
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-8 border-t">
                {step > 1 && (
                  <Button
                    type="button"
                    id="previous"
                    onClick={handlePrevious}
                    variant="outline"
                    size="lg"
                  >
                    <ArrowLeftIcon className="mr-2 h-4 w-4" /> Previous
                  </Button>
                )}
                {step < 3 ? (
                  <Button
                    type="button"
                    id="next"
                    onClick={handleNext}
                    disabled={!isStepValid()}
                    className="ml-auto bg-[#7856FF] hover:bg-[#7856FF]/90"
                    size="lg"
                  >
                    Next <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={!isStepValid()}
                    id="getStarted"
                    className="ml-auto bg-[#07B096] hover:bg-[#07B096]/90"
                    size="lg"
                  >
                    Complete KYC
                  </Button>
                )}
              </div>
            </form>
          </div>

          <div className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link className="underline text-[#7856FF] hover:text-[#7856FF]/80" href="/financial/login">
              Log in
            </Link>
          </div>
        </div>
      </main>
      <Footer />

      {/* KYC Auto-Fill Modal */}
      {showAutoFillModal && (
        <KYCAutoFillModal
          onClose={() => setShowAutoFillModal(false)}
          onComplete={() => {
            setShowAutoFillModal(false);
            // Could auto-fill form here
          }}
        />
      )}
    </div>
  );
}
