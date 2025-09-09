import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Navigation } from "@/components/Navigation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  DollarSign,
  Star,
  ArrowLeft,
  Share2,
  Heart,
  CheckCircle,
  Globe,
  User,
  Mail,
  Phone
} from "lucide-react";

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isRegistering, setIsRegistering] = useState(false);

  // Fetch event details
  const { data: event, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      if (!id) throw new Error('Event ID is required');
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .eq('status', 'published')
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  // Fetch organizer profile separately
  const { data: organizer } = useQuery({
    queryKey: ['organizer', event?.organizer_id],
    queryFn: async () => {
      if (!event?.organizer_id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('display_name, avatar_url')
        .eq('user_id', event.organizer_id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!event?.organizer_id
  });

  // Check if user is already registered
  const { data: registration } = useQuery({
    queryKey: ['registration', id, user?.id],
    queryFn: async () => {
      if (!id || !user?.id) return null;
      
      const { data, error } = await supabase
        .from('event_registrations')
        .select('*')
        .eq('event_id', id)
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id && !!user?.id
  });

  const handleRegister = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to register for events.",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

    if (!event) return;

    setIsRegistering(true);
    try {
      // Generate a unique ticket number
      const ticketNumber = `TICKET-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const { error } = await supabase
        .from('event_registrations')
        .insert({
          event_id: event.id,
          user_id: user.id,
          ticket_number: ticketNumber,
          status: 'confirmed'
        });

      if (error) throw error;

      toast({
        title: "Registration Successful!",
        description: `You've been registered for ${event.title}. Check your email for confirmation.`,
      });
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: "There was an error registering for this event. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRegistering(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading event details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Event Not Found</h1>
            <p className="text-muted-foreground">The event you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link to="/events">Browse Events</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isRegistered = !!registration;
  const eventDate = new Date(event.date);
  const isEventPassed = eventDate < new Date();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate('/events')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
            <div className="space-y-6">
              <div className="aspect-video bg-gradient-primary rounded-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Calendar className="h-20 w-20 text-white" />
                </div>
                {event.featured && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-gradient-primary text-primary-foreground">
                      <Star className="h-3 w-3 mr-1" />
                      Featured Event
                    </Badge>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <Badge variant="secondary" className="text-sm">
                      {event.category}
                    </Badge>
                    <h1 className="text-4xl font-bold leading-tight">
                      {event.title}
                    </h1>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-warning text-warning" />
                    <span className="font-medium">4.8</span>
                    <span className="text-sm">(124 reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>0/{event.capacity} registered</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  About This Event
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {event.description || "Join us for an amazing event experience that you won't want to miss. This event brings together passionate individuals to share knowledge, network, and create lasting memories."}
                </p>
                
                <div className="space-y-3 pt-4 border-t">
                  <h4 className="font-semibold">What you'll learn:</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span>Industry insights and best practices</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span>Networking opportunities with like-minded professionals</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span>Hands-on activities and interactive sessions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span>Take-home resources and exclusive materials</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Organizer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Meet Your Host
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-lg">
                      {organizer?.display_name?.charAt(0) || 'O'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-lg">
                      {organizer?.display_name || 'Event Organizer'}
                    </h4>
                    <p className="text-muted-foreground">
                      Experienced event organizer passionate about bringing people together for meaningful experiences.
                    </p>
                    <div className="flex gap-4 pt-2">
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4 mr-2" />
                        Contact
                      </Button>
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <Card className="sticky top-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    {event.price === 0 ? (
                      <div className="text-2xl font-bold text-success">Free</div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-5 w-5 text-muted-foreground" />
                        <span className="text-2xl font-bold">{event.price}</span>
                        <span className="text-muted-foreground">/ {event.currency}</span>
                      </div>
                    )}
                  </div>
                  {isRegistered && (
                    <Badge className="bg-success text-success-foreground">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Registered
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">
                        {eventDate.toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{event.capacity} spots available</span>
                  </div>
                </div>

                {isEventPassed ? (
                  <Button disabled className="w-full">
                    Event Has Passed
                  </Button>
                ) : isRegistered ? (
                  <div className="space-y-3">
                    <Button disabled className="w-full bg-success text-success-foreground">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      You're Registered!
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      Ticket #: {registration?.ticket_number}
                    </p>
                  </div>
                ) : (
                  <Button 
                    onClick={handleRegister} 
                    disabled={isRegistering}
                    className="w-full"
                    size="lg"
                  >
                    {isRegistering ? "Registering..." : "Register Now"}
                  </Button>
                )}

                <div className="text-xs text-muted-foreground text-center space-y-1">
                  <p>🔒 Secure registration</p>
                  <p>📧 Instant confirmation email</p>
                  <p>🎫 Digital ticket included</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Event Highlights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">3 hours</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Language</span>
                  <span className="font-medium">English</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Level</span>
                  <span className="font-medium">All Levels</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-medium">{event.category}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;