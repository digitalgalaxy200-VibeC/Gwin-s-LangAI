# Product Requirements Document (PRD)

## Personal AI Language Learning Assistant

| Field | Value |
| --- | --- |
| Working product name | To be determined |
| Initial language | French |
| Future languages | Arabic and others |
| Product type | Offline-first, AI-assisted language learning application |
| Primary platform | Android-first, with a responsive web interface |
| Database | Local SQLite, with optional Supabase synchronisation |
| Product approach | Local-first, AI-assisted, cloud-optional |
| Document status | Draft v1.0 |

---

## 0. Executive Summary

The product should be built as an **offline-first, personal AI language-learning application**. SQLite is the primary local database. Supabase is an optional cloud connection that can be introduced later without rebuilding the application or interrupting learning.

The most important architectural decision is that **the application must work independently before Supabase is configured**. Account creation, lessons, vocabulary, conversations, saved translations, audio and learning progress must all work locally.

---

## 1. Product Intention

### 1.1 What I Want to Build

I want to build a personal AI-powered language-learning application that helps me learn to speak a new language naturally, confidently and professionally through practical, everyday experiences.

The initial focus is French.

However, the application must be designed from the beginning to support multiple languages, including Arabic, without having to rebuild the entire learning engine.

I do not want a traditional language-learning application that focuses heavily on grammar exercises, written assignments and memorising isolated vocabulary.

I want an application that teaches me how to communicate in real life.

For example:

- How do I greet someone professionally?
- How do I introduce myself?
- How do I appreciate someone's work?
- How do I speak to my boss or colleagues?
- How do I negotiate in a market?
- How do I call a receptionist?
- How do I order food from a waiter?
- How do I explain my destination to a driver?
- How do I visit someone and start a conversation?
- How do I participate in a business meeting?
- How do I explain a problem or ask for assistance?

The application should teach me the expressions, vocabulary, conjugations and pronunciation needed to handle these situations.

The goal is practical communication and spoken fluency.

### 1.2 Core Product Philosophy

The application must follow these principles:

1. **Speak before writing:** Listening and speaking are the primary learning activities.
2. **Learn through experience:** Lessons should reflect realistic situations.
3. **Short lessons:** Introduce approximately 5–10 words or expressions per lesson.
4. **Learn useful conjugations:** Teach verbs through sentences and everyday conversations.
5. **Listen to everything:** Every French word, phrase, sentence and AI-generated response must have an audio playback option.
6. **Ask anything:** I must be able to ask how to express something in the language I am learning.
7. **Support mixed languages:** I can speak or type partly in French and partly in English.
8. **Remember what I learn:** Previously generated content must be saved and reused.
9. **Minimise AI costs:** Do not call an AI model repeatedly for information already available locally.
10. **Work offline:** Learning must continue without an internet connection.
11. **Cloud is optional:** Supabase can be connected later without making it a prerequisite.
12. **Support future languages:** The learning engine must not be hardcoded specifically for French.

---

## 2. Product Objectives

The application should achieve the following:

- Help me develop spoken French fluency.
- Build a progressive vocabulary library based on word frequency and practical usefulness.
- Teach conjugation through contextual examples.
- Simulate realistic conversations.
- Provide pronunciation practice and assessment.
- Allow me to ask spontaneous language questions.
- Maintain a personal library of all expressions and sentences I have learned.
- Reuse previously generated translations, explanations and audio.
- Store learning data locally using SQLite.
- Support optional synchronisation with Supabase.
- Allow future introduction of Arabic and other languages.

### 2.1 Success Indicators

The application should be able to demonstrate:

- Number of words learned.
- Number of expressions saved.
- Vocabulary mastery.
- Verb conjugation mastery.
- Listening progress.
- Pronunciation progress.
- Conversation practice completed.
- Previously learned expressions successfully reused.
- AI requests avoided through local retrieval.
- Percentage of learning activities available offline.

---

## 3. Account and First-Time Experience

