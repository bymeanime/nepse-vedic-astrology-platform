'use client'

import { useAppStore } from '@/lib/store'
import { Sidebar } from '@/components/layout/sidebar'
import { TopBar } from '@/components/layout/top-bar'
import { DashboardPage } from '@/components/pages/dashboard-page'
import { MarketPage } from '@/components/pages/market-page'
import { VedicPage } from '@/components/pages/vedic-page'
import { PredictionsPage } from '@/components/pages/predictions-page'
import { WatchlistPage } from '@/components/pages/watchlist-page'
import { CmsPagesPage } from '@/components/pages/cms-pages-page'
import { CmsBlogPage } from '@/components/pages/cms-blog-page'
import { CmsCategoriesPage } from '@/components/pages/cms-categories-page'
import { CmsMediaPage } from '@/components/pages/cms-media-page'
import { AdminUsersPage } from '@/components/pages/admin-users-page'
import { AdminSettingsPage } from '@/components/pages/admin-settings-page'
import { AdminLogsPage } from '@/components/pages/admin-logs-page'

export default function Home() {
  const { activePage } = useAppStore()

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage />
      case 'market':
        return <MarketPage />
      case 'vedic':
        return <VedicPage />
      case 'predictions':
        return <PredictionsPage />
      case 'watchlist':
        return <WatchlistPage />
      case 'cms-pages':
        return <CmsPagesPage />
      case 'cms-blog':
        return <CmsBlogPage />
      case 'cms-categories':
        return <CmsCategoriesPage />
      case 'cms-media':
        return <CmsMediaPage />
      case 'admin-users':
        return <AdminUsersPage />
      case 'admin-settings':
        return <AdminSettingsPage />
      case 'admin-logs':
        return <AdminLogsPage />
      default:
        return <DashboardPage />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  )
}
