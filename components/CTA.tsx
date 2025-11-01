import { Button } from "@/components/ui/button";

const CTA = () => {
  return (
    <section className="bg-secondary py-20">
      <div className="container text-center space-y-8">
        <h2 className="text-3xl md:text-4xl font-bold text-secondary-foreground">
          Ready to make a difference?
        </h2>
        <p className="text-lg text-secondary-foreground/80 max-w-2xl mx-auto">
          Join thousands of eco-conscious individuals tracking their impact and building a sustainable future.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="font-semibold px-8" asChild>
            <a href="/auth">Sign Up</a>
          </Button>
          <Button size="lg" variant="outline" className="font-semibold px-8 bg-transparent border-2" asChild>
            <a href="/auth">Log In</a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
