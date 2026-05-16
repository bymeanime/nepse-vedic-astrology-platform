'use client'

import { useEffect, useState } from 'react'
import { useAppStore } from '@/lib/store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Users,
  FileText,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  Activity,
  Clock,
} from 'lucide-react'

interface DashboardStats {
  users: number
  blogPosts: number
  predictions: number
  vedicEvents: number
}

interface RecentActivity {
  id: string
  action: string
  details: string | null
  createdAt: string
  user: { name: string | null; email: string } | null
}

export function DashboardPage() {
  const { user } = useAppStore()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [activities, setActivities] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [usersRes, blogRes, predictionsRes, vedicRes, logsRes] = await Promise.allSettled([
          fetch('/api/users'),
          fetch('/api/blog?all=true'),
          fetch('/api/predictions?all=true'),
          fetch('/api/vedic-events?all=true'),
          fetch('/api/activity-log?limit=10'),
        ])

        const users = usersRes.status === 'fulfilled' && usersRes.value.ok ? await usersRes.value.json() : null
        const blog = blogRes.status === 'fulfilled' && blogRes.value.ok ? await blogRes.value.json() : null
        const predictions = predictionsRes.status === 'fulfilled' && predictionsRes.value.ok ? await predictionsRes.value.json() : null
        const vedic = vedicRes.status === 'fulfilled' && vedicRes.value.ok ? await vedicRes.value.json() : null
        const logs = logsRes.status === 'fulfilled' && logsRes.value.ok ? await logsRes.value.json() : null

        setStats({
          users: users?.data?.length ?? 0,
          blogPosts: blog?.data?.length ?? 0,
          predictions: predictions?.data?.length ?? 0,
          vedicEvents: vedic?.data?.length ?? 0,
        })

        setActivities(logs?.data ?? [])
      } catch {
        // Use fallback data
        setStats({ users: 0, blogPosts: 0, predictions: 0, vedicEvents: 0 })
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.users ?? 0,
      icon: Users,
      color: 'text-amber-600',
      bg: 'bg-amber-500/10',
      description: 'Registered accounts',
    },
    {
      title: 'Blog Posts',
      value: stats?.blogPosts ?? 0,
      icon: FileText,
      color: 'text-emerald-600',
      bg: 'bg-emerald-500/10',
      description: 'Published & drafts',
    },
    {
      title: 'Predictions',
      value: stats?.predictions ?? 0,
      icon: TrendingUp,
      color: 'text-rose-600',
      bg: 'bg-rose-500/10',
      description: 'Market predictions',
    },
    {
      title: 'Vedic Events',
      value: stats?.vedicEvents ?? 0,
      icon: Sparkles,
      color: 'text-violet-600',
      bg: 'bg-violet-500/10',
      description: 'Astrological events',
    },
  ]

  const quickActions = [
    { label: 'New Blog Post', page: 'cms-blog' as const },
    { label: 'Add Vedic Event', page: 'vedic' as const },
    { label: 'View Market', page: 'market' as const },
    { label: 'Manage Users', page: 'admin-users' as const },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Welcome back, {user?.name?.split(' ')[0] ?? 'Admin'} 👋
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Here&apos;s what&apos;s happening on your NEPSE Vedic Trading Platform today.
              </p>
            </div>
            <Badge variant="outline" className="bg-amber-500/10 text-amber-700 border-amber-200 dark:text-amber-400 dark:border-amber-800 w-fit">
              {user?.role ?? 'ADMIN'}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`rounded-lg p-2 ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold">{stat.value}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-amber-600" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest actions across the platform</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => useAppStore.getState().setActivePage('admin-logs')}
              >
                View all
                <ArrowUpRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto space-y-3">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))
              ) : activities.length > 0 ? (
                activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="rounded-full bg-amber-500/10 p-2 mt-0.5">
                      <Clock className="h-3 w-3 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {activity.user?.name ?? 'System'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {activity.action}
                        {activity.details && ` — ${activity.details}`}
                      </p>
                    </div>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                      {new Date(activity.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  No recent activity to display.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
            <CardDescription>Jump to common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                variant="outline"
                className="w-full justify-start gap-3 h-11"
                onClick={() => useAppStore.getState().setActivePage(action.page)}
              >
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                {action.label}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
