import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Package,
  ChefHat,
  Truck,
  Train,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  User,
  Thermometer,
  QrCode,
  Shield,
} from "lucide-react";

const traceabilitySteps = [
  {
    id: "supplier",
    title: "Supplier",
    icon: Package,
    status: "completed",
    timestamp: "2024-01-27 08:00 AM",
    location: "Fresh Foods Ltd, Mumbai",
    responsible: "Raj Kumar - Supplier Manager",
    details: {
      temperature: "4°C",
      hygieneScore: 95,
      qrVerified: true,
      batchId: "BATCH-7845",
      items: 245,
    },
  },
  {
    id: "kitchen",
    title: "Kitchen",
    icon: ChefHat,
    status: "completed",
    timestamp: "2024-01-27 10:30 AM",
    location: "Central Kitchen - Mumbai",
    responsible: "Priya Sharma - Head Chef",
    details: {
      temperature: "18°C",
      hygieneScore: 92,
      qrVerified: true,
      batchId: "BATCH-7845",
      items: 245,
    },
  },
  {
    id: "transport",
    title: "Transport",
    icon: Truck,
    status: "in-progress",
    timestamp: "2024-01-27 02:00 PM",
    location: "Mumbai to Pune Route",
    responsible: "Amit Singh - Transport Lead",
    details: {
      temperature: "8°C",
      hygieneScore: 88,
      qrVerified: true,
      batchId: "BATCH-7845",
      items: 245,
    },
  },
  {
    id: "train",
    title: "Train",
    icon: Train,
    status: "pending",
    timestamp: "2024-01-27 04:30 PM (ETA)",
    location: "Train 12123 - Pune Express",
    responsible: "Suresh Kumar - Train Manager",
    details: {
      temperature: "12°C",
      hygieneScore: 85,
      qrVerified: false,
      batchId: "BATCH-7845",
      items: 245,
    },
  },
  {
    id: "passenger",
    title: "Passenger",
    icon: Users,
    status: "pending",
    timestamp: "2024-01-27 06:00 PM (ETA)",
    location: "Coach A2 - Seat 45",
    responsible: "Service Staff",
    details: {
      temperature: "15°C",
      hygieneScore: 90,
      qrVerified: false,
      batchId: "BATCH-7845",
      items: 245,
    },
  },
];

export function TraceabilityFlow() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case "in-progress":
        return <Clock className="w-6 h-6 text-amber-600" />;
      case "pending":
        return (
          <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
        );
      default:
        return <XCircle className="w-6 h-6 text-red-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="compliant" className="text-xs">
            Completed
          </Badge>
        );
      case "in-progress":
        return (
          <Badge variant="pending" className="text-xs">
            In Progress
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="text-xs">
            Pending
          </Badge>
        );
      default:
        return (
          <Badge variant="critical" className="text-xs">
            Failed
          </Badge>
        );
    }
  };

  const getTemperatureColor = (temp: string) => {
    const tempNum = parseInt(temp);
    if (tempNum <= 5) return "text-blue-600";
    if (tempNum <= 10) return "text-green-600";
    if (tempNum <= 15) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Food Traceability Flow
            </h2>
            <p className="text-gray-600 mt-1">
              Complete journey from supplier to passenger
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="text-sm">
              Batch ID: BATCH-7845
            </Badge>
            <Badge variant="outline" className="text-sm">
              245 Items
            </Badge>
          </div>
        </div>
      </div>

      {/* Horizontal Flow */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between relative">
          {/* Connection Line */}
          <div className="absolute top-12 left-0 right-0 h-0.5 bg-gray-200 z-0"></div>

          {/* Steps */}
          {traceabilitySteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className="flex flex-col items-center space-y-4 z-10"
              >
                {/* Icon and Status */}
                <div className="flex flex-col items-center space-y-2">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      step.status === "completed"
                        ? "bg-green-100"
                        : step.status === "in-progress"
                          ? "bg-amber-100"
                          : "bg-gray-100"
                    }`}
                  >
                    <Icon
                      className={`w-8 h-8 ${
                        step.status === "completed"
                          ? "text-green-600"
                          : step.status === "in-progress"
                            ? "text-amber-600"
                            : "text-gray-400"
                      }`}
                    />
                  </div>
                  {getStatusIcon(step.status)}
                </div>

                {/* Step Info */}
                <div className="text-center">
                  <h3 className="font-semibold text-gray-900">{step.title}</h3>
                  {getStatusBadge(step.status)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {traceabilitySteps.map((step) => {
          const Icon = step.icon;
          return (
            <Card
              key={step.id}
              className={`${
                step.status === "completed"
                  ? "border-green-200 bg-green-50"
                  : step.status === "in-progress"
                    ? "border-amber-200 bg-amber-50"
                    : "border-gray-200"
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        step.status === "completed"
                          ? "bg-green-100"
                          : step.status === "in-progress"
                            ? "bg-amber-100"
                            : "bg-gray-100"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          step.status === "completed"
                            ? "text-green-600"
                            : step.status === "in-progress"
                              ? "text-amber-600"
                              : "text-gray-400"
                        }`}
                      />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{step.title}</CardTitle>
                      {getStatusBadge(step.status)}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Timestamp and Location */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{step.timestamp}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{step.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span>{step.responsible}</span>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Thermometer className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Temperature</p>
                      <p
                        className={`text-sm font-semibold ${getTemperatureColor(step.details.temperature)}`}
                      >
                        {step.details.temperature}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Hygiene Score</p>
                      <p
                        className={`text-sm font-semibold ${
                          step.details.hygieneScore >= 90
                            ? "text-green-600"
                            : step.details.hygieneScore >= 80
                              ? "text-amber-600"
                              : "text-red-600"
                        }`}
                      >
                        {step.details.hygieneScore}%
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <QrCode className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">QR Status</p>
                      <p
                        className={`text-sm font-semibold ${
                          step.details.qrVerified
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {step.details.qrVerified ? "Verified" : "Pending"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Package className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Items</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {step.details.items}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {step.status === "in-progress" && (
                  <div className="pt-3 border-t border-gray-200">
                    <Button variant="outline" size="sm" className="w-full">
                      View Live Tracking
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Traceability Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">2</div>
              <div className="text-sm text-gray-600">Stages Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">1</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">2</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">90%</div>
              <div className="text-sm text-gray-600">Overall Compliance</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
