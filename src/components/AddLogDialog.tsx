import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { api } from "@/utils/api";

interface AddLogDialogProps {
  onAddLog: (log: any) => void;
}

const AddLogDialog = ({ onAddLog }: AddLogDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    activity: "",
    category: "",
    details: "",
  });

  const [calculatedData, setCalculatedData] = useState<{
    carbon_emission: number;
    eco_points: number;
    explanation: string;
  } | null>(null);

  const categories = [
    { value: "transportation", label: "Transportation" },
    { value: "energy", label: "Energy" },
    { value: "waste", label: "Waste Reduction" },
    { value: "food", label: "Food" },
    { value: "shopping", label: "Shopping" },
  ];

  const calculatePoints = async () => {
    if (!formData.activity || !formData.category) {
      setError("Please enter activity and select category");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await api.ai.calculatePoints(
        formData.activity,
        formData.category,
        formData.details
      );
      setCalculatedData(result);
    } catch (err: any) {
      setError(err.message || "Failed to calculate points");
    } finally {
      setIsLoading(false);
    }
  };

  const createLog = async () => {
    if (!calculatedData) return;

    setIsLoading(true);

    try {
      const logData = {
        activity_type: formData.category,
        description: formData.activity,
        emissions_saved: calculatedData.carbon_emission,
      };

      const newLog = await api.logs.create(logData);
      onAddLog(newLog);
      setOpen(false);
      resetForm();
    } catch (err: any) {
      setError(err.message || "Failed to create log");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      activity: "",
      category: "",
      details: "",
    });
    setCalculatedData(null);
    setError("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Activity</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Eco Activity</DialogTitle>
          <DialogDescription>
            Log your eco-friendly activity and see its environmental impact.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="activity">Activity Description</Label>
            <Input
              id="activity"
              placeholder="e.g., Cycled to work instead of driving"
              value={formData.activity}
              onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="details">Additional Details (Optional)</Label>
            <Textarea
              id="details"
              placeholder="e.g., 10km commute, avoided car trip"
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
            />
          </div>

          {!calculatedData && (
            <Button 
              onClick={calculatePoints} 
              disabled={isLoading || !formData.activity || !formData.category}
            >
              {isLoading ? "Calculating..." : "Calculate Impact"}
            </Button>
          )}

          {calculatedData && (
            <div className="p-4 border rounded-lg bg-green-50">
              <h4 className="font-semibold mb-2">Environmental Impact</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">CO₂ Saved:</span>
                  <div className="font-semibold">{calculatedData.carbon_emission} kg</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Eco Points:</span>
                  <div className="font-semibold text-green-600">+{calculatedData.eco_points}</div>
                </div>
              </div>
              {calculatedData.explanation && (
                <p className="text-sm text-muted-foreground mt-2">
                  {calculatedData.explanation}
                </p>
              )}
            </div>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={createLog} 
            disabled={!calculatedData || isLoading}
          >
            {isLoading ? "Saving..." : "Save Activity"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddLogDialog;