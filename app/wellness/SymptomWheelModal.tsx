"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import mixpanel from "mixpanel-browser";
import { XIcon, FlagIcon, ActivityIcon, RotateCwIcon } from "lucide-react";

const experimentId = "our-heart-wheel-of-symptoms";
type Variant = "fast wheel, many symptoms (A)" | "slow wheel, few symptoms (B)" | "control (C)";
const fallbackVariant: Variant = "control (C)";

// Many symptoms for variant A
const manySymptoms = [
  "Headache", "Fever", "Cough", "Fatigue", "Nausea", "Dizziness",
  "Chest Pain", "Shortness of Breath", "Muscle Aches", "Sore Throat",
  "Runny Nose", "Congestion", "Chills", "Sweating", "Loss of Appetite",
  "Insomnia", "Anxiety", "Depression", "Joint Pain", "Back Pain",
  "Stomach Cramps", "Diarrhea", "Constipation", "Bloating", "Heartburn",
  "Skin Rash", "Itching", "Dry Mouth", "Blurred Vision", "Ear Pain",
];

// Few symptoms for variant B
const fewSymptoms = [
  "Headache", "Fever", "Cough", "Fatigue", "Nausea", "Dizziness",
];

// Medium symptoms for control
const mediumSymptoms = [
  "Headache", "Fever", "Cough", "Fatigue", "Nausea", "Dizziness",
  "Chest Pain", "Shortness of Breath", "Muscle Aches", "Sore Throat",
  "Runny Nose", "Congestion", "Chills", "Sweating", "Loss of Appetite",
];

// Corresponding prognoses
const prognoses: Record<string, string[]> = {
  "Headache": ["Tension headache - try resting in a dark room", "Possible migraine - consider reducing screen time", "Dehydration - drink more water!"],
  "Fever": ["Viral infection - rest and fluids recommended", "Common cold - over-the-counter medication may help", "Flu - monitor temperature and stay hydrated"],
  "Cough": ["Post-nasal drip - try throat lozenges", "Bronchitis - see a doctor if it persists", "Allergies - consider antihistamines"],
  "Fatigue": ["Sleep deprivation - aim for 7-9 hours", "Vitamin D deficiency - get some sunshine", "Chronic fatigue - consult a healthcare provider"],
  "Nausea": ["Food poisoning - stay hydrated", "Motion sickness - try ginger tea", "Anxiety-related - practice deep breathing"],
  "Dizziness": ["Low blood pressure - rise slowly from sitting", "Inner ear problem - consult ENT specialist", "Dehydration - drink fluids"],
  "Chest Pain": ["Muscle strain - rest and ice", "Heartburn - avoid spicy foods", "Serious concern - seek immediate medical attention if severe"],
  "Shortness of Breath": ["Anxiety - try breathing exercises", "Asthma - use prescribed inhaler", "Urgent care needed if sudden or severe"],
  "Muscle Aches": ["Post-workout soreness - gentle stretching helps", "Flu - rest and hydrate", "Fibromyalgia - consult rheumatologist"],
  "Sore Throat": ["Viral pharyngitis - warm tea with honey", "Strep throat - antibiotics needed", "Dry air - use a humidifier"],
  "Runny Nose": ["Common cold - tissue stocks recommended", "Allergies - antihistamine may help", "Sinus infection - warm compress"],
  "Congestion": ["Sinus pressure - steam inhalation", "Allergies - nasal spray", "Cold - decongestant medication"],
  "Chills": ["Fever coming on - monitor temperature", "Cold environment - add layers", "Viral infection - rest up"],
  "Sweating": ["Anxiety - practice relaxation", "Hyperhidrosis - medical evaluation", "Fever breaking - good sign of recovery"],
  "Loss of Appetite": ["Stress - try light meals", "Viral illness - eat when you can", "Depression - seek professional help"],
  "Insomnia": ["Stress - establish bedtime routine", "Too much caffeine - cut back after 2pm", "Sleep disorder - consult sleep specialist"],
  "Anxiety": ["Generalized anxiety - try mindfulness", "Panic attack - breathing exercises", "Therapy recommended for persistent anxiety"],
  "Depression": ["Seasonal depression - light therapy", "Clinical depression - seek professional help", "Exercise may help mood"],
  "Joint Pain": ["Arthritis - anti-inflammatory medication", "Overuse - rest and ice", "Autoimmune condition - see rheumatologist"],
  "Back Pain": ["Muscle strain - heat and rest", "Poor posture - ergonomic assessment", "Disc issue - physical therapy"],
  "Stomach Cramps": ["Gas - try peppermint tea", "Period cramps - heating pad", "Food intolerance - elimination diet"],
  "Diarrhea": ["Food poisoning - stay hydrated", "Virus - will pass in 24-48 hours", "IBS - dietary changes may help"],
  "Constipation": ["Dehydration - drink more water", "Low fiber - add fruits and vegetables", "Medication side effect - talk to doctor"],
  "Bloating": ["Gas - avoid carbonated drinks", "Overeating - smaller meals", "Food intolerance - try keeping food diary"],
  "Heartburn": ["Acid reflux - elevate head while sleeping", "Spicy food - avoid triggers", "GERD - medication may be needed"],
  "Skin Rash": ["Allergic reaction - antihistamine", "Eczema - moisturize frequently", "Contact dermatitis - identify irritant"],
  "Itching": ["Dry skin - use lotion", "Allergies - avoid allergen", "Medication reaction - consult doctor"],
  "Dry Mouth": ["Dehydration - drink water", "Medication side effect - talk to doctor", "Sinus breathing - nasal spray may help"],
  "Blurred Vision": ["Eye strain - take screen breaks", "Need glasses - eye exam recommended", "Urgent if sudden - seek immediate care"],
  "Ear Pain": ["Ear infection - may need antibiotics", "Wax buildup - ear drops", "TMJ - jaw exercises"],
};

