import CohortDashboard from "@/components/cohort/cohort-dashboard";
import { ParticipantLayout } from "@/components/participant/participant-layout";

export default function CohortDashboardPage() {
  return (
    <ParticipantLayout
      header={{
        title: "Dashboard",
        breadcrumb: [{ label: "Founding Cohort", href: "/cohort/dashboard" }],
      }}
    >
      <CohortDashboard />
    </ParticipantLayout>
  );
}
