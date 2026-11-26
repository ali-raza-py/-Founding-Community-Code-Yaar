/**
 * Code Yaar test-email content builder.
 *
 * Generates valid, non-empty HTML and plain-text content for the Send Test
 * Email flow. The test-email feature must not depend on the email composer
 * or editor being populated.
 *
 * The generated HTML is inner body content only — the backend wraps it with
 * the branded Code Yaar template via `wrapWithCodeYaarTemplate` before
 * sending to Resend. Do not pre-wrap with `<html>`/`<body>` tags here. Do not
 * include a header logo or footer — the backend wrapper provides exactly one
 * header and one footer for the entire email.
 */

const TEST_SUBJECT = 'Code Yaar — Email Integration Test';

/** Builds the inner HTML body content for a test email (no outer wrapper). */
export function buildTestEmailHtml(recipient: string, subject: string): string {
  const timestamp = new Date().toISOString();
  return `
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px; margin:0 auto; background-color:#ffffff;">
  <tr>
    <td align="center" style="padding:40px 24px; background-color:#ffffff;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px; margin:0 auto; background-color:#ffffff;">
        <tr>
          <td align="left" style="font-size:20px; font-weight:700; color:#0f172a; padding-bottom:16px; line-height:1.4;">Email Integration Test</td>
        </tr>
        <tr>
          <td align="left" style="font-size:15px; color:#334155; line-height:1.7; padding-bottom:24px;">
            <p style="margin:0 0 12px 0;">This is a test email from Code Yaar.</p>
            <p style="margin:0 0 12px 0;">If you received this message, the test request reached the email provider and delivery was accepted.</p>
          </td>
        </tr>
        <tr>
          <td align="left" style="padding-top:24px; border-top:1px solid #f1f5f9;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td align="left" style="font-size:14px; color:#64748b; line-height:1.6;">
                  Sent at: ${new Date(timestamp).toLocaleString()}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
`.trim();
}

/** Builds the plain-text body for a test email. */
export function buildTestEmailText(recipient: string, subject: string): string {
  const timestamp = new Date().toISOString();
  return [
    'Code Yaar — Test Email',
    '',
    'Email Integration Test',
    '',
    'This is a test email from Code Yaar.',
    'If you received this message, the test request reached the email provider and delivery was accepted.',
    '',
    `Sent at: ${new Date(timestamp).toLocaleString()}`,
    '',
    'Code Yaar',
    'hello@contact.codeyaar.tech',
    'contact.codeyaar.tech',
  ].join('\n');
}

export type TestEmailContent = {
  subject: string;
  html: string;
  text: string;
};

/** Builds complete test-email content ready to send to the backend. */
export function buildTestEmailContent(recipient: string): TestEmailContent {
  const subject = TEST_SUBJECT;
  const html = buildTestEmailHtml(recipient, subject);
  const text = buildTestEmailText(recipient, subject);
  return { subject, html, text };
}

export { TEST_SUBJECT };
