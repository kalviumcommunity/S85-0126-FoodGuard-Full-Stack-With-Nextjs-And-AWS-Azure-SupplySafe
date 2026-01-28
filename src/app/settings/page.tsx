"use client"

import { useState } from 'react'
import { AppShell } from '@/components/layout/app-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Settings,
  Save,
  Download,
  Upload,
  Shield,
  Bell,
  Database,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info,
  Mail,
  Phone,
  MapPin,
  Building,
  Globe,
  Lock,
  Eye,
  EyeOff,
  RefreshCw,
  Trash2,
  Plus,
  Edit
} from 'lucide-react'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [showPassword, setShowPassword] = useState(false)
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    pushNotifications: true,
    weeklyReports: true,
    criticalAlerts: true,
    systemUpdates: false
  })

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'data', label: 'Data Management', icon: Database },
    { id: 'users', label: 'User Policies', icon: Users },
    { id: 'system', label: 'System', icon: Clock }
  ]

  const systemSettings = {
    systemName: 'Digital Food Traceability System',
    organization: 'Indian Railway Catering Services',
    version: '2.1.0',
    lastUpdate: '2024-01-27',
    timezone: 'Asia/Kolkata',
    language: 'English',
    dateFormat: 'DD-MM-YYYY',
    timeFormat: '24-hour',
    currency: 'INR',
    backupFrequency: 'Daily',
    retentionPeriod: '2 years'
  }

  const securitySettings = {
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      expireAfter: 90
    },
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    twoFactorAuth: true,
    ipWhitelist: ['192.168.1.0/24', '10.0.0.0/8'],
    auditLogging: true
  }

  const recentBackups = [
    { id: 1, date: '2024-01-27 14:30:00', size: '2.4 GB', type: 'Full', status: 'completed' },
    { id: 2, date: '2024-01-27 02:00:00', size: '2.3 GB', type: 'Incremental', status: 'completed' },
    { id: 3, date: '2024-01-26 14:30:00', size: '2.4 GB', type: 'Full', status: 'completed' },
    { id: 4, date: '2024-01-26 02:00:00', size: '1.8 GB', type: 'Incremental', status: 'completed' }
  ]

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
            <p className="text-gray-600 mt-1">Configure and manage system preferences</p>
          </div>
          <Button>
            <Save className="w-4 h-4 mr-2" />
            Save All Changes
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Settings Categories</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                          activeTab === tab.id
                            ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                            : 'text-gray-700'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    )
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>General Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          System Name
                        </label>
                        <Input
                          defaultValue={systemSettings.systemName}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Organization
                        </label>
                        <Input
                          defaultValue={systemSettings.organization}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Timezone
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white">
                          <option>Asia/Kolkata</option>
                          <option>Asia/Delhi</option>
                          <option>Asia/Mumbai</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Language
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white">
                          <option>English</option>
                          <option>Hindi</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date Format
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white">
                          <option>DD-MM-YYYY</option>
                          <option>MM-DD-YYYY</option>
                          <option>YYYY-MM-DD</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Time Format
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white">
                          <option>24-hour</option>
                          <option>12-hour</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-4">Contact Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Admin Email
                          </label>
                          <Input
                            type="email"
                            defaultValue="admin@ircs.gov.in"
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Support Phone
                          </label>
                          <Input
                            type="tel"
                            defaultValue="+91-22-12345678"
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Address
                          </label>
                          <Input
                            defaultValue="Mumbai Central Office, Maharashtra"
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Website
                          </label>
                          <Input
                            type="url"
                            defaultValue="https://ircs.gov.in"
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Password Policy</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Minimum Length
                        </label>
                        <Input
                          type="number"
                          defaultValue={securitySettings.passwordPolicy.minLength}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Password Expiry (days)
                        </label>
                        <Input
                          type="number"
                          defaultValue={securitySettings.passwordPolicy.expireAfter}
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          defaultChecked={securitySettings.passwordPolicy.requireUppercase}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                        />
                        <label className="text-sm font-medium text-gray-700">
                          Require uppercase letters
                        </label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          defaultChecked={securitySettings.passwordPolicy.requireLowercase}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                        />
                        <label className="text-sm font-medium text-gray-700">
                          Require lowercase letters
                        </label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          defaultChecked={securitySettings.passwordPolicy.requireNumbers}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                        />
                        <label className="text-sm font-medium text-gray-700">
                          Require numbers
                        </label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          defaultChecked={securitySettings.passwordPolicy.requireSpecialChars}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                        />
                        <label className="text-sm font-medium text-gray-700">
                          Require special characters
                        </label>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Session Security</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Session Timeout (minutes)
                        </label>
                        <Input
                          type="number"
                          defaultValue={securitySettings.sessionTimeout}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Max Login Attempts
                        </label>
                        <Input
                          type="number"
                          defaultValue={securitySettings.maxLoginAttempts}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Lockout Duration (minutes)
                        </label>
                        <Input
                          type="number"
                          defaultValue={securitySettings.lockoutDuration}
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          defaultChecked={securitySettings.twoFactorAuth}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                        />
                        <label className="text-sm font-medium text-gray-700">
                          Enable Two-Factor Authentication
                        </label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          defaultChecked={securitySettings.auditLogging}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                        />
                        <label className="text-sm font-medium text-gray-700">
                          Enable Audit Logging
                        </label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Email Alerts</h4>
                          <p className="text-sm text-gray-500">Receive notifications via email</p>
                        </div>
                        <button
                          onClick={() => setNotifications({...notifications, emailAlerts: !notifications.emailAlerts})}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            notifications.emailAlerts ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              notifications.emailAlerts ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">SMS Alerts</h4>
                          <p className="text-sm text-gray-500">Receive critical alerts via SMS</p>
                        </div>
                        <button
                          onClick={() => setNotifications({...notifications, smsAlerts: !notifications.smsAlerts})}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            notifications.smsAlerts ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              notifications.smsAlerts ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Push Notifications</h4>
                          <p className="text-sm text-gray-500">Browser push notifications</p>
                        </div>
                        <button
                          onClick={() => setNotifications({...notifications, pushNotifications: !notifications.pushNotifications})}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            notifications.pushNotifications ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              notifications.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Weekly Reports</h4>
                          <p className="text-sm text-gray-500">Weekly summary reports</p>
                        </div>
                        <button
                          onClick={() => setNotifications({...notifications, weeklyReports: !notifications.weeklyReports})}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            notifications.weeklyReports ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              notifications.weeklyReports ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Critical Alerts</h4>
                          <p className="text-sm text-gray-500">Immediate critical alerts</p>
                        </div>
                        <button
                          onClick={() => setNotifications({...notifications, criticalAlerts: !notifications.criticalAlerts})}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            notifications.criticalAlerts ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              notifications.criticalAlerts ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">System Updates</h4>
                          <p className="text-sm text-gray-500">System update notifications</p>
                        </div>
                        <button
                          onClick={() => setNotifications({...notifications, systemUpdates: !notifications.systemUpdates})}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            notifications.systemUpdates ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              notifications.systemUpdates ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Data Management */}
            {activeTab === 'data' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Backup Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Backup Frequency
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white">
                          <option>Daily</option>
                          <option>Weekly</option>
                          <option>Monthly</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Retention Period
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white">
                          <option>30 days</option>
                          <option>90 days</option>
                          <option>1 year</option>
                          <option>2 years</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <Button>
                        <Download className="w-4 h-4 mr-2" />
                        Download Backup
                      </Button>
                      <Button variant="outline" className="text-gray-700 border-gray-300 hover:bg-gray-50">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Restore Backup
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Backups</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date & Time</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Size</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentBackups.map((backup) => (
                          <TableRow key={backup.id}>
                            <TableCell className="text-sm text-gray-900">{backup.date}</TableCell>
                            <TableCell>
                              <Badge variant={backup.type === 'Full' ? 'default' : 'secondary'} className="text-xs">
                                {backup.type}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-gray-600">{backup.size}</TableCell>
                            <TableCell>
                              <Badge variant="compliant" className="text-xs">
                                {backup.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end space-x-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Download className="w-4 h-4 text-gray-600" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Trash2 className="w-4 h-4 text-red-600" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* User Policies */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>User Access Policies</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Require Admin Approval</h4>
                          <p className="text-sm text-gray-500">New user registration requires admin approval</p>
                        </div>
                        <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                          <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Multi-Factor Authentication</h4>
                          <p className="text-sm text-gray-500">Require MFA for all users</p>
                        </div>
                        <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                          <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">IP Restrictions</h4>
                          <p className="text-sm text-gray-500">Limit access to specific IP ranges</p>
                        </div>
                        <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                          <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* System Settings */}
            {activeTab === 'system' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>System Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          System Version
                        </label>
                        <Input
                          defaultValue={systemSettings.version}
                          className="w-full"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Update
                        </label>
                        <Input
                          defaultValue={systemSettings.lastUpdate}
                          className="w-full"
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                      <div className="flex space-x-4">
                        <Button>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Check for Updates
                        </Button>
                        <Button variant="outline" className="text-gray-700 border-gray-300 hover:bg-gray-50">
                          <Download className="w-4 h-4 mr-2" />
                          Download Logs
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