### 3.1 Local Account Creation

When I first open the application, I should be able to create my personal learning profile.

The application must not require Supabase or an internet connection before I can start learning.

The local account should contain:

- User ID generated locally.
- Display name.
- Preferred interface language.
- Language being learned.
- Current learning level.
- Learning preferences.
- Account creation date.
- Local profile status.
- Synchronisation status.

The application should allow me to enter the application and start learning immediately.

### 3.2 Local Login

The application should support returning users.

When I reopen it, I should be able to access my existing learning profile.

For local-only operation, an optional PIN or device-based authentication can be used to protect access.

The application must not pretend that a local profile is already a cloud-authenticated account.

### 3.3 Cloud Account Connection Later

Supabase must be optional.

The intended sequence is:

1. Install and open the application.
2. Create a local learning profile.
3. Start learning immediately.
4. Store all learning activities in local SQLite.
5. Continue using the application offline.
6. When Supabase is configured, enable cloud account registration or login.
7. Link the existing local profile to the authenticated Supabase user.
8. Synchronise existing learning data.
9. Continue learning normally.

The user must never lose existing lessons, progress, vocabulary or saved conversations during this transition.

#### Important Requirement

Connecting Supabase must not require reinstalling the application, resetting the local database or creating a new learning profile.

The local profile should be linked to the cloud account through a controlled account-linking process.

If the user already has a cloud account, the application must offer a safe way to associate the local profile with that account.

---

## 4. Learning Experience

The application should have four primary learning sections.

### 4.1 Learn

This is the structured learning environment. The learner receives short, progressive lessons.

#### Learning Categories

**A. High-Frequency Vocabulary**

Start with frequently used French words.

Progress through:

- First 50 words.
- First 100 words.
- First 250 words.
- First 500 words.
- First 1,000 words.
- First 2,000 words.
- Advanced vocabulary.

The vocabulary list should combine frequency rankings with practical usefulness.

Each vocabulary record should contain:

- Word.
- English meaning.
- Part of speech.
- Pronunciation.
- Audio recording.
- Example sentence.
- Translation of the example.
- Gender where applicable.
- Related expressions.
- Related verbs.
- Frequency ranking.
- CEFR level where available.
- Mastery status.

**B. Conjugation Academy**

Conjugation is a major learning priority.

Start with commonly used verbs such as:

- Être
- Avoir
- Faire
- Aller
- Vouloir
- Pouvoir
- Devoir
- Prendre
- Venir
- Dire
- Savoir
- Parler
- Travailler

Teach conjugation through practical sentences.

For example:

- Je travaille.
- Vous travaillez.
- Nous travaillons.
- J'ai travaillé.
- Je vais travailler.

Introduce tenses progressively. Do not make conjugation unnecessarily academic.

**C. Everyday Expressions**

Teach expressions that are immediately useful in daily life.

Examples:

- Greeting people.
- Asking questions.
- Making requests.
- Showing appreciation.
- Apologising.
- Giving directions.
- Expressing opinions.
- Asking for clarification.
- Starting and ending conversations.

**D. Listening and Pronunciation**

Every lesson should include audio.

The learner should be able to:

- Play a word.
- Play an entire sentence.
- Replay audio.
- Adjust playback speed.
- Record their own voice.
- Compare their pronunciation.
- Receive pronunciation feedback where supported.

### 4.2 Ask AI

This is the personal language assistant.

The learner can ask anything related to the language.

Examples:

- How do I say "You did a good job this afternoon" in French?
- How do I say "I will be coming tomorrow"?
- How do I politely ask my boss for permission?
- What is the difference between these two expressions?
- Why did this verb change?
- How do I say this in a more professional way?

The AI should return:

1. Natural target-language expression.
2. English meaning.
3. Context or level of politeness.
4. Short explanation when necessary.
5. Audio playback.
6. Related expressions where useful.

#### Important: Every Generated Response Must Be Reusable

