"use client";

import { useState, useEffect } from "react";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DollarSignIcon,
  RefreshCcwIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  FileTextIcon,
  MailIcon,
  PrinterIcon,
  DownloadIcon,
  AlertTriangleIcon,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ProductsPage() {
  useEffect(() => {
    
  }, []);

  const [investmentAmount, setInvestmentAmount] = useState(5000);
  const [riskTolerance, setRiskTolerance] = useState(50);
  const [autoInvest, setAutoInvest] = useState(false);
  const [savingsGoal, setSavingsGoal] = useState(10000);
  const [portfolioData, setPortfolioData] = useState([
    { name: "Stocks", value: 45 },
    { name: "Bonds", value: 30 },
    { name: "Real Estate", value: 15 },
    { name: "Commodities", value: 10 },
  ]);
  const [activeInvestmentAction, setActiveInvestmentAction] = useState(null);
  const [activeSavingsAction, setActiveSavingsAction] = useState(null);
  const [activeExpenseAction, setActiveExpenseAction] = useState(null);

  const expensesData = [
    { name: "Housing", value: 35 },
    { name: "Food", value: 20 },
    { name: "Transportation", value: 15 },
    { name: "Utilities", value: 10 },
    { name: "Entertainment", value: 10 },
    { name: "Other", value: 10 },
  ];

  const handleDragEnd = (event: any, info: any, index: any) => {
    const newData = [...portfolioData];
    newData[index].value = Math.max(0, Math.min(100, newData[index].value + info.offset.x / 5));
    const total = newData.reduce((sum, item) => sum + item.value, 0);
    newData.forEach((item, i) => {
      if (i !== index) {
        item.value = Math.max(0, (item.value * (100 - newData[index].value)) / (total - newData[index].value));
      }
    });
    setPortfolioData(newData);
  };

  const rebalancePortfolio = () => {
    const newData = portfolioData.map((item) => ({
      ...item,
      value: Math.random() * 100,
    }));
    const total = newData.reduce((sum, item) => sum + item.value, 0);
    newData.forEach((item) => {
      item.value = Math.round((item.value / total) * 100);
    });
    setPortfolioData(newData);
  };

  const toggleInvestmentAction = (action: any) => {
    setActiveInvestmentAction(activeInvestmentAction === action ? null : action);
  };

  const toggleSavingsAction = (action: any) => {
    setActiveSavingsAction(activeSavingsAction === action ? null : action);
  };

  const toggleExpenseAction = (action: any) => {
    setActiveExpenseAction(activeExpenseAction === action ? null : action);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12 px-4 md:px-6">
        <div className="max-w-6xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold text-center mb-8">Product Demo</h1>

          <Tabs defaultValue="investments" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="investments">Investments</TabsTrigger>
              <TabsTrigger value="savings">Savings</TabsTrigger>
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
            </TabsList>
            <TabsContent value="investments" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Investment Amount</h3>
                  <div className="flex items-center space-x-2">
                    <DollarSignIcon className="h-4 w-4" />
                    <Input
                      type="number"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Risk Tolerance</h3>
                  <Slider
                    value={[riskTolerance]}
                    onValueChange={(value) => setRiskTolerance(value[0])}
                    max={100}
                    step={1}
                  />
                  <div className="text-center mt-2">{riskTolerance}%</div>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Auto-Invest</h3>
                <div className="flex items-center space-x-2">
                  <Switch checked={autoInvest} onCheckedChange={setAutoInvest} />
                  <Label>{autoInvest ? "Enabled" : "Disabled"}</Label>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Portfolio Allocation</h3>
                  <Button
                    id="rebalance"
                    onClick={(e) => {
                      rebalancePortfolio();

                    }}
                    size="sm"
                    className="hover:bg-opacity-90 active:scale-95 transition-all"
                  >
                    <RefreshCcwIcon className="mr-2 h-4 w-4" />
                    Rebalance
                  </Button>
                </div>
                <div className="flex justify-around">
                  {portfolioData.map((item, index) => (
                    <motion.div
                      key={index}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      onDragEnd={(event, info) => handleDragEnd(event, info, index)}
                      className="text-center cursor-move"
                    >
                      <motion.div
                        className="w-16 h-16 mx-auto mb-2 rounded-full bg-primary flex items-center justify-center text-white font-bold"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {Math.round(item.value)}%
                      </motion.div>
                      <div className="text-sm">{item.name}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Button
                  className={`w-full ${activeInvestmentAction === "increase" ? "bg-green-500 hover:bg-green-600" : ""}`}
                  id="increaseInvestment"
                  onClick={(e) => {
                    toggleInvestmentAction("increase");
                    
                  }}
                >
                  <TrendingUpIcon className="mr-2 h-4 w-4" />
                  Increase Investment
                </Button>
                <Button
                  variant="outline"
				  id="decreaseInvestment"
                  className={`w-full ${
                    activeInvestmentAction === "decrease" ? "bg-red-500 hover:bg-red-600 text-white" : ""
                  }`}
                  onClick={(e) => {
                    toggleInvestmentAction("decrease");
                    
                  }}
                >
                  <TrendingDownIcon className="mr-2 h-4 w-4" />
                  Decrease Investment
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="savings" className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Savings Goal</h3>
                <div className="flex items-center space-x-2">
                  <DollarSignIcon className="h-4 w-4" />
                  <Input
                    type="number"
                    value={savingsGoal}
                    onChange={(e) => setSavingsGoal(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Progress</h3>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <motion.div
                    className="bg-primary h-2.5 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "45%" }}
                    transition={{ duration: 1 }}
                  ></motion.div>
                </div>
                <div className="text-center mt-2">45% of goal reached</div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Monthly Savings</h3>
                  <div className="text-2xl font-bold sensitive">$500</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Time to Goal</h3>
                  <div className="text-2xl font-bold">18 months</div>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Button
                  className={`w-full ${activeSavingsAction === "increase" ? "bg-green-500 hover:bg-green-600" : ""}`}
				  id="increaseSavings"
                  onClick={(e) => {
                    toggleSavingsAction("increase");
                    
                  }}
                >
                  <TrendingUpIcon className="mr-2 h-4 w-4" />
                  Increase Savings
                </Button>
                <Button
                  variant="outline"
				  id="adjustGoal"
                  className={`w-full ${
                    activeSavingsAction === "adjust" ? "bg-blue-500 hover:bg-blue-600 text-white" : ""
                  }`}
                  onClick={() => toggleSavingsAction("adjust")}
                >
                  Adjust Goal
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="expenses" className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-4">Expense Breakdown</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {expensesData.map((item, index) => (
                    <motion.div key={index} className="text-center" whileHover={{ scale: 1.05 }}>
                      <motion.div
                        className="w-16 h-16 mx-auto mb-2 rounded-full bg-primary flex items-center justify-center text-white font-bold"
                        whileTap={{ scale: 0.95 }}
                      >
                        {item.value}%
                      </motion.div>
                      <div className="text-sm">{item.name}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Total Monthly Expenses</h3>
                <div className="text-2xl font-bold sensitive">$2,500</div>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Biggest Expense Category</h3>
                <div className="text-xl">Housing (35%)</div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Button
				id="reduceExpenses"
                  className={`w-full ${activeExpenseAction === "reduce" ? "bg-green-500 hover:bg-green-600" : ""}`}
                  onClick={(e) => {
                    toggleExpenseAction("reduce");
                    
                  }}
                >
                  <TrendingDownIcon className="mr-2 h-4 w-4" />
                  Reduce Expenses
                </Button>
                <Button
                  variant="outline"
                  className={`w-full ${
                    activeExpenseAction === "alert" ? "bg-yellow-500 hover:bg-yellow-600 text-white" : ""
                  }`}
                  onClick={() => toggleExpenseAction("alert")}
                >
                  <AlertTriangleIcon className="mr-2 h-4 w-4" />
                  Set Budget Alerts
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <div className="grid gap-4 md:grid-cols-3">
            <motion.div className="p-4 border rounded-lg" whileHover={{ boxShadow: "0px 0px 8px rgba(0,0,0,0.1)" }}>
              <h3 className="font-semibold mb-2">Net Worth</h3>
              <div className="text-2xl font-bold sensitive">$150,000</div>
              <div className="text-sm text-green-600">↑ 5% from last month</div>
            </motion.div>
            <motion.div className="p-4 border rounded-lg" whileHover={{ boxShadow: "0px 0px 8px rgba(0,0,0,0.1)" }}>
              <h3 className="font-semibold mb-2">Total Investments</h3>
              <div className="text-2xl font-bold sensitive">$75,000</div>
              <div className="text-sm text-green-600">↑ 3% from last month</div>
            </motion.div>
            <motion.div className="p-4 border rounded-lg" whileHover={{ boxShadow: "0px 0px 8px rgba(0,0,0,0.1)" }}>
              <h3 className="font-semibold mb-2">Total Savings</h3>
              <div className="text-2xl font-bold sensitive">$25,000</div>
              <div className="text-sm text-green-600">↑ 2% from last month</div>
            </motion.div>
          </div>

          <div className="text-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="lg" id="generateReport">
                  Generate Financial Report
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Choose Report Type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <FileTextIcon className="mr-2 h-4 w-4" />
                  <span>Detailed PDF Report</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <MailIcon className="mr-2 h-4 w-4" />
                  <span>Email Summary</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <PrinterIcon className="mr-2 h-4 w-4" />
                  <span>Print Report</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <DownloadIcon className="mr-2 h-4 w-4" />
                  <span>Download CSV Data</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
