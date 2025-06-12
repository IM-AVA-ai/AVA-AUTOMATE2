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

export type CreateNewLeadFormType = {
    firstName: string;
    lastName: string;
    company: string;
    phoneNumber: string;
    title: string;
    address: string;
    leadStatus: string;
    instanceUrl?: string
    accessToken: string
}

export type CreateNewContactFormType = {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    instanceUrl?: string
    accessToken: string
}

export type IFetchLeadsQueryParamsType = {
    search: string;
    nextRecordUrl: string;
    limit?: number
    offset?: number
}
export type IFetchHubSpotContactsQueryParamsType = {
    contactSearch?: string;
    leadSearch?: string;
    limit?: number
    offset?: number
}
export type IFetchHubSpotQueryParamsType = {
    query?: string;
}

export type IFetchSalesForceContactsQueryParamsType = {
    contactsSearch: string;
    contactsLimit?: number
    contactsOffset?: number
}