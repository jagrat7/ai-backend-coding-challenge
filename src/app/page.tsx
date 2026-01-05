"use client"

import { SequenceGeneratorForm } from "~/components/sequence-generator-form";
import { SequenceResults } from "~/components/sequence-results";
import { ModeToggle } from "~/components/mode-toggle";
import { api } from "~/trpc/react";

export default function Home() {
  const generateSequence = api.sequence.generate.useMutation()

  return (
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

        <div className="grid gap-6 lg:grid-cols-2">
          <SequenceGeneratorForm mutation={generateSequence} />
          <SequenceResults 
            data={generateSequence.data}
            isPending={generateSequence.isPending}
            error={generateSequence.error}
          />
        </div>
      </div>
    </main>
  );
}
