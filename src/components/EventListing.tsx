import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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

  const events = [
    {
      id: 1,
      title: "Tech Innovation Summit 2024",
      description: "Join industry leaders for cutting-edge discussions on AI, blockchain, and the future of technology.",
      date: "March 15, 2024",
      time: "9:00 AM - 6:00 PM",
      location: "San Francisco, CA",
      price: 199,
      currency: "USD",
      attendees: 245,
      capacity: 300,
      rating: 4.8,
      category: "Technology",
      organizer: "TechCorp Events",
      image: "/api/placeholder/400/240",
      featured: true
    },
    {
      id: 2,
      title: "Mountain Hiking Adventure",
      description: "Experience breathtaking views and challenge yourself on this guided mountain hiking expedition.",
      date: "April 2, 2024",
      time: "6:00 AM - 4:00 PM",
      location: "Colorado Springs, CO",
      price: 89,
      currency: "USD",
      attendees: 78,
      capacity: 100,
      rating: 4.9,
      category: "Outdoor",
      organizer: "Adventure Seekers",
      image: "/api/placeholder/400/240",
      featured: false
    },
    {
      id: 3,
      title: "UX Design Workshop",
      description: "Learn the latest UX design principles and hands-on techniques from industry experts.",
      date: "February 28, 2024",
      time: "10:00 AM - 5:00 PM",
      location: "Austin, TX",
      price: 149,
      currency: "USD",
      attendees: 156,
      capacity: 150,
      rating: 4.7,
      category: "Design",
      organizer: "Design Academy",
      image: "/api/placeholder/400/240",
      featured: false
    },
    {
      id: 4,
      title: "Startup Networking Mixer",
      description: "Connect with fellow entrepreneurs, investors, and innovators in the startup ecosystem.",
      date: "March 20, 2024",
      time: "6:00 PM - 9:00 PM",
      location: "New York, NY",
      price: 0,
      currency: "USD",
      attendees: 189,
      capacity: 200,
      rating: 4.6,
      category: "Business",
      organizer: "Startup Hub",
      image: "/api/placeholder/400/240",
      featured: true
    }
  ];

  const categories = ["All", "Technology", "Business", "Design", "Outdoor", "Education"];

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="group overflow-hidden bg-gradient-card border-0 shadow-soft hover:shadow-medium transition-smooth">
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
                    <span className="text-sm font-medium">{event.rating}</span>
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
                    <span>{event.date}</span>
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
                    <span>{event.attendees}/{event.capacity} attendees</span>
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
                  <Button variant="default" size="sm">
                    Register Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center pt-8">
          <Button variant="outline" size="lg">
            Load More Events
          </Button>
        </div>
      </div>
    </div>
  );
};