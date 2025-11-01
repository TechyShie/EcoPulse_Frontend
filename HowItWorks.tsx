import { ArrowRight } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Log your activity",
      description: "Record daily actions like commutes, meals, and purchases"
    },
    {
      number: "02",
      title: "AI calculates impact",
      description: "Our smart algorithm measures your carbon footprint"
    },
    {
      number: "03",
      title: "Get nudges to improve",
      description: "Receive personalized tips to reduce your emissions"
    }
  ];

  return (
    <section className="container py-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
        <p className="text-muted-foreground text-lg">Simple steps to a greener lifestyle</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-start">
        {steps.map((step, index) => (
          <div key={index} className="relative">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">{step.number}</span>
              </div>
              <h3 className="text-xl font-semibold">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
            {index < steps.length - 1 && (
              <ArrowRight className="hidden md:block absolute top-8 -right-8 h-6 w-6 text-muted-foreground" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
