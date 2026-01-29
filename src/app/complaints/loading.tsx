import { AppShell } from "@/components/layout/app-shell";
import { ComplaintsPageSkeleton } from "@/components/ui/skeleton";

export default function ComplaintsLoading() {
  return (
    <AppShell>
      <ComplaintsPageSkeleton />
    </AppShell>
  );
}
