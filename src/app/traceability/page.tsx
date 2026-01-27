"use client"

import { AppShell } from '@/components/layout/app-shell'
import { TraceabilityFlow } from '@/components/traceability/traceability-flow'

export default function TraceabilityPage() {
  return (
    <AppShell>
      <TraceabilityFlow />
    </AppShell>
  )
}
