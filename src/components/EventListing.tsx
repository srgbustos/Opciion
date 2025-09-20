import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { filterExpiredEvents } from "@/lib/eventUtils";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Search,
  Filter,
  Star,
  Clock,
  DollarSign
} from "lucide-react";
import { useState } from "react";

export const EventListing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch events from database
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'published')
        .order('date', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const categories = ["All", "Technology", "Business", "Design", "Outdoor", "Education"];

  // Filter out expired events first, then apply search filter
  const nonExpiredEvents = filterExpiredEvents(events);
  
  const filteredEvents = nonExpiredEvents.filter(event =>
    event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Discover Amazing Events</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Loading events...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Discover Amazing Events</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find and join events that match your interests and expand your horizons
          </p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search events, locations, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>
            <Button variant="outline" size="lg">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge 
                key={category} 
                variant="secondary" 
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-smooth px-4 py-2"
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Event Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-4">No events available yet</h3>
            <p className="text-muted-foreground mb-6">
              {user ? "Be the first to create an event!" : "Sign in to create events and get started!"}
            </p>
            {user && (
              <Button variant="hero" size="lg">
                Create Your First Event
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <Card 
                key={event.id} 
                className="group overflow-hidden bg-gradient-card border-0 shadow-soft hover:shadow-medium transition-smooth cursor-pointer"
                onClick={() => navigate(`/events/${event.id}`)}
              >
                {event.featured && (
                  <div className="absolute top-4 left-4 z-10">
                    <Badge className="bg-gradient-primary text-primary-foreground">
                      Featured
                    </Badge>
                  </div>
                )}
                
                <div className="aspect-video bg-muted relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-primary opacity-20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Calendar className="h-12 w-12 text-primary" />
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
                  <CardTitle className="group-hover:text-primary transition-smooth">
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
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>0/{event.capacity} attendees</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-1">
                      {event.price === 0 ? (
                        <span className="text-lg font-bold text-success">Free</span>
                      ) : (
                        <>
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="text-lg font-bold">{event.price}</span>
                        </>
                      )}
                    </div>
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/events/${event.id}`);
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};