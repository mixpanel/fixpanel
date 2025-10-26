"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { initMixpanelOnce, mixpanel } from "@/lib/analytics";
import { XIcon, FlagIcon, QrCodeIcon, DatabaseIcon, CameraIcon, AlertCircleIcon } from "lucide-react";

const experimentId = "i-bank-kyc-flow";
type Variant = "A (QR code)" | "B (data fetch)" | "C (camera access)" | "D (control)";
const fallbackVariant: Variant = "D (control)";

export interface KYCAutoFillModalProps {
  onClose?: () => void;
  onComplete?: () => void;
}

export function KYCAutoFillModal(props: KYCAutoFillModalProps) {
  const { onClose, onComplete } = props;
  const [variant, setVariant] = React.useState<Variant | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);

  React.useEffect(() => {
    initMixpanelOnce();
    mixpanel.flags
      .get_variant_value(experimentId, fallbackVariant)
      .then((returnedVariant: unknown) => {
        let v = returnedVariant as Variant;
        if (!v || typeof v !== "string") v = fallbackVariant;
        console.log("[MIXPANEL]: GOT FLAG (KYC Auto-fill)", v);
        setVariant(v);
      })
      .catch((error: Error) => {
        console.error("[MIXPANEL]: Error fetching flag, using fallback", error);
        setVariant(fallbackVariant);
      });
  }, []);

  const handleProcess = () => {
    if (!variant) return;

    setIsProcessing(true);
    mixpanel.track("KYC Auto-fill Attempted", { variant });

    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      if (variant !== "D (control)") {
        mixpanel.track("KYC Auto-fill Completed", { variant });
        onComplete?.();
      }
    }, 2000);
  };

  const handleClose = () => {
    mixpanel.track("KYC Auto-fill Modal Closed", { variant });
    onClose?.();
  };

  const getContent = () => {
    if (!variant) return null;
    switch (variant) {
      case "A (QR code)":
        return {
          icon: <QrCodeIcon className="h-16 w-16 text-blue-600" />,
          title: "Scan QR Code to Auto-Fill",
          description: "Use your phone to scan this QR code and complete the form on your mobile device. All data will be securely transferred.",
          qrCode: true,
          buttonText: "Generate QR Code",
          color: "blue",
        };
      case "B (data fetch)":
        return {
          icon: <DatabaseIcon className="h-16 w-16 text-purple-600" />,
          title: "Fetch Data from SSN Database",
          description: "Connect to our secure database using your SSN to automatically populate all required fields. This uses bank-grade encryption.",
          ssnInput: true,
          buttonText: "Fetch My Data",
          color: "purple",
        };
      case "C (camera access)":
        return {
          icon: <CameraIcon className="h-16 w-16 text-green-600" />,
          title: "Scan Documents with Camera",
          description: "Use your camera to scan your driver's license, passport, or other ID documents. Our AI will extract all necessary information.",
          cameraPreview: true,
          buttonText: "Enable Camera",
          color: "green",
        };
      case "D (control)":
        return {
          icon: <AlertCircleIcon className="h-16 w-16 text-gray-600" />,
          title: "Auto-Fill Not Available",
          description: "The automatic form filling feature is currently not available. Please complete the KYC form manually using the fields provided.",
          buttonText: "Understood",
          color: "gray",
        };
    }
  };

  const content = getContent();

  // Don't render until we have content
  if (!content) return null;

  // Get the appropriate flag icon color class (Tailwind doesn't support dynamic class names)
  const flagIconClass =
    content.color === "blue" ? "h-5 w-5 text-blue-600" :
    content.color === "purple" ? "h-5 w-5 text-purple-600" :
    content.color === "green" ? "h-5 w-5 text-green-600" :
    "h-5 w-5 text-gray-600";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black opacity-50" onClick={handleClose} />

      {/* Modal */}
      <div className="relative z-10 bg-white rounded-lg shadow-2xl w-11/12 max-w-md p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <FlagIcon className={flagIconClass} />
            <h2 className="text-2xl font-bold text-gray-900">{content.title}</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <XIcon className="h-5 w-5" />
          </Button>
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          {content.icon}
        </div>

        {/* Description */}
        <p className="text-gray-600 text-center mb-6">{content.description}</p>

        {/* Variant-specific content */}
        {content.qrCode && (
          <div className="bg-gray-100 rounded-lg p-8 mb-6 flex justify-center">
            <div className="w-48 h-48 bg-white border-4 border-blue-600 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-2">📱</div>
                <p className="text-xs text-gray-600">QR Code Here</p>
              </div>
            </div>
          </div>
        )}

        {content.ssnInput && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Social Security Number
            </label>
            <input
              type="text"
              placeholder="XXX-XX-XXXX"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              maxLength={11}
            />
          </div>
        )}

        {content.cameraPreview && (
          <div className="bg-gray-900 rounded-lg p-8 mb-6 flex justify-center">
            <div className="w-full h-48 bg-gray-800 flex items-center justify-center border-2 border-green-600">
              <div className="text-center">
                <CameraIcon className="h-12 w-12 text-green-400 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Camera Preview</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <Button
          onClick={variant === "D (control)" ? handleClose : handleProcess}
          disabled={isProcessing}
		  id="auto-fill-action-button"
          className={`w-full bg-${content.color}-600 hover:bg-${content.color}-700 text-white`}
          style={{
            backgroundColor:
              content.color === "blue" ? "#2563eb" :
              content.color === "purple" ? "#9333ea" :
              content.color === "green" ? "#16a34a" :
              "#4b5563"
          }}
        >
          {isProcessing ? "Processing..." : content.buttonText}
        </Button>

        {variant !== "D (control)" && (
          <p className="text-xs text-gray-500 text-center mt-4">
            * This is a demo feature. No actual data will be collected.
          </p>
        )}

        <div className="flex justify-center gap-3 mt-3 text-xs">
          <a
            href="https://mixpanel.com/project/3276012/view/3782804/app/feature-flags/7a8e2371-37ab-4e57-9f34-6f5ea0f9ad9b"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-purple-600 underline transition-colors"
          >
            View Flag
          </a>
          <span className="text-gray-300">•</span>
          <a
            href="https://mixpanel.com/project/3276012/view/3782804/app/experiments/6594af35-5405-41dd-b49f-d84b8a20e444"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-purple-600 underline transition-colors"
          >
            View Experiment
          </a>
        </div>
      </div>
    </div>
  );
}
