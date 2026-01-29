import { AppShell } from "@/components/layout/app-shell";
import { PageHeaderSkeleton } from "@/components/ui/skeleton";
import { CardSkeleton } from "@/components/ui/skeleton";

export default function BatchesLoading() {
  return (
    <AppShell>
      <div className="space-y-6 p-6">
        <PageHeaderSkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CardSkeleton />
          </div>
          <div>
            <CardSkeleton />
          </div>
        </div>
        <CardSkeleton />
      </div>
    </AppShell>
  );
}
