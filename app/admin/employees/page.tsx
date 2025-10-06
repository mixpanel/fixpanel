"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import {
  UsersIcon,
  SearchIcon,
  FilterIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  BriefcaseIcon,
  MoreVerticalIcon,
} from "lucide-react";

// Extensive mock employee data
const employees = [
  {
    id: 1,
    name: "Sarah Chen",
    email: "sarah.chen@company.com",
    department: "Engineering",
    role: "Senior Software Engineer",
    location: "San Francisco, CA",
    status: "active",
    phone: "+1 (555) 123-4567",
    startDate: "2021-03-15",
  },
  {
    id: 2,
    name: "Marcus Johnson",
    email: "marcus.j@company.com",
    department: "Product",
    role: "Product Manager",
    location: "New York, NY",
    status: "active",
    phone: "+1 (555) 234-5678",
    startDate: "2020-07-22",
  },
  {
    id: 3,
    name: "Priya Patel",
    email: "priya.patel@company.com",
    department: "Design",
    role: "Lead UX Designer",
    location: "Austin, TX",
    status: "active",
    phone: "+1 (555) 345-6789",
    startDate: "2019-11-08",
  },
  {
    id: 4,
    name: "Alex Martinez",
    email: "alex.martinez@company.com",
    department: "Engineering",
    role: "DevOps Engineer",
    location: "Seattle, WA",
    status: "active",
    phone: "+1 (555) 456-7890",
    startDate: "2022-01-10",
  },
  {
    id: 5,
    name: "Emily Wong",
    email: "emily.wong@company.com",
    department: "Sales",
    role: "Account Executive",
    location: "Boston, MA",
    status: "active",
    phone: "+1 (555) 567-8901",
    startDate: "2021-09-05",
  },
  {
    id: 6,
    name: "David Kim",
    email: "david.kim@company.com",
    department: "Engineering",
    role: "Staff Engineer",
    location: "San Francisco, CA",
    status: "active",
    phone: "+1 (555) 678-9012",
    startDate: "2018-05-20",
  },
  {
    id: 7,
    name: "Jessica Brown",
    email: "jessica.brown@company.com",
    department: "Marketing",
    role: "Marketing Manager",
    location: "Chicago, IL",
    status: "active",
    phone: "+1 (555) 789-0123",
    startDate: "2020-12-15",
  },
  {
    id: 8,
    name: "Ryan O'Connor",
    email: "ryan.oconnor@company.com",
    department: "Engineering",
    role: "Frontend Engineer",
    location: "Remote",
    status: "active",
    phone: "+1 (555) 890-1234",
    startDate: "2022-06-01",
  },
  {
    id: 9,
    name: "Aisha Okafor",
    email: "aisha.okafor@company.com",
    department: "HR",
    role: "People Operations Lead",
    location: "Denver, CO",
    status: "active",
    phone: "+1 (555) 901-2345",
    startDate: "2019-08-12",
  },
  {
    id: 10,
    name: "James Sullivan",
    email: "james.sullivan@company.com",
    department: "Finance",
    role: "Financial Analyst",
    location: "New York, NY",
    status: "active",
    phone: "+1 (555) 012-3456",
    startDate: "2021-02-28",
  },
  {
    id: 11,
    name: "Mei Lin",
    email: "mei.lin@company.com",
    department: "Engineering",
    role: "Backend Engineer",
    location: "San Francisco, CA",
    status: "active",
    phone: "+1 (555) 123-5678",
    startDate: "2022-03-14",
  },
  {
    id: 12,
    name: "Carlos Rodriguez",
    email: "carlos.rodriguez@company.com",
    department: "Customer Success",
    role: "CS Manager",
    location: "Miami, FL",
    status: "active",
    phone: "+1 (555) 234-6789",
    startDate: "2020-10-05",
  },
  {
    id: 13,
    name: "Fatima Hassan",
    email: "fatima.hassan@company.com",
    department: "Engineering",
    role: "Security Engineer",
    location: "Remote",
    status: "active",
    phone: "+1 (555) 345-7890",
    startDate: "2021-07-19",
  },
  {
    id: 14,
    name: "Thomas Anderson",
    email: "thomas.anderson@company.com",
    department: "Sales",
    role: "VP of Sales",
    location: "New York, NY",
    status: "active",
    phone: "+1 (555) 456-8901",
    startDate: "2017-04-03",
  },
  {
    id: 15,
    name: "Nina Kowalski",
    email: "nina.kowalski@company.com",
    department: "Product",
    role: "Senior Product Designer",
    location: "Portland, OR",
    status: "active",
    phone: "+1 (555) 567-9012",
    startDate: "2020-11-22",
  },
  {
    id: 16,
    name: "Jamal Washington",
    email: "jamal.washington@company.com",
    department: "Engineering",
    role: "Mobile Engineer",
    location: "Atlanta, GA",
    status: "active",
    phone: "+1 (555) 678-0123",
    startDate: "2022-08-30",
  },
  {
    id: 17,
    name: "Sophie Dubois",
    email: "sophie.dubois@company.com",
    department: "Design",
    role: "UI Designer",
    location: "Remote",
    status: "active",
    phone: "+1 (555) 789-1234",
    startDate: "2021-05-17",
  },
  {
    id: 18,
    name: "Mohammed Al-Rashid",
    email: "mohammed.alrashid@company.com",
    department: "Engineering",
    role: "Data Engineer",
    location: "San Francisco, CA",
    status: "active",
    phone: "+1 (555) 890-2345",
    startDate: "2019-12-09",
  },
  {
    id: 19,
    name: "Lisa Tanaka",
    email: "lisa.tanaka@company.com",
    department: "Legal",
    role: "General Counsel",
    location: "San Francisco, CA",
    status: "active",
    phone: "+1 (555) 901-3456",
    startDate: "2018-09-24",
  },
  {
    id: 20,
    name: "Robert Miller",
    email: "robert.miller@company.com",
    department: "IT",
    role: "IT Manager",
    location: "Seattle, WA",
    status: "active",
    phone: "+1 (555) 012-4567",
    startDate: "2020-03-11",
  },
];