The application must save useful generated language content to the local knowledge library.

It should not generate the same translation and audio repeatedly.

### 4.3 Practise

This is the real-life conversation environment.

The learner selects a scenario and interacts with an AI character.

#### Initial Scenarios

**Office**

- Greeting colleagues.
- Appreciating someone's work.
- Speaking to a manager.
- Asking for updates.
- Participating in meetings.
- Giving feedback.

**Market**

- Asking for prices.
- Negotiating.
- Requesting products.
- Comparing prices.
- Making payments.

**Restaurant**

- Calling a waiter.
- Ordering food.
- Asking for the menu.
- Requesting the bill.

**Transport**

- Calling a driver.
- Explaining a destination.
- Giving directions.
- Asking about travel time.

**Social**

- Meeting someone for the first time.
- Introducing yourself.
- Visiting someone.
- Starting conversations.
- Maintaining conversations.

**Telephone**

- Calling reception.
- Making appointments.
- Asking to speak with someone.
- Explaining why you are calling.

#### Conversation Behaviour

The AI should:

- Play the role of the other person.
- Speak naturally in the target language.
- Ask questions.
- Respond to the learner's answers.
- Allow the learner to speak or type.
- Correct mistakes appropriately.
- Offer better expressions.
- Reuse previously learned vocabulary.

The conversation should feel like a real interaction, not a sequence of examination questions.

### 4.4 Listen and Repeat

A dedicated practice area for:

- Words.
- Short expressions.
- Complete sentences.
- Difficult sounds.
- Connected speech.
- Sentence rhythm.
- Intonation.

The learner listens, repeats and records their response.

Speech transcription alone must not be treated as pronunciation assessment. A dedicated pronunciation assessment method must be evaluated and integrated.

---

## 5. Mixed-Language Input

This is a mandatory feature.

The learner may not know every French expression. The application must understand mixed English and French.

Example:

**Learner:**

> Bonjour, je voudrais parler avec... I don't know how to say the manager.

The AI should understand the intended meaning.

It can respond:

> You can say *le responsable*.

It should then provide the complete natural French sentence and audio.

The application should not reject mixed-language input or require the learner to speak perfect French before receiving help.

The same behaviour must work in text and voice input.

---

## 6. Intelligent AI Caching and Reuse

This is one of the most important product requirements.

The application must use an AI-once, save-and-reuse approach wherever possible.

### 6.1 The Problem

Suppose I ask:

> How do I say you did a good job this afternoon?

The AI generates:

> "Vous avez fait du très bon travail cet après-midi."

Tomorrow I ask:

> How do I say you did a good job this morning?

The application should not automatically call the AI again. It should recognise that the sentence has an existing pattern.

### 6.2 Three-Level Retrieval Engine

**Level 1: Exact Match**

Check whether the same expression has already been generated.

If found, retrieve the saved answer. No AI request.

**Level 2: Pattern and Component Matching**

Identify reusable sentence structures and expressions.

For example:

Base expression:

> "Vous avez fait du très bon travail."

Time expressions:

- Ce matin.
- Cet après-midi.
- Ce soir.
- Demain.
- Hier.

The system can assemble the appropriate sentence locally when the substitution is grammatically valid.

**Level 3: AI Fallback**

Only call the AI when:

- The sentence is genuinely new.
- The meaning is ambiguous.
- A new grammatical construction is required.
- The requested expression needs contextual interpretation.
- The application cannot confidently construct a correct sentence.

### 6.3 Save Generated Content

Every successful AI-generated language response should be considered for storage.

Save:

- Original question.
- Original language.
- Target language.
- Generated expression.
- English meaning.
- Context.
- Formality.
- Sentence structure.
- Reusable components.
- Grammar metadata.
- Audio file reference.
- Audio generation provider.
- Voice model.
- Creation timestamp.
- Content version.

The system must distinguish between a complete reusable phrase and a sentence pattern with interchangeable components.

