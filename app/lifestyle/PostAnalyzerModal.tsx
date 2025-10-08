"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import mixpanel from "mixpanel-browser";
import { XIcon, FlagIcon, BrainIcon, SparklesIcon, BookOpenIcon } from "lucide-react";

const experimentId = "we-read-post-analyzer";
type Variant = "present day engine (A)" | "historical engine (B)" | "control (C)";
const fallbackVariant: Variant = "control (C)";

// Present Day Engine - finds modern biases, thinks everything is AI
const presentDayFindings = [
  { bias: "Silicon Valley Techno-Optimism", confidence: 94, aiProbability: 97 },
  { bias: "Late-Stage Capitalist Anxiety", confidence: 89, aiProbability: 95 },
  { bias: "Social Media Echo Chamber Effects", confidence: 92, aiProbability: 98 },
  { bias: "Gen Z Digital Native Perspective", confidence: 87, aiProbability: 93 },
  { bias: "Algorithmic Thinking Patterns", confidence: 91, aiProbability: 99 },
  { bias: "Millennial Burnout Culture", confidence: 86, aiProbability: 94 },
  { bias: "Climate Anxiety Undertones", confidence: 88, aiProbability: 96 },
  { bias: "Tech Bro Meritocracy Myth", confidence: 93, aiProbability: 97 },
  { bias: "Hustle Culture Glorification", confidence: 90, aiProbability: 95 },
  { bias: "Platform Capitalism Dependency", confidence: 85, aiProbability: 92 },
  { bias: "Surveillance Capitalism Normalization", confidence: 89, aiProbability: 98 },
  { bias: "Attention Economy Exploitation", confidence: 91, aiProbability: 96 },
  { bias: "Growth Mindset Dogma", confidence: 87, aiProbability: 94 },
  { bias: "Startup Culture Toxic Positivity", confidence: 88, aiProbability: 93 },
  { bias: "Remote Work Digital Nomad Ideology", confidence: 84, aiProbability: 91 },
];

// Historical Engine - references classical philosophy, thinks nothing is AI
const historicalFindings = [
  { influence: "Socratic Method of Inquiry", period: "Ancient Greece (470-399 BCE)", aiProbability: 12 },
  { influence: "Stoic Philosophy of Marcus Aurelius", period: "Roman Empire (121-180 CE)", aiProbability: 8 },
  { influence: "Cartesian Dualism", period: "Enlightenment (1596-1650)", aiProbability: 15 },
  { influence: "Kantian Categorical Imperative", period: "18th Century (1724-1804)", aiProbability: 11 },
  { influence: "Hegelian Dialectic", period: "German Idealism (1770-1831)", aiProbability: 9 },
  { influence: "Nietzschean Will to Power", period: "Late 19th Century (1844-1900)", aiProbability: 7 },
  { influence: "Kierkegaardian Leap of Faith", period: "Existentialist Roots (1813-1855)", aiProbability: 10 },
  { influence: "Utilitarian Calculus of Bentham", period: "British Empiricism (1748-1832)", aiProbability: 13 },
  { influence: "Rousseauian Social Contract", period: "Age of Enlightenment (1712-1778)", aiProbability: 14 },
  { influence: "Platonic Forms and Ideals", period: "Classical Philosophy (428-348 BCE)", aiProbability: 6 },
  { influence: "Aristotelian Virtue Ethics", period: "Ancient Greece (384-322 BCE)", aiProbability: 8 },
  { influence: "Confucian Social Harmony", period: "Ancient China (551-479 BCE)", aiProbability: 11 },
  { influence: "Buddhist Middle Way", period: "Ancient India (5th Century BCE)", aiProbability: 9 },
  { influence: "Spinozan Determinism", period: "Dutch Golden Age (1632-1677)", aiProbability: 12 },
  { influence: "Humean Skepticism", period: "Scottish Enlightenment (1711-1776)", aiProbability: 10 },
];

// Control Engine - never sure about anything
const controlFindings = [
  "Unable to determine primary bias orientation",
  "Insufficient data for confident analysis",
  "Results inconclusive, multiple interpretations possible",
  "Cannot establish clear ideological framework",
  "Analysis incomplete, more context needed",
  "Uncertain philosophical underpinnings detected",
  "Ambiguous rhetorical patterns observed",
  "Indeterminate argumentative structure",
  "Unclear epistemological foundation",
  "Mixed signals prevent definitive assessment",
];

export interface PostAnalyzerModalProps {
  onClose?: () => void;
}

