"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/collapsible"
import { Loader2, ChevronDown, Sparkles } from "lucide-react"

interface Message {
  id: string
  body: string
  confidence: number | null
}

interface SequenceResultsProps {
  data?: {
    sequenceId: string
    prospectId: string
    messages: Message[]
    thinkingProcess: string
  }
  isPending: boolean
  error?: { message: string } | null
}

export function SequenceResults({ data, isPending, error }: SequenceResultsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Generated Messages</CardTitle>
        <CardDescription>
          Your personalized outreach sequence will appear here
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isPending && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {data && (
          <div className="space-y-4">
            {data.thinkingProcess && (
              <Collapsible>
                <Card className="border-muted cursor-pointer hover:bg-muted/50 transition-colors">
                  <CollapsibleTrigger asChild>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <CardTitle className="text-sm">AI Thinking Process</CardTitle>
                            <CardDescription>
                              How the AI approached generating these messages
                            </CardDescription>
                          </div>
                        </div>
                        <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 data-[state=open]:rotate-180" />
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent>
                      <p className="text-xs text-muted-foreground whitespace-pre-wrap">
                        {data.thinkingProcess}
                      </p>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            )}

            {data.messages.map((msg, idx) => (
              <Card className="bg-foreground/5" key={msg.id}>
                <CardHeader>
                  <CardTitle className="text-sm ">Message {idx + 1}</CardTitle>
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

        {error && (
          <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
            <p className="text-sm text-destructive">
              Error: {error.message}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
