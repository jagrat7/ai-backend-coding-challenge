"use client"

import { useState } from "react"
import { api } from "~/trpc/react"
import type { LinkedInProfile } from "~/server/api/routers/linkedin"

export function LinkedInScraperForm() {
  const [url, setUrl] = useState("")
  const [result, setResult] = useState<{
    success: boolean
    linkedinId: string
    profile: LinkedInProfile
  } | null>(null)

  const scrapeProfile = api.linkedin.scrapeProfile.useMutation({
    onSuccess: (data) => {
      setResult(data)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setResult(null)
    scrapeProfile.mutate({ url })
  }

  return (
    <div className="w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="linkedin-url" className="text-lg font-medium">
            LinkedIn Profile URL
          </label>
          <input
            id="linkedin-url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://linkedin.com/in/username"
            className="rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/50 focus:border-white/40 focus:outline-none"
            required
          />
        </div>

        <button
          type="submit"
          disabled={scrapeProfile.isPending}
          className="rounded-lg bg-white/10 px-6 py-3 font-semibold transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {scrapeProfile.isPending ? "Scraping..." : "Scrape Profile"}
        </button>
      </form>

      {scrapeProfile.error && (
        <div className="mt-6 rounded-lg bg-red-500/20 border border-red-500/50 p-4">
          <p className="font-semibold text-red-200">Error:</p>
          <p className="text-red-100">{scrapeProfile.error.message}</p>
        </div>
      )}

      {result && (
        <div className="mt-6 rounded-lg bg-white/10 p-6">
          <h2 className="mb-4 text-2xl font-bold">Profile Data</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-white/60">LinkedIn ID</p>
              <p className="text-lg">{result.linkedinId}</p>
            </div>

            {result.profile.name && (
              <div>
                <p className="text-sm text-white/60">Name</p>
                <p className="text-lg">{result.profile.name}</p>
              </div>
            )}

            {result.profile.headline && (
              <div>
                <p className="text-sm text-white/60">Headline</p>
                <p className="text-lg">{result.profile.headline}</p>
              </div>
            )}

            {result.profile.location && (
              <div>
                <p className="text-sm text-white/60">Location</p>
                <p className="text-lg">{result.profile.location}</p>
              </div>
            )}

            {result.profile.summary && (
              <div>
                <p className="text-sm text-white/60">Summary</p>
                <p className="text-base">{result.profile.summary}</p>
              </div>
            )}

            {result.profile.experience && result.profile.experience.length > 0 && (
              <div>
                <p className="text-sm text-white/60 mb-2">Experience</p>
                <div className="space-y-3">
                  {result.profile.experience.map((exp, idx) => (
                    <div key={idx} className="rounded bg-white/5 p-3">
                      <p className="font-semibold">{exp.title}</p>
                      <p className="text-white/80">{exp.company}</p>
                      {exp.duration && <p className="text-sm text-white/60">{exp.duration}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.profile.education && result.profile.education.length > 0 && (
              <div>
                <p className="text-sm text-white/60 mb-2">Education</p>
                <div className="space-y-3">
                  {result.profile.education.map((edu, idx) => (
                    <div key={idx} className="rounded bg-white/5 p-3">
                      <p className="font-semibold">{edu.school}</p>
                      {edu.degree && <p className="text-white/80">{edu.degree}</p>}
                      {edu.field && <p className="text-white/80">{edu.field}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <details className="mt-4">
              <summary className="cursor-pointer text-sm text-white/60 hover:text-white/80">
                View Raw JSON
              </summary>
              <pre className="mt-2 overflow-auto rounded bg-black/30 p-4 text-xs">
                {JSON.stringify(result.profile, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      )}
    </div>
  )
}
