"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ShieldCheckIcon, CheckCircleIcon, XCircleIcon, ClockIcon, Loader2Icon } from "lucide-react";

const initialAccessRequests = [
  { id: 1, user: "Alex Martinez", service: "Salesforce", role: "Sales User", status: "pending", requestedAt: "2 hours ago" },
  { id: 2, user: "Emily Wong", service: "GitHub Enterprise", role: "Developer", status: "pending", requestedAt: "4 hours ago" },
  { id: 3, user: "Ryan O'Connor", service: "Jira", role: "Project Admin", status: "pending", requestedAt: "1 day ago" },
  { id: 4, user: "Sarah Chen", service: "AWS Console", role: "DevOps Admin", status: "approved", requestedAt: "2 days ago" },
  { id: 5, user: "Marcus Johnson", service: "Figma", role: "Editor", status: "approved", requestedAt: "3 days ago" },
  { id: 6, user: "Priya Patel", service: "Slack Enterprise", role: "Workspace Owner", status: "rejected", requestedAt: "1 week ago" },
];

const provisionedServices = [
  { service: "Google Workspace", users: 847, groups: 23, lastProvisioned: "5 min ago" },
  { service: "Slack", users: 821, groups: 45, lastProvisioned: "12 min ago" },
  { service: "GitHub", users: 456, groups: 12, lastProvisioned: "1 hour ago" },
  { service: "Salesforce", users: 342, groups: 8, lastProvisioned: "2 hours ago" },
  { service: "Zoom", users: 798, groups: 15, lastProvisioned: "3 hours ago" },
  { service: "Jira", users: 623, groups: 18, lastProvisioned: "5 hours ago" },
  { service: "AWS", users: 89, groups: 6, lastProvisioned: "1 day ago" },
  { service: "Figma", users: 234, groups: 9, lastProvisioned: "2 days ago" },
];

const teams = [
  { name: "Engineering", members: 156, services: 28 },
  { name: "Product", members: 45, services: 18 },
  { name: "Design", members: 32, services: 15 },
  { name: "Sales", members: 78, services: 12 },
  { name: "Marketing", members: 52, services: 16 },
  { name: "Customer Success", members: 67, services: 14 },
  { name: "Finance", members: 24, services: 10 },
  { name: "HR", members: 18, services: 11 },
  { name: "Legal", members: 12, services: 8 },
  { name: "IT", members: 15, services: 25 },
];

