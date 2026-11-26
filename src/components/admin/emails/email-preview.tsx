"use client";

import { useMemo } from "react";

import { escapeHtml } from "@/lib/email-templates";
import { cn } from "@/lib/utils";

/**
 * Reusable branded email preview components.
 *
 * These render the Code Yaar branded email structure in the browser (for the
 * compose preview and Templates preview dialog). They mirror the inline-CSS
 * shell used for actual delivery in
 * `codeyaar-community-api/src/services/email.templates.ts` and
 * `src/lib/email-templates.ts` so the preview is a faithful representation of
 * what recipients receive.
 *
 * Design tokens:
 *   - Code Yaar logotype ("code" dark slate + emerald "yaar")
 *   - Brand positioning: Think. Build. Evolve.
 *   - Emerald/teal accent (#10b981), white background, dark typography
 *   - Responsive, accessible contrast, no dependence on loaded images
 */

const BRAND_COLOR = '#10b981'
const BASE_URL = 'https://contact.codeyaar.tech'
const LOGO_URL = `${BASE_URL}/code-yaar-logo.png`
const FROM_NAME = 'Code Yaar'
const FROM_EMAIL = 'hello@contact.codeyaar.tech'
const UNSUBSCRIBE_URL = `${BASE_URL}/admin/email/unsubscribe`
const PRIVACY_URL = `${BASE_URL}/privacy`
// Brand positioning.
const BRAND_TAGLINE = 'Think. Build. Evolve.'

const brandTextStyles = 'font-weight:800;letter-spacing:-0.5px;text-transform:uppercase;'

const logoMark = () => (
  <>
    <span
      className="text-slate-900 font-extrabold tracking-tighter uppercase"
      style={{ fontSize: '26px', letterSpacing: '-0.5px', ...styleFromCss(brandTextStyles) }}
    >
      code
    </span>
    <span
      className="text-emerald-500 font-extrabold tracking-tighter uppercase"
      style={{ fontSize: '26px', letterSpacing: '-0.5px', ...styleFromCss(brandTextStyles) }}
    >
      yaar
    </span>
  </>
)

const logoSmall = () => (
  <>
    <span
      className="text-slate-900 font-extrabold tracking-tighter uppercase"
      style={{ fontSize: '17px', letterSpacing: '-0.5px', ...styleFromCss(brandTextStyles) }}
    >
      code
    </span>
    <span
      className="text-emerald-500 font-extrabold tracking-tighter uppercase"
      style={{ fontSize: '17px', letterSpacing: '-0.5px', ...styleFromCss(brandTextStyles) }}
    >
      yaar
    </span>
  </>
)

/** Convert a CSS declaration string into an object React accepts. */
function styleFromCss(css: string): React.CSSProperties {
  const styles: Record<string, string> = {}
  css.split(';').forEach((decl) => {
    const [key, ...valueParts] = decl.split(':')
    if (key && valueParts.length) {
      styles[key.trim()] = valueParts.join(':').trim()
    }
  })
  return styles as React.CSSProperties
}

interface EmailLogoProps {
  size?: 'sm' | 'lg'
}
export function EmailLogo({ size = 'lg' }: EmailLogoProps) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size === 'lg' ? 10 : 8,
      }}
    >
      <img
        src={LOGO_URL}
        alt="Code Yaar"
        width={size === 'lg' ? 32 : 24}
        height={size === 'lg' ? 32 : 24}
        style={{
          display: 'block',
          borderRadius: size === 'lg' ? 6 : 4,
          width: size === 'lg' ? 32 : 24,
          height: size === 'lg' ? 32 : 24,
        }}
        loading="lazy"
        decoding="async"
      />
      <span style={{ ...styleFromCss(brandTextStyles), fontSize: size === 'lg' ? '26px' : '17px' }}>
        {size === 'lg' ? logoMark() : logoSmall()}
      </span>
    </div>
  )
}

