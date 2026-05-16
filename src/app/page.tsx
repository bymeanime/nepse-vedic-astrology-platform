'use client'

import { useAppStore, ADMIN_PAGE_CONFIGS, type AdminPage, type PublicPage } from '@/lib/store'
import { Navbar, Footer } from '@/components/public/navbar'
import { HomePage } from '@/components/public/home-page'
import { PublicMarketPage } from '@/components/public/public-market-page'
import { PublicVedicPage } from '@/components/public/public-vedic-page'
import { PublicPredictionsPage } from '@/components/public/public-predictions-page'
import { PublicBlogPage } from '@/components/public/public-blog-page'
import { AboutPage } from '@/components/public/about-page'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminTopBar } from '@/components/admin/admin-topbar'
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
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function Home() {
  const { viewMode, publicPage, adminPage, setViewMode, setPublicPage, setAdminPage } = useAppStore()

  const handlePublicNavigate = (page: string) => {
    setPublicPage(page as PublicPage)
    setViewMode('public')
  }

  const handleAdminClick = () => {
    setViewMode('admin')
    setAdminPage('admin-dashboard')
  }

  // Admin Panel
  if (viewMode === 'admin') {
    const renderAdminPage = () => {
      switch (adminPage) {
        case 'admin-dashboard': return <DashboardPage />
        case 'admin-market': return <MarketPage />
        case 'admin-vedic': return <VedicPage />
        case 'admin-predictions': return <PredictionsPage />
        case 'admin-watchlist': return <WatchlistPage />
        case 'admin-cms-pages': return <CmsPagesPage />
        case 'admin-cms-blog': return <CmsBlogPage />
        case 'admin-cms-categories': return <CmsCategoriesPage />
        case 'admin-cms-media': return <CmsMediaPage />
        case 'admin-users': return <AdminUsersPage />
        case 'admin-settings': return <AdminSettingsPage />
        case 'admin-logs': return <AdminLogsPage />
        default: return <DashboardPage />
      }
    }

    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminTopBar />
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            {renderAdminPage()}
          </main>
        </div>
      </div>
    )
  }

  // Public Website
  const renderPublicPage = () => {
    switch (publicPage) {
      case 'home': return <HomePage onNavigate={handlePublicNavigate} />
      case 'market': return <PublicMarketPage />
      case 'vedic': return <PublicVedicPage />
      case 'predictions': return <PublicPredictionsPage />
      case 'blog': return <PublicBlogPage />
      case 'about': return <AboutPage />
      default: return <HomePage onNavigate={handlePublicNavigate} />
    }
  }

  const isFullPage = ['market', 'vedic', 'predictions', 'blog', 'about'].includes(publicPage)

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-950">
      {!isFullPage && <Navbar currentPage={publicPage} onNavigate={handlePublicNavigate} onAdminClick={handleAdminClick} />}
      {isFullPage && (
        <div className="sticky top-0 z-50 bg-white dark:bg-gray-950 border-b border-border/40">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 flex h-14 items-center">
            <Button variant="ghost" size="sm" onClick={() => handlePublicNavigate('home')} className="text-muted-foreground mr-4">
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              Home
            </Button>
            <Navbar currentPage={publicPage} onNavigate={handlePublicNavigate} onAdminClick={handleAdminClick} />
          </div>
        </div>
      )}
      <main className="flex-1">
        {renderPublicPage()}
      </main>
      {!isFullPage && <Footer onNavigate={handlePublicNavigate} />}
    </div>
  )
}
