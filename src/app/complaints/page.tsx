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
  AlertTriangle,
  Search,
  Filter,
  Download,
  Eye,
  MessageSquare,
  Clock,
  Calendar,
  MapPin,
  User,
  Train,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  TrendingUp,
  FileText,
  Phone,
  Mail,
} from "lucide-react";

const complaints = [
  {
    id: "C-2024-7845",
    type: "food_quality",
    category: "Food Quality",
    title: "Food quality issue - Train 12123",
    description:
      "Complaint about stale food served in Coach A2, Seat 45. Food was cold and seemed to be from previous day.",
    passenger: "Rajesh Kumar",
    contact: "+91-9876543210",
    email: "rajesh.kumar@email.com",
    train: "12123 - Pune Express",
    route: "Mumbai to Pune",
    coach: "A2",
    seat: "45",
    date: "2024-01-27",
    time: "02:30 PM",
    status: "investigating",
    priority: "high",
    severity: "medium",
    assignedTo: "Quality Inspector - Mumbai",
    reportedBy: "Passenger",
    followUpRequired: true,
    resolution: null,
    lastUpdated: "2 hours ago",
  },
  {
    id: "C-2024-7844",
    type: "hygiene",
    category: "Hygiene",
    title: "Hygiene concern - Mumbai Central Kitchen",
    description:
      "Report of unhygienic food preparation area. Staff not wearing proper hair nets and gloves.",
    passenger: "Anonymous Staff",
    contact: "Internal Report",
    email: "internal@ircs.gov.in",
    train: "N/A - Kitchen Report",
    route: "N/A",
    coach: "Kitchen",
    seat: "N/A",
    date: "2024-01-27",
    time: "10:15 AM",
    status: "open",
    priority: "critical",
    severity: "high",
    assignedTo: "Health Inspector - Mumbai",
    reportedBy: "Staff",
    followUpRequired: true,
    resolution: null,
    lastUpdated: "4 hours ago",
  },
  {
    id: "C-2024-7843",
    type: "service",
    category: "Service",
    title: "Service delay - Train 12841",
    description:
      "Delayed food service during journey. Food served 2 hours after scheduled time.",
    passenger: "Priya Sharma",
    contact: "+91-9876543211",
    email: "priya.sharma@email.com",
    train: "12841 - Coromandel Express",
    route: "Chennai to Howrah",
    coach: "B1",
    seat: "23",
    date: "2024-01-27",
    time: "08:45 AM",
    status: "resolved",
    priority: "medium",
    severity: "low",
    assignedTo: "Service Manager - Chennai",
    reportedBy: "Passenger",
    followUpRequired: false,
    resolution: "Apology issued and service protocol reviewed",
    lastUpdated: "6 hours ago",
  },
  {
    id: "C-2024-7842",
    type: "food_quantity",
    category: "Food Quantity",
    title: "Insufficient portions - Train 12259",
    description:
      "Complaint about small food portions. Regular meal size reduced significantly.",
    passenger: "Amit Singh",
    contact: "+91-9876543212",
    email: "amit.singh@email.com",
    train: "12259 - Duronto Express",
    route: "Delhi to Mumbai",
    coach: "C3",
    seat: "12",
    date: "2024-01-26",
    time: "07:30 PM",
    status: "investigating",
    priority: "low",
    severity: "low",
    assignedTo: "Catering Manager - Delhi",
    reportedBy: "Passenger",
    followUpRequired: false,
    resolution: null,
    lastUpdated: "8 hours ago",
  },
  {
    id: "C-2024-7841",
    type: "pricing",
    category: "Pricing",
    title: "Overcharging - Train 12953",
    description:
      "Charged extra for vegetarian meal despite having valid ticket.",
    passenger: "Suresh Kumar",
    contact: "+91-9876543213",
    email: "suresh.kumar@email.com",
    train: "12953 - August Kranti Rajdhani",
    route: "Mumbai to Delhi",
    coach: "A1",
    seat: "18",
    date: "2024-01-26",
    time: "09:15 PM",
    status: "resolved",
    priority: "medium",
    severity: "medium",
    assignedTo: "Finance Team - Mumbai",
    reportedBy: "Passenger",
    followUpRequired: false,
    resolution: "Refund processed and staff counselled",
    lastUpdated: "1 day ago",
  },
  {
    id: "C-2024-7840",
    type: "staff_behavior",
    category: "Staff Behavior",
    title: "Rude staff behavior - Train 12433",
    description:
      "Catering staff was rude and unresponsive to passenger requests.",
    passenger: "Anita Desai",
    contact: "+91-9876543214",
    email: "anita.desai@email.com",
    train: "12433 - Rajdhani Express",
    route: "Bangalore to Delhi",
    coach: "B2",
    seat: "34",
    date: "2024-01-25",
    time: "06:45 PM",
    status: "investigating",
    priority: "high",
    severity: "high",
    assignedTo: "HR Manager - Bangalore",
    reportedBy: "Passenger",
    followUpRequired: true,
    resolution: null,
    lastUpdated: "2 days ago",
  },
];

