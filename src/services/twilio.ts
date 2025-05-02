/**
 * Represents the response from sending an SMS message.
 */
export interface SmsResponse {
  /**
   * A unique ID for the message.
   */
  messageId: string;
  /**
   * The status of the message (e.g., "queued", "sent", "failed").
   */
  status: string;
  /**
   * The error message if the SMS failed
   */
  errorMessage?: string;
}

/**
 * Sends an SMS message using Twilio.
 *
 * @param to The recipient's phone number.
 * @param message The text message to send.
 * @returns A promise that resolves to an SmsResponse object.
 */
export async function sendSms(to: string, message: string): Promise<SmsResponse> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  // Basic validation
  if (!accountSid || !authToken || !fromNumber) {
     console.error("Twilio credentials are not configured in environment variables.");
     return {
       messageId: '',
       status: 'failed',
       errorMessage: 'Twilio credentials are not configured.',
     };
   }

  // TODO: Implement the actual Twilio API call using fetch or a Twilio SDK (server-side).
  // Example structure (needs proper implementation, likely in a server action or API route):
  /*
  try {
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: to,
        From: fromNumber,
        Body: message,
      }),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Twilio API error');
    }

    return {
      messageId: data.sid,
      status: data.status,
    };
  } catch (error: any) {
    console.error("Twilio send SMS error:", error);
    return {
      messageId: '',
      status: 'failed',
      errorMessage: error.message || 'Failed to send SMS',
    };
  }
  */

  // Return a dummy SMS response for now, as client-side direct calls are insecure.
   console.warn("Dummy SMS response returned. Implement actual Twilio call server-side.");
   await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
   const success = Math.random() > 0.1; // Simulate occasional failure
   if (success) {
       return {
         messageId: `SM${Math.random().toString(36).substring(2, 17)}${Math.random().toString(36).substring(2, 17)}`,
         status: 'queued',
       };
   } else {
       return {
           messageId: '',
           status: 'failed',
           errorMessage: 'Simulated Twilio failure.'
       }
   }
}
