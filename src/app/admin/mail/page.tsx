"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Inbox,
  Mail,
  Users,
  FileText,
  MailOpen,
  AlertCircle,
  Settings,
} from "lucide-react";

import { useAuth } from "@/lib/api/auth";
import { Section, SectionInner } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { EmailDashboard } from "@/components/admin/emails/email-dashboard";
import { EmailCompose } from "@/components/admin/emails/email-compose";
import { EmailRecipients } from "@/components/admin/emails/email-recipients";
import { EmailTemplates } from "@/components/admin/emails/email-templates";
import { EmailLogs } from "@/components/admin/emails/email-logs";
import { FailedEmails } from "@/components/admin/emails/failed-emails";
import { EmailConfig } from "@/components/admin/emails/email-config";
import { cn } from "@/lib/utils";

type TabKey =
  | "overview"
  | "compose"
  | "recipients"
  | "templates"
  | "history"
  | "failed"
  | "configuration";

interface TabItem {
  key: TabKey;
  label: string;
  icon: React.ElementType;
}

const TABS: TabItem[] = [
  { key: "overview", label: "Overview", icon: Inbox },
  { key: "compose", label: "Compose Email", icon: Mail },
  { key: "recipients", label: "Recipients", icon: Users },
  { key: "templates", label: "Templates", icon: FileText },
  { key: "history", label: "Email History", icon: MailOpen },
  { key: "failed", label: "Failed Emails", icon: AlertCircle },
  { key: "configuration", label: "Configuration", icon: Settings },
] as const;

export default function AdminMailCenterPage() {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [composeRecipients, setComposeRecipients] = useState<string[]>([]);

  // Deep link into a tab (?tab=compose etc.) from the recipient directory or
  // direct URLs.
  useEffect(() => {
    const tab = searchParams.get("tab") as TabKey | null;
    if (tab && TABS.some((t) => t.key === tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const mailSectionActive =
    pathname === "/admin/mail" || pathname.startsWith("/admin/mail/");

  const selectTab = useCallback(
    (key: TabKey) => {
      setActiveTab(key);
      void router.replace(`${pathname}?tab=${key}`, { scroll: false });
    },
    [pathname, router]
  );

  const handleEmailSelected = useCallback(
    (emails: string[]) => {
      setComposeRecipients(emails);
      selectTab("compose");
    },
    [selectTab]
  );

  if (isLoading) return null;
  if (!isAuthenticated || !isAdmin) return null;
  if (!mailSectionActive) return null;

  return (
    <Section padded>
      <SectionInner>
        <SectionHeading
          eyebrow="Mail Center"
          title="Mail Center"
          description="Send emails to the community, manage recipient lists, and review delivery history through the Code Yaar email provider."
          tag="h2"
        />

        {/* Tab navigation */}
        <div className="mt-8 flex gap-1 border-b border-line overflow-x-auto pb-2 sm:pb-0 sm:overflow-visible">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => selectTab(tab.key)}
                className={cn(
                  "flex items-center gap-2 shrink-0 border-transparent bg-transparent px-3 py-2.5 text-sm font-medium transition-colors border-b-2 whitespace-nowrap",
                  isActive
                    ? "border-emerald text-emerald"
                    : "border-transparent text-ink-muted hover:text-emerald hover:bg-surface-raised"
                )}
                aria-pressed={isActive}
              >
                <Icon className="size-4 shrink-0" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab panels */}
        <div className="mt-6">
          {activeTab === "overview" && <EmailDashboard />}
          {activeTab === "compose" && (
            <EmailCompose
              initialRecipients={composeRecipients}
              onRecipientsChange={setComposeRecipients}
              onBrowseRecipients={() => selectTab("recipients")}
            />
          )}
          {activeTab === "recipients" && (
            <EmailRecipients onEmailSelected={handleEmailSelected} />
          )}
          {activeTab === "templates" && <EmailTemplates />}
          {activeTab === "history" && <EmailLogs />}
          {activeTab === "failed" && <FailedEmails />}
          {activeTab === "configuration" && <EmailConfig />}
        </div>
      </SectionInner>
    </Section>
  );
}