export default function ComplaintsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "resolved":
        return (
          <Badge variant="compliant" className="text-xs">
            Resolved
          </Badge>
        );
      case "investigating":
        return (
          <Badge variant="pending" className="text-xs">
            Investigating
          </Badge>
        );
      case "open":
        return (
          <Badge variant="critical" className="text-xs">
            Open
          </Badge>
        );
      case "closed":
        return (
          <Badge variant="outline" className="text-xs">
            Closed
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

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "critical":
        return (
          <Badge variant="critical" className="text-xs">
            Critical
          </Badge>
        );
      case "high":
        return (
          <Badge variant="pending" className="text-xs">
            High
          </Badge>
        );
      case "medium":
        return (
          <Badge variant="secondary" className="text-xs">
            Medium
          </Badge>
        );
      case "low":
        return (
          <Badge variant="outline" className="text-xs">
            Low
          </Badge>
        );
      default:
        return (
          <Badge variant="default" className="text-xs">
            {priority}
          </Badge>
        );
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return (
          <Badge variant="critical" className="text-xs">
            High
          </Badge>
        );
      case "medium":
        return (
          <Badge variant="pending" className="text-xs">
            Medium
          </Badge>
        );
      case "low":
        return (
          <Badge variant="outline" className="text-xs">
            Low
          </Badge>
        );
      default:
        return (
          <Badge variant="default" className="text-xs">
            {severity}
          </Badge>
        );
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "food_quality":
        return "🍽️";
      case "hygiene":
        return "🧼";
      case "service":
        return "⏱️";
      case "food_quantity":
        return "📏";
      case "pricing":
        return "💰";
      case "staff_behavior":
        return "👥";
      default:
        return "📋";
    }
  };

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.passenger.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.train.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || complaint.status === selectedStatus;
    const matchesPriority =
      selectedPriority === "all" || complaint.priority === selectedPriority;
    const matchesCategory =
      selectedCategory === "all" || complaint.category === selectedCategory;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const overallStats = {
    total: complaints.length,
    open: complaints.filter((c) => c.status === "open").length,
    investigating: complaints.filter((c) => c.status === "investigating")
      .length,
    resolved: complaints.filter((c) => c.status === "resolved").length,
    critical: complaints.filter((c) => c.priority === "critical").length,
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Complaints Management
            </h1>
            <p className="text-gray-600 mt-1">
              Track and resolve passenger complaints efficiently
            </p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Log New Complaint
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Complaints
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {overallStats.total}
                  </p>
                </div>
                <MessageSquare className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Open</p>
                  <p className="text-2xl font-bold text-red-600">
                    {overallStats.open}
                  </p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Investigating
                  </p>
                  <p className="text-2xl font-bold text-amber-600">
                    {overallStats.investigating}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Resolved</p>
                  <p className="text-2xl font-bold text-green-600">
                    {overallStats.resolved}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Critical</p>
                  <p className="text-2xl font-bold text-red-600">
                    {overallStats.critical}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
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
                    placeholder="Search by complaint ID, title, passenger, or train..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="investigating">Investigating</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>

                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
                >
                  <option value="all">All Priority</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
                >
                  <option value="all">All Categories</option>
                  <option value="Food Quality">Food Quality</option>
                  <option value="Hygiene">Hygiene</option>
                  <option value="Service">Service</option>
                  <option value="Food Quantity">Food Quantity</option>
                  <option value="Pricing">Pricing</option>
                  <option value="Staff Behavior">Staff Behavior</option>
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

        {/* Complaints Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Complaint Records ({filteredComplaints.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Passenger</TableHead>
                    <TableHead>Train</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredComplaints.map((complaint) => (
                    <TableRow key={complaint.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        {complaint.id}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">
                            {getTypeIcon(complaint.type)}
                          </span>
                          <span className="text-sm text-gray-600">
                            {complaint.category}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {complaint.title}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {complaint.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {complaint.passenger}
                          </div>
                          <div className="text-xs text-gray-500">
                            {complaint.contact}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {complaint.train}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm text-gray-900">
                            {complaint.date}
                          </div>
                          <div className="text-xs text-gray-500">
                            {complaint.time}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(complaint.status)}</TableCell>
                      <TableCell>
                        {getPriorityBadge(complaint.priority)}
                      </TableCell>
                      <TableCell>
                        {getSeverityBadge(complaint.severity)}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {complaint.assignedTo}
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
                            <MessageSquare className="w-4 h-4 text-gray-600" />
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
                  Showing {filteredComplaints.length} of {complaints.length}{" "}
                  complaints
                </span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled
                    className="text-gray-700 border-gray-300 hover:bg-gray-50"
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-gray-700 border-gray-300 hover:bg-gray-50"
                  >
                    1
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-gray-700 border-gray-300 hover:bg-gray-50"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Complaint Card */}
        <Card>
          <CardHeader>
            <CardTitle>Critical Complaint Details - C-2024-7844</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">
                  Complaint Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Hygiene concern - Mumbai Central Kitchen
                      </p>
                      <p className="text-sm text-gray-600">
                        Report of unhygienic food preparation area. Staff not
                        wearing proper hair nets and gloves.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500">Reported By</p>
                      <p className="text-sm font-medium text-gray-900">
                        Anonymous Staff
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Contact</p>
                      <p className="text-sm text-gray-600">Internal Report</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Date & Time</p>
                      <p className="text-sm text-gray-900">
                        2024-01-27 10:15 AM
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="text-sm text-gray-900">
                        Mumbai Central Kitchen
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Action Required</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-medium text-red-900">
                        Immediate Action Required
                      </span>
                    </div>
                    <p className="text-xs text-red-700">
                      Critical hygiene violation that could affect food safety
                      and passenger health.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-700">
                        Immediate inspection scheduled
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <span className="text-sm text-gray-700">
                        Staff training required
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-700">
                        Report to be filed with FSSAI
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-200">
                    <Button className="w-full">Take Immediate Action</Button>
                  </div>
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
                <span className="text-sm">Log New Complaint</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
              >
                <MessageSquare className="w-6 h-6" />
                <span className="text-sm">Follow-up Required</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
              >
                <Download className="w-6 h-6" />
                <span className="text-sm">Export Reports</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
              >
                <TrendingUp className="w-6 h-6" />
                <span className="text-sm">Analytics Dashboard</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
