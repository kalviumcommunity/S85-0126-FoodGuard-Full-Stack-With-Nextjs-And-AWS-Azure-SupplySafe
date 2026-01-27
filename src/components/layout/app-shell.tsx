"use client"

import { Sidebar } from './sidebar'
import { Header } from './header'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <Sidebar />
      <Header />
      
      <main className="pt-16 ml-64">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
