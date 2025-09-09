import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  MapPin, 
  Clock,
  Download,
  Share2,
  Users
} from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

interface EventRegistration {
  id: string;
  ticket_number: string;
  status: string;
  registered_at: string;
  event: {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    price: number;
    currency: string;
    category: string;
  };
}

const Dashboard = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserRegistrations();
    }
  }, [user]);

  const fetchUserRegistrations = async () => {
    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select(`
          id,
          ticket_number,
          status,
          registered_at,
          events!inner (
            id,
            title,
            description,
            date,
            time,
            location,
            price,
            currency,
            category
          )
        `)
        .eq('user_id', user?.id)
        .order('registered_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedData: EventRegistration[] = data?.map(reg => ({
        id: reg.id,
        ticket_number: reg.ticket_number,
        status: reg.status,
        registered_at: reg.registered_at,
        event: reg.events as any
      })) || [];

      setRegistrations(transformedData);
    } catch (error) {
      console.error('Error fetching user registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentDate = new Date();
  
  const upcomingEvents = registrations.filter(reg => 
    new Date(reg.event.date) >= currentDate
  );
  
  const pastEvents = registrations.filter(reg => 
    new Date(reg.event.date) < currentDate
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to view your dashboard</h1>
          <Button asChild>
            <Link to="/auth">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold">Loading your dashboard...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">My Dashboard</h1>
              <p className="text-muted-foreground">Track your registered events and journey</p>
            </div>
            <Button variant="default" asChild>
              <Link to="/events">
                <Calendar className="h-4 w-4 mr-2" />
                Discover New Events
              </Link>
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{registrations.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{upcomingEvents.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Past Events</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pastEvents.length}</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="upcoming" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upcoming">Upcoming Events ({upcomingEvents.length})</TabsTrigger>
              <TabsTrigger value="past">Past Events ({pastEvents.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-6">
              {upcomingEvents.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No upcoming events</h3>
                    <p className="text-muted-foreground text-center mb-4">
                      You haven't registered for any upcoming events yet.
                    </p>
                    <Button asChild>
                      <Link to="/events">Browse Events</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {upcomingEvents.map((registration) => (
                    <Card key={registration.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <CardTitle className="text-xl">{registration.event.title}</CardTitle>
                              <Badge variant={registration.status === 'confirmed' ? 'default' : 'secondary'}>
                                {registration.status}
                              </Badge>
                              <Badge variant="outline">
                                {registration.event.category}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {format(new Date(registration.event.date), 'MMM dd, yyyy')}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {registration.event.time}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {registration.event.location}
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-muted/50 rounded-lg p-4">
                            <div className="text-sm font-medium text-muted-foreground">Ticket Number</div>
                            <div className="text-lg font-mono">{registration.ticket_number}</div>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-4">
                            <div className="text-sm font-medium text-muted-foreground">Price</div>
                            <div className="text-lg font-semibold">
                              {registration.event.price === 0 ? 'Free' : `$${registration.event.price}`}
                            </div>
                          </div>
                        </div>
                        {registration.event.description && (
                          <div className="mt-4">
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {registration.event.description}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-6">
              {pastEvents.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Users className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No past events</h3>
                    <p className="text-muted-foreground text-center">
                      You haven't attended any events yet.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {pastEvents.map((registration) => (
                    <Card key={registration.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <CardTitle className="text-xl">{registration.event.title}</CardTitle>
                              <Badge variant="outline">
                                {registration.event.category}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {format(new Date(registration.event.date), 'MMM dd, yyyy')}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {registration.event.location}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-muted/50 rounded-lg p-4">
                            <div className="text-sm font-medium text-muted-foreground">Ticket Number</div>
                            <div className="text-lg font-mono">{registration.ticket_number}</div>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-4">
                            <div className="text-sm font-medium text-muted-foreground">Attended</div>
                            <div className="text-lg font-semibold text-green-600">Completed</div>
                          </div>
                        </div>
                        {registration.event.description && (
                          <div className="mt-4">
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {registration.event.description}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;