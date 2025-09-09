import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Users, TrendingUp, Shield, CreditCard, MapPin } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage = ({ onGetStarted }: LandingPageProps) => {
  const features = [
    {
      icon: CalendarDays,
      title: "Smart Event Creation",
      description: "Use our pre-built templates and modular blocks to create professional events in minutes."
    },
    {
      icon: Users,
      title: "Seamless Registration",
      description: "Custom forms, group registrations, and automated confirmation emails."
    },
    {
      icon: CreditCard,
      title: "Integrated Payments",
      description: "Stripe integration for tickets, merchandise, and add-on services."
    },
    {
      icon: TrendingUp,
      title: "Real-time Analytics",
      description: "Track registrations, sales, attendance, and participant engagement."
    },
    {
      icon: Shield,
      title: "Event Insurance",
      description: "Offer health and cancellation coverage directly at checkout."
    },
    {
      icon: MapPin,
      title: "Complete Experience",
      description: "Manage accommodations, transportation, and merchandise in one platform."
    }
  ];

  const stats = [
    { value: "10k+", label: "Events Created" },
    { value: "500k+", label: "Participants" },
    { value: "99.9%", label: "Uptime" },
    { value: "4.9/5", label: "User Rating" }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <Badge variant="secondary" className="px-4 py-2 text-sm">
                  🚀 Trusted by 10,000+ Event Organizers
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Create
                  <span className="bg-gradient-primary bg-clip-text text-transparent"> Memorable Events </span>
                  That Scale
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  From intimate workshops to large conferences, our platform provides everything you need to plan, 
                  manage, and monetize successful events.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="xl" onClick={onGetStarted}>
                  Start Creating Events
                </Button>
                <Button variant="outline" size="xl">
                  Watch Demo
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative animate-slide-up">
              <div className="absolute inset-0 bg-gradient-primary rounded-2xl blur-xl opacity-20"></div>
              <img 
                src={heroImage} 
                alt="Event management platform showcasing real events" 
                className="relative rounded-2xl shadow-strong w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold">Everything You Need to Succeed</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools designed to streamline every aspect of event management
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-medium transition-smooth bg-gradient-card border-0">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-smooth">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-hero">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold text-primary-foreground">
            Ready to Transform Your Events?
          </h2>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Join thousands of organizers who trust EventFlow to create exceptional experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="xl" onClick={onGetStarted}>
              Create Your First Event
            </Button>
            <Button variant="outline" size="xl" className="text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};