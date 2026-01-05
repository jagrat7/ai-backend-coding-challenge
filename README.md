# LinkedIn Messaging Sequence Generator

## Database Schema

```mermaid
erDiagram
    prospects ||--o{ sequences : "has"
    tovConfigs ||--o{ sequences : "configures"
    sequences ||--o{ messages : "contains"
    sequences ||--o{ aiGenerations : "tracks"

    prospects {
        uuid id PK
        varchar linkedinUrl UK
        jsonb profileData
        timestamp createdAt
        timestamp updatedAt
    }

    tovConfigs {
        uuid id PK
        varchar name
        numeric formality
        numeric warmth
        numeric directness
        timestamp createdAt
    }

    sequences {
        uuid id PK
        uuid prospectId FK
        uuid tovId FK
        text companyContext
        timestamp createdAt
    }

    messages {
        uuid id PK
        uuid sequenceId FK
        text body
        numeric confidence
        timestamp createdAt
    }

    aiGenerations {
        uuid id PK
        uuid sequenceId FK
        varchar model
        text prompt
        integer tokens_used
        numeric costUsd
        text thinkingProcess
        jsonb rawResponse
        timestamp createdAt
    }
```

## Future Improvements/Changes

- Puppeteer/playwright based scraper with docker compose and railway deployment instead of vercel
- better UI
- better service names
- better tov storage
- additonal company config
- improve sqeuence abstraction