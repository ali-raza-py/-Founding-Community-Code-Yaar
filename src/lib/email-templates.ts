/**
 * Code Yaar branded email template library (frontend).
 *
 * Mirrors the backend branded shell in
 * `codeyaar-community-api/src/services/email.templates.ts` so the compose
 * preview and the Templates preview dialog show recipients a faithful,
 * production-rendered representation of the email they will receive.
 *
 * Design:
 *   - Code Yaar logotype ("code" dark + emerald "yaar")
 *   - Brand positioning: Think. Build. Evolve.
 *   - Clean white background, emerald/teal accents, dark readable typography
 *   - Table-based responsive layout with inline CSS (email-client safe)
 *   - Plain-text alternative returned with every template
 *   - Absolute, publicly accessible logo URL
 *   - Safe escaping of every dynamic value
 *
 * No frontend-only CSS, no external stylesheets, no dependence on loaded
 * images, no gradients/neon/emoji-heavy design.
 */

const FROM_NAME = 'Code Yaar'
const FROM_EMAIL = 'hello@contact.codeyaar.tech'
// Brand positioning.
const BRAND_TAGLINE = 'Think. Build. Evolve.'
// Emerald/teal brand accent (matches the backend branded shell).
const BRAND_COLOR = '#10b981'
// Official, publicly accessible origins. No invented social profiles.
const BASE_URL = 'https://contact.codeyaar.tech'
const LOGO_URL = `${BASE_URL}/code-yaar-logo.png`
const UNSUBSCRIBE_PATH = '/admin/email/unsubscribe'
const PRIVACY_URL = `${BASE_URL}/privacy`

