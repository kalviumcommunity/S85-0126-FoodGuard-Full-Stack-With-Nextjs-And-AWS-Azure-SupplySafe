'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Database, 
  Activity, 
  HardDrive, 
  Users, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Server,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

interface DatabaseMetrics {
  connections: {
    active: number;
    max: number;
    utilization: number;
  };
  performance: {
    avgQueryTime: number;
    queriesPerSecond: number;
    slowQueries: number;
  };
  storage: {
    used: number;
    total: number;
    utilization: number;
  };
  uptime: {
    total: number;
    since: string;
  };
  health: {
    status: 'healthy' | 'warning' | 'critical';
    lastCheck: string;
    issues: string[];
  };
}

interface DatabaseInfo {
  version: string;
  timezone: string;
  encoding: string;
  collation: string;
}

export default function DatabaseMonitoringDashboard() {
  const [metrics, setMetrics] = useState<DatabaseMetrics | null>(null);
  const [dbInfo, setDbInfo] = useState<DatabaseInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds

  const fetchDatabaseMetrics = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/database/metrics');
      if (!response.ok) {
        throw new Error('Failed to fetch database metrics');
      }
      const data = await response.json();
      setMetrics(data.metrics);
      setDbInfo(data.databaseInfo);
    } catch (error) {
      toast.error('Failed to fetch database metrics');
      console.error('Metrics fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDatabaseMetrics();
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchDatabaseMetrics, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'critical':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Database className="h-8 w-8" />
            Database Monitoring Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Real-time monitoring of your managed PostgreSQL database
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(Number(e.target.value))}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value={10000}>10s</option>
            <option value={30000}>30s</option>
            <option value={60000}>1m</option>
            <option value={300000}>5m</option>
          </select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`} />
            Auto Refresh
          </Button>
          <Button onClick={fetchDatabaseMetrics} disabled={isLoading} className="flex items-center gap-2">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Refresh
          </Button>
        </div>
      </div>

      {/* Health Status */}
      {metrics && (
        <Card className="border-l-4" style={{ borderLeftColor: getHealthColor(metrics.health.status) }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getHealthIcon(metrics.health.status)}
              Database Health: {metrics.health.status.toUpperCase()}
            </CardTitle>
            <CardDescription>
              Last checked: {new Date(metrics.health.lastCheck).toLocaleString()}
            </CardDescription>
          </CardHeader>
          {metrics.health.issues.length > 0 && (
            <CardContent>
              <div className="space-y-2">
                {metrics.health.issues.map((issue, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-yellow-700 bg-yellow-50 p-2 rounded">
                    <AlertTriangle className="h-4 w-4" />
                    {issue}
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Connections</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics ? metrics.connections.active : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              of {metrics ? metrics.connections.max : 'N/A'} max
            </p>
            {metrics && (
              <Progress value={metrics.connections.utilization} className="mt-2" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Query Performance</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics ? `${metrics.performance.avgQueryTime}ms` : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              Avg query time
            </p>
            {metrics && (
              <div className="flex items-center gap-2 mt-2">
                <TrendingUp className="h-3 w-3" />
                <span className="text-xs">{metrics.performance.queriesPerSecond} q/s</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Usage</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics ? `${metrics.storage.utilization}%` : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics ? formatBytes(metrics.storage.used) : 'N/A'} used
            </p>
            {metrics && (
              <Progress value={metrics.storage.utilization} className="mt-2" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics ? formatUptime(metrics.uptime.total) : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics ? `Since ${new Date(metrics.uptime.since).toLocaleDateString()}` : 'N/A'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Details */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>
              Detailed performance information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {metrics ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Queries per Second</span>
                  <Badge variant="outline">{metrics.performance.queriesPerSecond}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Average Query Time</span>
                  <Badge variant="outline">{metrics.performance.avgQueryTime}ms</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Slow Queries</span>
                  <Badge variant={metrics.performance.slowQueries > 0 ? "destructive" : "default"}>
                    {metrics.performance.slowQueries}
                  </Badge>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Loading performance metrics...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Database Information */}
        <Card>
          <CardHeader>
            <CardTitle>Database Information</CardTitle>
            <CardDescription>
              PostgreSQL server details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {dbInfo ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Version</span>
                  <Badge variant="outline">{dbInfo.version}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Timezone</span>
                  <Badge variant="outline">{dbInfo.timezone}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Encoding</span>
                  <Badge variant="outline">{dbInfo.encoding}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Collation</span>
                  <Badge variant="outline">{dbInfo.collation}</Badge>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <Server className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No database information available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Connection Details */}
      {metrics && (
        <Card>
          <CardHeader>
            <CardTitle>Connection Details</CardTitle>
            <CardDescription>
              Database connection utilization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Connection Utilization</span>
                  <span className="text-sm text-muted-foreground">
                    {metrics.connections.active} / {metrics.connections.max}
                  </span>
                </div>
                <Progress value={metrics.connections.utilization} className="h-2" />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Active:</span>
                  <span className="ml-2 font-medium">{metrics.connections.active}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Max:</span>
                  <span className="ml-2 font-medium">{metrics.connections.max}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Utilization:</span>
                  <span className="ml-2 font-medium">{metrics.connections.utilization}%</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Available:</span>
                  <span className="ml-2 font-medium">{metrics.connections.max - metrics.connections.active}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Storage Details */}
      {metrics && (
        <Card>
          <CardHeader>
            <CardTitle>Storage Details</CardTitle>
            <CardDescription>
              Database storage utilization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Storage Utilization</span>
                  <span className="text-sm text-muted-foreground">
                    {formatBytes(metrics.storage.used)} / {formatBytes(metrics.storage.total)}
                  </span>
                </div>
                <Progress value={metrics.storage.utilization} className="h-2" />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Used:</span>
                  <span className="ml-2 font-medium">{formatBytes(metrics.storage.used)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Total:</span>
                  <span className="ml-2 font-medium">{formatBytes(metrics.storage.total)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Utilization:</span>
                  <span className="ml-2 font-medium">{metrics.storage.utilization}%</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Free:</span>
                  <span className="ml-2 font-medium">{formatBytes(metrics.storage.total - metrics.storage.used)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
