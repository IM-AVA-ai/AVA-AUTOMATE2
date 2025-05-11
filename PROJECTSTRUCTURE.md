📁 AVA-AUTOMATE Project Structure

```plaintext
AVA-AUTOMATE/
├── .firebaserc
├── .gitignore
├── apphosting.yaml
├── components.json
├── database.rules.json
├── firebase-debug.log
├── firebase.json
├── firestore.indexes.json
├── firestore.rules
├── jest.config.js
├── jest.setup.js
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
├── storage.rules
├── tailwind.config.ts
├── tsconfig.json
├── dataconnect/
│   ├── dataconnect.yaml
│   ├── connector/
│   │   ├── connector.yaml
│   │   ├── mutations.gql
│   │   └── queries.gql
│   └── schema/
│       └── schema.gql
├── dataconnect-generated/
│   └── js/
│       └── default-connector/
│           ├── index.cjs.js
│           ├── index.d.ts
│           ├── package.json
│           ├── README.md
│           ├── esm/
│           └── react/
├── functions/
│   ├── .eslintrc.js
│   ├── .gitignore
│   ├── firebase-debug.log
│   ├── index.js
│   ├── package-lock.json
│   ├── package.json
│   ├── tsconfig.dev.json
│   ├── tsconfig.json
│   └── src/
│       ├── genkit-sample.ts
│       └── index.ts
├── public/
│   ├── 404.html
│   ├── app.js
│   ├── index.html
│   └── images/
│       ├── favicon.png
│       ├── favicon.svg
│       ├── im-ava-logo.png
│       ├── long-logo.jpg
│       ├── long-logo.png
│       ├── long-logo.svg
│       ├── square-logo-white.jpg
│       └── square-logo.jpg
├── src/
│   ├── features-cards.tsx
│   ├── middleware.ts
│   ├── prompt-container-empty.tsx
│   ├── providers.tsx
│   ├── ai/
│   │   ├── ai-instance.ts
│   │   ├── dev.ts
│   │   └── flows/
│   │       ├── agent-customization.ts
│   │       ├── automatic-follow-ups.ts
│   │       ├── message-personalization.ts
│   │       └── sms-campaign-generation.ts
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── (auth)/
│   │   │   ├── auth.ts
│   │   │   ├── sign-in/
│   │   │   └── sign-up/
│   │   ├── dashboard/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── agents/
│   │   │   ├── campaigns/
│   │   │   ├── conversations/
│   │   │   ├── leads/
│   │   │   ├── notifications/
│   │   │   ├── playground/
│   │   │   └── settings/
│   │   └── home-old/
│   │       └── page.tsx
│   ├── components/
│   │   ├── DashboardContent.tsx
│   │   ├── FeatureItem.tsx
│   │   ├── FeatureItemEnhanced.tsx
│   │   ├── FooterLink.tsx
│   │   ├── MetricsCard.tsx
│   │   ├── NotificationHandler.tsx
│   │   ├── PlaygroundInterface.tsx
│   │   ├── prompt-container-empty-base.tsx
│   │   ├── SelectLeadsDialog.tsx
│   │   ├── Sidebar.tsx
│   │   ├── SocialIcon.tsx
│   │   ├── StatsCard.tsx
│   │   ├── theme-provider.tsx
│   │   ├── ThreeColumnLayout.tsx
│   │   ├── TopNav.tsx
│   │   ├── UseCaseCard.tsx
│   │   ├── WorkflowStep.tsx
│   │   ├── Providers/
│   │   │   └── QueryProvider.tsx
│   │   └── ui/
│   │       └── [...UI components list truncated for brevity]
│   ├── firebase/
│   │   ├── auth-context.ts
│   │   ├── auth-context.tsx
│   │   └── config.ts
│   ├── functions/
│   │   └── api/
│   │       ├── generate-ai-response.ts
│   │       ├── generate-genkit-response.ts
│   │       ├── process-incoming-sms.ts
│   │       └── generate-genkit-response/
│   ├── hooks/
│   │   ├── use-in-view.ts
│   │   ├── use-mobile.tsx
│   │   ├── use-toast.ts
│   │   ├── useConversations.ts
│   │   └── useIsMobile.ts
│   ├── lib/
│   │   └── utils.ts
│   ├── pages/
│   └── services/
│       ├── ai-service.ts
│       ├── auth.ts
│       ├── campaigns.ts
│       ├── chats.ts
│       ├── conversations.ts
│       ├── email-verification.ts
│       ├── email.ts
│       ├── genkit.ts
│       ├── leads.ts
│       ├── messages.ts
│       ├── notifications.ts
│       ├── realtime-conversations.ts
│       ├── sms.ts
│       ├── twilio.ts
│       └── users.ts
```

# Summary

This is the full project structure for `AVA-AUTOMATE`, organized as a directory tree. It includes backend functions, frontend logic, AI integrations, Firestore schema via Data Connect, and public-facing components.