export function PostAnalyzerModal(props: PostAnalyzerModalProps) {
  const { onClose } = props;
  const [variant, setVariant] = React.useState<Variant | null>(null);
  const [selectedPostId, setSelectedPostId] = React.useState("");
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [results, setResults] = React.useState<any>(null);

  React.useEffect(() => {
    mixpanel.flags
      .get_variant_value(experimentId, fallbackVariant)
      .then((returnedVariant: unknown) => {
        let v = returnedVariant as Variant;
        if (!v || typeof v !== "string") v = fallbackVariant;
        console.log("[MIXPANEL]: GOT FLAG (Post Analyzer)", v);
        setVariant(v);
      });
  }, []);

  const handleAnalyze = () => {
    if (!selectedPostId || !variant) return;

    setIsAnalyzing(true);
    mixpanel.track("Post Analysis Started", { variant, post_id: selectedPostId });

    // Simulate analysis
    setTimeout(() => {
      let analysisResults;

      if (variant === "present day engine (A)") {
        const randomFindings = [...presentDayFindings]
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        const avgAI = randomFindings.reduce((sum, f) => sum + f.aiProbability, 0) / randomFindings.length;

        analysisResults = {
          type: "modern",
          findings: randomFindings,
          aiGenerated: avgAI > 90 ? "HIGHLY LIKELY" : "LIKELY",
          aiProbability: Math.round(avgAI),
        };
      } else if (variant === "historical engine (B)") {
        const randomInfluences = [...historicalFindings]
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        const avgAI = randomInfluences.reduce((sum, f) => sum + f.aiProbability, 0) / randomInfluences.length;

        analysisResults = {
          type: "historical",
          influences: randomInfluences,
          aiGenerated: avgAI < 15 ? "UNLIKELY" : "POSSIBLY",
          aiProbability: Math.round(avgAI),
        };
      } else {
        const randomMessages = [...controlFindings]
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);

        analysisResults = {
          type: "control",
          messages: randomMessages,
          aiGenerated: "UNCERTAIN",
          aiProbability: 50,
        };
      }

      setResults(analysisResults);
      setIsAnalyzing(false);
      mixpanel.track("Post Analysis Completed", {
        variant,
        post_id: selectedPostId,
        ai_probability: analysisResults.aiProbability,
      });
    }, 2000);
  };

  const handleClose = () => {
    mixpanel.track("Post Analyzer Modal Closed", { variant, analyzed: !!results });
    onClose?.();
  };

  if (!variant) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black opacity-70" onClick={handleClose} />

      {/* Modal */}
      <div className="relative z-10 bg-zinc-800 border-2 border-amber-600 rounded-lg shadow-2xl w-11/12 max-w-2xl p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <FlagIcon className="h-5 w-5 text-amber-500" />
            <BrainIcon className="h-5 w-5 text-amber-500" />
            <h2 className="text-2xl font-bold text-amber-400">Post Analyzer</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={handleClose} className="text-zinc-400 hover:text-zinc-200">
            <XIcon className="h-5 w-5" />
          </Button>
        </div>

        <p className="text-zinc-300 mb-6">
          {variant === "present day engine (A)" && "Using modern cultural analysis engine to detect contemporary biases and AI-generated content."}
          {variant === "historical engine (B)" && "Using historical philosophy engine to trace classical influences and human authorship."}
          {variant === "control (C)" && "Running baseline analysis engine for post content evaluation."}
        </p>

        {/* Post Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Select Post ID to Analyze
          </label>
          <select
            value={selectedPostId}
            onChange={(e) => setSelectedPostId(e.target.value)}
            className="w-full px-4 py-2 bg-zinc-700 border border-zinc-600 text-zinc-100 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            <option value="">Choose a post...</option>
            {[...Array(24)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                Post #{i + 1}
              </option>
            ))}
          </select>
        </div>

        {/* Analyze Button */}
        {!results && (
          <Button
            onClick={handleAnalyze}
            disabled={!selectedPostId || isAnalyzing}
            className="w-full bg-amber-600 hover:bg-amber-500 text-zinc-900 font-semibold mb-6"
          >
            {isAnalyzing ? (
              <>
                <SparklesIcon className="mr-2 h-5 w-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <BrainIcon className="mr-2 h-5 w-5" />
                Analyze Post
              </>
            )}
          </Button>
        )}

        {/* Results */}
        {results && (
          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-700">
            <h3 className="text-xl font-bold text-amber-400 mb-4">Analysis Results</h3>

            {results.type === "modern" && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-zinc-200 mb-2">Detected Biases:</h4>
                  {results.findings.map((finding: any, idx: number) => (
                    <div key={idx} className="mb-2 p-3 bg-zinc-800 rounded border border-zinc-700">
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-300">{finding.bias}</span>
                        <span className="text-amber-400 font-medium">{finding.confidence}%</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-red-900/30 border border-red-600 rounded">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-200 font-semibold">AI Generated Content:</span>
                    <span className="text-red-400 font-bold">{results.aiGenerated} ({results.aiProbability}%)</span>
                  </div>
                </div>
              </div>
            )}

            {results.type === "historical" && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-zinc-200 mb-2">Philosophical Influences:</h4>
                  {results.influences.map((influence: any, idx: number) => (
                    <div key={idx} className="mb-2 p-3 bg-zinc-800 rounded border border-zinc-700">
                      <div className="text-zinc-300 font-medium">{influence.influence}</div>
                      <div className="text-zinc-500 text-sm">{influence.period}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-green-900/30 border border-green-600 rounded">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-200 font-semibold">AI Generated Content:</span>
                    <span className="text-green-400 font-bold">{results.aiGenerated} ({results.aiProbability}%)</span>
                  </div>
                </div>
              </div>
            )}

            {results.type === "control" && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-zinc-200 mb-2">Analysis Status:</h4>
                  {results.messages.map((message: string, idx: number) => (
                    <div key={idx} className="mb-2 p-3 bg-zinc-800 rounded border border-zinc-700">
                      <span className="text-zinc-400 italic">{message}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-gray-800 border border-gray-600 rounded">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-200 font-semibold">AI Generated Content:</span>
                    <span className="text-gray-400 font-bold">{results.aiGenerated} ({results.aiProbability}%)</span>
                  </div>
                </div>
              </div>
            )}

            <Button
              onClick={() => {
                setResults(null);
                setSelectedPostId("");
              }}
              className="w-full mt-4 bg-zinc-700 hover:bg-zinc-600 text-zinc-200"
            >
              Analyze Another Post
            </Button>
          </div>
        )}

        <a
          href="https://mixpanel.com/project/3276012/view/3782804/app/feature-flags/a759f0e5-cd4e-4458-b24c-a786a045cf12"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-zinc-500 hover:text-amber-500 mt-4 block text-center transition-colors"
        >
          ⚙️ View flag in Mixpanel
        </a>
      </div>
    </div>
  );
}