### 6.4 Audio Reuse

Audio must also be cached.

The same French sentence should not be sent repeatedly to a TTS provider.

Generate once, save the audio and replay it locally.

Audio identity should account for:

- Target language.
- Exact text.
- Voice.
- Accent.
- Speaking speed or synthesis settings.
- Audio model version.

If an exact recording does not exist, check whether the local TTS engine can generate it.

Only use cloud TTS as a fallback when necessary.

### 6.5 Accuracy Requirements

The application must never blindly replace words in a sentence.

It must understand:

- Gender agreement.
- Singular and plural.
- Verb conjugation.
- Articles.
- Prepositions.
- Word order.
- Context.
- Formal and informal forms.

For uncertain transformations, use AI fallback rather than producing an incorrect expression.

---

## 7. Local-First Database and Cloud Synchronisation

### 7.1 Primary Database: SQLite

SQLite is the application's primary database.

All core operations must work without Supabase.

Local SQLite should store:

- User profile.
- Learning preferences.
- Languages.
- Vocabulary.
- Expressions.
- Conjugation records.
- Grammar references.
- Lessons.
- Lesson progress.
- Conversation history.
- AI-generated responses.
- Saved sentence patterns.
- Audio metadata.
- Learning assessments.
- Pronunciation attempts.
- Revision schedules.
- Synchronisation queue.

Audio files and downloadable model files should be stored separately in application-managed local storage, with their references maintained in SQLite.

### 7.2 Optional Cloud Database: Supabase

Supabase is an optional synchronisation and backup layer.

It should provide:

- Cloud account authentication.
- Cloud backup.
- Cross-device learning continuity.
- Synchronisation of personal learning data.
- Central storage of shared language content.
- Optional sharing of non-private learning resources.

Supabase must not become a mandatory dependency of the learning engine.

### 7.3 Synchronisation Behaviour

The application should implement an offline-first synchronisation mechanism.

Every locally created or updated record should have:

- Unique ID.
- Local user ID.
- Cloud user ID where linked.
- Created timestamp.
- Updated timestamp.
- Deleted timestamp where applicable.
- Sync status.
- Version number.

Suggested sync statuses:

- Local only.
- Pending upload.
- Synced.
- Pending download.
- Conflict.
- Failed.

#### Synchronisation Process

1. User creates or updates a record locally.
2. SQLite saves the change immediately.
3. A sync event is added to the local sync queue.
4. If Supabase is configured and the user is authenticated, the sync engine processes the queue.
5. The server confirms successful synchronisation.
6. Local record is marked as synced.

If the internet is unavailable, the queue remains pending. When connectivity returns, synchronisation resumes.

#### Conflict Management

The application must not blindly overwrite data.

Implement:

- Record versioning.
- Updated timestamps.
- Conflict detection.
- Defined merge policies.
- Recovery from interrupted synchronisation.

Learning events should be append-only wherever practical. For example, a new pronunciation attempt should be stored as a new event, not overwrite the previous attempt.

### 7.4 Connecting Supabase Later

The Supabase connection must be configurable.

The application should have a configuration layer for:

- Supabase URL.
- Supabase anonymous/publishable key.
- Authentication settings.
- Database schema version.
- Synchronisation settings.

Never expose a Supabase service-role key in the client application.

Use Row Level Security to protect user-owned records.

The application must support an existing local installation being connected to a Supabase project without resetting its database.

---

## 8. Proposed Software Architecture

### 8.1 Architecture Principles

The application should follow a modular architecture.

The learning engine, database, AI providers, audio engine and synchronisation engine must be independent modules.

The application must not directly couple its user interface to one AI provider.

### 8.2 Proposed Technology Stack

