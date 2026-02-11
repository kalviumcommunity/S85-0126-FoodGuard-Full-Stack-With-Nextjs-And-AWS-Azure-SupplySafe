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
import { Progress } from "@/components/ui/progress";
import {
  Shield,
  Search,
  Filter,
  Download,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  MapPin,
  User,
  Thermometer,
  TrendingUp,
  TrendingDown,
  FileText,
  Plus,
  ChefHat,
  Building,
} from "lucide-react";

const hygieneReports = [
  {
    id: "HYG-2024-7845",
    kitchen: "Mumbai Central Kitchen",
    inspector: "Dr. Anita Sharma",
    date: "2024-01-27",
    time: "10:30 AM",
    overallScore: 92,
    status: "compliant",
    priority: "low",
    categories: {
      foodHandling: 95,
      storageTemperature: 88,
      kitchenCleanliness: 90,
      personalHygiene: 96,
      equipmentSanitation: 91,
    },
    issues: 2,
    recommendations: 1,
    nextInspection: "2024-02-27",
    location: "Mumbai, Maharashtra",
  },
  {
    id: "HYG-2024-7844",
    kitchen: "Pune Regional Kitchen",
    inspector: "Mr. Rajesh Kumar",
    date: "2024-01-27",
    time: "08:15 AM",
    overallScore: 76,
    status: "warning",
    priority: "medium",
    categories: {
      foodHandling: 82,
      storageTemperature: 70,
      kitchenCleanliness: 68,
      personalHygiene: 85,
      equipmentSanitation: 75,
    },
    issues: 8,
    recommendations: 5,
    nextInspection: "2024-02-03",
    location: "Pune, Maharashtra",
  },
  {
    id: "HYG-2024-7843",
    kitchen: "Nagpur Central Kitchen",
    inspector: "Dr. Priya Desai",
    date: "2024-01-26",
    time: "02:45 PM",
    overallScore: 68,
    status: "critical",
    priority: "high",
    categories: {
      foodHandling: 72,
      storageTemperature: 65,
      kitchenCleanliness: 60,
      personalHygiene: 78,
      equipmentSanitation: 65,
    },
    issues: 15,
    recommendations: 8,
    nextInspection: "2024-01-30",
    location: "Nagpur, Maharashtra",
  },
  {
    id: "HYG-2024-7842",
    kitchen: "Delhi Main Kitchen",
    inspector: "Mr. Vikram Mehta",
    date: "2024-01-26",
    time: "11:00 AM",
    overallScore: 95,
    status: "compliant",
    priority: "low",
    categories: {
      foodHandling: 98,
      storageTemperature: 92,
      kitchenCleanliness: 94,
      personalHygiene: 97,
      equipmentSanitation: 94,
    },
    issues: 1,
    recommendations: 0,
    nextInspection: "2024-02-26",
    location: "Delhi, NCR",
  },
  {
    id: "HYG-2024-7841",
    kitchen: "Chennai Central Kitchen",
    inspector: "Dr. Suresh Iyer",
    date: "2024-01-25",
    time: "09:30 AM",
    overallScore: 83,
    status: "compliant",
    priority: "medium",
    categories: {
      foodHandling: 85,
      storageTemperature: 80,
      kitchenCleanliness: 82,
      personalHygiene: 88,
      equipmentSanitation: 80,
    },
    issues: 4,
    recommendations: 3,
    nextInspection: "2024-02-08",
    location: "Chennai, Tamil Nadu",
  },
];

