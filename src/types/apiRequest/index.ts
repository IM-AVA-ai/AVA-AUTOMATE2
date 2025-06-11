// This file contains the types for the API request.

interface DateTime {
    dateTime: string;
    timeZone: string;
}

interface Attendee {
    email: string;
}

interface ReminderOverride {
    method: 'email' | 'popup';
    minutes: number;
}

interface Reminders {
    useDefault: boolean;
    overrides: ReminderOverride[];
}

interface ConferenceSolutionKey {
    type: string;
}

interface CreateRequest {
    requestId: string;
    conferenceSolutionKey: ConferenceSolutionKey;
}

interface ConferenceData {
    createRequest: CreateRequest;
}

export interface CreateCalendarEventType {
    summary: string;
    location?: string;
    description?: string;
    start: DateTime;
    end: DateTime;
    recurrence?: string[];
    attendees?: Attendee[];
    reminders?: Reminders;
    conferenceData?: ConferenceData;
    accessToken: string
}

export type CreateCalendarEventFormType = {
    summary: string;
    location?: string;
    description?: string;
    start: Date;
    end: Date;
    isRecurring: boolean;
    emails: string[];
    notificationTime: string;
    timezone: string;
    googleMeet: string
}