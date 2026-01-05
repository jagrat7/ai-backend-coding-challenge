import { SequenceGeneratorForm } from "~/components/sequence-generator-form";
import { ModeToggle } from "~/components/mode-toggle";
import { HydrateClient } from "~/trpc/server";

export default function Home() {
  return (
    <HydrateClient>
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="mb-12 text-center relative">
            <div className="absolute right-0 top-0">
              <ModeToggle />
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
              LinkedIn Outreach Generator
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Generate personalized outreach sequences powered by AI
            </p>
          </div>

          <SequenceGeneratorForm />
        </div>
      </main>
    </HydrateClient>
  );
}
