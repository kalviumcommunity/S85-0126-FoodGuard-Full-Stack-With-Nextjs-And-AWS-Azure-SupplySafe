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
  Bell,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  TrendingUp,
  Thermometer,
  Settings,
  Eye,
  Archive,
  Trash2,
  Package,
} from "lucide-react";

const alerts = [
  {
    id: "ALT-2024-7845",
    type: "critical",
    category: "Temperature",
    title: "Temperature Violation - Storage Unit A3",
    description:
      "Temperature exceeded safe limits for dairy products. Current temp: 12°C (Safe: ≤4°C)",
    location: "Mumbai Central Kitchen",
    severity: "high",
    status: "active",
    priority: "critical",
    source: "IoT Sensor - TEMP-A3-001",
    timestamp: "2024-01-27 14:30:00",
    acknowledged: false,
    assignedTo: "Maintenance Team",
    estimatedResolution: "2 hours",
    impact: "High - Risk of food spoilage affecting 245 meals",
    actions: ["Immediate cooling required", "Inspect refrigeration unit", "Check temperature logs"]
  },
  {
    id: "ALT-2024-7844",
    type: "warning",
    category: "Hygiene",
    title: "Hygiene Score Drop - Kitchen B2",
    description:
      "Hygiene compliance fell below 80% threshold during routine inspection",
    location: "Pune Regional Kitchen",
    severity: "medium",
    status: "active",
    priority: "high",
    source: "Quality Inspector - Dr. Anita Sharma",
    timestamp: "2024-01-27 13:15:00",
    acknowledged: true,
    assignedTo: "Quality Inspector",
    estimatedResolution: "4 hours",
    impact: "Medium - May affect food quality standards",
    actions: ["Schedule deep cleaning", "Retrain staff on hygiene protocols", "Follow-up inspection"]
  },
  {
    id: "ALT-2024-7843",
    type: "info",
    category: "Maintenance",
    title: "Scheduled Maintenance - Equipment C1",
    description: "Routine maintenance scheduled for refrigeration unit C1",
    location: "Nagpur Kitchen",
    severity: "low",
    status: "scheduled",
    priority: "medium",
    source: "Facility Manager",
    timestamp: "2024-01-27 12:00:00",
    acknowledged: true,
    assignedTo: "Maintenance Team",
    estimatedResolution: "6 hours",
    impact: "Low - Temporary equipment downtime",
    actions: ["Backup refrigeration ready", "Inform catering staff", "Update inventory"]
  },
  {
    id: "ALT-2024-7842",
    type: "critical",
    category: "QR Verification",
    title: "QR Verification Failed - Batch #7845",
    description:
      "Food batch QR code could not be verified at transport checkpoint",
    location: "Transport Hub - Mumbai",
    severity: "high",
    status: "resolved",
    priority: "critical",
    source: "Transport Scanner - TH-MUM-01",
    timestamp: "2024-01-27 11:45:00",
    acknowledged: true,
    assignedTo: "IT Support",
    estimatedResolution: "Resolved",
    impact: "High - Traceability chain broken",
    actions: ["QR code regenerated", "System updated", "Staff trained"]
  },
  {
    id: "ALT-2024-7841",
    type: "warning",
    category: "Inventory",
    title: "Low Stock Alert - Essential Supplies",
    description: "Critical supplies running below minimum threshold levels",
    location: "Delhi Main Kitchen",
    severity: "medium",
    status: "active",
    priority: "medium",
    source: "Inventory System",
    timestamp: "2024-01-27 10:30:00",
    acknowledged: false,
    assignedTo: "Procurement Team",
    estimatedResolution: "24 hours",
    impact: "Medium - May affect meal preparation",
    actions: ["Place emergency order", "Contact backup suppliers", "Adjust meal planning"]
  },
  {
    id: "ALT-2024-7840",
    type: "info",
    category: "System",
    title: "System Update Scheduled",
    description: "DFTS system maintenance scheduled for tonight",
    location: "All Locations",
    severity: "low",
    status: "scheduled",
    priority: "low",
    source: "System Administrator",
    timestamp: "2024-01-27 09:00:00",
    acknowledged: true,
    assignedTo: "IT Team",
    estimatedResolution: "2 hours",
    impact: "Low - Temporary system unavailable",
    actions: ["Backup data", "Inform all users", "Rollback plan ready"]
  },
];

