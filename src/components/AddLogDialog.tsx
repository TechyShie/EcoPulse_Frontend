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
    description: "",
    activity_type: "",
    details: "",
    emissions_saved: 0,
    points_earned: 0
  });

  // Use the exact same activity types as backend enum
  const activityTypes = [
    { value: "transport", label: "Transportation" },
    { value: "energy", label: "Energy" },
    { value: "waste", label: "Waste Reduction" },
    { value: "food", label: "Food" },
    { value: "water", label: "Water" },
  ];

  // Calculate emissions and points based on activity type
  const calculateImpact = (activityType: string, description: string) => {
    const calculations = {
      transport: { emissions: 2.5, points: 8 },
      energy: { emissions: 1.2, points: 6 },
      waste: { emissions: 1.8, points: 7 },
      food: { emissions: 2.0, points: 8 },
      water: { emissions: 0.8, points: 5 }
    };

    const base = calculations[activityType as keyof typeof calculations] || { emissions: 1.0, points: 5 };
    
    // Adjust based on description length/complexity
    const multiplier = description.length > 30 ? 1.5 : 1.0;
    
    return {
      emissions_saved: Math.round((base.emissions * multiplier) * 100) / 100,
      points_earned: Math.round(base.points * multiplier)
    };
  };

  const createLog = async () => {
    if (!formData.description || !formData.activity_type) {
      setError("Please enter activity description and select category");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Calculate emissions and points based on activity type
      const impact = calculateImpact(formData.activity_type, formData.description);

      // Create the log data exactly as backend expects
      const logData = {
        activity_type: formData.activity_type,
        description: formData.description + (formData.details ? ` - ${formData.details}` : ""),
        emissions_saved: impact.emissions_saved,
        points_earned: impact.points_earned
      };

      console.log("📝 Creating log with data:", logData);
      
      const response = await api.logs.create(logData);
      console.log("✅ Log created successfully:", response);
      
      // The backend returns { log: {...}, message: "..." }
      if (response && response.log) {
        onAddLog(response.log);
        setOpen(false);
        resetForm();
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err: any) {
      console.error("❌ Error creating log:", err);
      setError(err.message || "Failed to create activity log. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      description: "",
      activity_type: "",
      details: "",
      emissions_saved: 0,
      points_earned: 0
    });
    setError("");
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      resetForm();
    }
  };

  // Update impact preview when activity type or description changes
  const impactPreview = formData.activity_type && formData.description 
    ? calculateImpact(formData.activity_type, formData.description)
    : null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>Add Activity</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Eco Activity</DialogTitle>
          <DialogDescription>
            Log your eco-friendly activity and estimate its environmental impact.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="description">Activity Description *</Label>
            <Input
              id="description"
              placeholder="e.g., Cycled to work instead of driving"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="activity_type">Category *</Label>
            <Select
              value={formData.activity_type}
              onValueChange={(value) => setFormData({ ...formData, activity_type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {activityTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
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

          {/* Impact Preview */}
          {impactPreview && (
            <div className="p-4 border rounded-lg bg-green-50">
              <h4 className="font-semibold mb-2">Estimated Impact</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">CO₂ Saved:</span>
                  <div className="font-semibold text-green-600">
                    {impactPreview.emissions_saved} kg
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Eco Points:</span>
                  <div className="font-semibold text-blue-600">
                    +{impactPreview.points_earned}
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Based on {formData.activity_type} activity
              </p>
            </div>
          )}

          {error && (
            <div className="bg-destructive/15 border border-destructive/50 text-destructive p-3 rounded text-sm">
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={createLog} 
            disabled={isLoading || !formData.description || !formData.activity_type}
          >
            {isLoading ? "Saving..." : "Save Activity"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddLogDialog;