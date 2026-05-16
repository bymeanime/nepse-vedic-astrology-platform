import { create } from 'zustand'

// Public pages (website)
export type PublicPage = 'home' | 'market' | 'vedic' | 'predictions' | 'blog' | 'about'

// Admin pages (dashboard)
export type AdminPage =
  | 'admin-dashboard'
  | 'admin-market'
  | 'admin-vedic'
  | 'admin-predictions'
  | 'admin-watchlist'
  | 'admin-cms-pages'
  | 'admin-cms-blog'
  | 'admin-cms-categories'
  | 'admin-cms-media'
  | 'admin-users'
  | 'admin-settings'
  | 'admin-logs'

export type ViewMode = 'public' | 'admin'

export interface PageConfig {
  key: string
  label: string
  group: 'main' | 'cms' | 'admin'
}

export const ADMIN_PAGE_CONFIGS: PageConfig[] = [
  { key: 'admin-dashboard', label: 'Dashboard', group: 'main' },
  { key: 'admin-market', label: 'Market', group: 'main' },
  { key: 'admin-vedic', label: 'Vedic Charts', group: 'main' },
  { key: 'admin-predictions', label: 'Predictions', group: 'main' },
  { key: 'admin-watchlist', label: 'Watchlist', group: 'main' },
  { key: 'admin-cms-pages', label: 'Pages', group: 'cms' },
  { key: 'admin-cms-blog', label: 'Blog', group: 'cms' },
  { key: 'admin-cms-categories', label: 'Categories', group: 'cms' },
  { key: 'admin-cms-media', label: 'Media', group: 'cms' },
  { key: 'admin-users', label: 'Users', group: 'admin' },
  { key: 'admin-settings', label: 'Settings', group: 'admin' },
  { key: 'admin-logs', label: 'Activity Logs', group: 'admin' },
]

interface AppStore {
  viewMode: ViewMode
  publicPage: PublicPage
  adminPage: AdminPage
  sidebarOpen: boolean
  user: { id: string; name: string; email: string; role: string } | null
  setViewMode: (mode: ViewMode) => void
  setPublicPage: (page: PublicPage) => void
  setAdminPage: (page: AdminPage) => void
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  setUser: (user: { id: string; name: string; email: string; role: string } | null) => void
}

export const useAppStore = create<AppStore>((set) => ({
  viewMode: 'public',
  publicPage: 'home',
  adminPage: 'admin-dashboard',
  sidebarOpen: false,
  user: { id: '1', name: 'Admin User', email: 'admin@nepsevedic.com', role: 'ADMIN' },
  setViewMode: (mode) => set({ viewMode: mode }),
  setPublicPage: (page) => set({ publicPage: page }),
  setAdminPage: (page) => set({ adminPage: page }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setUser: (user) => set({ user }),
}))
