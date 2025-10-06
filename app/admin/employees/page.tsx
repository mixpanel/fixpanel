"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  UsersIcon,
  SearchIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  XIcon,
  CheckCircleIcon,
  CalendarIcon,
  BriefcaseIcon,
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
    manager: "David Kim",
    salary: "$145,000",
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
    manager: "Thomas Anderson",
    salary: "$135,000",
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
    manager: "Nina Kowalski",
    salary: "$128,000",
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
    manager: "David Kim",
    salary: "$132,000",
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
    manager: "Thomas Anderson",
    salary: "$115,000",
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
    manager: "Lisa Tanaka",
    salary: "$165,000",
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
    manager: "Thomas Anderson",
    salary: "$125,000",
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
    manager: "David Kim",
    salary: "$122,000",
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
    manager: "Lisa Tanaka",
    salary: "$118,000",
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
    manager: "Lisa Tanaka",
    salary: "$108,000",
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
    manager: "David Kim",
    salary: "$128,000",
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
    manager: "Thomas Anderson",
    salary: "$112,000",
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
    manager: "David Kim",
    salary: "$142,000",
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
    manager: "Lisa Tanaka",
    salary: "$185,000",
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
    manager: "Thomas Anderson",
    salary: "$138,000",
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
    manager: "David Kim",
    salary: "$126,000",
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
    manager: "Nina Kowalski",
    salary: "$115,000",
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
    manager: "David Kim",
    salary: "$148,000",
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
    manager: "CEO",
    salary: "$195,000",
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
    manager: "Lisa Tanaka",
    salary: "$120,000",
  },
];

export default function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<typeof employees[0] | null>(null);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    department: "Engineering",
    role: "",
    location: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined" && window.mixpanel) {
      window.mixpanel.track("Employees Page Viewed");
    }
  }, []);

  const departments = ["all", ...Array.from(new Set(employees.map((emp) => emp.department)))];

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === "all" || emp.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const handleAddEmployee = () => {
    if (typeof window !== "undefined" && window.mixpanel) {
      window.mixpanel.track("Employee Added", newEmployee);
    }
    setShowAddModal(false);
    setNewEmployee({ name: "", email: "", department: "Engineering", role: "", location: "" });
    // Show success message
    alert(`✅ ${newEmployee.name} has been added to the system!`);
  };

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
                  setShowAddModal(true);
                  if (typeof window !== "undefined" && window.mixpanel) {
                    window.mixpanel.track("Add Employee Modal Opened");
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
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedEmployee(employee);
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
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Add Employee Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">Add New Employee</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <XIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                  <Input
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <Input
                    type="email"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                    placeholder="john.doe@company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Department</label>
                  <select
                    value={newEmployee.department}
                    onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {departments.filter((d) => d !== "all").map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
                  <Input
                    value={newEmployee.role}
                    onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
                    placeholder="Software Engineer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                  <Input
                    value={newEmployee.location}
                    onChange={(e) => setNewEmployee({ ...newEmployee, location: e.target.value })}
                    placeholder="San Francisco, CA"
                  />
                </div>
              </div>
              <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-blue-600 text-white hover:bg-blue-700"
                  onClick={handleAddEmployee}
                  disabled={!newEmployee.name || !newEmployee.email}
                >
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Add Employee
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Employee Detail Modal */}
        {selectedEmployee && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
              <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-2xl font-bold">
                    {selectedEmployee.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedEmployee.name}</h2>
                    <p className="text-blue-100">{selectedEmployee.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEmployee(null)}
                  className="text-white hover:text-blue-200 transition-colors"
                >
                  <XIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="p-6 grid grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center text-sm text-slate-600 mb-1">
                    <MailIcon className="h-4 w-4 mr-2" />
                    Email
                  </div>
                  <div className="text-slate-900 font-medium">{selectedEmployee.email}</div>
                </div>
                <div>
                  <div className="flex items-center text-sm text-slate-600 mb-1">
                    <PhoneIcon className="h-4 w-4 mr-2" />
                    Phone
                  </div>
                  <div className="text-slate-900 font-medium">{selectedEmployee.phone}</div>
                </div>
                <div>
                  <div className="flex items-center text-sm text-slate-600 mb-1">
                    <BriefcaseIcon className="h-4 w-4 mr-2" />
                    Department
                  </div>
                  <div className="text-slate-900 font-medium">{selectedEmployee.department}</div>
                </div>
                <div>
                  <div className="flex items-center text-sm text-slate-600 mb-1">
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    Location
                  </div>
                  <div className="text-slate-900 font-medium">{selectedEmployee.location}</div>
                </div>
                <div>
                  <div className="flex items-center text-sm text-slate-600 mb-1">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Start Date
                  </div>
                  <div className="text-slate-900 font-medium">{selectedEmployee.startDate}</div>
                </div>
                <div>
                  <div className="flex items-center text-sm text-slate-600 mb-1">
                    <UsersIcon className="h-4 w-4 mr-2" />
                    Manager
                  </div>
                  <div className="text-slate-900 font-medium">{selectedEmployee.manager}</div>
                </div>
              </div>
              <div className="p-6 border-t border-slate-200 bg-slate-50 rounded-b-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-slate-600">Annual Salary</div>
                    <div className="text-2xl font-bold text-slate-900">{selectedEmployee.salary}</div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      window.open("https://storage.googleapis.com/mp-customer-upload/RickRoll.mp4", "_blank");
                      if (typeof window !== "undefined" && window.mixpanel) {
                        window.mixpanel.track("Employee Edit Rickrolled");
                      }
                    }}
                  >
                    Edit Profile
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
