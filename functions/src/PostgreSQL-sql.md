-- Create Enums
CREATE TYPE "NotificationStatus" AS ENUM (
  'NEW',
  'DELIVERED',
  'DISMISSED'
);

CREATE TYPE "LeadStatus" AS ENUM (
  'NO_REPLY',
  'REJECTED',
  'CONVERTED'
);

CREATE TYPE "MessageSender" AS ENUM (
  'LEAD',
  'ASSISTANT'
);

CREATE TYPE "MessageDirection" AS ENUM (
  'INBOUND',
  'OUTBOUND'
);

-- Create Tables

-- User table
-- Corresponds to the 'User' type with @table
CREATE TABLE "User" (
  -- id: String! @default(expr: "auth.uid") - Assuming this is the primary key and maps to a UUID or VARCHAR
  "id" VARCHAR(255) PRIMARY KEY,
  -- username: String! @col(dataType: "varchar(50)")
  "username" VARCHAR(50) NOT NULL,
  -- email: String! @col(dataType: "varchar(255)")
  "email" VARCHAR(255) NOT NULL,
  -- createdAt: Date! @default(expr: "request.time")
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
  -- campaigns: [Campaign!]! @hasMany(foreignKey: "createdBy") - Relationship handled by foreign key in Campaign table
);

-- AIAgent table
-- Corresponds to the 'AIAgent' type with @table
CREATE TABLE "AIAgent" (
  -- id: String! @default(expr: "uuidV4()") - Assuming this is the primary key and maps to UUID with default generation
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- name: String! @col(dataType: "varchar(255)")
  "name" VARCHAR(255) NOT NULL,
  -- description: String @col(dataType: "text")
  "description" TEXT,
  -- systemPrompt: String! @col(dataType: "text")
  "systemPrompt" TEXT NOT NULL,
  -- initialMessage: String! @col(dataType: "text")
  "initialMessage" TEXT NOT NULL
);

-- ResponseRule table
-- Corresponds to the 'ResponseRule' type with @table
CREATE TABLE "ResponseRule" (
  -- id: String! @default(expr: "uuidV4()") - Assuming this is the primary key and maps to UUID with default generation
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- aiAgentId: String! - Link to the AI agent, foreign key
  "aiAgentId" UUID NOT NULL,
  -- condition: String! @col(dataType: "text")
  "condition" TEXT NOT NULL,
  -- action: String! @col(dataType: "text")
  "action" TEXT NOT NULL,
  -- Foreign key constraint linking to AIAgent table
  FOREIGN KEY ("aiAgentId") REFERENCES "AIAgent" ("id") ON DELETE CASCADE
);

-- Campaign table
-- Corresponds to the 'Campaign' type with @table
CREATE TABLE "Campaign" (
  -- id: String! @default(expr: "uuidV4()") - Assuming this is the primary key and maps to UUID with default generation
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- name: String! @col(dataType: "varchar(255)")
  "name" VARCHAR(255) NOT NULL,
  -- description: String @col(dataType: "text")
  "description" TEXT,
  -- status: String! @col(dataType: "varchar(50)") - Assuming this maps to VARCHAR, could also be an ENUM if defined
  "status" VARCHAR(50) NOT NULL,
  -- createdBy: String! - Link to the User who created the campaign, foreign key
  "createdBy" VARCHAR(255) NOT NULL,
  -- createdAt: Date! @default(expr: "request.time")
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  -- sentAt: Date
  "sentAt" TIMESTAMP WITH TIME ZONE,
  -- completedAt: Date
  "completedAt" TIMESTAMP WITH TIME ZONE,
  -- totalLeads: Int
  "totalLeads" INTEGER,
  -- sentCount: Int
  "sentCount" INTEGER,
  -- respondedCount: Int
  "respondedCount" INTEGER,
  -- aiAgentId: String! - Link to the AI agent used, foreign key
  "aiAgentId" UUID NOT NULL,
  -- Foreign key constraint linking to User table
  FOREIGN KEY ("createdBy") REFERENCES "User" ("id") ON DELETE CASCADE,
  -- Foreign key constraint linking to AIAgent table
  FOREIGN KEY ("aiAgentId") REFERENCES "AIAgent" ("id") ON DELETE RESTRICT -- Assuming RESTRICT is appropriate
);

