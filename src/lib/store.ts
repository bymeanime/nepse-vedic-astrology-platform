import { create } from 'zustand'

export type Page =
  | 'dashboard'
  | 'market'
  | 'vedic'
  | 'predictions'
  | 'watchlist'
  | 'cms-pages'
  | 'cms-blog'
  | 'cms-categories'
  | 'cms-media'
  | 'admin-users'
  | 'admin-settings'
  | 'admin-logs'

export interface PageConfig {
  key: Page
  label: string
  group: 'main' | 'cms' | 'admin'
}

export const PAGE_CONFIGS: PageConfig[] = [
  { key: 'dashboard', label: 'Dashboard', group: 'main' },
  { key: 'market', label: 'Market', group: 'main' },
  { key: 'vedic', label: 'Vedic Charts', group: 'main' },
  { key: 'predictions', label: 'Predictions', group: 'main' },
  { key: 'watchlist', label: 'Watchlist', group: 'main' },
  { key: 'cms-pages', label: 'Pages', group: 'cms' },
  { key: 'cms-blog', label: 'Blog', group: 'cms' },
  { key: 'cms-categories', label: 'Categories', group: 'cms' },
  { key: 'cms-media', label: 'Media', group: 'cms' },
  { key: 'admin-users', label: 'Users', group: 'admin' },
  { key: 'admin-settings', label: 'Settings', group: 'admin' },
  { key: 'admin-logs', label: 'Activity Logs', group: 'admin' },
]

interface AppStore {
  activePage: Page
  sidebarOpen: boolean
  user: { id: string; name: string; email: string; role: string } | null
  setActivePage: (page: Page) => void
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  setUser: (user: { id: string; name: string; email: string; role: string } | null) => void
}

export const useAppStore = create<AppStore>((set) => ({
  activePage: 'dashboard',
  sidebarOpen: false,
  user: { id: '1', name: 'Admin User', email: 'admin@nepsevedic.com', role: 'ADMIN' },
  setActivePage: (page) => set({ activePage: page }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setUser: (user) => set({ user }),
}))
