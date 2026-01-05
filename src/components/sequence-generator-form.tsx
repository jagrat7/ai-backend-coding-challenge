"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { api } from "~/trpc/react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Field, FieldDescription, FieldError, FieldLabel } from "~/components/ui/field"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  prospectUrl: z.string().url("Enter a valid LinkedIn profile URL"),
  companyContext: z.string().min(10, "Company context must be at least 10 characters"),
  messageCount: z.number().min(1).max(5),
  formality: z.number().min(0).max(1),
  warmth: z.number().min(0).max(1),
  directness: z.number().min(0).max(1),
})

type FormData = z.infer<typeof formSchema>

export function SequenceGeneratorForm() {
  const generateSequence = api.sequence.generate.useMutation()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prospectUrl: "",
      companyContext: "",
      messageCount: 3,
      formality: 0.5,
      warmth: 0.5,
      directness: 0.5,
    },
  })

  const onSubmit = async (data: FormData) => {
    try {
      await generateSequence.mutateAsync(data)
    } catch (error) {
      console.error("Error generating sequence:", error)
    }
  }

  const messageCount = form.watch("messageCount")
  const formality = form.watch("formality")
  const warmth = form.watch("warmth")
  const directness = form.watch("directness")

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Generate Outreach Sequence</CardTitle>
          <CardDescription>
            Enter a LinkedIn profile URL to generate personalized outreach messages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Controller
              name="prospectUrl"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>LinkedIn Profile URL</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="url"
                    placeholder="https://linkedin.com/in/username"
                    aria-invalid={fieldState.invalid}
                    autoComplete="url"
                  />
                  <FieldDescription>
                    Enter the full LinkedIn profile URL of your prospect
                  </FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="companyContext"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Company Context</FieldLabel>
                  <Textarea
                    {...field}
                    id={field.name}
                    placeholder="Describe your company, product, and value proposition..."
                    aria-invalid={fieldState.invalid}
                    rows={4}
                  />
                  <FieldDescription>
                    Provide context about your company and what you&apos;re offering
                  </FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="messageCount"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Number of Messages: {messageCount}
                  </FieldLabel>
                  <input
                    {...field}
                    id={field.name}
                    type="range"
                    min="1"
                    max="5"
                    className="w-full"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                  <FieldDescription>
                    Choose how many follow-up messages to generate (1-5)
                  </FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Tone of Voice</h3>
              
              <Controller
                name="formality"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Formality: {formality.toFixed(1)}
                    </FieldLabel>
                    <input
                      {...field}
                      id={field.name}
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      className="w-full"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Casual</span>
                      <span>Formal</span>
                    </div>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="warmth"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Warmth: {warmth.toFixed(1)}
                    </FieldLabel>
                    <input
                      {...field}
                      id={field.name}
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      className="w-full"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Transactional</span>
                      <span>Personal</span>
                    </div>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="directness"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Directness: {directness.toFixed(1)}
                    </FieldLabel>
                    <input
                      {...field}
                      id={field.name}
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      className="w-full"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Subtle</span>
                      <span>Direct</span>
                    </div>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={generateSequence.isPending}
            >
              {generateSequence.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Sequence"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Generated Messages</CardTitle>
          <CardDescription>
            Your personalized outreach sequence will appear here
          </CardDescription>
        </CardHeader>
        <CardContent>
          {generateSequence.isPending && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {generateSequence.data && (
            <div className="space-y-4">
              {generateSequence.data.messages.map((msg, idx) => (
                <Card key={msg.id}>
                  <CardHeader>
                    <CardTitle className="text-sm">Message {idx + 1}</CardTitle>
                    <CardDescription>
                      Confidence: {(Number(msg.confidence) * 100).toFixed(0)}%
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-wrap">{msg.body}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {generateSequence.error && (
            <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
              <p className="text-sm text-destructive">
                Error: {generateSequence.error.message}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