| Layer | Proposed technology |
| --- | --- |
| User interface | Next.js + React |
| Styling | Tailwind CSS |
| Mobile application | Capacitor Android wrapper |
| Local database | SQLite |
| SQLite access | Capacitor-compatible SQLite plugin |
| Cloud database | Supabase PostgreSQL |
| Authentication | Local profile initially; Supabase Auth when connected |
| AI text provider | DeepSeek API adapter |
| TTS | Piper locally, optional cloud TTS adapter |
| Speech recognition | Whisper.cpp or another validated local engine |
| Pronunciation evaluation | Dedicated assessment model to be selected |
| Audio storage | Local application storage |
| Cloud audio storage | Optional Supabase Storage |
| Offline support | Service worker, local assets and SQLite |
| Synchronisation | Custom sync service |

#### Important Platform Decision

The application should use an Android-capable SQLite implementation.

A conventional browser-only PWA cannot assume unrestricted native SQLite access or unrestricted filesystem access.

Therefore, use a mobile-first interface with a Capacitor Android shell and native SQLite integration.

A browser-based version may be provided separately, using an appropriate local persistence adapter.

Both interfaces should use the same learning domain logic.

### 8.3 Logical Architecture

The application should be divided into the following modules:

1. Presentation Layer.
2. Authentication and Local Profile Layer.
3. Learning Engine.
4. Local SQLite Repository.
5. AI Provider Layer.
6. Translation and Retrieval Engine.
7. Audio and Speech Engine.
8. Conversation Engine.
9. Offline Content Manager.
10. Synchronisation Engine.
11. Optional Supabase Adapter.

#### High-Level Data Flow

```text
User Interface
    ↓
Application Services
    ↓
Learning Engine
    ↓
Local SQLite Repository
    ↓
Local Retrieval and Pattern Engine
    ↓
If necessary: AI Provider
    ↓
Save generated content and metadata locally
    ↓
Optional Supabase Synchronisation
```

The application should always check local data before making an external AI request.

---

## 9. AI Provider Architecture

The AI provider must be replaceable.

Create provider interfaces rather than hardcoding a single vendor.

### 9.1 AI Capabilities

**A. Language Tutor**

Responsibilities:

- Translate expressions.
- Explain language usage.
- Generate examples.
- Identify sentence structures.
- Support mixed-language input.
- Generate conversation responses.

**B. Text-to-Speech**

Responsibilities:

- Generate natural speech.
- Support French initially.
- Generate audio for individual words and complete sentences.
- Cache generated audio.

**C. Speech Recognition**

Responsibilities:

- Recognise French speech.
- Support English and mixed-language speech.
- Convert spoken input into usable text for the conversation engine.

**D. Pronunciation Assessment**

Responsibilities:

- Assess phoneme production.
- Identify difficult sounds.
- Evaluate pronunciation accuracy.
- Evaluate rhythm and intonation where supported.

Speech recognition and pronunciation evaluation must remain separate services.

### 9.2 Provider Configuration

Create a central AI settings module.

It should support:

- Provider selection.
- Model selection.
- API credentials.
- Request limits.
- Token usage tracking.
- Audio generation tracking.
- Cost estimation.
- Error handling.
- Provider fallback.

No AI provider should be required for ordinary offline learning.

---

## 10. Multi-Language Architecture

French is the first language pack.

Arabic and additional languages must be supported without changing the learning engine.

Each language pack should define:

- Language identifier.
- Display name.
- Writing system.
- Reading direction.
- Vocabulary.
- Frequency ranking.
- Phonetic system.
- Voice models.
- Pronunciation rules.
- Grammar rules.
- Conjugation system.
- Example sentences.
- Learning levels.
- Assessment configuration.

Arabic must support:

- Right-to-left interface rendering.
- Arabic script.
- Arabic audio.
- Appropriate pronunciation resources.
- Arabic-specific grammar and morphology.

Do not assume that French and Arabic share the same grammatical or pronunciation rules.

The shared application engine should consume language-specific configurations.

---

## 11. User Interface and Navigation

Keep the interface simple.

Primary navigation:

1. Learn.
2. Ask AI.
3. Practise.
4. Listen and Repeat.
5. My Progress.
6. Settings.

