'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Sparkles,
  TrendingUp,
  Brain,
  BookOpen,
  Menu,
  X,
  Shield,
  ArrowRight,
} from 'lucide-react'

interface NavbarProps {
  currentPage: string
  onNavigate: (page: string) => void
  onAdminClick: () => void
}

const NAV_ITEMS = [
  { key: 'home', label: 'Home' },
  { key: 'market', label: 'Market' },
  { key: 'vedic', label: 'Vedic Insights' },
  { key: 'predictions', label: 'Predictions' },
  { key: 'blog', label: 'Blog' },
]

export function Navbar({ currentPage, onNavigate, onAdminClick }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleNav = (page: string) => {
    onNavigate(page)
    setMobileOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <button onClick={() => handleNav('home')} className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 shadow-md shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-shadow">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-foreground">NEPSE Vedic</span>
            <span className="text-[10px] text-muted-foreground leading-none">Trading Platform</span>
          </div>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => handleNav(item.key)}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentPage === item.key
                  ? 'text-amber-700 bg-amber-500/10 dark:text-amber-400'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onAdminClick} className="text-muted-foreground">
            <Shield className="h-4 w-4 mr-1.5" />
            Admin
          </Button>
          <Button
            onClick={() => handleNav('market')}
            className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white shadow-md shadow-amber-500/20"
          >
            Get Started
            <ArrowRight className="h-4 w-4 ml-1.5" />
          </Button>
        </div>

        {/* Mobile Menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="flex flex-col gap-6 pt-6">
              <div className="flex items-center gap-3 px-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-amber-600">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold tracking-tight text-foreground">NEPSE Vedic</span>
                  <span className="text-[10px] text-muted-foreground leading-none">Trading Platform</span>
                </div>
              </div>
              <nav className="flex flex-col gap-1">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => handleNav(item.key)}
                    className={`px-3 py-2.5 text-sm font-medium rounded-lg transition-colors text-left ${
                      currentPage === item.key
                        ? 'text-amber-700 bg-amber-500/10 dark:text-amber-400'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
              <div className="border-t pt-4 flex flex-col gap-2">
                <Button variant="outline" onClick={() => { onAdminClick(); setMobileOpen(false); }} className="justify-start">
                  <Shield className="h-4 w-4 mr-2" />
                  Admin Panel
                </Button>
                <Button
                  onClick={() => handleNav('market')}
                  className="bg-gradient-to-r from-amber-600 to-amber-500 text-white"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

export function Footer({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-amber-600">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight text-foreground">NEPSE Vedic</span>
                <span className="text-[10px] text-muted-foreground leading-none">Trading Platform</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Combining ancient Vedic astrological wisdom with modern market analysis to provide unique insights into the Nepal Stock Exchange.
            </p>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Features</h4>
            <ul className="space-y-2">
              {[
                { key: 'market', label: 'Market Overview' },
                { key: 'vedic', label: 'Vedic Charts' },
                { key: 'predictions', label: 'AI Predictions' },
              ].map((item) => (
                <li key={item.key}>
                  <button onClick={() => onNavigate(item.key)} className="text-xs text-muted-foreground hover:text-amber-600 transition-colors">
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Resources</h4>
            <ul className="space-y-2">
              {[
                { key: 'blog', label: 'Blog & Articles' },
                { key: 'about', label: 'About Us' },
              ].map((item) => (
                <li key={item.key}>
                  <button onClick={() => onNavigate(item.key)} className="text-xs text-muted-foreground hover:text-amber-600 transition-colors">
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Contact</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>Kathmandu, Nepal</li>
              <li>info@nepsevedic.com</li>
              <li className="pt-2 text-[10px]">
                Data provided for informational purposes only. Not financial advice.
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[10px] text-muted-foreground">
            &copy; {new Date().getFullYear()} NEPSE Vedic Trading Platform. All rights reserved.
          </p>
          <p className="text-[10px] text-muted-foreground">
            Powered by Vedic Astrology & AI
          </p>
        </div>
      </div>
    </footer>
  )
}
