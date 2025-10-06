"use client";

import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BarChartIcon, TrendingUpIcon, TrendingDownIcon, ActivityIcon } from "lucide-react";

export default function AnalyticsPage() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.mixpanel) {
      window.mixpanel.track("Analytics Page Viewed");
    }
  }, []);

  const serviceMetrics = [
    { service: "Slack", dailyActive: 756, weeklyActive: 821, engagement: 92, trend: "up" },
    { service: "Google Workspace", dailyActive: 834, weeklyActive: 847, engagement: 98, trend: "up" },
    { service: "Zoom", dailyActive: 623, weeklyActive: 798, engagement: 78, trend: "down" },
    { service: "Salesforce", dailyActive: 289, weeklyActive: 342, engagement: 84, trend: "up" },
    { service: "GitHub", dailyActive: 398, weeklyActive: 456, engagement: 87, trend: "up" },
    { service: "Jira", dailyActive: 534, weeklyActive: 623, engagement: 86, trend: "up" },
  ];

  const departmentStats = [
    { dept: "Engineering", headcount: 156, utilization: 94, topService: "GitHub" },
    { dept: "Sales", headcount: 78, utilization: 89, topService: "Salesforce" },
    { dept: "Product", headcount: 45, utilization: 91, topService: "Figma" },
    { dept: "Design", headcount: 32, utilization: 88, topService: "Figma" },
    { dept: "Marketing", headcount: 52, utilization: 85, topService: "HubSpot" },
    { dept: "Customer Success", headcount: 67, utilization: 92, topService: "Zendesk" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />
      <main className="flex-1">
        <section className="w-full py-8 bg-white border-b border-slate-200">
          <div className="container px-4 md:px-6">
            <h1 className="text-3xl font-bold text-slate-900">Analytics & Insights</h1>
            <p className="text-slate-600 mt-1">Service usage, engagement, and organizational metrics</p>
          </div>
        </section>

        <section className="w-full py-8">
          <div className="container px-4 md:px-6 space-y-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Total Services</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">156</p>
                  </div>
                  <BarChartIcon className="h-8 w-8 text-cyan-600" />
                </div>
              </div>
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Avg Engagement</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">87%</p>
                  </div>
                  <TrendingUpIcon className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Daily Active Users</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">743</p>
                  </div>
                  <ActivityIcon className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Monthly Cost</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">$127K</p>
                  </div>
                  <BarChartIcon className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Service Usage Metrics</h2>
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Service</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Daily Active</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Weekly Active</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Engagement</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Trend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {serviceMetrics.map((metric, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">{metric.service}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{metric.dailyActive}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{metric.weeklyActive}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-24 bg-slate-200 rounded-full h-2 mr-3">
                              <div
                                className="bg-cyan-600 h-2 rounded-full"
                                style={{ width: `${metric.engagement}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-slate-900">{metric.engagement}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {metric.trend === "up" ? (
                            <TrendingUpIcon className="h-5 w-5 text-green-600" />
                          ) : (
                            <TrendingDownIcon className="h-5 w-5 text-red-600" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Department Statistics</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {departmentStats.map((stat, idx) => (
                  <div key={idx} className="bg-white rounded-lg border border-slate-200 p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">{stat.dept}</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Headcount</span>
                        <span className="text-sm font-medium text-slate-900">{stat.headcount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Utilization</span>
                        <span className="text-sm font-medium text-slate-900">{stat.utilization}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Top Service</span>
                        <span className="text-sm font-medium text-slate-900">{stat.topService}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
