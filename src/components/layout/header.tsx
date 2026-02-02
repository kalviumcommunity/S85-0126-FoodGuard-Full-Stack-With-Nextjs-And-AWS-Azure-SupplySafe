"use client"

import { Search, Bell, User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

export function Header({ sidebarCollapsed }: { sidebarCollapsed: boolean }) {
  return (
    <header className={`fixed top-0 right-0 h-16 bg-white border-b border-gray-200 z-40 transition-all duration-300 ${
      sidebarCollapsed ? 'left-16' : 'left-64'
    }`}>
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Digital Food Traceability System
          </h2>
          <Badge variant="secondary" className="text-xs">
            Indian Railway Catering Services
          </Badge>
        </div>

        <div className="flex-1 max-w-xl mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search batches, suppliers, reports..."
              className="pl-10 pr-4 py-2 bg-gray-50 border-gray-200 focus:bg-white"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5 text-gray-600" />
            </Button>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </div>

          <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">System Administrator</p>
              <p className="text-xs text-gray-500">IRCS Authority</p>
            </div>
            <div className="w-10 h-10 bg-[#0F2A44] rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <Button variant="ghost" size="icon">
              <LogOut className="w-4 h-4 text-gray-600" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
