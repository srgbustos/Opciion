import { EventListing } from "@/components/EventListing";
import { Navigation } from "@/components/Navigation";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <EventListing />
    </div>
  );
};

export default Index;