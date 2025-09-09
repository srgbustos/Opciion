import { EventListing } from "@/components/EventListing";
import { Navigation } from "@/components/Navigation";

const Events = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <EventListing />
    </div>
  );
};

export default Events;