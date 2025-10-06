"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { ThumbsUpIcon, ThumbsDownIcon, EyeIcon, TrendingUpIcon } from "lucide-react";

const medicalCases = [
  {
    id: 1,
    username: "SneezMaster3000",
    symptoms: "I've been sneezing for 3 days straight, my nose is running like a faucet, and I feel like I got hit by a truck. Also, I'm pretty sure my cat is judging me.",
    age: "32",
    duration: "3 days",
    postedAt: "2 hours ago",
    votes: { commonCold: 234, flu: 89, allergies: 156, catJudgment: 12 },
  },
  {
    id: 2,
    username: "TummyTrouble42",
    symptoms: "Ate questionable street tacos last night. Now experiencing... regrets. Lots of regrets. Send help. And maybe some Pepto.",
    age: "28",
    duration: "12 hours",
    postedAt: "5 hours ago",
    votes: { foodPoisoning: 412, karma: 298, badDecisions: 187, streetTacoRevenge: 93 },
  },
  {
    id: 3,
    username: "InsomniacPhilosopher",
    symptoms: "Haven't slept in 3 days. Keep thinking about the existential dread of human existence. Also, my left eye won't stop twitching. Coincidence?",
    age: "35",
    duration: "3 days",
    postedAt: "1 day ago",
    votes: { insomnia: 267, caffeine: 198, existentialCrisis: 445, needsVacation: 312 },
  },
  {
    id: 4,
    username: "OfficeWarrior99",
    symptoms: "Lower back pain after 8 hours of sitting. I swear my chair is a medieval torture device. Posture? Never heard of her.",
    age: "41",
    duration: "2 weeks",
    postedAt: "3 hours ago",
    votes: { badPosture: 521, needsBetterChair: 389, aging: 234, modernLifestyle: 167 },
  },
  {
    id: 5,
    username: "ConfusedMillennial",
    symptoms: "Random joint pain, fatigue, and I make old person noises when standing up. I'm only 29. Is this adulthood? I want a refund.",
    age: "29",
    duration: "6 months",
    postedAt: "6 hours ago",
    votes: { prematureAging: 398, vitaminDeficiency: 245, welcomeToThirties: 612, needsExercise: 178 },
  },
  {
    id: 6,
    username: "CoffeeDependent",
    symptoms: "Headache that starts around 2 PM every day. Weird coincidence that it's exactly when I stop drinking coffee?",
    age: "26",
    duration: "ongoing",
    postedAt: "30 min ago",
    votes: { caffeineWithdrawal: 789, denial: 534, addiction: 423, honesty: 12 },
  },
];

export default function VotePage() {
  const [currentCase, setCurrentCase] = useState(0);
  const [votedOn, setVotedOn] = useState<number[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.mixpanel) {
      window.mixpanel.track("Wellness Vote Page Viewed");
    }
  }, []);

  const handleVote = (caseId: number, diagnosis: string, votes: number) => {
    if (typeof window !== "undefined" && window.mixpanel) {
      window.mixpanel.track("Wellness Case Vote", {
        case_id: caseId,
        diagnosis: diagnosis,
        current_votes: votes,
      });
    }
    setVotedOn([...votedOn, caseId]);
    if (currentCase < medicalCases.length - 1) {
      setCurrentCase(currentCase + 1);
    }
  };

  const currentCaseData = medicalCases[currentCase];
  const hasVoted = votedOn.includes(currentCaseData?.id);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <Header />
      <main className="flex-1">
        <section className="w-full py-8 bg-white border-b border-slate-200">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Vote on Medical Cases</h1>
                <p className="text-slate-600 mt-1">Help fellow humans with your internet medical degree</p>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="text-sm text-slate-600">
                  Case {currentCase + 1} of {medicalCases.length}
                </div>
                <div className="w-64 bg-slate-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-orange-600 h-2 rounded-full transition-all"
                    style={{ width: `${((currentCase + 1) / medicalCases.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {currentCaseData && (
          <section className="w-full py-12">
            <div className="container px-4 md:px-6 max-w-4xl">
              <div className="bg-white rounded-lg border-2 border-orange-200 shadow-xl p-8">
                {/* Case Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center text-white font-bold text-lg">
                      {currentCaseData.username[0]}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">{currentCaseData.username}</h2>
                      <p className="text-sm text-slate-500">Posted {currentCaseData.postedAt}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-600">Age: {currentCaseData.age}</div>
                    <div className="text-sm text-slate-600">Duration: {currentCaseData.duration}</div>
                  </div>
                </div>

                {/* Symptoms */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Symptoms:</h3>
                  <p className="text-slate-700 text-lg leading-relaxed bg-slate-50 p-6 rounded-lg border border-slate-200">
                    {currentCaseData.symptoms}
                  </p>
                </div>

                {/* Voting Options */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4">What do you think it is?</h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    {Object.entries(currentCaseData.votes).map(([diagnosis, votes]) => (
                      <button
                        key={diagnosis}
                        onClick={() => handleVote(currentCaseData.id, diagnosis, votes as number)}
                        disabled={hasVoted}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          hasVoted
                            ? "border-slate-200 bg-slate-50 cursor-not-allowed"
                            : "border-orange-200 hover:border-orange-400 hover:bg-orange-50 cursor-pointer"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-slate-900 capitalize">
                            {diagnosis.replace(/([A-Z])/g, " $1").trim()}
                          </span>
                          <span className="text-sm text-slate-500">{votes} votes</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-orange-600 h-2 rounded-full transition-all"
                            style={{
                              width: `${
                                (votes / Object.values(currentCaseData.votes).reduce((a, b) => a + b, 0)) * 100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Navigation */}
                <div className="mt-8 flex justify-between items-center pt-6 border-t border-slate-200">
                  <Button
                    variant="ghost"
                    onClick={() => setCurrentCase(Math.max(0, currentCase - 1))}
                    disabled={currentCase === 0}
                  >
                    Previous Case
                  </Button>
                  {hasVoted && (
                    <div className="flex items-center text-green-600">
                      <ThumbsUpIcon className="h-5 w-5 mr-2" />
                      <span className="font-medium">Vote Recorded!</span>
                    </div>
                  )}
                  <Button
                    className="bg-orange-600 text-white hover:bg-orange-700"
                    onClick={() => {
                      if (currentCase < medicalCases.length - 1) {
                        setCurrentCase(currentCase + 1);
                      }
                    }}
                    disabled={currentCase === medicalCases.length - 1}
                  >
                    {currentCase === medicalCases.length - 1 ? "All Done!" : "Next Case"}
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <div className="bg-white rounded-lg border border-slate-200 p-6 text-center">
                  <div className="text-3xl font-bold text-orange-600">{votedOn.length}</div>
                  <div className="text-sm text-slate-600 mt-1">Cases Voted On</div>
                </div>
                <div className="bg-white rounded-lg border border-slate-200 p-6 text-center">
                  <div className="text-3xl font-bold text-emerald-600">
                    {Math.floor(Math.random() * 40 + 30)}%
                  </div>
                  <div className="text-sm text-slate-600 mt-1">Accuracy Score</div>
                  <div className="text-xs text-slate-400">(Completely made up)</div>
                </div>
                <div className="bg-white rounded-lg border border-slate-200 p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600">{medicalCases.length - currentCase - 1}</div>
                  <div className="text-sm text-slate-600 mt-1">Cases Remaining</div>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-8 text-center">
                <Link href="/wellness/submit">
                  <Button size="lg" variant="outline" className="border-teal-200 text-teal-700 hover:bg-teal-50">
                    Submit Your Own Case
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
