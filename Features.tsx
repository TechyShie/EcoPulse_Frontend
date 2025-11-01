import { Activity, Sparkles, Trophy } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Features = () => {
  const features = [
    {
      icon: Activity,
      title: "Track Daily Emissions",
      description: "Log your transportation, food, and energy consumption to see your real-time carbon footprint."
    },
    {
      icon: Sparkles,
      title: "AI Insights & Tips",
      description: "Get personalized recommendations powered by AI to reduce your environmental impact."
    },
    {
      icon: Trophy,
      title: "Compete for Eco-Score",
      description: "Challenge friends and climb the leaderboard by making sustainable choices every day."
    }
  ];

  return (
    <section id="features" className="container py-20 bg-muted/50">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Features That Make a Difference</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Everything you need to understand and reduce your environmental impact
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Card key={index} className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Features;