export default function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  useEffect(() => {
    if (typeof window !== "undefined" && window.mixpanel) {
      window.mixpanel.track("Employees Page Viewed");
    }
  }, []);

  const departments = ["all", ...new Set(employees.map((emp) => emp.department))];

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === "all" || emp.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />
      <main className="flex-1">
        {/* Page Header */}
        <section className="w-full py-8 bg-white border-b border-slate-200">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Employees</h1>
                <p className="text-slate-600 mt-1">{filteredEmployees.length} total employees</p>
              </div>
              <Button
                className="bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => {
                  if (typeof window !== "undefined" && window.mixpanel) {
                    window.mixpanel.track("Add Employee Clicked");
                  }
                }}
              >
                <UsersIcon className="h-4 w-4 mr-2" />
                Add New Employee
              </Button>
            </div>
          </div>
        </section>

        {/* Filters and Search */}
        <section className="w-full py-6 bg-slate-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Search employees by name, email, or role..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      if (typeof window !== "undefined" && window.mixpanel) {
                        window.mixpanel.track("Employee Search", { search_term: e.target.value });
                      }
                    }}
                    className="pl-10 bg-white"
                  />
                </div>
              </div>
              <div className="md:w-64">
                <select
                  value={selectedDepartment}
                  onChange={(e) => {
                    setSelectedDepartment(e.target.value);
                    if (typeof window !== "undefined" && window.mixpanel) {
                      window.mixpanel.track("Employee Filter Changed", { department: e.target.value });
                    }
                  }}
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept === "all" ? "All Departments" : dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Employee List */}
        <section className="w-full py-8 bg-slate-50">
          <div className="container px-4 md:px-6">
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                        Employee
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredEmployees.map((employee) => (
                      <tr key={employee.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                              {employee.name.split(" ").map((n) => n[0]).join("")}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-slate-900">{employee.name}</div>
                              <div className="text-sm text-slate-500 flex items-center">
                                <MailIcon className="h-3 w-3 mr-1" />
                                {employee.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-900">{employee.department}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-slate-900">{employee.role}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-900 flex items-center">
                            <MapPinIcon className="h-3 w-3 mr-1 text-slate-400" />
                            {employee.location}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {employee.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link href={`/admin/employee/${employee.id}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (typeof window !== "undefined" && window.mixpanel) {
                                  window.mixpanel.track("View Employee Profile", {
                                    employee_id: employee.id,
                                    employee_name: employee.name,
                                    department: employee.department,
                                  });
                                }
                              }}
                            >
                              View Details
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
