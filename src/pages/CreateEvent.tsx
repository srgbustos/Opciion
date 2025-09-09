import { LandingPage } from "@/components/LandingPage";
import { Navigation } from "@/components/Navigation";

const CreateEvent = () => {
  const handleGetStarted = () => {
    // Could navigate to an event creation form or scroll to form section
    // For now, we'll keep the existing behavior
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <LandingPage onGetStarted={handleGetStarted} />
    </div>
  );
};

export default CreateEvent;
