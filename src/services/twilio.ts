export class TwilioService {
  private accountSid: string;
  private authToken: string;
  private phoneNumber: string;

  constructor(accountSid: string, authToken: string, phoneNumber: string) {
    this.accountSid = accountSid;
    this.authToken = authToken;
    this.phoneNumber = phoneNumber;
  }

  async sendSMS(to: string, body: string): Promise<{ success: boolean; messageSid?: string; error?: any }> {
    try {
      const formData = new URLSearchParams();
      formData.append('To', to);
      formData.append('From', this.phoneNumber);
      formData.append('Body', body);

      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${this.accountSid}:${this.authToken}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData.toString()
      });

      if (!response.ok) {
        const error = await response.json();
        return { success: false, error };
      }

      const data = await response.json();
      return { success: true, messageSid: data.sid };
    } catch (error) {
      return { success: false, error };
    }
  }
}