interface EmailHeaderProps {
  campaignLabel?: string
}
export function EmailHeader({ campaignLabel }: EmailHeaderProps) {
  return (
    <div style={{ background: '#0f172a', padding: '28px 22px', borderTop: `4px solid ${BRAND_COLOR}` }}>
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
          <EmailLogo size="lg" />
        </div>
        {campaignLabel && (
          <div style={{ marginTop: '10px' }}>
            <span
              style={{
                display: 'inline-block',
                padding: '4px 10px',
                borderRadius: '4px',
                background: BRAND_COLOR,
                color: '#ffffff',
                fontFamily:
                  '"Times New Roman",Times,serif',
                fontSize: '11px',
                fontWeight: '700',
                letterSpacing: '0.6px',
                textTransform: 'uppercase',
              }}
            >
              {escapeHtml(campaignLabel)}
            </span>
          </div>
        )}
        <div style={{ marginTop: '6px' }}>
          <span
            style={{
              fontSize: '12.5px',
              color: '#94a3b8',
              fontFamily:
                '"Times New Roman",Times,serif',
              letterSpacing: '0.4px',
              textTransform: 'uppercase',
            }}
          >
            {BRAND_TAGLINE}
          </span>
        </div>
      </div>
    </div>
  )
}

interface EmailBodyProps {
  children: React.ReactNode
}
export function EmailBody({ children }: EmailBodyProps) {
  return (
    <div style={{ padding: '30px 26px', maxWidth: '640px', margin: '0 auto' }}>
      {children}
    </div>
  )
}

interface EmailContentSectionProps {
  children: React.ReactNode
}
export function EmailContentSection({ children }: EmailContentSectionProps) {
  return <div>{children}</div>
}

interface EmailGreetingProps {
  name: string
}
export function EmailGreeting({ name }: EmailGreetingProps) {
  return <p style={{ margin: '0 0 16px 0' }}>Hi {escapeHtml(name)},</p>
}

interface EmailParagraphProps {
  children: React.ReactNode
  className?: string
}
export function EmailParagraph({ children, className }: EmailParagraphProps) {
  return (
    <p
      className={cn(
        'text-slate-700 leading-relaxed',
        'margin:0 0 16px 0',
        className,
      )}
    >
      {children}
    </p>
  )
}

interface EmailButtonProps {
  label: string;
  url: string;
}
export function EmailButton({ label, url }: EmailButtonProps) {
  return (
    <div style={{ margin: '28px 0', textAlign: 'center' }}>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          background: BRAND_COLOR,
          color: '#ffffff',
          border: 'none',
          borderRadius: '6px',
          padding: '14px 30px',
          fontFamily:
            '"Times New Roman",Times,serif',
          fontSize: '16px',
          fontWeight: '600',
          textDecoration: 'none',
          display: 'inline-block',
        }}
      >
        {escapeHtml(label)}
      </a>
    </div>
  )
}

interface EmailCTASectionProps {
  heading: string
  body: string
  buttonLabel: string
  buttonUrl: string
}
export function EmailCTASection({ heading, body, buttonLabel, buttonUrl }: EmailCTASectionProps) {
  return (
    <div>
      <p style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: '600', color: '#0f172a' }}>
        {escapeHtml(heading)}
      </p>
      <p style={{ margin: '0 0 16px 0', color: '#334155' }}>{escapeHtml(body)}</p>
      <div style={{ margin: '28px 0', textAlign: 'center' }}>
        <a
          href={buttonUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: BRAND_COLOR,
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            padding: '14px 30px',
            fontFamily:
              '"Times New Roman",Times,serif',
            fontSize: '16px',
            fontWeight: '600',
            textDecoration: 'none',
            display: 'inline-block',
          }}
        >
          {escapeHtml(buttonLabel)}
        </a>
      </div>
    </div>
  )
}

export function EmailDivider() {
  return (
    <div
      style={{
        borderTop: '1px solid #f1f5f9',
        margin: '26px 0',
        height: '1px',
      }}
    />
  )
}

interface EmailSignatureProps {
  signature: string
}
export function EmailSignature({ signature }: EmailSignatureProps) {
  return (
    <p
      style={{
        margin: '26px 0 0 0',
        fontSize: '14px',
        color: '#475569',
        borderTop: '1px solid #f1f5f9',
        paddingTop: '16px',
      }}
    >
      {escapeHtml(signature)}
    </p>
  )
}

