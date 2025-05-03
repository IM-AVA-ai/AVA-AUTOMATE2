export interface EmailParams {
    to: string;
    subject: string;
    body: string;
}

export interface EmailResult {
    success: boolean;
    error?: any;
}

import { Resend } from 'resend';

const resend = new Resend('re_3D5s2qCy_PnLPxAix4xTgQqovuEKaLskn');
export const sendEmail = async ({ to, subject, body }: EmailParams): Promise<EmailResult> => {
  try {
    console.log(`Sending email to ${to} with subject ${subject}`);
    console.log(`Email body: ${body}`);

    const data = await resend.emails.send({
      from: 'team@imava.ai',
      to: to,
      subject: subject,
      html: body
    });

    console.log("Message sent: ", data.id);

    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
};