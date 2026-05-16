'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Sparkles,
  TrendingUp,
  Brain,
  Shield,
  Zap,
  ArrowRight,
  Star,
  BarChart3,
  Globe,
} from 'lucide-react'

interface HomePageProps {
  onNavigate: (page: string) => void
}

const FEATURES = [
  {
    icon: Sparkles,
    title: 'Vedic Kundli Charts',
    description: 'Interactive North and South Indian style birth charts with all 9 Navagraha planets, 12 houses, and 27 Nakshatras for deep astrological analysis.',
    color: 'text-amber-600',
    bg: 'bg-amber-500/10',
  },
  {
    icon: TrendingUp,
    title: 'Real-Time Market Data',
    description: 'Live NEPSE index tracking with sector-wise stock analysis, price trends, volume data, and comprehensive market overview dashboards.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: Brain,
    title: 'AI Predictions',
    description: 'Machine learning-powered market predictions enhanced by Vedic astrological events including eclipses, retrogrades, and planetary transits.',
    color: 'text-violet-600',
    bg: 'bg-violet-500/10',
  },
  {
    icon: Shield,
    title: 'Smart Watchlists',
    description: 'Create custom stock watchlists to track your favorite NEPSE stocks with price alerts and astrological impact notifications.',
    color: 'text-rose-600',
    bg: 'bg-rose-500/10',
  },
  {
    icon: Globe,
    title: 'Event Impact Analysis',
    description: 'Understand how celestial events like Saturn retrograde, Rahu-Ketu transits, and eclipses correlate with market movements.',
    color: 'text-cyan-600',
    bg: 'bg-cyan-500/10',
  },
  {
    icon: BarChart3,
    title: 'Dasha Period Tracking',
    description: 'Track Vimshottari Dasha periods and planetary periods to identify favorable and challenging market cycles.',
    color: 'text-orange-600',
    bg: 'bg-orange-500/10',
  },
]

const STATS = [
  { value: '2,200+', label: 'NEPSE Listed Stocks', icon: BarChart3 },
  { value: '27', label: 'Nakshatras Tracked', icon: Star },
  { value: '9', label: 'Navagraha Planets', icon: Sparkles },
  { value: '24/7', label: 'Market Monitoring', icon: Zap },
]

const TESTIMONIALS = [
  {
    name: 'Rajesh K.',
    role: 'Day Trader, Kathmandu',
    text: 'The Vedic chart integration with market data gives me a completely new perspective. Saturn retrograde predictions have been remarkably accurate for banking stocks.',
    rating: 5,
  },
  {
    name: 'Sita M.',
    role: 'Portfolio Manager',
    text: 'This platform combines two worlds beautifully. The Kundli chart visualizations are the best I have seen, and the event impact analysis helps time my trades.',
    rating: 5,
  },
  {
    name: 'Arun S.',
    role: 'Long-term Investor',
    text: 'I was skeptical at first, but the correlation between planetary transits and NEPSE index movements shown here is genuinely thought-provoking.',
    rating: 4,
  },
]

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D97706' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div className="relative max-w-7xl mx-auto px-4 lg:px-8 py-20 lg:py-32">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <Badge variant="outline" className="mb-6 px-4 py-1.5 text-xs bg-amber-500/5 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400">
              <Sparkles className="h-3 w-3 mr-1.5" />
              First platform combining Vedic Astrology with NEPSE Analysis
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
              Decode the Market
              <span className="block bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 bg-clip-text text-transparent">
                Through the Stars
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              Harness the ancient wisdom of Vedic astrology combined with real-time NEPSE market data.
              Get unique celestial insights for smarter trading decisions on the Nepal Stock Exchange.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                onClick={() => onNavigate('market')}
                className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white shadow-lg shadow-amber-500/25 px-8"
              >
                Explore Market
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => onNavigate('vedic')}
                className="px-8"
              >
                View Kundli Charts
              </Button>
            </div>

            {/* Stats Bar */}
            <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-2xl">
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center p-3 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-border/50">
                  <stat.icon className="h-5 w-5 mx-auto mb-1.5 text-amber-600" />
                  <div className="text-xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-20">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-3 text-[10px] uppercase tracking-wider text-amber-600 border-amber-200 dark:border-amber-800">
            Platform Features
          </Badge>
          <h2 className="text-3xl font-bold text-foreground">
            Everything You Need for{' '}
            <span className="bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
              Astrological Trading
            </span>
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            A comprehensive toolkit that bridges ancient Vedic wisdom with modern financial analysis.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card
              key={feature.title}
              className="group hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-300 border-border/50 hover:border-amber-200 dark:hover:border-amber-800"
            >
              <CardContent className="p-6">
                <div className={`rounded-xl p-3 w-fit ${feature.bg} mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`h-5 w-5 ${feature.color}`} />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/30 py-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-3 text-[10px] uppercase tracking-wider text-amber-600 border-amber-200 dark:border-amber-800">
              How It Works
            </Badge>
            <h2 className="text-3xl font-bold text-foreground">
              From Stars to Stocks in 3 Steps
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Analyze Celestial Events',
                description: 'We track planetary transits, eclipses, retrogrades, and conjunctions using traditional Vedic astrology calculations and modern astronomical data.',
                icon: Sparkles,
              },
              {
                step: '02',
                title: 'Correlate with Market Data',
                description: 'Our AI engine cross-references astrological events with historical and real-time NEPSE market data to identify patterns and correlations.',
                icon: Brain,
              },
              {
                step: '03',
                title: 'Get Actionable Insights',
                description: 'Receive confidence-scored predictions, sector-specific analysis, and personalized watchlists based on your astrological profile and trading preferences.',
                icon: TrendingUp,
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="text-6xl font-bold text-amber-500/10 absolute -top-4 -left-2">{item.step}</div>
                <div className="relative bg-background rounded-xl p-6 border shadow-sm">
                  <div className="rounded-lg bg-amber-500/10 p-2.5 w-fit mb-4">
                    <item.icon className="h-5 w-5 text-amber-600" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-20">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-3 text-[10px] uppercase tracking-wider text-amber-600 border-amber-200 dark:border-amber-800">
            Testimonials
          </Badge>
          <h2 className="text-3xl font-bold text-foreground">
            Trusted by Nepalese Traders
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <Card key={t.name} className="border-border/50">
              <CardContent className="p-6">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 py-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Trade with the Stars?
          </h2>
          <p className="text-amber-100 max-w-xl mx-auto mb-8">
            Join traders who are already using Vedic astrology to gain an edge in the NEPSE market.
            Start exploring today.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              size="lg"
              onClick={() => onNavigate('market')}
              className="bg-white text-amber-700 hover:bg-amber-50 shadow-lg px-8"
            >
              Start Free
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => onNavigate('predictions')}
              className="border-white/30 text-white hover:bg-white/10 px-8"
            >
              View Predictions
            </Button>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
          Disclaimer: NEPSE Vedic Trading Platform provides astrological insights and market data for educational and informational purposes only.
          This is not financial advice. Always conduct your own research and consult a qualified financial advisor before making investment decisions.
          Past performance and astrological predictions do not guarantee future results.
        </p>
      </section>
    </div>
  )
}
