import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../components/ui/table";
import { Button } from "../components/ui/button";

const tickets = [
  { id: "TCK-1001", title: "Login issue", assignee: "Siti", priority: "High", status: "Open" },
  { id: "TCK-1002", title: "Printer not working", assignee: "Budi", priority: "Medium", status: "In Progress" },
  { id: "TCK-1003", title: "Email quota full", assignee: "Dewi", priority: "Low", status: "Resolved" },
  { id: "TCK-1004", title: "VPN access request", assignee: "Ilham", priority: "High", status: "Open" },
];

export default function TablePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Data Table</h1>
        <p className="text-sm text-muted-foreground">
          Reusable table pattern with tabs and filters
        </p>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <TicketsTable data={tickets} />
        </TabsContent>
        <TabsContent value="open">
          <TicketsTable data={tickets.filter((t) => t.status === "Open" || t.status === "In Progress")} />
        </TabsContent>
        <TabsContent value="resolved">
          <TicketsTable data={tickets.filter((t) => t.status === "Resolved")} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TicketsTable({ data }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tickets</CardTitle>
        <CardDescription>Support tickets across the organization</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.id}</TableCell>
                <TableCell>{t.title}</TableCell>
                <TableCell>{t.assignee}</TableCell>
                <TableCell>
                  <Badge variant={t.priority === "High" ? "destructive" : t.priority === "Medium" ? "warning" : "secondary"}>
                    {t.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={t.status === "Open" ? "destructive" : t.status === "In Progress" ? "warning" : "success"}>
                    {t.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