export default function HygienePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "compliant":
        return (
          <Badge variant="compliant" className="text-xs">
            Compliant
          </Badge>
        );
      case "warning":
        return (
          <Badge variant="pending" className="text-xs">
            Warning
          </Badge>
        );
      case "critical":
        return (
          <Badge variant="critical" className="text-xs">
            Critical
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
            {priority}
          </Badge>
        );
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-amber-600";
    return "text-red-600";
  };

  const getProgressColor = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 80) return "bg-amber-500";
    return "bg-red-500";
  };

  const filteredReports = hygieneReports.filter((report) => {
    const matchesSearch =
      report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.kitchen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.inspector.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || report.status === selectedStatus;
    const matchesPriority =
      selectedPriority === "all" || report.priority === selectedPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const overallStats = {
    totalReports: hygieneReports.length,
    compliant: hygieneReports.filter((r) => r.status === "compliant").length,
    warning: hygieneReports.filter((r) => r.status === "warning").length,
    critical: hygieneReports.filter((r) => r.status === "critical").length,
    averageScore: Math.round(
      hygieneReports.reduce((acc, r) => acc + r.overallScore, 0) /
        hygieneReports.length
    ),
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Hygiene Reports
            </h1>
            <p className="text-gray-600 mt-1">
              Monitor and manage hygiene compliance across all kitchens
            </p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Inspection
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Reports
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {overallStats.totalReports}
                  </p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Compliant</p>
                  <p className="text-2xl font-bold text-green-600">
                    {overallStats.compliant}
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
                  <p className="text-sm font-medium text-gray-600">Warning</p>
                  <p className="text-2xl font-bold text-amber-600">
                    {overallStats.warning}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-amber-600" />
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

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Score</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {overallStats.averageScore}%
                  </p>
                </div>
                <Shield className="w-8 h-8 text-purple-600" />
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
                    placeholder="Search by report ID, kitchen, or inspector..."
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
                  <option value="compliant">Compliant</option>
                  <option value="warning">Warning</option>
                  <option value="critical">Critical</option>
                </select>

                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
                >
                  <option value="all">All Priority</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
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

        {/* Reports Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Hygiene Inspection Reports ({filteredReports.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report ID</TableHead>
                    <TableHead>Kitchen</TableHead>
                    <TableHead>Inspector</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Overall Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Issues</TableHead>
                    <TableHead>Next Inspection</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((report) => (
                    <TableRow key={report.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{report.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {report.kitchen}
                          </div>
                          <div className="text-xs text-gray-500">
                            {report.location}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {report.inspector}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm text-gray-900">
                            {report.date}
                          </div>
                          <div className="text-xs text-gray-500">
                            {report.time}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div
                            className={`text-sm font-bold ${getScoreColor(report.overallScore)}`}
                          >
                            {report.overallScore}%
                          </div>
                          <Progress
                            value={report.overallScore}
                            className="h-2 mt-1"
                          />
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(report.status)}</TableCell>
                      <TableCell>{getPriorityBadge(report.priority)}</TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-900">
                          {report.issues}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {report.nextInspection}
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
                            <Download className="w-4 h-4 text-gray-600" />
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
                  Showing {filteredReports.length} of {hygieneReports.length}{" "}
                  reports
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

        {/* Detailed Report Card */}
        <Card>
          <CardHeader>
            <CardTitle>Latest Detailed Report - HYG-2024-7843</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">
                  Category Breakdown
                </h4>
                {hygieneReports[2].categories &&
                  Object.entries(hygieneReports[2].categories).map(
                    ([category, score]) => (
                      <div key={category} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700 capitalize">
                            {category.replace(/([A-Z])/g, " $1").trim()}
                          </span>
                          <span
                            className={`text-sm font-bold ${getScoreColor(score)}`}
                          >
                            {score}%
                          </span>
                        </div>
                        <Progress value={score} className="h-2" />
                      </div>
                    )
                  )}
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">
                  Key Issues Found
                </h4>
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Storage temperature above safe limits
                      </p>
                      <p className="text-xs text-gray-500">
                        Critical - Immediate action required
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Kitchen cleanliness below standards
                      </p>
                      <p className="text-xs text-gray-500">
                        Medium - Schedule deep cleaning
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Equipment sanitation inadequate
                      </p>
                      <p className="text-xs text-gray-500">
                        Medium - Review cleaning protocols
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <Button className="w-full">View Full Report Details</Button>
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
                <span className="text-sm">Schedule Inspection</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
              >
                <Shield className="w-6 h-6" />
                <span className="text-sm">Generate Certificate</span>
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
