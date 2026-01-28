"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Package,
  Users,
  FileText,
  AlertTriangle,
  Bell,
  Settings,
  Menu,
  X,
  Train,
  UserCheck
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Traceability', href: '/traceability', icon: Package },
  { name: 'Batches', href: '/batches', icon: Package },
  { name: 'Hygiene Reports', href: '/hygiene', icon: FileText },
  { name: 'Complaints', href: '/complaints', icon: AlertTriangle },
  { name: 'Alerts', href: '/alerts', icon: Bell },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: (collapsed: boolean) => void }) {
  const pathname = usePathname()

  return (
    <div className={cn(
      "fixed left-0 top-0 h-screen bg-[#0F2A44] border-r border-gray-200 transition-all duration-300 z-50",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#1E7F5C] rounded-lg flex items-center justify-center">
                <Train className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">SupplySafe</h1>
                <p className="text-gray-400 text-xs">DFTS System</p>
              </div>
            </div>
          )}
          <button
            onClick={() => onToggle(!collapsed)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {collapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                  isActive
                    ? "bg-[#1E7F5C] text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span className="text-sm font-medium">{item.name}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              <UserCheck className="w-4 h-4 text-white" />
            </div>
            {!collapsed && (
              <div className="text-white">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-gray-400">IRCS Authority</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
