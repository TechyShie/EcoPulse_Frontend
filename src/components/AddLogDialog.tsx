import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EcoLog {
  id: string;
  activity: string;
  category: string;
  date: string;
  points: number;
  notes?: string;
}

interface AddLogDialogProps {
  onAddLog: (log: EcoLog) => void;
  triggerText?: string;
  triggerIcon?: React.ReactNode;
}

const AddLogDialog = ({ onAddLog, triggerText = "Add Log", triggerIcon = <Plus className="h-4 w-4" /> }: AddLogDialogProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    activity: "",
    category: "Recycling",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Call AI to calculate points based on activity
      const response = await fetch("http://127.0.0.1:8000/api/calculate-points", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ activity: formData.activity }),
      });

      if (!response.ok) {
        throw new Error("Failed to calculate points");
      }

      const { points } = await response.json();

      const newLog: EcoLog = {
        id: Date.now().toString(),
        ...formData,
        points,
      };

      onAddLog(newLog);
      toast({
        title: "Log added!",
        description: "Your eco activity has been recorded.",
      });

      setIsOpen(false);
      setFormData({
        activity: "",
        category: "Recycling",
        date: new Date().toISOString().split("T")[0],
        notes: "",
      });
    } catch (error) {
      console.error("Error calculating points:", error);
      toast({
        title: "Error",
        description: "Failed to calculate points. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          {triggerIcon}
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Activity</DialogTitle>
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
            Add Log
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddLogDialog;
