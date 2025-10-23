"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import {
  UsersIcon,
  TrendingUpIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  MailIcon,
  SmartphoneIcon,
  ShieldCheckIcon,
  BarChartIcon,
  PlusIcon,
  SearchIcon,
} from "lucide-react";

export default function AdminDashboard() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.mixpanel) {
      window.mixpanel.track("Admin Dashboard Viewed", {
        total_employees: stats.totalEmployees,
        active_employees: stats.activeEmployees,
        pending_onboarding: stats.pendingOnboarding,
        referrer: document.referrer || 'direct'
      });
    }
  }, []);

  const stats = {
    totalEmployees: 847,
    activeEmployees: 821,
    pendingOnboarding: 12,
    offboardingInProgress: 4,
    totalDevices: 1243,
    activeServices: 156,
    avgServiceUtilization: 73,
    pendingAccessRequests: 18,
  };

  const recentActivities = [
    { user: "Sarah Chen", action: "Provisioned access to Salesforce", time: "2 minutes ago", status: "success" },
    { user: "Marcus Johnson", action: "Device enrollment - MacBook Pro", time: "15 minutes ago", status: "success" },
    { user: "Priya Patel", action: "Email account created", time: "32 minutes ago", status: "success" },
    { user: "Alex Martinez", action: "Access request pending approval", time: "1 hour ago", status: "pending" },
    { user: "Emily Wong", action: "Performance review submitted", time: "2 hours ago", status: "success" },
    { user: "David Kim", action: "Failed login attempt", time: "3 hours ago", status: "error" },
    { user: "Jessica Brown", action: "Password reset completed", time: "4 hours ago", status: "success" },
    { user: "Ryan O'Connor", action: "Provisioned to Engineering team", time: "5 hours ago", status: "success" },
  ];

  const topServices = [
    { name: "Slack", users: 821, utilization: 97 },
    { name: "Google Workspace", users: 847, utilization: 100 },
    { name: "Zoom", users: 798, utilization: 94 },
    { name: "Salesforce", users: 342, utilization: 40 },
    { name: "GitHub", users: 456, utilization: 54 },
    { name: "Jira", users: 623, utilization: 74 },
  ];

  const pendingActions = [
    { type: "Access Request", count: 18, priority: "high" },
    { type: "Device Approvals", count: 7, priority: "medium" },
    { type: "Offboarding Tasks", count: 4, priority: "high" },
    { type: "License Renewals", count: 3, priority: "medium" },
    { type: "Security Alerts", count: 2, priority: "critical" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />
      <main className="flex-1">
        {/* Dashboard Header */}
        <section className="w-full py-8 bg-white border-b border-slate-200">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-600 mt-1">Welcome back, Admin</p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="hover:bg-opacity-90 active:scale-95 transition-all"
                  onClick={() => {
                    if (typeof window !== "undefined" && window.mixpanel) {
                      window.mixpanel.track("Dashboard Quick Action", { action: "Search" });
                    }
                  }}
                >
                  <SearchIcon className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Link href="/admin/employees">
                  <Button
                    className="bg-blue-600 text-white hover:bg-blue-700 hover:bg-opacity-90 active:scale-95 transition-all"
                    onClick={() => {
                      if (typeof window !== "undefined" && window.mixpanel) {
                        window.mixpanel.track("Dashboard Quick Action", { action: "Add Employee" });
                      }
                    }}
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Employee
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Key Metrics */}
        <section className="w-full py-8 bg-slate-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {/* Total Employees */}
              <div className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Employees</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalEmployees}</p>
                    <p className="text-sm text-green-600 mt-1">
                      <TrendingUpIcon className="h-3 w-3 inline mr-1" />
                      {stats.activeEmployees} active
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <UsersIcon className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
              </div>

              {/* Pending Actions */}
              <div className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Pending Actions</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">34</p>
                    <p className="text-sm text-orange-600 mt-1">
                      <AlertCircleIcon className="h-3 w-3 inline mr-1" />
                      Requires attention
                    </p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <AlertCircleIcon className="h-8 w-8 text-orange-600" />
                  </div>
                </div>
              </div>

              {/* Active Devices */}
              <div className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Active Devices</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalDevices}</p>
                    <p className="text-sm text-green-600 mt-1">
                      <CheckCircleIcon className="h-3 w-3 inline mr-1" />
                      All secure
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <SmartphoneIcon className="h-8 w-8 text-green-600" />
                  </div>
                </div>
              </div>

              {/* Service Utilization */}
              <div className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Avg Utilization</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{stats.avgServiceUtilization}%</p>
                    <p className="text-sm text-blue-600 mt-1">
                      <BarChartIcon className="h-3 w-3 inline mr-1" />
                      {stats.activeServices} services
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <BarChartIcon className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Grid */}
        <section className="w-full py-8 bg-slate-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Recent Activity */}
              <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900">Recent Activity</h2>
                  <Link href="/admin/analytics">
                    <Button variant="ghost" size="sm" className="hover:bg-opacity-90 active:scale-95 transition-all">
                      View All
                    </Button>
                  </Link>
                </div>
                <div className="space-y-4">
                  {recentActivities.map((activity, idx) => (
                    <div
                      key={idx}
                      className="flex items-start space-x-4 p-3 rounded-lg hover:bg-slate-50 hover:scale-[1.01] active:scale-[0.99] transition-all"
                    >
                      <div
                        className={`p-2 rounded-full ${
                          activity.status === "success"
                            ? "bg-green-100"
                            : activity.status === "pending"
                            ? "bg-orange-100"
                            : "bg-red-100"
                        }`}
                      >
                        {activity.status === "success" && <CheckCircleIcon className="h-4 w-4 text-green-600" />}
                        {activity.status === "pending" && <AlertCircleIcon className="h-4 w-4 text-orange-600" />}
                        {activity.status === "error" && <AlertCircleIcon className="h-4 w-4 text-red-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900">{activity.user}</p>
                        <p className="text-sm text-slate-600">{activity.action}</p>
                        <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending Actions */}
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Pending Actions</h2>
                <div className="space-y-3">
                  {pendingActions.map((action, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-blue-300 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                      onClick={() => {
                        if (typeof window !== "undefined" && window.mixpanel) {
                          window.mixpanel.track("Pending Action Clicked", {
                            action_type: action.type,
                            priority: action.priority,
                          });
                        }
                      }}
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-900">{action.type}</p>
                        <p className="text-xs text-slate-500 mt-1">{action.count} pending</p>
                      </div>
                      <div
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          action.priority === "critical"
                            ? "bg-red-100 text-red-700"
                            : action.priority === "high"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {action.priority}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Services */}
            <div className="mt-6 bg-white rounded-lg border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">Top Services by Usage</h2>
                <Link href="/admin/analytics">
                  <Button variant="ghost" size="sm" className="hover:bg-opacity-90 active:scale-95 transition-all">
                    Full Report
                  </Button>
                </Link>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {topServices.map((service, idx) => (
                  <div key={idx} className="p-4 rounded-lg border border-slate-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-slate-900">{service.name}</h3>
                      <span className="text-sm font-medium text-blue-600">{service.utilization}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${service.utilization}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-slate-600">
                      {service.users} / {stats.totalEmployees} users
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Link href="/admin/employees" className="block">
                <div
                  className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                  onClick={() => {
                    if (typeof window !== "undefined" && window.mixpanel) {
                      window.mixpanel.track("Quick Action Clicked", { action: "Manage Employees" });
                    }
                  }}
                >
                  <UsersIcon className="h-8 w-8 text-blue-600 mb-3" />
                  <h3 className="font-medium text-slate-900">Manage Employees</h3>
                  <p className="text-sm text-slate-600 mt-1">View and edit employee profiles</p>
                </div>
              </Link>

              <Link href="/admin/access" className="block">
                <div
                  className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                  onClick={() => {
                    if (typeof window !== "undefined" && window.mixpanel) {
                      window.mixpanel.track("Quick Action Clicked", { action: "Access Control" });
                    }
                  }}
                >
                  <ShieldCheckIcon className="h-8 w-8 text-purple-600 mb-3" />
                  <h3 className="font-medium text-slate-900">Access Control</h3>
                  <p className="text-sm text-slate-600 mt-1">Provision user access</p>
                </div>
              </Link>

              <Link href="/admin/email" className="block">
                <div
                  className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                  onClick={() => {
                    if (typeof window !== "undefined" && window.mixpanel) {
                      window.mixpanel.track("Quick Action Clicked", { action: "Email Setup" });
                    }
                  }}
                >
                  <MailIcon className="h-8 w-8 text-orange-600 mb-3" />
                  <h3 className="font-medium text-slate-900">Email Setup</h3>
                  <p className="text-sm text-slate-600 mt-1">Configure email accounts</p>
                </div>
              </Link>

              <Link href="/admin/analytics" className="block">
                <div
                  className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                  onClick={() => {
                    if (typeof window !== "undefined" && window.mixpanel) {
                      window.mixpanel.track("Quick Action Clicked", { action: "Analytics" });
                    }
                  }}
                >
                  <BarChartIcon className="h-8 w-8 text-cyan-600 mb-3" />
                  <h3 className="font-medium text-slate-900">Analytics</h3>
                  <p className="text-sm text-slate-600 mt-1">View usage insights</p>
                </div>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