### 11.1 Dashboard

The dashboard should show:

- Current learning language.
- Current level.
- Today's lesson.
- Vocabulary progress.
- Conjugation progress.
- Recent conversations.
- Daily learning activity.
- Pending reviews.

The application should not overload the learner with statistics.

### 11.2 Lesson Design

Each lesson should be short.

Example:

**Lesson: Appreciating Someone's Work**

- 5–10 expressions.
- Listen to each expression.
- Learn the English meaning.
- Practise pronunciation.
- Learn the relevant verb.
- Complete a short scenario.
- Review previous expressions.

A lesson should ideally take approximately 5–10 minutes.

---

## 12. Content Management and Learning Progression

The system should support structured learning content.

Content should be organised by:

- Language.
- Learning level.
- Topic.
- Scenario.
- Vocabulary.
- Conjugation.
- Expression.
- Lesson.
- Assessment.

Learning content must be reusable across multiple lessons.

For example, the verb *faire* should appear in different situations:

- Office.
- Market.
- Social conversations.
- Everyday activities.
- Professional communication.

Learning progress should be tracked independently for:

- Vocabulary.
- Listening.
- Pronunciation.
- Speaking.
- Conjugation.
- Reading.
- Writing.

Reading should be introduced progressively.

Writing should remain optional and can be activated later without resetting existing progress.

Use spaced repetition to revisit words and expressions.

---

## 13. Security and Privacy

Requirements:

- Do not store passwords in plaintext.
- Do not expose private API credentials in frontend code.
- Use secure local storage for sensitive credentials.
- Protect local learning data.
- Use Supabase Row Level Security.
- Separate private conversation history from shared language content.
- Provide data export and deletion.
- Make cloud synchronisation optional.
- Do not upload voice recordings without the appropriate user permission.
- Provide controls for clearing downloaded audio and models.

---

## 14. AI Cost Management

The application must minimise external AI usage.

Implement the following controls:

1. Exact phrase caching.
2. Sentence-pattern matching.
3. Reusable vocabulary and conjugation records.
4. Local audio caching.
5. Local TTS where practical.
6. Pre-generated lessons.
7. Local conversation templates.
8. Request deduplication.
9. AI usage monitoring.
10. Configurable usage limits.

Every external AI request should be logged.

Track:

- Provider.
- Model.
- Request type.
- Input tokens.
- Output tokens.
- Audio characters or duration.
- Estimated cost.
- Cache hit or miss.
- Generation timestamp.
- Associated content record.

The system should be able to report how much money was saved through local retrieval and caching.

---

## 15. Functional Requirements

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-001 | Create a local learning profile | Critical |
| FR-002 | Login to an existing local profile | Critical |
| FR-003 | Start learning without internet | Critical |
| FR-004 | Persist all learning data in SQLite | Critical |
| FR-005 | Browse structured French lessons | Critical |
| FR-006 | Play audio for every French sentence | Critical |
| FR-007 | Replay and control audio speed | High |
| FR-008 | Learn high-frequency vocabulary | Critical |
| FR-009 | Learn practical verb conjugations | Critical |
| FR-010 | Ask AI how to express something | Critical |
| FR-011 | Understand mixed French-English input | Critical |
| FR-012 | Cache generated translations and explanations | Critical |
| FR-013 | Cache generated audio | Critical |
| FR-014 | Recognise reusable sentence patterns | Critical |
| FR-015 | Practise real-life conversations | Critical |
| FR-016 | Record spoken responses | High |
| FR-017 | Support pronunciation assessment | High |
| FR-018 | Track learning progress | High |
| FR-019 | Connect Supabase after initial installation | Critical |
| FR-020 | Synchronise local records with Supabase | Critical |
| FR-021 | Recover from interrupted synchronisation | Critical |
| FR-022 | Support multiple language packs | Critical |
| FR-023 | Support Arabic RTL | High |
| FR-024 | Support optional reading practice | Medium |
| FR-025 | Support optional writing practice | Low |

