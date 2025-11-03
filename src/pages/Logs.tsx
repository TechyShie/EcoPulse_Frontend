import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, Leaf, Droplets } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AddLogDialog from "@/components/AddLogDialog";

interface EcoLog {
  id: string;
  activity: string;
  category: string;
  date: string;
  points: number;
  notes?: string;
}

const Logs = () => {
  const { toast } = useToast();
  const [logs, setLogs] = useState<EcoLog[]>([]);

  const totalLogs = logs.length;
  const totalPoints = logs.reduce((sum, log) => sum + log.points, 0);

  useEffect(() => {
    // Fetch logs from backend
    fetch("http://127.0.0.1:8000/api/logs")
      .then((res) => res.json())
      .then((data) => setLogs(data))
      .catch((error) => {
        console.error("Error fetching logs:", error);
        setLogs([]);
      });
  }, []);

  const handleAddLog = (newLog: EcoLog) => {
    setLogs([...logs, newLog]);
  };

  const handleDelete = (id: string) => {
    setLogs(logs.filter(log => log.id !== id));
    toast({
      title: "Log deleted",
      description: "The activity has been removed.",
      variant: "destructive",
    });
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />

        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center justify-between px-6">
              <SidebarTrigger />
              <Avatar className="h-10 w-10 bg-primary text-primary-foreground">
                <AvatarFallback>AX</AvatarFallback>
              </Avatar>
            </div>
          </header>

          <main className="flex-1 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Activity Logs</h1>
                <p className="text-muted-foreground">Track your eco-friendly actions</p>
              </div>

              <AddLogDialog onAddLog={handleAddLog} />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Actions</CardTitle>
                  <Leaf className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalLogs}</div>
                  <p className="text-xs text-muted-foreground">
                    This week
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Eco Points</CardTitle>
                  <Droplets className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{totalPoints}</div>
                  <p className="text-xs text-muted-foreground">
                    Keep it up!
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Activity History</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Activity</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Points</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{new Date(log.date).toLocaleDateString()}</TableCell>
                        <TableCell className="font-medium">{log.activity}</TableCell>
                        <TableCell>{log.category}</TableCell>
                        <TableCell className="text-primary font-semibold">
                          +{log.points}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {log.notes || "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(log.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Logs;