export default function AccessControlPage() {
  const [selectedTab, setSelectedTab] = useState("requests");
  const [accessRequests, setAccessRequests] = useState(initialAccessRequests);
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.mixpanel) {
      window.mixpanel.track("Access Control Page Viewed");
    }
  }, []);

  const handleApprove = (request: typeof initialAccessRequests[0]) => {
    setProcessingId(request.id);

    if (typeof window !== "undefined" && window.mixpanel) {
      window.mixpanel.track("Access Request Approved", {
        user: request.user,
        service: request.service,
        role: request.role,
      });
    }

    // Simulate API call with animation
    setTimeout(() => {
      setAccessRequests(prev =>
        prev.map(req =>
          req.id === request.id ? { ...req, status: "approved" } : req
        )
      );
      setProcessingId(null);
    }, 1000);
  };

  const handleReject = (request: typeof initialAccessRequests[0]) => {
    setProcessingId(request.id);

    if (typeof window !== "undefined" && window.mixpanel) {
      window.mixpanel.track("Access Request Rejected", {
        user: request.user,
        service: request.service,
        role: request.role,
      });
    }

    // Simulate API call with animation
    setTimeout(() => {
      setAccessRequests(prev =>
        prev.map(req =>
          req.id === request.id ? { ...req, status: "rejected" } : req
        )
      );
      setProcessingId(null);
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />
      <main className="flex-1">
        {/* Page Header */}
        <section className="w-full py-8 bg-white border-b border-slate-200">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Access Control</h1>
                <p className="text-slate-600 mt-1">Manage user access and permissions across all services</p>
              </div>
              <Button className="bg-purple-600 text-white hover:bg-purple-700 mt-4 md:mt-0" onClick={() => {
                window.open("https://storage.googleapis.com/mp-customer-upload/RickRoll.mp4", "_blank");
                if (typeof window !== "undefined" && window.mixpanel) {
                  window.mixpanel.track("Bulk Provision Rickrolled");
                }
              }}>
                <ShieldCheckIcon className="h-4 w-4 mr-2" />
                Bulk Provision
              </Button>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <section className="w-full bg-white border-b border-slate-200">
          <div className="container px-4 md:px-6">
            <div className="flex space-x-8">
              <button
                onClick={() => setSelectedTab("requests")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === "requests"
                    ? "border-purple-600 text-purple-600"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                Pending Requests ({accessRequests.filter(r => r.status === "pending").length})
              </button>
              <button
                onClick={() => setSelectedTab("services")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === "services"
                    ? "border-purple-600 text-purple-600"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                Provisioned Services
              </button>
              <button
                onClick={() => setSelectedTab("teams")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === "teams"
                    ? "border-purple-600 text-purple-600"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                Teams & Groups
              </button>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="w-full py-8">
          <div className="container px-4 md:px-6">
            {selectedTab === "requests" && (
              <div className="space-y-4">
                {accessRequests.map((request) => (
                  <div
                    key={request.id}
                    className={`bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-all ${
                      processingId === request.id ? "scale-[0.99] opacity-70" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-medium">
                            {request.user.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-slate-900">{request.user}</h3>
                            <p className="text-sm text-slate-500">Requested {request.requestedAt}</p>
                          </div>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-slate-600">Service</p>
                            <p className="text-sm font-medium text-slate-900">{request.service}</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-600">Requested Role</p>
                            <p className="text-sm font-medium text-slate-900">{request.role}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        {processingId === request.id ? (
                          <div className="flex items-center space-x-2 text-purple-600">
                            <Loader2Icon className="h-5 w-5 animate-spin" />
                            <span className="text-sm">Processing...</span>
                          </div>
                        ) : request.status === "pending" ? (
                          <>
                            <Button
                              variant="outline"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => handleReject(request)}
                            >
                              <XCircleIcon className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                            <Button
                              className="bg-green-600 text-white hover:bg-green-700"
                              onClick={() => handleApprove(request)}
                            >
                              <CheckCircleIcon className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                          </>
                        ) : request.status === "approved" ? (
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium animate-pulse">
                            ✓ Approved
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                            ✗ Rejected
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedTab === "services" && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {provisionedServices.map((service, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-lg transition-shadow"
                  >
                    <h3 className="text-lg font-bold text-slate-900 mb-4">{service.service}</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Provisioned Users</span>
                        <span className="text-sm font-medium text-slate-900">{service.users}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Access Groups</span>
                        <span className="text-sm font-medium text-slate-900">{service.groups}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Last Provisioned</span>
                        <span className="text-sm font-medium text-slate-500">{service.lastProvisioned}</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full mt-4"
                      onClick={() => {
                        window.open("https://storage.googleapis.com/mp-customer-upload/RickRoll.mp4", "_blank");
                        if (typeof window !== "undefined" && window.mixpanel) {
                          window.mixpanel.track("Manage Service Access Rickrolled", { service: service.service });
                        }
                      }}
                    >
                      Manage Access
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {selectedTab === "teams" && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {teams.map((team, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-lg transition-shadow"
                  >
                    <h3 className="text-lg font-bold text-slate-900 mb-4">{team.name}</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Team Members</span>
                        <span className="text-sm font-medium text-slate-900">{team.members}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Services Accessed</span>
                        <span className="text-sm font-medium text-slate-900">{team.services}</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full mt-4"
                      onClick={() => {
                        window.open("https://storage.googleapis.com/mp-customer-upload/RickRoll.mp4", "_blank");
                        if (typeof window !== "undefined" && window.mixpanel) {
                          window.mixpanel.track("Manage Team Access Rickrolled", { team: team.name });
                        }
                      }}
                    >
                      Manage Team
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