---

## 16. Non-Functional Requirements

- The application must be mobile-first.
- Local lesson retrieval should be fast.
- The application must remain usable without an internet connection.
- Learning progress must be saved immediately.
- Synchronisation must not block normal learning.
- AI provider outages must not crash the application.
- Audio playback must work offline when audio is cached.
- Database migrations must preserve existing data.
- The architecture must allow additional AI providers.
- The application must support future language packs.
- The application must not require a complete rewrite when Supabase is connected.

---

## 17. Phased Development Roadmap

### Phase 1 — Foundation

- Project setup.
- Mobile-first interface.
- Local SQLite integration.
- Local profile creation.
- Local login.
- Database migrations.
- Offline persistence.
- Basic navigation.

**Deliverable:** A functioning application that works without Supabase or AI.

### Phase 2 — French Learning Engine

- Language pack architecture.
- French vocabulary database.
- High-frequency vocabulary.
- Expression library.
- Conjugation data.
- Lesson engine.
- Learning progress.

**Deliverable:** Structured French lessons operating locally.

### Phase 3 — Audio Engine

- TTS provider interface.
- French voice integration.
- Audio caching.
- Sentence-level playback.
- Replay and speed controls.
- Offline audio access.

**Deliverable:** Complete listening and repetition functionality.

### Phase 4 — AI Tutor and Intelligent Retrieval

- AI provider integration.
- Ask AI interface.
- Translation and explanation.
- Exact phrase matching.
- Sentence-pattern engine.
- Reusable components.
- AI request logging.
- AI cost tracking.

**Deliverable:** An AI assistant that generates new language content and reuses existing content whenever possible.

### Phase 5 — Conversation Practice

- Scenario library.
- Conversation engine.
- Mixed-language input.
- Text conversations.
- Voice conversations.
- Contextual corrections.
- Reusable conversation expressions.

**Deliverable:** Real-life French conversation simulations.

### Phase 6 — Speech and Pronunciation

- Speech recognition.
- Voice recording.
- Pronunciation assessment research and integration.
- Feedback.
- Listening and pronunciation progress.

**Deliverable:** A speaking practice environment.

### Phase 7 — Supabase Integration

- Cloud account authentication.
- Local-to-cloud account linking.
- Database schema.
- Sync queue.
- Conflict management.
- Cloud backup.
- Cross-device synchronisation.

**Deliverable:** Existing local users can connect to Supabase without losing data.

### Phase 8 — Additional Languages

- Arabic language pack.
- RTL interface.
- Additional language configurations.
- Language-specific pronunciation and grammar systems.

**Deliverable:** Multi-language platform.

### Phase 9 — Advanced Learning

- Reading Academy.
- Optional Writing Academy.
- CEFR assessments.
- DELF/DALF-oriented preparation.
- Advanced conversation simulations.

**Deliverable:** Extended language learning capabilities.

---

## 18. Acceptance Criteria

The following tests are mandatory.

### Test 1: Local Installation

Given a new installation, when the application opens without internet, the user can create a local profile and start learning.

**Expected result:** Successful local account creation and persistent SQLite storage.

### Test 2: Offline Learning

Given an existing local profile, when the device is offline, the learner can access downloaded lessons, saved vocabulary and cached audio.

**Expected result:** No Supabase dependency.

### Test 3: AI Translation

Given a new expression, when the learner asks how to say it in French, the AI generates the translation and the application saves the response.

**Expected result:** The expression is available for later reuse.

### Test 4: Sentence-Pattern Reuse

Given that the application has already learned:

> "Vous avez fait du très bon travail cet après-midi."

When the learner asks:

> "How do I say you did a good job this morning?"

**Expected result:**

> "Vous avez fait du très bon travail ce matin."

The application should reuse the known sentence structure without an AI call if its local transformation rules can verify correctness.

