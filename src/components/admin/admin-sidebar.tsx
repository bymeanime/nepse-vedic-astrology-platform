'use client'

import { useAppStore, ADMIN_PAGE_CONFIGS, type AdminPage } from '@/lib/store'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  LayoutDashboard, TrendingUp, Sparkles, Brain, Bookmark,
  FileText, PenTool, Tag, Image, Users, Settings, Activity,
  Moon, Sun, ArrowLeft,
} from 'lucide-react'
import { useTheme } from 'next-themes'

const ICON_MAP: Record<AdminPage, React.ElementType> = {
  'admin-dashboard': LayoutDashboard,
  'admin-market': TrendingUp,
  'admin-vedic': Sparkles,
  'admin-predictions': Brain,
  'admin-watchlist': Bookmark,
  'admin-cms-pages': FileText,
  'admin-cms-blog': PenTool,
  'admin-cms-categories': Tag,
  'admin-cms-media': Image,
  'admin-users': Users,
  'admin-settings': Settings,
  'admin-logs': Activity,
}

const GROUP_LABELS: Record<string, string> = { main: 'MAIN', cms: 'CMS', admin: 'ADMIN' }

export function AdminSidebar() {
  const { adminPage, setAdminPage, sidebarOpen, setSidebarOpen, setViewMode, setPublicPage } = useAppStore()
  const { setTheme, theme } = useTheme()
  const groups = ['main', 'cms', 'admin'] as const

  const handleNavClick = (page: AdminPage) => {
    setAdminPage(page)
    setSidebarOpen(false)
  }

  const handleBackToSite = () => {
    setViewMode('public')
    setPublicPage('home')
  }

  const sidebarContent = (
    <div className="flex h-full flex-col bg-card border-r border-border">
      <div className="flex h-16 items-center gap-3 px-5 border-b border-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10">
          <Sparkles className="h-5 w-5 text-amber-600" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold tracking-tight text-foreground">Admin Panel</span>
          <span className="text-[10px] text-muted-foreground leading-none">NEPSE Vedic</span>
        </div>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-9 px-3 text-sm font-medium text-muted-foreground hover:text-foreground mb-4"
          onClick={handleBackToSite}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Website
        </Button>

        {groups.map((group) => {
          const items = ADMIN_PAGE_CONFIGS.filter(p => p.group === group)
          return (
            <div key={group} className="mb-4">
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                {GROUP_LABELS[group]}
              </p>
              <div className="space-y-1">
                {items.map((page) => {
                  const Icon = ICON_MAP[page.key as AdminPage]
                  const isActive = adminPage === page.key
                  return (
                    <Button
                      key={page.key}
                      variant={isActive ? 'secondary' : 'ghost'}
                      className={cn(
                        'w-full justify-start gap-3 h-9 px-3 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-amber-500/10 text-amber-700 hover:bg-amber-500/15 dark:text-amber-400 dark:hover:bg-amber-500/15'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                      onClick={() => handleNavClick(page.key as AdminPage)}
                    >
                      {Icon && <Icon className="h-4 w-4" />}
                      {page.label}
                    </Button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </ScrollArea>

      <div className="border-t border-border p-3">
        <Button variant="ghost" size="sm" className="w-full justify-start gap-3 text-muted-foreground" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside className={cn('fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 ease-in-out lg:hidden', sidebarOpen ? 'translate-x-0' : '-translate-x-full')}>
        {sidebarContent}
      </aside>
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0">{sidebarContent}</aside>
    </>
  )
}
