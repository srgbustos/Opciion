import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp,
  Eye,
  Settings,
  MapPin,
  Clock
} from "lucide-react";

export const OrganizerDashboard = () => {
  const events = [
    {
      id: 1,
      title: "Tech Innovation Summit 2024",
      date: "Mar 15, 2024",
      location: "San Francisco, CA",
      attendees: 245,
      capacity: 300,
      revenue: 24500,
      status: "active"
    },
    {
      id: 2,
      title: "Mountain Hiking Adventure",
      date: "Apr 2, 2024",
      location: "Colorado Springs, CO",
      attendees: 78,
      capacity: 100,
      revenue: 7800,
      status: "selling"
    },
    {
      id: 3,
      title: "UX Design Workshop",
      date: "Feb 28, 2024",
      location: "Austin, TX",
      attendees: 156,
      capacity: 150,
      revenue: 15600,
      status: "sold_out"
    }
  ];

  const stats = [
    {
      title: "Total Revenue",
      value: "$47,900",
      change: "+12.5%",
      icon: DollarSign,
      trend: "up"
    },
    {
      title: "Active Events",
      value: "8",
      change: "+2",
      icon: Calendar,
      trend: "up"
    },
    {
      title: "Total Attendees",
      value: "1,234",
      change: "+89",
      icon: Users,
      trend: "up"
    },
    {
      title: "Conversion Rate",
      value: "8.2%",
      change: "+1.1%",
      icon: TrendingUp,
      trend: "up"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-success text-success-foreground";
      case "selling": return "bg-primary text-primary-foreground";
      case "sold_out": return "bg-warning text-warning-foreground";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "Active";
      case "selling": return "Selling";
      case "sold_out": return "Sold Out";
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Event Dashboard</h1>
            <p className="text-muted-foreground">Manage your events and track performance</p>
          </div>
          <Button variant="hero" size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Create New Event
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-gradient-card border-0 shadow-soft hover:shadow-medium transition-smooth">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-success flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Events Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Your Events</h2>
            <Button variant="outline">View All</Button>
          </div>

          <div className="grid gap-6">
            {events.map((event) => (
              <Card key={event.id} className="bg-gradient-card border-0 shadow-soft hover:shadow-medium transition-smooth">
                <CardHeader>
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-xl">{event.title}</CardTitle>
                        <Badge className={getStatusColor(event.status)}>
                          {getStatusText(event.status)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {event.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Attendees</span>
                        <span className="font-medium">{event.attendees} / {event.capacity}</span>
                      </div>
                      <Progress 
                        value={(event.attendees / event.capacity) * 100} 
                        className="h-2"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Revenue</div>
                      <div className="text-2xl font-bold text-success">
                        ${event.revenue.toLocaleString()}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Avg. Ticket Price</div>
                      <div className="text-lg font-semibold">
                        ${Math.round(event.revenue / event.attendees)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};