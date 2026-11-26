/**
 * Local constants for the Email Management section.
 *
 * Template names and descriptions are product-defined (per the Email
 * Management specification). The `active` flag and `updatedAt` timestamps
 * come from the backend; this file only holds the canonical template
 * catalogue used to render previews when backend template data is absent.
 * No email statistics or sending behaviour is faked here.
 */

export const EMAIL_TEMPLATES: Array<{
  id: string;
  name: string;
  description: string;
}> = [
  {
    id: "application-received",
    name: "Application Received",
    description:
      "Confirmation email sent to an applicant once their application has been successfully received.",
  },
  {
    id: "application-approved",
    name: "Application Approved",
    description:
      "Notification email sent to an applicant when their application is approved for the founding community.",
  },
  {
    id: "application-rejected",
    name: "Application Rejected",
    description:
      "Notification email sent to an applicant when their application is not accepted.",
  },
  {
    id: "new-application-admin-notification",
    name: "New Application Admin Notification",
    description:
      "Alert email sent to administrators when a new application is submitted and needs review.",
  },
  {
    id: "participant-invitation",
    name: "Participant Invitation",
    description:
      "Invitation email sent to approved participants to join the community and complete onboarding.",
  },
  {
    id: "welcome",
    name: "Welcome Email",
    description:
      "Welcome email sent to new participants when they join the founding community.",
  },
  {
    id: "community-announcement",
    name: "Community Announcement",
    description:
      "Broadcast announcement email sent to community members.",
  },
  {
    id: "ambassador-invitation",
    name: "Code Yaar Ambassador Invitation",
    description:
      "Campaign email inviting a suitable candidate to become a Code Yaar ambassador and refer qualified applicants to The First 100.",
  },
] as const;

/**
 * Illustrative preview content for each template. Used only to render preview
 * panes and to prefill a new compose draft. These samples are not live backend
 * data; real template bodies come from the backend template endpoint.
 */
export const EMAIL_TEMPLATE_PREVIEWS: Record<string, { subject: string; body: string }> = {
  "application-received": {
    subject: "We received your application — Code Yaar Founding Community",
    body:
      "Thank you for applying to the Code Yaar Global Founding Community. We’ve received your application and our team is reviewing it. You will hear back from us by email once a decision has been made.",
  },
  "application-approved": {
    subject: "Your application has been approved — welcome to Code Yaar",
    body:
      "Congratulations! Your application to the Code Yaar Global Founding Community has been approved. You’re now invited to complete participant onboarding and join the first 100 members.",
  },
  "application-rejected": {
    subject: "Update on your Code Yaar application",
    body:
      "Thank you for your interest in the Code Yaar Global Founding Community. After careful review, we’re unable to offer you a place in this cohort. We encourage you to apply again in future cycles.",
  },
  "new-application-admin-notification": {
    subject: "New application submitted — review needed",
    body:
      "A new application has been submitted to the Code Yaar Global Founding Community and is awaiting your review. Open the admin dashboard to view the application and update its status.",
  },
  "participant-invitation": {
    subject: "You’re invited to join the Code Yaar Founding Community",
    body:
      "You have been approved as a participant in the Code Yaar Global Founding Community. Accept this invitation to set up your account and begin onboarding.",
  },
  welcome: {
    subject: "Welcome to the Code Yaar Founding Community",
    body:
      "Welcome aboard! You’re now part of the Code Yaar Global Founding Community — The First 100. We’re thrilled to have you with us.",
  },
  "community-announcement": {
    subject: "Community announcement — Code Yaar Founding Community",
    body:
      "Hello from the Code Yaar team. Here is the latest community announcement. Keep building, keep sharing, and keep evolving together.",
  },
  "ambassador-invitation": {
    subject: "Join Code Yaar as an ambassador",
    body:
      "Hi <recipientName>,<br/><br/>The Code Yaar team invites you to become a Code Yaar ambassador and help grow the founding community — The First 100. As an ambassador, you would introduce Code Yaar to relevant communities, share the official application form, and encourage suitable people to apply. We'd encourage you to bring five qualified applicants through your referral; applicants must name the ambassador who referred them when they apply.<br/><br/>Apply to the Ambassador Programme",
  },
};

export const EMAIL_STATUS_LABELS: Record<string, string> = {
  accepted: "Accepted",
  delivered: "Delivered",
  failed: "Failed",
  pending: "Pending",
};

export const EMAIL_STATUS_VARIANTS: Record<string, "emerald" | "default" | "outline"> = {
  accepted: "emerald",
  delivered: "emerald",
  pending: "default",
  failed: "default",
};

export const EMAIL_TYPE_FILTER_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "", label: "All types" },
  { value: "application-received", label: "Application Received" },
  { value: "application-approved", label: "Application Approved" },
  { value: "application-rejected", label: "Application Rejected" },
  { value: "new-application-admin-notification", label: "New Application Admin Notification" },
  { value: "participant-invitation", label: "Participant Invitation" },
  { value: "welcome", label: "Welcome Email" },
  { value: "community-announcement", label: "Community Announcement" },
] as const;

export const EMAIL_STATUS_FILTER_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "", label: "All statuses" },
  { value: "accepted", label: "Accepted" },
  { value: "delivered", label: "Delivered" },
  { value: "failed", label: "Failed" },
  { value: "pending", label: "Pending" },
] as const;

export const EMAIL_PROVIDER = "resend";
export const EMAIL_SENDER_ADDRESS = "noreply@codeyaar.tech";
export const EMAIL_SENDER_NAME = "Code Yaar Founding Community";
