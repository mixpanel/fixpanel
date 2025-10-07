"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import mixpanel from "mixpanel-browser";
import fooImage from "../images/foo.png";
import barImage from "../images/bar.png";
import bazImage from "../images/baz.png";

interface ContentProps {
  headline?: string;
  tagline?: string;
  copy?: string;
  color?: string;
  bgColor?: string;
  copyColor?: string;
  cancelText?: string;
  confirmText?: string;
  imgUrl?: string;
}

export interface FlagsModalProps extends Partial<ContentProps> {
  onClose?: () => void;
  onConfirm?: () => void;
}

const experimentId = "exp_customerStory"; //? https://bit.ly/43siFeM (Mixpanel Flag Key!)
type Variant = "no story (D)" | "sarah story (A)" | "marco portfolio (B)" | "priya debt (C)" ; // ? mixpanel flag values
const fallbackVariant: Variant = "no story (D)";

const getModalData = (v?: Variant): ContentProps => {
  switch (v) {
    case "sarah story (A)":
      return {
        headline: "iBank Supercharged My Savings!",
        tagline: "— Sarah L., Small Business Owner [Variant A]",
        copy: "Thanks to iBank's automated insights…",
        color: "#1C782D",
        bgColor: "#E6F9F0",
        copyColor: "#0F2D13",
        cancelText: "Not Now",
        confirmText: "Read Sarah's Story",
        imgUrl: fooImage.src,
      };
    case "marco portfolio (B)":
      return {
        headline: "Investment ROI: 3× in 90 Days",
        tagline: "— Marco P., Freelance Designer [Variant B]",
        copy: "I was skeptical, but iBank's data-driven portfolio…",
        color: "#7856FF",
        bgColor: "#F3E8FF",
        copyColor: "#2E004E",
        cancelText: "Maybe Later",
        confirmText: "See Marco's Portfolio",
        imgUrl: barImage.src,
      };
    case "priya debt (C)":
      return {
        headline: 'Zero Debt in 6 Months',
        tagline: "— Priya S., Marketing Manager [Variant C]",
        copy: "With iBank's budgeting wizard, I paid off $23K…",
        color: "#CC332B",
        bgColor: "#FFEFEF",
        copyColor: "#3C0F0A",
        cancelText: "Decline",
        confirmText: "Learn Priya's Plan",
        imgUrl: bazImage.src,
      };
    case "no story (D)":
      return {
        headline: 'Join Thousands of Success Stories',
        tagline: "— Our Community [Variant D]",
        copy: 'From debt payoff to wealth building…',
        color: "#07B096",
        bgColor: "#E8FBF7",
        copyColor: "#00332E",
        cancelText: "Dismiss",
        confirmText: "Explore Testimonials",
      };
    default:
      // empty until we've fetched
      return {};
  }
};

export function FlagsModal(props: FlagsModalProps) {
  const { onClose, onConfirm, ...overrides } = props;
  const router = useRouter();
  // if user didn't supply onConfirm, navigate to /financial/testimonials
  const handleConfirm = onConfirm ?? (() => router.push("/financial/testimonials"));

  // start empty
  const [modalData, setModalData] = React.useState<ContentProps>(() => getModalData());

  React.useEffect(() => {
    mixpanel.flags
      .get_variant_value(experimentId, fallbackVariant) // ! look for a feature flag for the experiment + user
      .then((returnedVariant: unknown) => {
        let variant = returnedVariant as Variant;
        if (!variant || typeof variant !== "string") variant = "no story (D)";
        console.log("[MIXPANEL]: GOT FLAG", variant);
        if (variant) setModalData(getModalData(variant)); // ! use the variant to the app
      });
  }, []);

  // have we loaded anything yet?
  const isLoaded = Object.keys(modalData).length > 1;

  // props override flag data
  const { headline, tagline, copy, color, bgColor, copyColor, cancelText, confirmText, imgUrl } = {
    ...modalData,
    ...overrides,
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        opacity: isLoaded ? 1 : 0,
        transition: "opacity 2s ease-in-out",
      }}
    >
      {/* backdrop */}
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose} />

      {/* panel: always in the DOM, but opacity goes 0→1 when loaded */}
      <div
        className="rounded-lg shadow-xl z-10 w-11/12 max-w-md p-6"
        style={{
          borderTop: `4px solid ${color}`,
          backgroundColor: bgColor,
          color: copyColor,
        }}
      >
        {/* only show children once we have data */}
        {isLoaded && (
          <div>
            <h2 className="text-2xl font-bold mb-2">{headline}</h2>
            {tagline && <h3 className="text-lg font-semibold mb-4">{tagline}</h3>}
            {imgUrl && <img src={imgUrl} alt="" className="mb-4 w-auto max-h-24 object-cover rounded mx-auto" />}
            {copy && <p className="text-base mb-6">{copy}</p>}
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={onClose}>
                {cancelText}
              </Button>
              <Button onClick={handleConfirm}>{confirmText}</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
