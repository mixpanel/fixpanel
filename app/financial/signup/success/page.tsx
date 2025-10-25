"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle2Icon, HomeIcon } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { initMixpanelOnce, mixpanel } from "@/lib/analytics";
import Link from "next/link";

export default function KYCSuccessPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<any>(null);
  const [hasTracked, setHasTracked] = useState(false);

  useEffect(() => {
    initMixpanelOnce();

    // Load the completed KYC data from sessionStorage
    if (typeof window !== 'undefined') {
      const completedData = sessionStorage.getItem('ibank_kyc_completed');
      if (completedData) {
        try {
          const data = JSON.parse(completedData);
          setFormData(data);
          console.log('[KYC SUCCESS]: Loaded completed KYC data');
        } catch (e) {
          console.error('Error loading KYC data:', e);
          // Redirect to signup if no data
          router.push('/financial/signup');
        }
      } else {
        // No completed data - redirect to signup
        console.log('[KYC SUCCESS]: No completed data found, redirecting to signup');
        router.push('/financial/signup');
      }
    }
  }, [router]);

  const handleComplete = () => {
    if (!formData || hasTracked) return;

    // Fire the Complete KYC event with all form data
    mixpanel.track('Complete KYC', {
      citizenship_status: formData.citizenshipStatus,
      employment_status: formData.employmentStatus,
      annual_income: formData.annualIncome,
      source_of_funds: formData.sourceOfFunds,
      investment_experience: formData.investmentExperience,
      risk_tolerance: formData.riskTolerance,
      time_of_day: new Date().getHours(),
    });

    setHasTracked(true);

    // Clear the completed data from sessionStorage
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('ibank_kyc_completed');
      console.log('[KYC SUCCESS]: Cleared completed data after tracking');
    }

    // Redirect to financial home
    setTimeout(() => {
      router.push('/financial');
    }, 500);
  };

  // Helper function to format the display values
  const formatValue = (value: string) => {
    // Convert kebab-case to Title Case
    return value
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Helper function to get full display text
  const getDisplayText = (field: string, value: string) => {
    const displayMap: Record<string, Record<string, string>> = {
      citizenshipStatus: {
        'us-citizen': 'U.S. Citizen',
        'permanent-resident': 'Permanent Resident',
        'visa-holder': 'Visa Holder',
        'international': 'International/Non-resident'
      },
      employmentStatus: {
        'employed-full': 'Employed (Full-time)',
        'employed-part': 'Employed (Part-time)',
        'self-employed': 'Self-employed',
        'retired': 'Retired',
        'student': 'Student',
        'unemployed': 'Unemployed'
      },
      annualIncome: {
        '0-25k': 'Less than $25,000',
        '25k-50k': '$25,000 - $50,000',
        '50k-100k': '$50,000 - $100,000',
        '100k-250k': '$100,000 - $250,000',
        '250k+': 'More than $250,000'
      },
      sourceOfFunds: {
        'employment': 'Employment Income',
        'business': 'Business Income',
        'investments': 'Investment Returns',
        'inheritance': 'Inheritance/Gift',
        'retirement': 'Retirement/Pension',
        'other': 'Other'
      },
      investmentExperience: {
        'none': 'No experience',
        'limited': 'Limited (less than 2 years)',
        'moderate': 'Moderate (2-5 years)',
        'experienced': 'Experienced (5-10 years)',
        'expert': 'Expert (10+ years)'
      },
      riskTolerance: {
        'very-conservative': 'Very Conservative - Preserve capital, minimal risk',
        'conservative': 'Conservative - Low risk, stable returns',
        'moderate': 'Moderate - Balanced risk and reward',
        'aggressive': 'Aggressive - Higher risk for higher returns',
        'very-aggressive': 'Very Aggressive - Maximum risk for maximum returns'
      }
    };

    return displayMap[field]?.[value] || formatValue(value);
  };

  if (!formData) {
    return null; // Loading or redirecting
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-green-50">
        <div className="w-full max-w-3xl space-y-8 px-4 py-12">
          {/* Success Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle2Icon className="h-24 w-24 text-green-500 animate-in zoom-in duration-500" />
            </div>
            <h1 className="text-4xl font-bold text-[#7856FF]">KYC Verification Complete!</h1>
            <p className="text-xl text-gray-600">
              Thank you for completing your verification. Here's a summary of your information:
            </p>
          </div>

          {/* Summary Card */}
          <div className="bg-white rounded-lg shadow-xl p-8 space-y-6">
            {/* Step 1: Identity Verification */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
                Identity Verification
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex justify-between items-start p-4 bg-purple-50 rounded-lg">
                  <span className="font-semibold text-gray-700">Citizenship Status:</span>
                  <span className="text-right text-gray-900">
                    {getDisplayText('citizenshipStatus', formData.citizenshipStatus)}
                  </span>
                </div>
                <div className="flex justify-between items-start p-4 bg-purple-50 rounded-lg">
                  <span className="font-semibold text-gray-700">Employment Status:</span>
                  <span className="text-right text-gray-900">
                    {getDisplayText('employmentStatus', formData.employmentStatus)}
                  </span>
                </div>
              </div>
            </div>

            {/* Step 2: Financial Information */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
                Financial Information
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex justify-between items-start p-4 bg-blue-50 rounded-lg">
                  <span className="font-semibold text-gray-700">Annual Income:</span>
                  <span className="text-right text-gray-900">
                    {getDisplayText('annualIncome', formData.annualIncome)}
                  </span>
                </div>
                <div className="flex justify-between items-start p-4 bg-blue-50 rounded-lg">
                  <span className="font-semibold text-gray-700">Source of Funds:</span>
                  <span className="text-right text-gray-900">
                    {getDisplayText('sourceOfFunds', formData.sourceOfFunds)}
                  </span>
                </div>
              </div>
            </div>

            {/* Step 3: Risk Assessment */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
                Risk Assessment
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex justify-between items-start p-4 bg-green-50 rounded-lg">
                  <span className="font-semibold text-gray-700">Investment Experience:</span>
                  <span className="text-right text-gray-900">
                    {getDisplayText('investmentExperience', formData.investmentExperience)}
                  </span>
                </div>
                <div className="flex justify-between items-start p-4 bg-green-50 rounded-lg">
                  <span className="font-semibold text-gray-700">Risk Tolerance:</span>
                  <span className="text-right text-gray-900">
                    {getDisplayText('riskTolerance', formData.riskTolerance)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t flex gap-4">
              <Button
                onClick={handleComplete}
                disabled={hasTracked}
                className="flex-1 bg-[#07B096] hover:bg-[#07B096]/90 text-white text-lg py-6"
                size="lg"
              >
                {hasTracked ? 'Redirecting...' : 'Continue to iBank'}
              </Button>
              <Link href="/financial" className="flex-1">
                <Button
                  variant="outline"
                  className="w-full text-lg py-6"
                  size="lg"
                >
                  <HomeIcon className="mr-2 h-5 w-5" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>

          <div className="text-center text-sm text-gray-600">
            <p>Your information is secure and encrypted. We'll never share your data without permission.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
