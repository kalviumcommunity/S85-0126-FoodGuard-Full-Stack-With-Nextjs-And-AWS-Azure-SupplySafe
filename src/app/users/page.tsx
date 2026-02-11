"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  UserCheck,
  Shield,
  ChefHat,
  Train,
  Building,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Settings,
} from "lucide-react";

const usersData = [
  {
    id: "USR-001",
    name: "Rajesh Kumar",
    email: "rajesh.kumar@ircs.gov.in",
    phone: "+91-9876543210",
    role: "System Administrator",
    department: "IT",
    location: "Mumbai Central Office",
    status: "active",
    lastLogin: "2024-01-27 14:30:00",
    joinDate: "2022-03-15",
    permissions: ["full_access", "user_management", "system_config"],
    avatar: "RK",
  },
  {
    id: "USR-002",
    name: "Priya Sharma",
    email: "priya.sharma@ircs.gov.in",
    phone: "+91-9876543211",
    role: "Quality Inspector",
    department: "Quality Assurance",
    location: "Pune Regional Kitchen",
    status: "active",
    lastLogin: "2024-01-27 13:15:00",
    joinDate: "2022-06-20",
    permissions: ["hygiene_inspection", "report_generation", "quality_control"],
    avatar: "PS",
  },
  {
    id: "USR-003",
    name: "Amit Singh",
    email: "amit.singh@ircs.gov.in",
    phone: "+91-9876543212",
    role: "Kitchen Manager",
    department: "Catering",
    location: "Nagpur Central Kitchen",
    status: "active",
    lastLogin: "2024-01-27 12:45:00",
    joinDate: "2021-11-10",
    permissions: ["kitchen_management", "staff_supervision", "inventory_control"],
    avatar: "AS",
  },
  {
    id: "USR-004",
    name: "Dr. Anita Desai",
    email: "anita.desai@ircs.gov.in",
    phone: "+91-9876543213",
    role: "Health Inspector",
    department: "Health & Safety",
    location: "Delhi Main Kitchen",
    status: "active",
    lastLogin: "2024-01-27 11:30:00",
    joinDate: "2021-08-05",
    permissions: ["health_inspection", "compliance_check", "safety_audit"],
    avatar: "AD",
  },
  {
    id: "USR-005",
    name: "Suresh Kumar",
    email: "suresh.kumar@ircs.gov.in",
    phone: "+91-9876543214",
    role: "Transport Manager",
    department: "Logistics",
    location: "Chennai Central Hub",
    status: "inactive",
    lastLogin: "2024-01-25 16:20:00",
    joinDate: "2023-01-12",
    permissions: ["transport_management", "route_planning", "vehicle_tracking"],
    avatar: "SK",
  },
  {
    id: "USR-006",
    name: "Vikram Mehta",
    email: "vikram.mehta@ircs.gov.in",
    phone: "+91-9876543215",
    role: "Maintenance Lead",
    department: "Facility Management",
    location: "Kolkata Central Kitchen",
    status: "active",
    lastLogin: "2024-01-27 10:15:00",
    joinDate: "2022-09-18",
    permissions: ["equipment_maintenance", "facility_management", "repair_scheduling"],
    avatar: "VM",
  },
  {
    id: "USR-007",
    name: "Anita Gupta",
    email: "anita.gupta@ircs.gov.in",
    phone: "+91-9876543216",
    role: "Catering Partner",
    department: "Catering",
    location: "Bangalore Regional Kitchen",
    status: "active",
    lastLogin: "2024-01-27 09:45:00",
    joinDate: "2023-04-22",
    permissions: ["food_preparation", "menu_planning", "quality_control"],
    avatar: "AG",
  },
  {
    id: "USR-008",
    name: "Rahul Verma",
    email: "rahul.verma@ircs.gov.in",
    phone: "+91-9876543217",
    role: "Train Manager",
    department: "Operations",
    location: "Hyderabad Central",
    status: "suspended",
    lastLogin: "2024-01-20 14:00:00",
    joinDate: "2022-12-10",
    permissions: ["train_operations", "staff_coordination", "passenger_services"],
    avatar: "RV",
  },
];

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="compliant" className="text-xs">
            Active
          </Badge>
        );
      case "inactive":
        return (
          <Badge variant="secondary" className="text-xs">
            Inactive
          </Badge>
        );
      case "suspended":
        return (
          <Badge variant="critical" className="text-xs">
            Suspended
          </Badge>
        );
      default:
        return (
          <Badge variant="default" className="text-xs">
            {status}
          </Badge>
        );
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "System Administrator":
        return <Shield className="w-4 h-4" />;
      case "Quality Inspector":
      case "Health Inspector":
        return <UserCheck className="w-4 h-4" />;
      case "Kitchen Manager":
      case "Catering Partner":
        return <ChefHat className="w-4 h-4" />;
      case "Transport Manager":
      case "Train Manager":
        return <Train className="w-4 h-4" />;
      case "Maintenance Lead":
        return <Settings className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const filteredUsers = usersData.filter((user) => {
    const matchesSearch =
      user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    const matchesStatus =
      selectedStatus === "all" || user.status === selectedStatus;
    const matchesDepartment =
      selectedDepartment === "all" || user.department === selectedDepartment;

    return matchesSearch && matchesRole && matchesStatus && matchesDepartment;
  });

  const overallStats = {
    total: usersData.length,
    active: usersData.filter((u) => u.status === "active").length,
    inactive: usersData.filter((u) => u.status === "inactive").length,
    suspended: usersData.filter((u) => u.status === "suspended").length,
    administrators: usersData.filter((u) => u.role.includes("Administrator"))
      .length,
    inspectors: usersData.filter((u) => u.role.includes("Inspector")).length,
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              User Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage system users and their permissions
            </p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Users
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {overallStats.total}
                  </p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-green-600">
                    {overallStats.active}
                  </p>
                </div>
                <UserCheck className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Inactive</p>
                  <p className="text-2xl font-bold text-gray-600">
                    {overallStats.inactive}
                  </p>
                </div>
                <Users className="w-8 h-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Suspended</p>
                  <p className="text-2xl font-bold text-red-600">
                    {overallStats.suspended}
                  </p>
                </div>
                <Shield className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Administrators
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {overallStats.administrators}
                  </p>
                </div>
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Inspectors
                  </p>
                  <p className="text-2xl font-bold text-amber-600">
                    {overallStats.inspectors}
                  </p>
                </div>
                <UserCheck className="w-8 h-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by user ID, name, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
                >
                  <option value="all">All Roles</option>
                  <option value="System Administrator">
                    System Administrator
                  </option>
                  <option value="Quality Inspector">Quality Inspector</option>
                  <option value="Health Inspector">Health Inspector</option>
                  <option value="Kitchen Manager">Kitchen Manager</option>
                  <option value="Transport Manager">Transport Manager</option>
                  <option value="Maintenance Lead">Maintenance Lead</option>
                  <option value="Catering Partner">Catering Partner</option>
                  <option value="Train Manager">Train Manager</option>
                </select>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>

                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
                >
                  <option value="all">All Departments</option>
                  <option value="IT">IT</option>
                  <option value="Quality Assurance">Quality Assurance</option>
                  <option value="Catering">Catering</option>
                  <option value="Health & Safety">Health & Safety</option>
                  <option value="Logistics">Logistics</option>
                  <option value="Facility Management">
                    Facility Management
                  </option>
                  <option value="Operations">Operations</option>
                </select>

                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  More Filters
                </Button>

                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>System Users ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-[#0F2A44] rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {user.avatar}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {user.email}
                            </div>
                            <div className="text-xs text-gray-500">
                              {user.phone}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getRoleIcon(user.role)}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {user.role}
                            </div>
                            <div className="text-xs text-gray-500">
                              {user.id}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {user.department}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {user.location}
                      </TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm text-gray-900">
                            {user.lastLogin.split(" ")[1]}
                          </div>
                          <div className="text-xs text-gray-500">
                            {user.lastLogin.split(" ")[0]}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {user.joinDate}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Eye className="w-4 h-4 text-gray-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Edit className="w-4 h-4 text-gray-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Showing {filteredUsers.length} of {usersData.length} users
                </span>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    1
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>User Profile Details - Rajesh Kumar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">
                  Personal Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-16 bg-[#0F2A44] rounded-full flex items-center justify-center">
                      <span className="text-white text-xl font-medium">RK</span>
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-900">
                        Rajesh Kumar
                      </p>
                      <p className="text-sm text-gray-600">
                        System Administrator
                      </p>
                      <Badge variant="compliant" className="text-xs mt-1">
                        Active
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2 pt-3 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        rajesh.kumar@ircs.gov.in
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        +91-9876543210
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        Mumbai Central Office
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">
                  Professional Details
                </h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Department</p>
                      <p className="text-sm font-medium text-gray-900">IT</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Employee ID</p>
                      <p className="text-sm font-medium text-gray-900">
                        USR-001
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Join Date</p>
                      <p className="text-sm text-gray-900">2022-03-15</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Last Login</p>
                      <p className="text-sm text-gray-900">2024-01-27 14:30</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-900 mb-2">
                      Permissions
                    </p>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="secondary" className="text-xs">
                        Full Access
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        User Management
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        System Config
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Quick Actions</h4>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Shield className="w-4 h-4 mr-2" />
                    Manage Permissions
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="w-4 h-4 mr-2" />
                    View Activity Log
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Account Settings
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
              >
                <Plus className="w-6 h-6" />
                <span className="text-sm">Add New User</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
              >
                <Users className="w-6 h-6" />
                <span className="text-sm">Bulk Import</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
              >
                <Shield className="w-6 h-6" />
                <span className="text-sm">Permission Matrix</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
              >
                <Download className="w-6 h-6" />
                <span className="text-sm">Export Users</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
