import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, Leaf, Droplets } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const [logs, setLogs] = useState<EcoLog[]>([
    {
      id: "1",
      activity: "Used reusable bag",
      category: "Recycling",
      date: "2025-10-20",
      points: 10,
      notes: "Grocery shopping",
    },
    {
      id: "2",
      activity: "Cycled to work",
      category: "Transportation",
      date: "2025-10-21",
      points: 25,
    },
    {
      id: "3",
      activity: "Saved water",
      category: "Conservation",
      date: "2025-10-22",
      points: 15,
      notes: "Shorter shower",
    },
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<EcoLog | null>(null);
  const [formData, setFormData] = useState({
    activity: "",
    category: "Recycling",
    date: new Date().toISOString().split("T")[0],
    points: "10",
    notes: "",
  });

  const totalLogs = logs.length;
  const totalPoints = logs.reduce((sum, log) => sum + log.points, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingLog) {
      setLogs(logs.map(log => 
        log.id === editingLog.id 
          ? { ...log, ...formData, points: parseInt(formData.points) }
          : log
      ));
      toast({
        title: "Log updated!",
        description: "Your eco activity has been updated.",
      });
    } else {
      const newLog: EcoLog = {
        id: Date.now().toString(),
        ...formData,
        points: parseInt(formData.points),
      };
      setLogs([...logs, newLog]);
      toast({
        title: "Log added!",
        description: "Your eco activity has been recorded.",
      });
    }

    setIsOpen(false);
    setEditingLog(null);
    setFormData({
      activity: "",
      category: "Recycling",
      date: new Date().toISOString().split("T")[0],
      points: "10",
      notes: "",
    });
  };

  const handleEdit = (log: EcoLog) => {
    setEditingLog(log);
    setFormData({
      activity: log.activity,
      category: log.category,
      date: log.date,
      points: log.points.toString(),
      notes: log.notes || "",
    });
    setIsOpen(true);
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

              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Log
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingLog ? "Edit Activity" : "Add New Activity"}
                    </DialogTitle>
                    <DialogDescription>
                      Record your eco-friendly action and earn points!
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="activity">Activity Name</Label>
                      <Input
                        id="activity"
                        value={formData.activity}
                        onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
                        placeholder="e.g., Used reusable bag"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Recycling">Recycling</SelectItem>
                          <SelectItem value="Transportation">Transportation</SelectItem>
                          <SelectItem value="Conservation">Conservation</SelectItem>
                          <SelectItem value="Energy">Energy Saving</SelectItem>
                          <SelectItem value="Food">Sustainable Food</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="points">Points Earned</Label>
                      <Input
                        id="points"
                        type="number"
                        value={formData.points}
                        onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                        min="1"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="notes">Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Add any additional details..."
                        rows={3}
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      {editingLog ? "Update Log" : "Add Log"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
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
                              onClick={() => handleEdit(log)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
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