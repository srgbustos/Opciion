import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Search,
  Star,
  Clock,
  DollarSign,
  ArrowRight,
  Sparkles,
  Globe,
  Heart
} from "lucide-react";
import { useState } from "react";

export const DiscoverLanding = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();

  // Fetch featured events from database
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['featured-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'published')
        .eq('featured', true)
        .order('date', { ascending: true })
        .limit(6);
      
      if (error) throw error;
      return data;
    }
  });

  const categories = ["Technology", "Business", "Design", "Outdoor", "Education"];

  const filteredEvents = events.filter(event =>
    event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="relative px-6 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="h-8 w-8 text-primary" />
              <span className="text-lg font-medium text-primary">Discover Your Next Adventure</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              Find Amazing Events 
              <span className="bg-gradient-primary bg-clip-text text-transparent"> Near You</span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Join thousands of people discovering unforgettable experiences. From tech conferences to outdoor adventures, find events that match your passions.
            </p>
          </div>

          {/* Hero Search */}
          <div className="max-w-2xl mx-auto space-y-6 animate-scale-in">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Search events, locations, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg rounded-full border-2 bg-background/80 backdrop-blur-sm"
              />
            </div>
            
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <Badge 
                  key={category} 
                  variant="secondary" 
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-smooth px-4 py-2 text-sm hover-scale"
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Button size="lg" className="px-8 py-6 text-lg rounded-full hover-scale" asChild>
              <Link to="/events">
                Browse All Events
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            {user ? (
              <Button variant="outline" size="lg" className="px-8 py-6 text-lg rounded-full hover-scale" asChild>
                <Link to="/create-event">
                  Create an Event
                </Link>
              </Button>
            ) : (
              <Button variant="outline" size="lg" className="px-8 py-6 text-lg rounded-full hover-scale" asChild>
                <Link to="/auth">
                  Sign Up Free
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="px-6 py-20 bg-background/50">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold">Featured Events</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Handpicked events that you won't want to miss
            </p>
          </div>

          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="bg-gradient-card border-0 shadow-soft animate-pulse">
                  <div className="aspect-video bg-muted"></div>
                  <CardHeader className="space-y-2">
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-full"></div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-12 space-y-6">
              <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Calendar className="h-12 w-12 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold">No events available yet</h3>
                <p className="text-muted-foreground text-lg">
                  {user ? "Be the first to create an amazing event!" : "Sign in to create events and get started!"}
                </p>
              </div>
              {user && (
                <Button variant="hero" size="lg" className="rounded-full" asChild>
                  <Link to="/create-event">
                    Create Your First Event
                    <Sparkles className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event, index) => (
                <Card key={event.id} className={`group overflow-hidden bg-gradient-card border-0 shadow-soft hover:shadow-medium transition-smooth hover-scale animate-fade-in`} style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-primary opacity-20"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Calendar className="h-12 w-12 text-primary" />
                    </div>
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-gradient-primary text-primary-foreground">
                        Featured
                      </Badge>
                    </div>
                  </div>

                  <CardHeader className="space-y-2">
                    <div className="flex items-start justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {event.category}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-warning text-warning" />
                        <span className="text-sm font-medium">4.8</span>
                      </div>
                    </div>
                    <CardTitle className="group-hover:text-primary transition-smooth line-clamp-2">
                      {event.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {event.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-1">
                        {event.price === 0 ? (
                          <span className="text-lg font-bold text-success">Free</span>
                        ) : (
                          <>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span className="text-lg font-bold">${event.price}</span>
                          </>
                        )}
                      </div>
                      <Button variant="default" size="sm" className="rounded-full">
                        Register Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {filteredEvents.length > 0 && (
            <div className="text-center pt-8">
              <Button variant="outline" size="lg" className="rounded-full hover-scale" asChild>
                <Link to="/events">
                  View All Events
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold">Why Choose Opciion?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The best platform to discover and connect with amazing events
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center bg-gradient-card border-0 shadow-soft hover:shadow-medium transition-smooth hover-scale p-8">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Globe className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Discover Anywhere</h3>
              <p className="text-muted-foreground leading-relaxed">
                Find events happening near you or explore opportunities worldwide. From local meetups to international conferences.
              </p>
            </Card>

            <Card className="text-center bg-gradient-card border-0 shadow-soft hover:shadow-medium transition-smooth hover-scale p-8">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Connect & Network</h3>
              <p className="text-muted-foreground leading-relaxed">
                Meet like-minded people and build meaningful connections. Every event is an opportunity to expand your network.
              </p>
            </Card>

            <Card className="text-center bg-gradient-card border-0 shadow-soft hover:shadow-medium transition-smooth hover-scale p-8">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Curated Experiences</h3>
              <p className="text-muted-foreground leading-relaxed">
                Quality events handpicked for you. We ensure every experience meets our high standards for engagement and value.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-gradient-primary">
        <div className="max-w-4xl mx-auto text-center space-y-8 text-white">
          <h2 className="text-4xl lg:text-5xl font-bold">
            Ready to Discover Your Next Adventure?
          </h2>
          <p className="text-xl opacity-90 leading-relaxed">
            Join thousands of people who have found their perfect events on Opciion. 
            Your next memorable experience is just a click away.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" variant="secondary" className="px-8 py-6 text-lg rounded-full hover-scale" asChild>
              <Link to="/events">
                Start Exploring Events
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            {!user && (
              <Button variant="outline" size="lg" className="px-8 py-6 text-lg rounded-full border-white text-white hover:bg-white hover:text-primary hover-scale" asChild>
                <Link to="/auth">
                  Join Free Today
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};