export interface SymptomWheelModalProps {
  onClose?: () => void;
}

export function SymptomWheelModal(props: SymptomWheelModalProps) {
  const { onClose } = props;
  const [variant, setVariant] = React.useState<Variant | null>(null);
  const [isSpinning, setIsSpinning] = React.useState(false);
  const [result, setResult] = React.useState<{ symptom: string; prognosis: string } | null>(null);
  const [rotation, setRotation] = React.useState(0);

  React.useEffect(() => {
    mixpanel.flags
      .get_variant_value(experimentId, fallbackVariant)
      .then((returnedVariant: unknown) => {
        let v = returnedVariant as Variant;
        if (!v || typeof v !== "string") v = fallbackVariant;
        console.log("[MIXPANEL]: GOT FLAG (Symptom Wheel)", v);
        setVariant(v);
      });
  }, []);

  const getSymptoms = () => {
    if (!variant) return mediumSymptoms;
    if (variant === "fast wheel, many symptoms (A)") return manySymptoms;
    if (variant === "slow wheel, few symptoms (B)") return fewSymptoms;
    return mediumSymptoms;
  };

  const getSpinDuration = () => {
    if (!variant) return 3000;
    if (variant === "fast wheel, many symptoms (A)") return 1500; // Fast
    if (variant === "slow wheel, few symptoms (B)") return 6000; // Slow
    return 3000; // Medium
  };

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setResult(null);

    const symptoms = getSymptoms();
    const duration = getSpinDuration();
    const rotations = variant === "fast wheel, many symptoms (A)" ? 10 : variant === "slow wheel, few symptoms (B)" ? 3 : 6;
    const finalRotation = rotation + (360 * rotations) + Math.random() * 360;

    setRotation(finalRotation);

    mixpanel.track("Symptom Wheel Spun", {
      variant,
      duration_ms: duration,
      rotations,
    });

    setTimeout(() => {
      const randomSymptom = symptoms[Math.floor(Math.random() * symptoms.length)];
      const prognoses = prognoses[randomSymptom] || ["Consult a healthcare professional"];
      const randomPrognosis = prognoses[Math.floor(Math.random() * prognoses.length)];

      setResult({ symptom: randomSymptom, prognosis: randomPrognosis });
      setIsSpinning(false);

      mixpanel.track("Symptom Wheel Result", {
        variant,
        symptom: randomSymptom,
        prognosis: randomPrognosis,
      });
    }, duration);
  };

  const handleClose = () => {
    mixpanel.track("Symptom Wheel Closed", { variant, spun: result !== null });
    onClose?.();
  };

  if (!variant) return null;

  const symptoms = getSymptoms();
  const segmentAngle = 360 / symptoms.length;
  const duration = getSpinDuration();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black opacity-60" onClick={handleClose} />

      {/* Modal */}
      <div className="relative z-10 bg-white rounded-lg shadow-2xl w-11/12 max-w-2xl p-6 border-2 border-teal-600">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <FlagIcon className="h-5 w-5 text-teal-600" />
            <ActivityIcon className="h-5 w-5 text-teal-600" />
            <h2 className="text-2xl font-bold text-slate-900">Wheel of Symptoms</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <XIcon className="h-5 w-5" />
          </Button>
        </div>

        <p className="text-slate-600 mb-6 text-center">
          {variant === "fast wheel, many symptoms (A)" && "🚀 Fast spin with 30 possible symptoms!"}
          {variant === "slow wheel, few symptoms (B)" && "🐌 Slow and deliberate with 6 core symptoms"}
          {variant === "control (C)" && "⚡ Medium speed with 15 common symptoms"}
        </p>

        {/* Wheel Container */}
        <div className="flex justify-center mb-6">
          <div className="relative w-80 h-80">
            {/* Pointer */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20">
              <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[25px] border-t-red-600"></div>
            </div>

            {/* Wheel */}
            <div
              className="w-full h-full rounded-full border-8 border-teal-600 overflow-hidden relative bg-white shadow-lg"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: isSpinning ? `transform ${duration}ms cubic-bezier(0.25, 0.1, 0.25, 1)` : 'none',
              }}
            >
              {symptoms.map((symptom, index) => {
                const angle = segmentAngle * index;
                const hue = (360 / symptoms.length) * index;

                return (
                  <div
                    key={index}
                    className="absolute w-full h-full"
                    style={{
                      transform: `rotate(${angle}deg)`,
                      transformOrigin: 'center',
                    }}
                  >
                    <div
                      className="absolute left-1/2 top-0 w-full h-1/2 origin-bottom"
                      style={{
                        background: `hsl(${hue}, 70%, 60%)`,
                        clipPath: `polygon(50% 0%, ${50 + 50 * Math.tan((segmentAngle * Math.PI) / 360)}% 100%, ${50 - 50 * Math.tan((segmentAngle * Math.PI) / 360)}% 100%)`,
                      }}
                    >
                      <div
                        className="absolute top-4 left-1/2 -translate-x-1/2 text-xs font-semibold text-white text-center whitespace-nowrap"
                        style={{
                          transform: 'rotate(0deg)',
                        }}
                      >
                        {symptom.length > 12 ? symptom.substring(0, 12) + '...' : symptom}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Center Circle */}
              <div className="absolute inset-0 m-auto w-24 h-24 rounded-full bg-white border-4 border-teal-600 flex items-center justify-center">
                <RotateCwIcon className={`h-8 w-8 text-teal-600 ${isSpinning ? 'animate-spin' : ''}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Result Display */}
        {result && !isSpinning && (
          <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border-2 border-teal-600 rounded-lg p-6 mb-4 animate-fade-in">
            <h3 className="text-xl font-bold text-teal-900 mb-2">
              Your Symptom: {result.symptom}
            </h3>
            <p className="text-slate-700">
              <strong>Prognosis:</strong> {result.prognosis}
            </p>
            <p className="text-xs text-slate-500 mt-3 italic">
              * This is for entertainment purposes only. Please consult a real healthcare professional.
            </p>
          </div>
        )}

        {/* Spin Button */}
        <Button
          onClick={handleSpin}
          disabled={isSpinning}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold text-lg py-6"
        >
          {isSpinning ? (
            <>
              <RotateCwIcon className="mr-2 h-5 w-5 animate-spin" />
              Spinning...
            </>
          ) : result ? (
            <>
              <RotateCwIcon className="mr-2 h-5 w-5" />
              Spin Again
            </>
          ) : (
            <>
              <RotateCwIcon className="mr-2 h-5 w-5" />
              Spin the Wheel
            </>
          )}
        </Button>

        <a
          href="https://mixpanel.com/project/3276012/view/3782804/app/feature-flags/293d35aa-b171-41a9-b64e-1dfb7d4eb6b6"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-slate-400 hover:text-teal-600 mt-3 block text-center transition-colors"
        >
          ⚙️ View flag in Mixpanel
        </a>
      </div>
    </div>
  );
}
