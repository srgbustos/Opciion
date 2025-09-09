import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { 
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Image,
  Star,
  Sparkles,
  ArrowRight,
  Plus
} from "lucide-react";

interface EventFormData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  price: string;
  capacity: string;
  category: string;
  featured: boolean;
}

export const EventCreationForm = () => {
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    price: "0",
    capacity: "100",
    category: "",
    featured: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const categories = [
    "Technology",
    "Business",
    "Design", 
    "Outdoor",
    "Education",
    "Health & Wellness",
    "Arts & Culture",
    "Food & Drink",
    "Sports & Fitness",
    "Music & Entertainment"
  ];

  const handleInputChange = (field: keyof EventFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please sign in to create an event");
      navigate("/auth");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('events')
        .insert({
          organizer_id: user.id,
          title: formData.title,
          description: formData.description,
          date: formData.date,
          time: formData.time,
          location: formData.location,
          price: parseFloat(formData.price),
          capacity: parseInt(formData.capacity),
          category: formData.category,
          featured: formData.featured,
          status: 'published'
        });

      if (error) throw error;

      toast.success("Event created successfully!");
      navigate("/events");
    } catch (error: any) {
      toast.error(error.message || "Failed to create event");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold">Ready to Create Your Event?</h2>
          <p className="text-xl text-muted-foreground">
            Sign in to start creating amazing events that people will love to attend.
          </p>
          <Button size="lg" className="rounded-full" onClick={() => navigate("/auth")}>
            Sign In to Create Event
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 py-20">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="h-8 w-8 text-primary" />
            <span className="text-lg font-medium text-primary">Create Your Event</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold">
            Bring Your Vision to Life
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Fill out the details below to create an unforgettable event experience.
          </p>
        </div>

        {/* Event Creation Form */}
        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Calendar className="h-6 w-6 text-primary" />
              Event Details
            </CardTitle>
            <CardDescription>
              Provide the essential information for your event
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-base font-medium">
                      Event Title *
                    </Label>
                    <Input
                      id="title"
                      placeholder="e.g., Tech Innovation Summit 2024"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-base font-medium">
                      Category *
                    </Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => handleInputChange("category", value)}
                      required
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-base font-medium">
                    Description *
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what makes your event special..."
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    required
                    className="min-h-32 resize-none"
                  />
                </div>
              </div>

              {/* Date, Time & Location */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  When & Where
                </h3>
                
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-base font-medium">
                      Date *
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange("date", e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="time" className="text-base font-medium">
                      Start Time *
                    </Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => handleInputChange("time", e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="capacity" className="text-base font-medium">
                      Capacity *
                    </Label>
                    <Input
                      id="capacity"
                      type="number"
                      min="1"
                      placeholder="100"
                      value={formData.capacity}
                      onChange={(e) => handleInputChange("capacity", e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-base font-medium">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    Location *
                  </Label>
                  <Input
                    id="location"
                    placeholder="e.g., San Francisco, CA or 123 Main St, City, State"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    required
                    className="h-12"
                  />
                </div>
              </div>

              {/* Pricing & Features */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Pricing & Features
                </h3>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-base font-medium">
                      Ticket Price (USD)
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                      className="h-12"
                    />
                    <p className="text-sm text-muted-foreground">
                      Set to 0 for free events
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-base font-medium">
                          Featured Event
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Highlight your event on the homepage
                        </p>
                      </div>
                      <Switch
                        checked={formData.featured}
                        onCheckedChange={(checked) => handleInputChange("featured", checked)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview Card */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Preview</h3>
                <Card className="bg-gradient-card border-0 shadow-soft">
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-primary opacity-20"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Calendar className="h-12 w-12 text-primary" />
                    </div>
                    {formData.featured && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-gradient-primary text-primary-foreground">
                          Featured
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <Badge variant="secondary">
                        {formData.category || "Category"}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-warning text-warning" />
                        <span className="text-sm font-medium">New</span>
                      </div>
                    </div>
                    <CardTitle className="line-clamp-2">
                      {formData.title || "Your Event Title"}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {formData.description || "Your event description will appear here..."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{formData.date || "Select date"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{formData.time || "Select time"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{formData.location || "Event location"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>0/{formData.capacity || "100"} attendees</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-1">
                        {parseFloat(formData.price) === 0 ? (
                          <span className="text-lg font-bold text-success">Free</span>
                        ) : (
                          <>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span className="text-lg font-bold">${formData.price || "0"}</span>
                          </>
                        )}
                      </div>
                      <Button variant="default" size="sm" disabled>
                        Register Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  type="submit"
                  size="lg"
                  className="flex-1 h-14 text-lg rounded-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Creating Event..."
                  ) : (
                    <>
                      <Plus className="mr-2 h-5 w-5" />
                      Create Event
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="h-14 text-lg rounded-full px-8"
                  onClick={() => navigate("/events")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};