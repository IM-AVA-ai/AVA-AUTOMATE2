Project Title: AVA Automate (Based on directory and codebase names)

**AVA Automate** is a Firebase-backed SaaS platform designed to automate business-to-consumer communication through **AI-powered SMS campaigns**. It enables businesses to import leads, engage them with personalized messages via AI assistants, and manage ongoing conversations in real time.

The core goal is to reduce manual outreach by allowing AI to **send**, **respond**, and **qualify leads** automatically, while keeping users informed and in control.

---

## 🗺️ User Flow

```
Lead Import 
   ↓
Campaign Creation & Launch 
   ↓
AI-Powered SMS Interaction 
   ↓
Conversation Management & Notifications
```

---

## 🧱 Technical Stack

| Layer        | Tech/Tool                                     |
|--------------|-----------------------------------------------|
| Backend      | Firebase Functions, Node.js                   |
| Database     | Firestore (managed via Data Connect)          |
| Auth         | Firebase Authentication                       |
| Storage      | Firebase Storage                              |
| Messaging    | Twilio (SMS API, A2P Compliance)              |
| AI Engine    | Google Gen AI Kit                             |
| Frontend     | HTML + JS (MVP), React/Next.js (planned)      |
| CSV Parsing  | csv-parser (Node.js library)                  |

---

##  Project Structure

```
AVA-AUTOMATE/
├── firebase.json                → Firebase config (functions, hosting, rules)
├── functions/                  → Core Firebase Functions
├── ava-automate/             → Additional/alternate functions
├── dataconnect/
│   └── schema/
│       └── schema.gql         → Firestore schema using Data Connect GraphQL
├── public/
│   ├── index.html             → Basic UI for CSV upload
│   └── app.js                 → Firebase client integration
```

---

## 🧬 Data Connect Schema

**File:** `dataconnect/schema/schema.gql`

###  Key Types
- User
- Campaign
- AIAgent
- ResponseRule
- Lead
- Message
- Notification
- Conversation

###  Enums
- `LeadStatus`
- `NotificationStatus`

###  Relationships
- `User @hasMany Campaigns`
- `Campaign @hasMany Leads`
- `Lead @hasMany Conversations`
- `Conversation @hasMany Messages`
- `Campaign @oneToOne AIAgent`

###  Mutations
- `insertLead`
- `insertNotification`

---

##  Firebase Cloud Functions

### `importLeadsFromCSV`
- **Location:** `functions/` or `ava-automate2/`
- **Purpose:** Import and validate leads from CSV
- **Steps:**
  - Accepts CSV string via HTTPS Callable
  - Parses and validates rows
  - (Planned) Checks for duplicates
  - Inserts valid leads with `insertLead`
  - Logs notifications with `insertNotification`
  - Returns summary to frontend

---

##  Frontend Implementation (MVP)

### HTML (`public/index.html`)
- File input for CSV
- Upload button
- Status feedback area

### JavaScript (`public/app.js`)
- Firebase initialization
- CSV file parsing
- Calls `importLeadsFromCSV`
- Displays result messages

---

##  Twilio Integration (Planned)

- Send SMS via Twilio API
- Receive SMS via Twilio webhook → Firebase Function
- Threading + delivery tracking
- A2P 10DLC handling
- Opt-out detection (STOP, HELP, etc.)

---

##  AI Assistant Tools

| Feature                  | Description |
|--------------------------|-------------|
| Dynamic Prompt System    | Assign custom tone + prompt per assistant |
| Gen AI Integration       | Real-time message generation |
| Campaign Linking         | Assign assistant per campaign |
| Playground (Planned)     | Preview/test prompts before launch |

---

##  Notifications

| Trigger                         | Output |
|----------------------------------|--------|
| Lead Import                     | Import summary |
| Campaign Sent                   | Confirmation + stats |
| Lead Reply                      | Real-time alert |
| Message Failure                 | Error alert |
| A2P or Twilio Error             | Warning notification |

---

##  Future Roadmap

- [ ] Duplicate lead detection logic
- [ ] Twilio webhook for incoming replies
- [ ] Assistant reply function via Gen AI
- [ ] Real-time message UI (Conversations)
- [ ] AIAgent editor + preview Playground
- [ ] A2P registration status tracking
- [ ] Campaign reporting dashboard

---

## Summary

**AVA Automate** is built to empower businesses with hands-free, AI-driven SMS lead engagement. Backed by Firebase, integrated with Twilio, and powered by Google Gen AI — this platform combines automation, personalization, and scalability.

Ready to be extended, tested, and deployed with real-time conversation logic and assistant training capabilities.


