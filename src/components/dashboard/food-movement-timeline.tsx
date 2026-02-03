import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, ChefHat, Truck, Train, Users } from "lucide-react";

const timelineSteps = [
  {
    id: 1,
    title: "Supplier",
    icon: Package,
    location: "Mumbai Central Kitchen",
    time: "08:00 AM",
    status: "completed",
    responsible: "Raj Kumar - Supplier Manager",
    hygiene: "compliant",
    qr: "verified",
  },
  {
    id: 2,
    title: "Kitchen",
    icon: ChefHat,
    location: "Central Kitchen - Mumbai",
    time: "10:30 AM",
    status: "completed",
    responsible: "Priya Sharma - Head Chef",
    hygiene: "compliant",
    qr: "verified",
  },
  {
    id: 3,
    title: "Transport",
    icon: Truck,
    location: "Mumbai to Pune Route",
    time: "02:00 PM",
    status: "in-progress",
    responsible: "Amit Singh - Transport Lead",
    hygiene: "pending",
    qr: "pending",
  },
  {
    id: 4,
    title: "Train",
    icon: Train,
    location: "Train 12123 - Pune Express",
    time: "04:30 PM",
    status: "pending",
    responsible: "Suresh Kumar - Train Manager",
    hygiene: "pending",
    qr: "pending",
  },
  {
    id: 5,
    title: "Passenger",
    icon: Users,
    location: "Coach A2 - Seat 45",
    time: "06:00 PM",
    status: "pending",
    responsible: "Service Staff",
    hygiene: "pending",
    qr: "pending",
  },
];

export function FoodMovementTimeline() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Food Movement Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {timelineSteps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = step.status === "completed";
            const isInProgress = step.status === "in-progress";

            return (
              <div key={step.id} className="flex items-start space-x-4">
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    isCompleted
                      ? "bg-green-100"
                      : isInProgress
                        ? "bg-amber-100"
                        : "bg-gray-100"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isCompleted
                        ? "text-green-600"
                        : isInProgress
                          ? "text-amber-600"
                          : "text-gray-400"
                    }`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-gray-900">
                      {step.title}
                    </h4>
                    <Badge
                      variant={
                        isCompleted
                          ? "compliant"
                          : isInProgress
                            ? "pending"
                            : "default"
                      }
                    >
                      {step.status}
                    </Badge>
                  </div>

                  <div className="space-y-1 text-xs text-gray-600">
                    <p>
                      <span className="font-medium">Location:</span>{" "}
                      {step.location}
                    </p>
                    <p>
                      <span className="font-medium">Time:</span> {step.time}
                    </p>
                    <p>
                      <span className="font-medium">Responsible:</span>{" "}
                      {step.responsible}
                    </p>

                    <div className="flex items-center space-x-4 pt-1">
                      <div className="flex items-center space-x-1">
                        <span className="font-medium">Hygiene:</span>
                        <Badge
                          variant={
                            step.hygiene === "compliant"
                              ? "compliant"
                              : step.hygiene === "pending"
                                ? "pending"
                                : "critical"
                          }
                          className="text-xs"
                        >
                          {step.hygiene}
                        </Badge>
                      </div>

                      <div className="flex items-center space-x-1">
                        <span className="font-medium">QR:</span>
                        <Badge
                          variant={
                            step.qr === "verified"
                              ? "compliant"
                              : step.qr === "pending"
                                ? "pending"
                                : "critical"
                          }
                          className="text-xs"
                        >
                          {step.qr}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {index < timelineSteps.length - 1 && (
                  <div className="absolute left-5 mt-10 w-0.5 h-16 bg-gray-200" />
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  );
}
