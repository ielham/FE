import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Users, Shield, Activity, TrendingUp } from "lucide-react";

const stats = [
  { label: "Total Users", value: "1,284", trend: "+12%", icon: Users },
  { label: "Active Roles", value: "8", trend: "+2", icon: Shield },
  { label: "Tickets Today", value: "42", trend: "+5%", icon: Activity },
  { label: "Resolution Rate", value: "94%", trend: "+1.2%", icon: TrendingUp },
];

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your helpdesk activity
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold">{s.value}</p>
                <Badge variant="success" className="mt-1">
                  {s.trend}
                </Badge>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-muted">
                <s.icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Placeholder chart area */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Overview</CardTitle>
          <CardDescription>Ticket volume over time</CardDescription>
        </CardHeader>
        <CardContent className="h-64 rounded-md bg-muted/50" />
      </Card>
    </div>
  );
}
