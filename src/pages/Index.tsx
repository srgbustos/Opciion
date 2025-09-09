import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { LandingPage } from "@/components/LandingPage";
import { OrganizerDashboard } from "@/components/OrganizerDashboard";
import { EventListing } from "@/components/EventListing";
import { ParticipantDashboard } from "@/components/ParticipantDashboard";

const Index = () => {
  const [currentView, setCurrentView] = useState<"landing" | "organizer" | "participant" | "events">("events");

  const handleGetStarted = () => {
    setCurrentView("events");
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "organizer":
        return <OrganizerDashboard />;
      case "participant":
        return <ParticipantDashboard />;
      case "events":
        return <EventListing />;
      default:
        return <LandingPage onGetStarted={handleGetStarted} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      {renderCurrentView()}
    </div>
  );
};

export default Index;
