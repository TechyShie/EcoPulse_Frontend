import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  return (
    <section className="container py-20 md:py-32">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Track your habits.{" "}
            <span className="text-primary">Save the planet.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg">
            Monitor your carbon footprint with every action. Get personalized insights 
            and make a real impact on the environment, one habit at a time.
          </p>
          <Button size="lg" className="text-base font-semibold px-8" asChild>
            <a href="/auth">Get Started</a>
          </Button>
        </div>

        <div className="relative">
          <img 
            src={heroImage} 
            alt="Person standing on a green leaf in the sky" 
            className="rounded-2xl shadow-2xl w-full"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