-- Lead table
-- Corresponds to the 'Lead' type with @table
CREATE TABLE "Lead" (
  -- id: String! @default(expr: "uuidV4()") - Assuming this is the primary key and maps to UUID with default generation
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- first_name: String! @col(dataType: "varchar(255)")
  "first_name" VARCHAR(255) NOT NULL,
  -- last_name: String! @col(dataType: "varchar(255)")
  "last_name" VARCHAR(255) NOT NULL,
  -- phone: String! @col(dataType: "varchar(20)")
  "phone" VARCHAR(20) NOT NULL,
  -- email: String @col(dataType: "varchar(255)")
  "email" VARCHAR(255),
  -- address: String @col(dataType: "text")
  "address" TEXT,
  -- recentCampaignId: String - Link to the recent Campaign, foreign key
  "recentCampaignId" UUID,
  -- lastContacted: Date
  "lastContacted" TIMESTAMP WITH TIME ZONE,
  -- status: LeadStatus! - Use the LeadStatus Enum
  "status" "LeadStatus" NOT NULL,
  -- Foreign key constraint linking to Campaign table (optional, as recentCampaignId is nullable)
  FOREIGN KEY ("recentCampaignId") REFERENCES "Campaign" ("id") ON DELETE SET NULL
);

-- Conversation table
-- Corresponds to the 'Conversation' type with @table
CREATE TABLE "Conversation" (
  -- id: String! @default(expr: "uuidV4()") - Assuming this is the primary key and maps to UUID with default generation
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- leadId: String! - Link to the Lead, foreign key
  "leadId" UUID NOT NULL,
  -- clientId: String! - Link to the User (client), foreign key
  "clientId" VARCHAR(255) NOT NULL,
  -- aiAgentId: String! - Link to the AI agent, foreign key
  "aiAgentId" UUID NOT NULL,
  -- createdAt: Date! @default(expr: "request.time")
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  -- lastUpdatedAt: Date! @default(expr: "request.time")
  "lastUpdatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  -- Foreign key constraint linking to Lead table
  FOREIGN KEY ("leadId") REFERENCES "Lead" ("id") ON DELETE CASCADE,
  -- Foreign key constraint linking to User table
  FOREIGN KEY ("clientId") REFERENCES "User" ("id") ON DELETE CASCADE,
  -- Foreign key constraint linking to AIAgent table
  FOREIGN KEY ("aiAgentId") REFERENCES "AIAgent" ("id") ON DELETE RESTRICT -- Assuming RESTRICT is appropriate
);

-- Message table
-- Corresponds to the 'Message' type with @table
CREATE TABLE "Message" (
  -- id: String! @default(expr: "uuidV4()") - Assuming this is the primary key and maps to UUID with default generation
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- conversationId: String! - Link to the Conversation, foreign key
  "conversationId" UUID NOT NULL,
  -- sender: MessageSender! - Use the MessageSender Enum
  "sender" "MessageSender" NOT NULL,
  -- text: String! @col(dataType: "text")
  "text" TEXT NOT NULL,
  -- timestamp: Date! @default(expr: "request.time")
  "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  -- direction: MessageDirection! - Use the MessageDirection Enum
  "direction" "MessageDirection" NOT NULL,
  -- status: String! @col(dataType: "varchar(50)")
  "status" VARCHAR(50) NOT NULL,
  -- Foreign key constraint linking to Conversation table
  FOREIGN KEY ("conversationId") REFERENCES "Conversation" ("id") ON DELETE CASCADE
);

-- Notification table
-- Corresponds to the 'Notification' type with @table
CREATE TABLE "Notification" (
  -- id: String! @default(expr: "uuidV4()") - Assuming this is the primary key and maps to UUID with default generation
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- userId: String! - Link to the User, foreign key
  "userId" VARCHAR(255) NOT NULL,
  -- type: String! @col(dataType: "varchar(100)")
  "type" VARCHAR(100) NOT NULL,
  -- message: String! @col(dataType: "text")
  "message" TEXT NOT NULL,
  -- createdAt: Date! @default(expr: "request.time")
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  -- readAt: Date
  "readAt" TIMESTAMP WITH TIME ZONE,
  -- relatedEntityId: String - Optional link to a related entity
  "relatedEntityId" VARCHAR(255), -- Assuming VARCHAR is appropriate for a generic ID
  -- status: NotificationStatus! - Use the NotificationStatus Enum
  "status" "NotificationStatus" NOT NULL,
  -- Foreign key constraint linking to User table
  FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE
);

-- Note: The Query and Mutation types in schema.gql define the GraphQL API operations
-- and do not correspond to database tables themselves. The @firestore directives
-- indicate that some operations might be interacting with Firestore instead of PostgreSQL,
-- or that Data Connect is configured to bridge between GraphQL and Firestore for those.
-- However, the @table directives clearly indicate the intention for these types to be PostgreSQL tables.
-- The SQL above is generated based on the @table definitions.
