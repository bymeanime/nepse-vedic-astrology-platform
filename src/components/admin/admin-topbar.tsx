'use client'

import { useAppStore, ADMIN_PAGE_CONFIGS } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Bell, Menu, ArrowLeft, LogOut, User, Settings } from 'lucide-react'

export function AdminTopBar() {
  const { adminPage, sidebarOpen, setSidebarOpen, user, setViewMode, setPublicPage } = useAppStore()
  const currentPage = ADMIN_PAGE_CONFIGS.find(p => p.key === adminPage)

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={() => { setViewMode('public'); setPublicPage('home') }} className="text-muted-foreground mr-2 hidden sm:flex">
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Site
        </Button>
        <div>
          <h1 className="text-lg font-semibold text-foreground">{currentPage?.label?.replace('Admin ', '') ?? 'Dashboard'}</h1>
          <p className="text-xs text-muted-foreground hidden sm:block">NEPSE Vedic Admin Panel</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-amber-500/10 text-amber-700 text-xs font-semibold">
                  {user?.name?.charAt(0) ?? 'A'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-sm font-medium text-foreground leading-none">{user?.name ?? 'Admin'}</span>
                <span className="text-[10px] text-muted-foreground leading-none mt-0.5">{user?.role ?? 'ADMIN'}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem><User className="mr-2 h-4 w-4" />Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setAdminPage('admin-settings') }}><Settings className="mr-2 h-4 w-4" />Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => { setViewMode('public'); setPublicPage('home') }} className="text-amber-600 focus:text-amber-600">
              <ArrowLeft className="mr-2 h-4 w-4" />Back to Website
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-rose-600 focus:text-rose-600"><LogOut className="mr-2 h-4 w-4" />Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
