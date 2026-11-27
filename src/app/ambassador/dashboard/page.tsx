import AmbassadorDashboard from "@/components/ambassador/ambassador-dashboard";
import { ParticipantLayout } from "@/components/participant/participant-layout";

export default function AmbassadorDashboardPage() {
  return (
    <ParticipantLayout
      header={{
        title: "Dashboard",
        breadcrumb: [{ label: "Ambassador Programme", href: "/ambassador/dashboard" }],
      }}
    >
      <AmbassadorDashboard />
    </ParticipantLayout>
  );
}