### Test 5: Audio Reuse

Given an expression with a cached audio recording, when the learner requests playback again, the application plays the local audio.

**Expected result:** No new TTS request.

### Test 6: Mixed-Language Conversation

Given that the learner speaks partly in French and partly in English, the conversation engine understands the intended meaning and provides the missing French expression.

**Expected result:** The conversation continues naturally.

### Test 7: Supabase Connection

Given an existing local user with learning history, when Supabase is configured and the user authenticates, the application links the local profile and begins synchronisation.

**Expected result:** Existing data remains available and is not duplicated.

### Test 8: Offline-to-Online Synchronisation

Given locally created records while offline, when internet connectivity returns, the application synchronises pending changes.

**Expected result:** No lost learning records.

### Test 9: AI Provider Outage

Given that the AI provider is unavailable, when the learner opens a saved lesson or requests a cached expression, the application continues functioning.

**Expected result:** Existing content remains accessible.

### Test 10: New Language

Given that French is already installed, when a compatible Arabic language pack is added, the application can support Arabic without changing its shared learning engine.

**Expected result:** Language-specific content and settings load correctly.

---

## 19. Developer Implementation Rules

The development team must follow these rules:

1. Do not make Supabase a prerequisite for application startup.
2. Do not make AI APIs a prerequisite for ordinary learning.
3. SQLite is the primary source of truth for the active device.
4. Every learning operation must persist locally.
5. All database access must go through repository/service abstractions.
6. Do not couple the learning engine directly to DeepSeek or another provider.
7. Every AI-generated reusable response must be evaluated for caching.
8. Every generated audio file must be evaluated for local storage.
9. Never use speech transcription as a substitute for pronunciation assessment.
10. Do not hardcode French-specific logic into the shared learning engine.
11. Supabase integration must be additive.
12. Database schema changes must use migrations.
13. All synchronisation operations must be retryable and idempotent.
14. Preserve existing user data during updates.
15. Implement and test each phase before progressing to the next.

---

## 20. Final Product Definition

The proposed application is a personal, offline-first, AI-assisted, multi-language learning platform designed primarily to develop spoken fluency through practical vocabulary, conjugation, listening, pronunciation and realistic conversations.

It uses SQLite as its primary local database, allowing users to create a profile and begin learning immediately without requiring a cloud account or internet connection.

AI-generated translations, expressions, explanations, sentence patterns and audio are stored and reused to minimise repeated API requests and ongoing costs.

Supabase is an optional cloud integration that can be connected later for authentication, backup and synchronisation without interrupting existing learning activities or requiring the application to be rebuilt.

The architecture must remain modular, provider-independent and language-independent so that French can be expanded to Arabic and other languages.

**The central principle is simple: the application should become more useful, more knowledgeable about the learner's progress, and less dependent on repeated AI generation the longer it is used.**

---

## Appendix A: Architecture at a Glance

```text
Mobile / Web Interface
  Learn · Ask AI · Practise · Listen

Application Services
  Learning Engine · AI Retrieval · Audio · Conversation

SQLite — Primary Local Database
  Profiles · Lessons · Vocabulary · Progress · Cache

Local AI Services
  Piper · Whisper · Local models

Cloud AI Services
  DeepSeek · Optional TTS
  Optional synchronisation

Supabase — Optional Cloud Layer
  Authentication · Backup · Cross-device sync
```

## Appendix B: Three Architectural Decisions to Respect

1. **Local-first is not cloud-dependent:** The app must be fully usable before Supabase is supplied or connected.
2. **Local SQLite is the primary learning database:** Supabase should not be queried every time the user opens a lesson or plays audio.
3. **Cloud connection must be additive:** Connecting Supabase later must preserve the local account, its data and its learning history.

The one implementation detail to settle before development is the mobile runtime: use Capacitor with native SQLite for Android, rather than relying on browser storage alone. This gives the project a practical path to genuine local SQLite persistence while retaining a web-based interface.
