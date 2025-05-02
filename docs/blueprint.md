# **App Name**: AVA Automate

## Core Features:

- Authentication: User authentication with Firebase Authentication (login, signup, password reset).
- Data Management: Manage leads, upload CSV and AI agent creation.
- Real-time Chat: Real-time conversation history (pulled from Firestore with onSnapshot) with filter controls.
- AI Assistant Integration: AI assistants craft personalized messages to engage leads and qualify them.
- SMS Campaigns: Initiate SMS campaigns and send personalized SMS messages to selected leads using Twilio.
- Real-Time Messaging: Support ongoing two-way conversations displaying both user and AI-generated responses in real time.
- Automated Follow-ups and Notifications: Automatically manage follow-up messages and send notifications for key actions.
- Error Handling and Monitoring: Provide error handling, track failed message deliveries, and allow users to monitor campaign progress.

## Style Guidelines:

- Dark theme with dark gray backgrounds and lighter text for contrast.
- Use a primary color (e.g., a shade of blue or purple) for key elements like buttons and active states.
- Accent: Teal (#008080) to highlight interactive elements and provide a visual cue.
- Use Shadcn's Resizable component for Conversation History to allow users to adjust panel sizes.
- Employ a consistent grid system for aligning elements and maintaining a clean, structured layout.
- Use clear, simple icons from a library like Lucide or Tabler Icons to represent actions and categories.