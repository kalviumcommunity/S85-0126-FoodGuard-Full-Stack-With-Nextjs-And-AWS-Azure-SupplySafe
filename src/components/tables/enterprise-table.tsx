"use client"

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Filter,
  Download,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'

interface Column {
  key: string
  label: string
  sortable?: boolean
  render?: (value: any, row: any) => React.ReactNode
}

interface EnterpriseTableProps {
  data: any[]
  columns: Column[]
  title?: string
  searchable?: boolean
  filterable?: boolean
  paginated?: boolean
  pageSize?: number
  actions?: {
    view?: (row: any) => void
    edit?: (row: any) => void
    delete?: (row: any) => void
  }
}

export function EnterpriseTable({
  data,
  columns,
  title,
  searchable = true,
  filterable = true,
  paginated = true,
  pageSize = 10,
  actions
}: EnterpriseTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // Filter data based on search
  const filteredData = data.filter(row => {
    if (!searchTerm) return true
    return columns.some(column => {
      const value = row[column.key]
      return value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    })
  })

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0
    const aValue = a[sortColumn]
    const bValue = b[sortColumn]
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const paginatedData = paginated ? sortedData.slice(startIndex, startIndex + pageSize) : sortedData

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(columnKey)
      setSortDirection('asc')
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'compliant':
      case 'approved':
      case 'active':
      case 'delivered':
        return <Badge variant="compliant" className="text-xs">{status}</Badge>
      case 'pending':
      case 'in-transit':
      case 'processing':
        return <Badge variant="pending" className="text-xs">{status}</Badge>
      case 'non-compliant':
      case 'rejected':
      case 'expired':
      case 'critical':
        return <Badge variant="critical" className="text-xs">{status}</Badge>
      default:
        return <Badge variant="default" className="text-xs">{status}</Badge>
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
        
        <div className="flex items-center space-x-2">
          {filterable && (
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          )}
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Search */}
      {searchable && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      {/* Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} className="font-medium text-gray-700">
                  {column.sortable ? (
                    <button
                      onClick={() => handleSort(column.key)}
                      className="flex items-center space-x-1 hover:text-gray-900"
                    >
                      <span>{column.label}</span>
                      {sortColumn === column.key && (
                        <span className="text-xs">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </button>
                  ) : (
                    column.label
                  )}
                </TableHead>
              ))}
              {actions && <TableHead className="w-24">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((row, index) => (
              <TableRow key={index} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <TableCell key={column.key} className="text-sm">
                    {column.render ? column.render(row[column.key], row) : 
                     column.key.toLowerCase().includes('status') ? getStatusBadge(row[column.key]) :
                     row[column.key]}
                  </TableCell>
                ))}
                {actions && (
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {actions.view && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => actions.view!(row)}
                          className="h-8 w-8"
                        >
                          <Eye className="w-4 h-4 text-gray-600" />
                        </Button>
                      )}
                      {actions.edit && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => actions.edit!(row)}
                          className="h-8 w-8"
                        >
                          <Edit className="w-4 h-4 text-gray-600" />
                        </Button>
                      )}
                      {actions.delete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => actions.delete!(row)}
                          className="h-8 w-8 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {paginated && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(startIndex + pageSize, sortedData.length)} of {sortedData.length} entries
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