interface EmailFooterProps {
  optOut?: boolean
}
export function EmailFooter({ optOut = true }: EmailFooterProps) {
  return (
    <div
      style={{
        padding: '22px 22px 26px 22px',
        borderTop: '1px solid #f1f5f9',
        background: '#ffffff',
      }}
    >
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginBottom: '12px' }}>
          <img
            src={LOGO_URL}
            alt="Code Yaar"
            width={24}
            height={24}
            style={{ display: 'block', borderRadius: '4px', width: 24, height: 24 }}
            loading="lazy"
            decoding="async"
          />
          <span style={{ ...styleFromCss(brandTextStyles), fontSize: '17px' }}>
            {logoSmall()}
          </span>
        </div>
        <p style={{ margin: '2px 0', fontSize: '12.5px', color: '#64748b', lineHeight: '1.5' }}>
          {FROM_NAME}<br />
          <a
            href={BASE_URL}
            style={{ color: '#64748b', textDecoration: 'none' }}
          >
            {BASE_URL}
          </a>{' '}
          <br />
          {FROM_EMAIL}
        </p>
        {optOut && (
          <div style={{ marginTop: '24px', borderTop: '1px solid #e2e8f0', paddingTop: '24px' }}>
            <p style={{ margin: '0', fontSize: '11px', color: '#94a3b8', lineHeight: '1.5', textAlign: 'center' }}>
              You received this email because of your relationship with Code Yaar.{' '}
              <a href={UNSUBSCRIBE_URL} style={{ color: '#94a3b8', textDecoration: 'underline' }}>
                Manage communication preferences
              </a>{' '}
              or{' '}
              <a href={UNSUBSCRIBE_URL} style={{ color: '#94a3b8', textDecoration: 'underline' }}>
                unsubscribe
              </a>.
            </p>
          </div>
        )}
        <p style={{ marginTop: '14px', fontSize: '11px', color: '#94a3b8', textAlign: 'center' }}>
          {PRIVACY_URL}
        </p>
      </div>
    </div>
  )
}

