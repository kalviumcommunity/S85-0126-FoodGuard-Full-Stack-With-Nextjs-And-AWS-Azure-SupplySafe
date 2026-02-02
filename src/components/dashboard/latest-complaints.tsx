import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonLoader } from "@/components/ui/loader";
import { MessageSquare, Clock, User, Train } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const complaints = [
  {
    id: "C-2024-7845",
    type: "food_quality",
    title: "Food quality issue - Train 12123",
    description: "Complaint about stale food served in Coach A2",
    passenger: "Rajesh Kumar",
    train: "12123 - Pune Express",
    route: "Mumbai to Pune",
    time: "2 hours ago",
    status: "investigating",
    priority: "high",
    assignedTo: "Quality Inspector",
  },
  {
    id: "C-2024-7844",
    type: "hygiene",
    title: "Hygiene concern - Mumbai Central Kitchen",
    description: "Report of unhygienic food preparation area",
    passenger: "Anonymous Staff",
    train: "N/A - Kitchen Report",
    route: "N/A",
    time: "4 hours ago",
    status: "open",
    priority: "critical",
    assignedTo: "Health Inspector",
  },
  {
    id: "C-2024-7843",
    type: "service",
    title: "Service delay - Train 12841",
    description: "Delayed food service during journey",
    passenger: "Priya Sharma",
    train: "12841 - Coromandel Express",
    route: "Chennai to Howrah",
    time: "6 hours ago",
    status: "resolved",
    priority: "medium",
    assignedTo: "Service Manager",
  },
  {
    id: "C-2024-7842",
    type: "food_quantity",
    title: "Insufficient portions - Train 12259",
    description: "Complaint about small food portions",
    passenger: "Amit Singh",
    train: "12259 - Duronto Express",
    route: "Delhi to Mumbai",
    time: "8 hours ago",
    status: "investigating",
    priority: "low",
    assignedTo: "Catering Manager",
  },
];

export function LatestComplaints() {
  const [isResolving, setIsResolving] = useState<string | null>(null);
  const [isAssigning, setIsAssigning] = useState<string | null>(null);

  const handleResolveComplaint = async (complaintId: string) => {
    setIsResolving(complaintId);
    toast.loading("Resolving complaint...", { id: complaintId });

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Complaint resolved successfully!", {
        id: complaintId,
        description:
          "The complaint has been marked as resolved and the passenger will be notified.",
      });
    } catch {
      toast.error("Failed to resolve complaint", {
        id: complaintId,
        description: "Please try again or contact the system administrator.",
      });
    } finally {
      setIsResolving(null);
    }
  };

  const handleAssignComplaint = async (complaintId: string) => {
    setIsAssigning(complaintId);
    toast.loading("Assigning complaint...", { id: `assign-${complaintId}` });

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Complaint assigned successfully!", {
        id: `assign-${complaintId}`,
        description:
          "The complaint has been assigned to the appropriate department.",
      });
    } catch {
      toast.error("Failed to assign complaint", {
        id: `assign-${complaintId}`,
        description: "Please check the assignment details and try again.",
      });
    } finally {
      setIsAssigning(null);
    }
  };

  const handleViewDetails = (complaint: { id: string; title: string }) => {
    toast.info("Viewing complaint details", {
      description: `Complaint ${complaint.id} - ${complaint.title}`,
    });
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <Badge variant="critical" className="text-xs">
            Open
          </Badge>
        );
      case "investigating":
        return (
          <Badge variant="pending" className="text-xs">
            Investigating
          </Badge>
        );
      case "resolved":
        return (
          <Badge variant="compliant" className="text-xs">
            Resolved
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
      default:
        return "📋";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Latest Complaints
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="critical" className="text-xs">
              1 Critical
            </Badge>
            <Badge variant="pending" className="text-xs">
              2 Open
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {complaints.map((complaint) => (
            <div
              key={complaint.id}
              className="border-l-4 border-gray-200 pl-4 py-3"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getTypeIcon(complaint.type)}</span>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">
                      {complaint.title}
                    </h4>
                    <p className="text-xs text-gray-500">{complaint.id}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  {getPriorityBadge(complaint.priority)}
                  {getStatusBadge(complaint.status)}
                </div>
              </div>

              <p className="text-xs text-gray-600 mb-2">
                {complaint.description}
              </p>

              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <User className="w-3 h-3" />
                  <span>{complaint.passenger}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Train className="w-3 h-3" />
                  <span>{complaint.train}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{complaint.time}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageSquare className="w-3 h-3" />
                  <span>{complaint.assignedTo}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-gray-100">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewDetails(complaint)}
                  className="text-xs"
                >
                  View Details
                </Button>

                {complaint.status !== "resolved" && (
                  <>
                    <ButtonLoader
                      isLoading={isAssigning === complaint.id}
                      onClick={() => handleAssignComplaint(complaint.id)}
                      size="sm"
                      loaderText="Assigning..."
                      className="text-xs"
                    >
                      Assign
                    </ButtonLoader>

                    <ButtonLoader
                      isLoading={isResolving === complaint.id}
                      onClick={() => handleResolveComplaint(complaint.id)}
                      size="sm"
                      loaderText="Resolving..."
                      className="text-xs"
                    >
                      Resolve
                    </ButtonLoader>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">4 active complaints</span>
            <Button variant="link" className="text-sm text-blue-600 p-0">
              View All Complaints →
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
