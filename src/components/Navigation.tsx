import { Button } from "@/components/ui/button";
import { Calendar, Users, PlusCircle, BarChart3, Info } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

interface NavigationProps {
  currentView: "landing" | "organizer" | "participant" | "events";
  onViewChange: (view: "landing" | "organizer" | "participant" | "events") => void;
}

export const Navigation = ({ currentView, onViewChange }: NavigationProps) => {
  const [userRole, setUserRole] = useState<"organizer" | "participant" | null>(null);

  return (
    <nav className="bg-card border-b border-border shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div 
              className="flex items-center space-x-2 cursor-pointer" 
              onClick={() => onViewChange("landing")}
            >
              <Calendar className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                EventFlow
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant={currentView === "events" ? "default" : "ghost"}
              onClick={() => onViewChange("events")}
              className="flex items-center space-x-2"
            >
              <Calendar className="h-4 w-4" />
              <span>Discover Events</span>
            </Button>

            <Button
              variant={currentView === "landing" ? "default" : "ghost"}
              onClick={() => onViewChange("landing")}
              className="flex items-center space-x-2"
            >
              <Info className="h-4 w-4" />
              <span>About</span>
            </Button>

            {userRole === "organizer" && (
              <Button
                variant={currentView === "organizer" ? "default" : "ghost"}
                onClick={() => onViewChange("organizer")}
                className="flex items-center space-x-2"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Dashboard</span>
              </Button>
            )}

            <div className="flex items-center space-x-2">
              <Button
                variant="default"
                onClick={() => {
                  setUserRole("organizer");
                  onViewChange("organizer");
                }}
                size="sm"
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                Create Event
              </Button>
              
              <Button
                variant={userRole === "participant" ? "default" : "outline"}
                onClick={() => {
                  setUserRole("participant");
                  onViewChange("participant");
                }}
                size="sm"
              >
                <Users className="h-4 w-4 mr-1" />
                My Events
              </Button>

              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};