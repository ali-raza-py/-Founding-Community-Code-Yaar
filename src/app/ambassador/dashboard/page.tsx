import { redirect } from "next/navigation";

import AmbassadorDashboard from "@/components/ambassador/ambassador-dashboard";
import { AmbassadorLayout } from "@/components/ambassador/ambassador-layout";

export default function AmbassadorDashboardPage() {
  return (
    <AmbassadorLayout>
      <AmbassadorDashboard />
    </AmbassadorLayout>
  );
}
