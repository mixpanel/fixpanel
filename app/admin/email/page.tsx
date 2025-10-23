"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MailIcon, PlusIcon, SettingsIcon, UsersIcon } from "lucide-react";

const emailAccounts = [
  { user: "Sarah Chen", email: "sarah.chen@company.com", aliases: 2, storage: "12.4 GB", status: "active" },
  { user: "Marcus Johnson", email: "marcus.j@company.com", aliases: 1, storage: "8.7 GB", status: "active" },
  { user: "Priya Patel", email: "priya.patel@company.com", aliases: 3, storage: "15.2 GB", status: "active" },
  { user: "Alex Martinez", email: "alex.martinez@company.com", aliases: 0, storage: "4.1 GB", status: "active" },
  { user: "Emily Wong", email: "emily.wong@company.com", aliases: 2, storage: "9.8 GB", status: "active" },
  { user: "David Kim", email: "david.kim@company.com", aliases: 1, storage: "18.5 GB", status: "active" },
];

const distributionLists = [
  { name: "all@company.com", members: 847, description: "All Company" },
  { name: "engineering@company.com", members: 156, description: "Engineering Team" },
  { name: "sales@company.com", members: 78, description: "Sales Team" },
  { name: "leadership@company.com", members: 12, description: "Leadership Team" },
  { name: "support@company.com", members: 45, description: "Customer Support" },
];

export default function EmailSetupPage() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.mixpanel) {
      window.mixpanel.track("Email Setup Page Viewed", {
        referrer: document.referrer || 'direct',
        time_of_day: new Date().getHours()
      });
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />
      <main className="flex-1">
        <section className="w-full py-8 bg-white border-b border-slate-200">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Email & Collaboration Setup</h1>
                <p className="text-slate-600 mt-1">Manage email accounts and distribution lists</p>
              </div>
              <Button className="bg-orange-600 text-white hover:bg-orange-700 mt-4 md:mt-0" onClick={() => {
                if (typeof window !== "undefined" && window.mixpanel) {
                  window.mixpanel.track("Create Email Account Clicked", {
                    source: 'email_setup_page',
                    time_of_day: new Date().getHours()
                  });
                }
              }}>
                <PlusIcon className="h-4 w-4 mr-2" />
                Create Email Account
              </Button>
            </div>
          </div>
        </section>

        <section className="w-full py-8">
          <div className="container px-4 md:px-6 space-y-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Email Accounts</h2>
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Aliases</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Storage</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Status</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-600 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {emailAccounts.map((account, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">{account.user}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{account.email}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{account.aliases}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{account.storage}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            {account.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button variant="ghost" size="sm">Manage</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Distribution Lists</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {distributionLists.map((list, idx) => (
                  <div key={idx} className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-slate-900">{list.name}</h3>
                        <p className="text-sm text-slate-600 mt-1">{list.description}</p>
                        <div className="flex items-center mt-3 text-sm text-slate-500">
                          <UsersIcon className="h-4 w-4 mr-1" />
                          {list.members} members
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <SettingsIcon className="h-4 w-4" />
                      </Button>
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