interface BrandedEmailProps {
  campaignLabel?: string
  greetingName?: string
  children: React.ReactNode
  signature?: string
  optOut?: boolean
}
export function BrandedEmail({
  campaignLabel,
  greetingName,
  children,
  signature = FROM_NAME,
  optOut = true,
}: BrandedEmailProps) {
  return (
    <div style={{ background: '#ffffff', fontFamily: '"Times New Roman",Times,serif', lineHeight: '1.6', color: '#0f172a', margin: 0, padding: 0 }}>
      <div style={{ display: 'none', maxHeight: 0, overflow: 'hidden', fontSize: '1px', color: '#ffffff', lineHeight: '1px' }} />
      <table role="presentation" cellSpacing={0} cellPadding={0} border={0} width="100%">
        <tr>
          <td align="center" style={{ padding: '24px 16px' }}>
            <table role="presentation" cellSpacing={0} cellPadding={0} border={0} width="100%" style={{ maxWidth: '640px', background: '#ffffff', borderRadius: '10px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
              <tr>
                <td>
                  <EmailHeader campaignLabel={campaignLabel} />
                </td>
              </tr>
              <tr>
                <td>
                  <EmailBody>
                    {greetingName && <EmailGreeting name={greetingName} />}
                    <EmailContentSection>{children}</EmailContentSection>
                    <EmailSignature signature={signature} />
                  </EmailBody>
                </td>
              </tr>
              <tr>
                <td>
                  <EmailFooter optOut={optOut} />
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      <style>{`
        @media (max-width: 480px) {
          table[role="presentation"][width="100%"] { width: 100% !important; }
          td[style*="max-width:640px"] { border-radius: 0 !important; width: 100% !important; }
        }
      `}</style>
    </div>
  )
}

/**
 * Renders a named branded email template for preview. Each template maps to a
 * self-contained branded rendering so the admin can review the exact email
 * recipients will receive before sending.
 */
export interface BrandedEmailPreviewProps {
  templateKey:
    | 'applicationReceived'
    | 'applicationApproved'
    | 'applicationRejected'
    | 'applicationSubmittedAdmin'
    | 'participantInvited'
    | 'communityAnnouncement'
    | 'welcome'
    | 'ambassadorInvitation'
  data: Record<string, string>
}
export function BrandedEmailPreview({ templateKey, data }: BrandedEmailPreviewProps) {
  const render = useMemo(() => {
    switch (templateKey) {
      case 'applicationReceived': {
        const name = data.applicantName ?? 'Applicant'
        return (
          <BrandedEmail
            greetingName={name}
            signature={FROM_NAME}
          >
            <EmailParagraph>
              Thank you for applying to <strong>{escapeHtml(data.programName ?? 'the program')}</strong>. Your application has been received and is pending review.
            </EmailParagraph>
            <div style={{ background: '#f8fafc', borderRadius: '6px', padding: '16px', margin: '22px 0' }}>
              <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#64748b' }}>Application ID</p>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#0f172a', fontFamily: 'ui-monospace,SFMono-Regular,Menlo,Monaco,Cascadia Code,monospace' }}>
                {escapeHtml(data.applicationId ?? '')}
              </p>
            </div>
            <EmailParagraph>
              We&apos;ll let you know as soon as there&apos;s an update on your application status.
            </EmailParagraph>
          </BrandedEmail>
        )
      }
      case 'applicationApproved': {
        const name = data.applicantName ?? 'Applicant'
        return (
          <BrandedEmail
            campaignLabel="Application Decision"
            greetingName={name}
            signature={FROM_NAME}
          >
            <EmailParagraph>
              Great news! Your application to <strong>{escapeHtml(data.programName ?? 'the program')}</strong> has been accepted.
            </EmailParagraph>
            <div style={{ background: '#f8fafc', borderRadius: '6px', padding: '16px', margin: '22px 0' }}>
              <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#64748b' }}>Application ID</p>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#0f172a', fontFamily: 'ui-monospace,SFMono-Regular,Menlo,Monaco,Cascadia Code,monospace' }}>
                {escapeHtml(data.applicationId ?? '')}
              </p>
            </div>
            <EmailParagraph>
              Watch your inbox for next steps and onboarding details.
            </EmailParagraph>
            <EmailCTASection
              heading="View your application"
              body="Open your application in the Code Yaar dashboard to review next steps."
              buttonLabel="View application"
              buttonUrl={`${BASE_URL}/applications/${escapeHtml(data.applicationId ?? '')}`}
            />
          </BrandedEmail>
        )
      }
      case 'applicationRejected': {
        const name = data.applicantName ?? 'Applicant'
        return (
          <BrandedEmail greetingName={name} signature={FROM_NAME}>
            <EmailParagraph>
              Thank you for your interest in <strong>{escapeHtml(data.programName ?? 'the program')}</strong>. After careful review, we are unable to accept your application at this time.
            </EmailParagraph>
            <div style={{ background: '#f8fafc', borderRadius: '6px', padding: '16px', margin: '22px 0' }}>
              <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#64748b' }}>Application ID</p>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#0f172a', fontFamily: 'ui-monospace,SFMono-Regular,Menlo,Monaco,Cascadia Code,monospace' }}>
                {escapeHtml(data.applicationId ?? '')}
              </p>
            </div>
            <EmailParagraph>
              We encourage you to apply again in a future cycle.
            </EmailParagraph>
          </BrandedEmail>
        )
      }
      case 'applicationSubmittedAdmin': {
        const adminName = data.adminName ?? 'Administrator'
        return (
          <BrandedEmail
            campaignLabel="Admin Notification"
            greetingName={adminName}
            signature={FROM_NAME}
          >
            <EmailParagraph>
              A new application has been submitted to <strong>{escapeHtml(data.programName ?? 'the program')}</strong> and is ready for review.
            </EmailParagraph>
            <div style={{ background: '#f8fafc', borderRadius: '6px', padding: '16px', margin: '22px 0' }}>
              <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#64748b' }}>Applicant</p>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>{escapeHtml(data.applicantName ?? '')}</p>
              <p style={{ margin: '8px 0 0 0', fontSize: '12.5px', color: '#64748b' }}>Email</p>
              <p style={{ margin: 0, fontSize: '14px', color: '#0f172a' }}>{escapeHtml(data.applicantEmail ?? '')}</p>
              <p style={{ margin: '12px 0 0 0', fontSize: '12.5px', color: '#64748b' }}>Application ID</p>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#0f172a', fontFamily: 'ui-monospace,SFMono-Regular,Menlo,Monaco,Cascadia Code,monospace' }}>
                {escapeHtml(data.applicationId ?? '')}
              </p>
            </div>
            <EmailCTASection
              heading="Review application"
              body="Open the admin dashboard to review the application and update its status."
              buttonLabel="Review application"
              buttonUrl={`${BASE_URL}/admin/applications/${escapeHtml(data.applicationId ?? '')}`}
            />
          </BrandedEmail>
        )
      }
      case 'participantInvited': {
        return (
          <BrandedEmail
            campaignLabel="Participant Invitation"
            greetingName={data.inviteeName ?? ''}
            signature={FROM_NAME}
          >
            <EmailParagraph>
              You have been invited to join <strong>{escapeHtml(data.programName ?? 'the program')}</strong> as a participant.
            </EmailParagraph>
            <EmailParagraph>
              Accept the invitation by logging in to your Code Yaar account.
            </EmailParagraph>
            <EmailCTASection
              heading="Accept invitation"
              body="Log in to your Code Yaar account to accept your participant invitation."
              buttonLabel="Accept invitation"
              buttonUrl={`${BASE_URL}/participants/invitations`}
            />
          </BrandedEmail>
        )
      }
      case 'welcome': {
        return (
          <BrandedEmail greetingName={data.recipientName ?? 'Participant'} signature={FROM_NAME}>
            <EmailParagraph>
              Welcome aboard! You&apos;re now part of <strong>{escapeHtml(data.programName ?? 'the program')}</strong> — the Code Yaar Global Founding Community, The First 100. We&apos;re thrilled to have you with us.
            </EmailParagraph>
            <EmailParagraph>
              Think. Build. Evolve.
            </EmailParagraph>
          </BrandedEmail>
        )
      }
      case 'communityAnnouncement': {
        return (
          <BrandedEmail
            campaignLabel="Community Announcement"
            greetingName={data.recipientName ?? ''}
            signature={FROM_NAME}
          >
            <EmailParagraph>
              Here is the latest announcement from <strong>{escapeHtml(data.programName ?? 'Code Yaar')}</strong>.
            </EmailParagraph>
            <div style={{ background: '#f8fafc', borderRadius: '6px', padding: '16px', margin: '16px 0', borderLeft: `4px solid ${BRAND_COLOR}` }}>
              <p style={{ margin: '0 0 8px 0', fontSize: '15px', fontWeight: '600', color: '#0f172a' }}>
                {escapeHtml(data.announcementTitle ?? 'Announcement')}
              </p>
              <p style={{ margin: 0, color: '#334155' }}>{escapeHtml(data.announcementBody ?? '')}</p>
            </div>
            {data.url && (
              <EmailCTASection
                heading="Read announcement"
                body="Open the announcement in your browser."
                buttonLabel="Read announcement"
                buttonUrl={data.url}
              />
            )}
          </BrandedEmail>
        )
      }
      case 'ambassadorInvitation': {
        const fromLine = data.ambassadorName ? `A message from ${escapeHtml(data.ambassadorName)}, Code Yaar team` : 'The Code Yaar team'
        return (
          <BrandedEmail
            campaignLabel="Ambassador Invitation"
            greetingName={data.recipientName ?? 'Candidate'}
            signature={FROM_NAME}
          >
            <EmailParagraph>
              {fromLine} — we hope you&apos;re doing well.
            </EmailParagraph>
            <EmailParagraph>
              Code Yaar is a global learning community for technology learners and builders. Our positioning is simple: <strong>Think. Build. Evolve.</strong> We&apos;re growing the founding community — The First 100 — and we&apos;re looking for ambassadors to represent Code Yaar in their communities and help bring qualified applicants to the programme.
            </EmailParagraph>
            <EmailParagraph>
              As an ambassador, you would:
            </EmailParagraph>
            <ul style={{ margin: '14px 0 0 0', paddingLeft: '20px', color: '#334155' }}>
              <li style={{ marginBottom: '8px' }}>
                Introduce Code Yaar to relevant universities, societies and developer communities.
              </li>
              <li style={{ marginBottom: '8px' }}>
                Share the official application form and encourage suitable people to apply.
              </li>
              <li style={{ marginBottom: '8px' }}>
                Help applicants identify you as the ambassador who referred them.
              </li>
            </ul>
            <EmailParagraph>
              We&apos;d encourage you to bring <strong>five qualified applicants</strong> through your referral. Applicants must name the ambassador who referred them when they apply, so every referral is attributed to you.
            </EmailParagraph>
            <EmailParagraph>
              Apply and learn more about the ambassador programme here:
            </EmailParagraph>
            <EmailCTASection
              heading="Apply to the Ambassador Programme"
              body="Review the ambassador programme and submit your interest through the official application form."
              buttonLabel="Apply to the Ambassador Programme"
              buttonUrl={data.applicationUrl ?? BASE_URL}
            />
          </BrandedEmail>
        )
      }
      default:
        return <EmailParagraph>No preview content available for this template.</EmailParagraph>
    }
  }, [templateKey, data])

  return <div>{render}</div>
}