export default function AlertsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "critical":
        return (
          <Badge variant="critical" className="text-xs">
            Critical
          </Badge>
        );
      case "warning":
        return (
          <Badge variant="pending" className="text-xs">
            Warning
          </Badge>
        );
      case "info":
        return (
          <Badge variant="secondary" className="text-xs">
            Info
          </Badge>
        );
      default:
        return (
          <Badge variant="default" className="text-xs">
            {type}
          </Badge>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="critical" className="text-xs">
            Active
          </Badge>
        );
      case "resolved":
        return (
          <Badge variant="compliant" className="text-xs">
            Resolved
          </Badge>
        );
      case "scheduled":
        return (
          <Badge variant="outline" className="text-xs">
            Scheduled
          </Badge>
        );
      case "acknowledged":
        return (
          <Badge variant="secondary" className="text-xs">
            Acknowledged
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Temperature":
        return <Thermometer className="w-4 h-4" />;
      case "Hygiene":
        return <AlertCircle className="w-4 h-4" />;
      case "Maintenance":
        return <Settings className="w-4 h-4" />;
      case "QR Verification":
        return <CheckCircle className="w-4 h-4" />;
      case "Inventory":
        return <Package className="w-4 h-4" />;
      case "System":
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || alert.type === selectedType;
    const matchesStatus =
      selectedStatus === "all" || alert.status === selectedStatus;
    const matchesPriority =
      selectedPriority === "all" || alert.priority === selectedPriority;

    return matchesSearch && matchesType && matchesStatus && matchesPriority;
  });

  const overallStats = {
    total: alerts.length,
    critical: alerts.filter((a) => a.type === "critical").length,
    warning: alerts.filter((a) => a.type === "warning").length,
    info: alerts.filter((a) => a.type === "info").length,
    active: alerts.filter((a) => a.status === "active").length,
    resolved: alerts.filter((a) => a.status === "resolved").length,
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Alerts Management
            </h1>
            <p className="text-gray-600 mt-1">
              Monitor and respond to system alerts in real-time
            </p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Alert
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Alerts
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {overallStats.total}
                  </p>
                </div>
                <Bell className="w-8 h-8 text-blue-600" />
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
                  <p className="text-sm font-medium text-gray-600">Warning</p>
                  <p className="text-2xl font-bold text-amber-600">
                    {overallStats.warning}
                  </p>
                </div>
                <AlertCircle className="w-8 h-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Info</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {overallStats.info}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-red-600">
                    {overallStats.active}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-red-600" />
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
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by alert ID, title, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="critical">Critical</option>
                  <option value="warning">Warning</option>
                  <option value="info">Info</option>
                </select>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="resolved">Resolved</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="acknowledged">Acknowledged</option>
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

        {/* Alerts Table */}
        <Card>
          <CardHeader>
            <CardTitle>Active Alerts ({filteredAlerts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAlerts.map((alert) => (
                    <TableRow key={alert.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{alert.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getCategoryIcon(alert.category)}
                          <div>
                            <div>{getTypeBadge(alert.type)}</div>
                            <div className="text-xs text-gray-500">
                              {alert.category}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {alert.title}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {alert.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {alert.location}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            alert.severity === "high"
                              ? "critical"
                              : alert.severity === "medium"
                                ? "pending"
                                : "secondary"
                          }
                          className="text-xs"
                        >
                          {alert.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(alert.status)}</TableCell>
                      <TableCell>{getPriorityBadge(alert.priority)}</TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {alert.assignedTo}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm text-gray-900">
                            {alert.timestamp.split(" ")[1]}
                          </div>
                          <div className="text-xs text-gray-500">
                            {alert.timestamp.split(" ")[0]}
                          </div>
                        </div>
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
                            <Archive className="w-4 h-4 text-gray-600" />
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
                  Showing {filteredAlerts.length} of {alerts.length} alerts
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

        {/* Critical Alert Details */}
        <Card>
          <CardHeader>
            <CardTitle>Critical Alert Details - ALT-2024-7845</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">
                  Alert Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Temperature Violation - Storage Unit A3
                      </p>
                      <p className="text-sm text-gray-600">
                        Temperature exceeded safe limits for dairy products.
                        Current temp: 12°C (Safe: ≤4°C)
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500">Source</p>
                      <p className="text-sm font-medium text-gray-900">
                        IoT Sensor - TEMP-A3-001
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="text-sm text-gray-900">
                        Mumbai Central Kitchen
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Impact</p>
                      <p className="text-sm text-red-600">
                        High - Risk of food spoilage affecting 245 meals
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Est. Resolution</p>
                      <p className="text-sm text-gray-900">2 hours</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">
                  Required Actions
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                    <span className="text-sm text-gray-700">
                      Immediate cooling required
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                    <span className="text-sm text-gray-700">
                      Inspect refrigeration unit
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-sm text-gray-700">
                      Check temperature logs
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-2">
                    <Button className="w-full">Acknowledge Alert</Button>
                    <Button variant="outline" className="w-full">
                      Mark Resolved
                    </Button>
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
                <span className="text-sm">Create Alert</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
              >
                <Bell className="w-6 h-6" />
                <span className="text-sm">Acknowledge All</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
              >
                <Archive className="w-6 h-6" />
                <span className="text-sm">Archive Resolved</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
              >
                <Settings className="w-6 h-6" />
                <span className="text-sm">Alert Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
