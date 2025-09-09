import { LandingPage } from "@/components/LandingPage";
import { EventCreationForm } from "@/components/EventCreationForm";
import { Navigation } from "@/components/Navigation";

const CreateEvent = () => {
  const handleGetStarted = () => {
    // Scroll to the event creation form
    const formSection = document.getElementById('event-creation-form');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <LandingPage onGetStarted={handleGetStarted} />
      <div id="event-creation-form">
        <EventCreationForm />
      </div>
    </div>
  );
};

export default CreateEvent;