const escapeHtml = (value: unknown): string => {
  if (value === null || value === undefined) return ''
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

const logotypeHtml = ({ size = 22 }: { size?: number } = {}) => `
  <span style="font-size:${size}px; font-weight:800; letter-spacing:-0.5px; color:#0f172a; text-transform:uppercase;">code</span>
  <span style="font-size:${size}px; font-weight:800; letter-spacing:-0.5px; color:${BRAND_COLOR}; text-transform:uppercase;">yaar</span>
`

const logotypeAlt = 'Code Yaar'

const textSignature = () =>
  `— ${FROM_NAME} (${FROM_EMAIL})\n${BASE_URL}\nYou received this because of your relationship with Code Yaar.\nManage preferences or unsubscribe: ${BASE_URL}${UNSUBSCRIBE_PATH}`

/**
 * Shared branded, responsive email shell used by every template.
 *
 * HEADER — Code Yaar logotype, brand name, optional campaign/program label.
 * BODY   — greeting, purpose, content, primary CTA button, secondary info.
 * FOOTER — branding, official website, contact address, opt-out.
 */
const shell = (params: {
  preview: string
  title: string
  campaignLabel?: string
  body: string
  button?: { label: string; url: string }
  signature: string
  optOut?: boolean
}): string => {
  const { preview, title, campaignLabel, body, button, signature, optOut = true } = params
  const buttonHtml = button
    ? `
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin: 28px 0;">
        <tr>
          <td align="center">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td align="center" style="border-radius:6px;">
                  <a href="${escapeHtml(button.url)}" target="_blank" style="background:${BRAND_COLOR};color:#ffffff;border:none;border-radius:6px;padding:14px 30px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:16px;font-weight:600;text-decoration:none;display:block;">
                    ${escapeHtml(button.label)}
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `
    : ''

  const campaignLabelHtml = campaignLabel
    ? `
      <tr>
        <td align="center" style="padding:0 0 10px 0;">
          <span style="display:inline-block;padding:4px 10px;border-radius:4px;background:${BRAND_COLOR};color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.6px;text-transform:uppercase;">
            ${escapeHtml(campaignLabel)}
          </span>
        </td>
      </tr>
    `
    : ''

  const optOutHtml = optOut
    ? `
      <tr>
        <td align="center" style="padding-top:24px; border-top:1px solid #e2e8f0;">
          <p style="margin:0;font-size:11px;color:#94a3b8;line-height:1.5;text-align:center;">
            You received this email because of your relationship with Code Yaar.<br/>
            <a href="${escapeHtml(`${BASE_URL}${UNSUBSCRIBE_PATH}`)}" style="color:#94a3b8;text-decoration:underline;">Manage communication preferences</a>
            or <a href="${escapeHtml(`${BASE_URL}${UNSUBSCRIBE_PATH}`)}" style="color:#94a3b8;text-decoration:underline;">unsubscribe</a>.
          </p>
        </td>
      </tr>
    `
    : ''

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin:0;padding:0;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;line-height:1.6;color:#0f172a;">
    <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;color:#ffffff;line-height:1px;">
      ${escapeHtml(preview)}
    </div>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
      <tr>
        <td align="center" style="padding:24px 16px;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width:640px;background:#ffffff;border-radius:10px;overflow:hidden;border:1px solid #e2e8f0;">
            <tr>
              <td align="center" style="background:#0f172a;padding:28px 22px;border-top:4px solid ${BRAND_COLOR};">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td align="center" style="padding-right:10px;">
                      <img src="${LOGO_URL}" alt="${logotypeAlt}" width="32" height="32" style="display:block;border-radius:6px;width:32px;height:32px;" />
                    </td>
                    <td align="center">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                          <td align="center" style="padding-top:2px;">
                            ${logotypeHtml({ size: 26 })}
                          </td>
                        </tr>
                        ${campaignLabelHtml}
                        <tr>
                          <td align="center" style="padding-top:6px;">
                            <span style="font-size:12.5px;color:#94a3b8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;letter-spacing:0.4px;text-transform:uppercase;">
                              ${escapeHtml(BRAND_TAGLINE)}
                            </span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:30px 26px;">
                ${body}
                ${buttonHtml}
                <p style="margin:26px 0 0 0;font-size:14px;color:#475569;border-top:1px solid #f1f5f9;padding-top:16px;">${escapeHtml(signature)}</p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:22px 22px 26px 22px; border-top:1px solid #f1f5f9;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td align="center">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                          <td align="center" style="padding-right:8px;">
                            <img src="${LOGO_URL}" alt="${logotypeAlt}" width="24" height="24" style="display:block;border-radius:4px;width:24px;height:24px;" />
                          </td>
                          <td align="center">
                            <div style="font-size:17px;font-weight:800;letter-spacing:-0.5px;color:#0f172a;text-transform:uppercase;">code<span style="color:${BRAND_COLOR};">yaar</span></div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding-top:12px;">
                      <p style="margin:2px 0;font-size:12.5px;color:#64748b;line-height:1.5;">
                        Code Yaar Founding Community<br />
                        <a href="${escapeHtml(BASE_URL)}" style="color:#64748b;text-decoration:none;">${escapeHtml(BASE_URL)}</a><br />
                        ${escapeHtml(FROM_EMAIL)}
                      </p>
                    </td>
                  </tr>
                  ${optOutHtml}
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    <style>
      @media (max-width: 480px) {
        table[role="presentation"][width="100%"] { width: 100% !important; }
        td[style*="max-width:640px"] { border-radius: 0 !important; width: 100% !important; }
      }
    </style>
  </body>
</html>`
}

interface EmailRendered {
  to: string
  subject: string
  text: string
  html: string
}

export const applicationReceived = (params: {
  to: string
  applicantName: string
  programName: string
  applicationId: string
}): EmailRendered => {
  const { to, applicantName, programName, applicationId } = params
  const subject = `Application received — ${escapeHtml(programName)}`
  const body = `
    <p>Hi ${escapeHtml(applicantName)},</p>
    <p>Thank you for applying to <strong>${escapeHtml(programName)}</strong>. Your application has been received and is pending review.</p>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin:22px 0;background:#f8fafc;border-radius:6px;">
      <tr>
        <td style="padding:16px;">
          <p style="margin:4px 0;font-size:12.5px;color:#64748b;">Application ID</p>
          <p style="margin:0;font-size:14px;font-weight:600;color:#0f172a;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Cascadia Code,monospace;">${escapeHtml(applicationId)}</p>
        </td>
      </tr>
    </table>
    <p>We'll let you know as soon as there's an update on your application status.</p>
  `
  return {
    to,
    subject,
    text: `Hi ${applicantName},\n\nThank you for applying to ${programName}. Your application has been received and is pending review.\n\nApplication ID: ${applicationId}\nWe'll let you know as soon as there's an update on your application status.\n\n${textSignature()}`,
    html: shell({
      preview: `Your application to ${programName} has been received and is pending review.`,
      title: subject,
      body,
      signature: FROM_NAME,
    }),
  }
}

export const applicationApproved = (params: {
  to: string
  applicantName: string
  programName: string
  applicationId: string
}): EmailRendered => {
  const { to, applicantName, programName, applicationId } = params
  const subject = `Your application to ${escapeHtml(programName)} has been accepted`
  const body = `
    <p>Hi ${escapeHtml(applicantName)},</p>
    <p>Great news! Your application to <strong>${escapeHtml(programName)}</strong> has been accepted.</p>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin:22px 0;background:#f8fafc;border-radius:6px;">
      <tr>
        <td style="padding:16px;">
          <p style="margin:4px 0;font-size:12.5px;color:#64748b;">Application ID</p>
          <p style="margin:0;font-size:14px;font-weight:600;color:#0f172a;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Cascadia Code,monospace;">${escapeHtml(applicationId)}</p>
        </td>
      </tr>
    </table>
    <p>Watch your inbox for next steps and onboarding details.</p>
  `
  return {
    to,
    subject,
    text: `Hi ${applicantName},\n\nGreat news! Your application to ${programName} has been accepted.\n\nApplication ID: ${applicationId}\nWatch your inbox for next steps and onboarding details.\n\n${textSignature()}`,
    html: shell({
      preview: `Congratulations — your application to ${programName} has been accepted.`,
      title: subject,
      body,
      button: { label: 'View your application', url: `${BASE_URL}/applications/${escapeHtml(applicationId)}` },
      signature: FROM_NAME,
    }),
  }
}

export const applicationRejected = (params: {
  to: string
  applicantName: string
  programName: string
  applicationId: string
}): EmailRendered => {
  const { to, applicantName, programName, applicationId } = params
  const subject = `Application update — ${escapeHtml(programName)}`
  const body = `
    <p>Hi ${escapeHtml(applicantName)},</p>
    <p>Thank you for your interest in <strong>${escapeHtml(programName)}</strong>. After careful review, we are unable to accept your application at this time.</p>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin:22px 0;background:#f8fafc;border-radius:6px;">
      <tr>
        <td style="padding:16px;">
          <p style="margin:4px 0;font-size:12.5px;color:#64748b;">Application ID</p>
          <p style="margin:0;font-size:14px;font-weight:600;color:#0f172a;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Cascadia Code,monospace;">${escapeHtml(applicationId)}</p>
        </td>
      </tr>
    </table>
    <p>We encourage you to apply again in a future cycle.</p>
  `
  return {
    to,
    subject,
    text: `Hi ${applicantName},\n\nThank you for your interest in ${programName}. After careful review, we are unable to accept your application at this time.\n\nApplication ID: ${applicationId}\nWe encourage you to apply again in a future cycle.\n\n${textSignature()}`,
    html: shell({
      preview: `Update on your application to ${programName}.`,
      title: subject,
      body,
      signature: FROM_NAME,
    }),
  }
}

export const applicationSubmittedAdmin = (params: {
  to: string
  applicantName: string
  applicantEmail: string
  programName: string
  applicationId: string
  adminName?: string
}): EmailRendered => {
  const { to, applicantName, applicantEmail, programName, applicationId, adminName } = params
  const subject = `New application received — ${escapeHtml(programName)}`
  const body = `
    <p>Hi ${escapeHtml(adminName ?? 'Administrator')},</p>
    <p>A new application has been submitted to <strong>${escapeHtml(programName)}</strong> and is ready for review.</p>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin:22px 0;background:#f8fafc;border-radius:6px;">
      <tr>
        <td style="padding:16px;">
          <p style="margin:4px 0;font-size:12.5px;color:#64748b;">Applicant</p>
          <p style="margin:0;font-size:14px;font-weight:600;color:#0f172a;">${escapeHtml(applicantName)}</p>
          <p style="margin:8px 0 0 0;font-size:12.5px;color:#64748b;">Email</p>
          <p style="margin:0;font-size:14px;color:#0f172a;">${escapeHtml(applicantEmail)}</p>
          <p style="margin:12px 0 0 0;font-size:12.5px;color:#64748b;">Application ID</p>
          <p style="margin:0;font-size:14px;font-weight:600;color:#0f172a;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Cascadia Code,monospace;">${escapeHtml(applicationId)}</p>
        </td>
      </tr>
    </table>
  `
  return {
    to,
    subject,
    text: `Hi ${adminName ?? 'Administrator'},\n\nA new application has been submitted to ${programName}.\n\nApplicant: ${applicantName} (${applicantEmail})\nApplication ID: ${applicationId}\nReview it in the admin dashboard.\n\n${textSignature()}`,
    html: shell({
      preview: `A new application to ${programName} is ready for review.`,
      title: subject,
      body,
      button: { label: 'Review application', url: `${BASE_URL}/admin/applications/${escapeHtml(applicationId)}` },
      signature: FROM_NAME,
    }),
  }
}

export const participantInvited = (params: {
  to: string
  inviteeName?: string
  programName: string
}): EmailRendered => {
  const { to, inviteeName, programName } = params
  const subject = `You're invited to join ${escapeHtml(programName)}`
  const body = `
    <p>Hi ${escapeHtml(inviteeName ?? '')},</p>
    <p>You have been invited to join <strong>${escapeHtml(programName)}</strong> as a participant.</p>
    <p>Accept the invitation by logging in to your Code Yaar account.</p>
  `
  return {
    to,
    subject,
    text: `Hi ${inviteeName ?? ''},\n\nYou have been invited to join ${programName} as a participant.\n\nAccept the invitation by logging in to your Code Yaar account.\n\n${textSignature()}`,
    html: shell({
      preview: `You have been invited to join ${programName} as a participant.`,
      title: subject,
      body,
      button: { label: 'Accept invitation', url: `${BASE_URL}/participants/invitations` },
      signature: FROM_NAME,
    }),
  }
}

/**
 * Code Yaar Ambassador Invitation — campaign email inviting a suitable
 * candidate to become a Code Yaar ambassador and refer qualified applicants.
 *
 * No unapproved benefits (financial rewards, guaranteed selection, scholarships,
 * certificates, commission or employment) are promised.
 */
export const ambassadorInvitation = (params: {
  to: string
  recipientName: string
  ambassadorName?: string
  applicationUrl: string
}): EmailRendered => {
  const { to, recipientName, ambassadorName, applicationUrl } = params
  const subject = 'Join Code Yaar as an ambassador'
  const fromLine = ambassadorName ? `A message from ${escapeHtml(ambassadorName)}, Code Yaar team` : 'The Code Yaar team'
  const body = `
    <p>Hi ${escapeHtml(recipientName)},</p>
    <p>${fromLine} — we hope you're doing well.</p>
    <p>Code Yaar is a global learning community for technology learners and builders. Our positioning is simple: <strong>Think. Build. Evolve.</strong> We're growing the founding community — The First 100 — and we're looking for ambassadors to represent Code Yaar in their communities and help bring qualified applicants to the programme.</p>
    <p>As an ambassador, you would:</p>
    <ul style="margin:14px 0 0 0;padding-left:20px;color:#334155;">
      <li style="margin-bottom:8px;">Introduce Code Yaar to relevant universities, societies and developer communities.</li>
      <li style="margin-bottom:8px;">Share the official application form and encourage suitable people to apply.</li>
      <li style="margin-bottom:8px;">Help applicants identify you as the ambassador who referred them.</li>
    </ul>
    <p>We'd encourage you to bring <strong>five qualified applicants</strong> through your referral. Applicants must name the ambassador who referred them when they apply, so every referral is attributed to you.</p>
    <p>Apply and learn more about the ambassador programme here:</p>
  `
  return {
    to,
    subject,
    text: `Hi ${recipientName},\n\n${fromLine} — we hope you're doing well.\n\nCode Yaar is a global learning community for technology learners and builders. Our positioning is: Think. Build. Evolve. We're growing the founding community — The First 100 — and we're looking for ambassadors to represent Code Yaar in their communities and help bring qualified applicants to the programme.\n\nAs an ambassador, you would:\n- Introduce Code Yaar to relevant universities, societies and developer communities.\n- Share the official application form and encourage suitable people to apply.\n- Help applicants identify you as the ambassador who referred them.\n\nWe'd encourage you to bring five qualified applicants through your referral. Applicants must name the ambassador who referred them when they apply, so every referral is attributed to you.\n\nApply and learn more about the ambassador programme here:\n${applicationUrl}\n\n${textSignature()}`,
    html: shell({
      preview: 'You are invited to become a Code Yaar ambassador and help grow the founding community.',
      title: subject,
      campaignLabel: 'Ambassador Invitation',
      body,
      button: { label: 'Apply to the Ambassador Programme', url: escapeHtml(applicationUrl) },
      signature: FROM_NAME,
    }),
  }
}

export const communityAnnouncement = (params: {
  to: string
  recipientName?: string
  programName: string
  announcementTitle: string
  announcementBody: string
  url?: string
}): EmailRendered => {
  const { to, recipientName, programName, announcementTitle, announcementBody, url } = params
  const subject = `${escapeHtml(programName)} — ${escapeHtml(announcementTitle)}`
  const body = `
    <p>Hi ${escapeHtml(recipientName ?? '')},</p>
    <p>Here is the latest announcement from <strong>${escapeHtml(programName)}</strong>.</p>
    <div style="background:#f8fafc;border-radius:6px;padding:16px;margin:16px 0;border-left:4px solid ${BRAND_COLOR};">
      <p style="margin:0 0 8px 0;font-size:15px;font-weight:600;color:#0f172a;">${escapeHtml(announcementTitle)}</p>
      <p style="margin:0;color:#334155;">${escapeHtml(announcementBody)}</p>
    </div>
  `
  return {
    to,
    subject,
    text: `Hi ${recipientName ?? ''},\n\nHere is the latest announcement from ${programName}.\n\n${announcementTitle}\n${announcementBody}\n${textSignature()}`,
    html: shell({
      preview: announcementBody.slice(0, 120),
      title: subject,
      body,
      button: url ? { label: 'Read announcement', url: escapeHtml(url) } : undefined,
      signature: FROM_NAME,
    }),
  }
}

export const welcome = (params: {
  to: string
  recipientName: string
  programName: string
}): EmailRendered => {
  const { to, recipientName, programName } = params
  const subject = `Welcome to ${escapeHtml(programName)}`
  const body = `
    <p>Hi ${escapeHtml(recipientName)},</p>
    <p>Welcome aboard! You're now part of <strong>${escapeHtml(programName)}</strong> — the Code Yaar Global Founding Community, The First 100. We're thrilled to have you with us.</p>
    <p>Think. Build. Evolve.</p>
  `
  return {
    to,
    subject,
    text: `Hi ${recipientName},\n\nWelcome aboard! You're now part of ${programName} — the Code Yaar Global Founding Community, The First 100. We're thrilled to have you with us.\n\nThink. Build. Evolve.\n\n${textSignature()}`,
    html: shell({
      preview: `Welcome to ${programName}. You're now part of the Code Yaar founding community.`,
      title: subject,
      body,
      signature: FROM_NAME,
    }),
  }
}

export const emailTemplates = {
  applicationReceived,
  applicationApproved,
  applicationRejected,
  applicationSubmittedAdmin,
  participantInvited,
  communityAnnouncement,
  welcome,
  ambassadorInvitation,
} as const

export type EmailTemplateKey = keyof typeof emailTemplates

export { escapeHtml, BRAND_COLOR, FROM_EMAIL, FROM_NAME, BASE_URL, LOGO_URL, textSignature, shell }
