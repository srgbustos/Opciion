import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  MapPin, 
  Clock,
  Star,
  Share2,
  Download,
  Camera,
  Award,
  Users,
  Heart
} from "lucide-react";

export const ParticipantDashboard = () => {
  const upcomingEvents = [
    {
      id: 1,
      title: "Tech Innovation Summit 2024",
      date: "March 15, 2024",
      time: "9:00 AM",
      location: "San Francisco, CA",
      status: "confirmed",
      ticketNumber: "TIS24-001234"
    },
    {
      id: 2,
      title: "Mountain Hiking Adventure",
      date: "April 2, 2024",
      time: "6:00 AM",
      location: "Colorado Springs, CO",
      status: "confirmed",
      ticketNumber: "MHA24-005678"
    }
  ];

  const pastEvents = [
    {
      id: 3,
      title: "UX Design Workshop",
      date: "February 28, 2024",
      location: "Austin, TX",
      rating: 5,
      reviewed: true,
      badge: "Workshop Completion",
      photos: 12
    },
    {
      id: 4,
      title: "Startup Networking Mixer",
      date: "February 15, 2024",
      location: "New York, NY",
      rating: 4,
      reviewed: true,
      badge: "Network Builder",
      photos: 8
    }
  ];

  const badges = [
    { name: "Event Enthusiast", description: "Attended 5+ events", icon: Award, color: "bg-primary" },
    { name: "Workshop Completion", description: "Completed 3 workshops", icon: Star, color: "bg-success" },
    { name: "Network Builder", description: "Connected with 50+ participants", icon: Users, color: "bg-warning" },
    { name: "Early Bird", description: "Registered early for 10 events", icon: Clock, color: "bg-destructive" }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">My Events</h1>
            <p className="text-muted-foreground">Track your event journey and achievements</p>
          </div>
          <Button variant="hero">
            <Calendar className="h-4 w-4 mr-2" />
            Discover New Events
          </Button>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past Events</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-6">
            <div className="grid gap-6">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="bg-gradient-card border-0 shadow-soft hover:shadow-medium transition-smooth">
                  <CardHeader>
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <CardTitle className="text-xl">{event.title}</CardTitle>
                          <Badge className="bg-success text-success-foreground">
                            Confirmed
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {event.date}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {event.time}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {event.location}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Ticket
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="text-sm font-medium">Ticket Number</div>
                      <div className="text-lg font-mono">{event.ticketNumber}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="past" className="space-y-6">
            <div className="grid gap-6">
              {pastEvents.map((event) => (
                <Card key={event.id} className="bg-gradient-card border-0 shadow-soft hover:shadow-medium transition-smooth">
                  <CardHeader>
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                      <div className="space-y-2">
                        <CardTitle className="text-xl">{event.title}</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {event.date}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {event.location}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < event.rating ? 'fill-warning text-warning' : 'text-muted-foreground'}`} 
                            />
                          ))}
                        </div>
                        <Badge variant="secondary">
                          <Award className="h-3 w-3 mr-1" />
                          {event.badge}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Camera className="h-4 w-4" />
                        <span>{event.photos} photos uploaded</span>
                      </div>
                      <Button variant="outline" size="sm">
                        View Photos
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="badges" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {badges.map((badge, index) => (
                <Card key={index} className="bg-gradient-card border-0 shadow-soft hover:shadow-medium transition-smooth text-center">
                  <CardHeader>
                    <div className={`w-16 h-16 ${badge.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <badge.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-lg">{badge.name}</CardTitle>
                    <CardDescription>{badge.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="photos" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((photo) => (
                <Card key={photo} className="overflow-hidden bg-gradient-card border-0 shadow-soft hover:shadow-medium transition-smooth">
                  <div className="aspect-square bg-muted relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-primary opacity-20"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Camera className="h-12 w-12 text-primary" />
                    </div>
                    <div className="absolute top-2 right-2">
                      <Button variant="ghost" size="sm" className="bg-background/80">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <div className="text-sm font-medium">UX Design Workshop</div>
                    <div className="text-xs text-muted-foreground">Feb 28, 2024</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};