import { LandingPage } from "@/components/LandingPage";
import { Navigation } from "@/components/Navigation";

const About = () => {
  const handleGetStarted = () => {
    // Navigate to home page with events
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <LandingPage onGetStarted={handleGetStarted} />
    </div>
  );
};

export default About;