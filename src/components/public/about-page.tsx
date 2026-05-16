'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Target, Eye, Shield, Users, Globe } from 'lucide-react'

export function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <h1 className="text-3xl font-bold text-white">About NEPSE Vedic</h1>
          <p className="text-gray-300 mt-1">Bridging ancient wisdom with modern financial technology</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 space-y-12">
        {/* Mission */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <Badge variant="outline" className="text-amber-600 border-amber-200 dark:border-amber-800">
            <Sparkles className="h-3 w-3 mr-1" /> Our Mission
          </Badge>
          <h2 className="text-2xl font-bold text-foreground">
            Making Vedic Astrology Accessible for Modern Traders
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            NEPSE Vedic Trading Platform was born from the belief that ancient Vedic astrological wisdom,
            when combined with modern data analysis and AI, can offer unique perspectives on market behavior.
            We are the first platform in Nepal to provide a comprehensive integration of Kundli charts,
            Navagraha analysis, Dasha periods, and real-time NEPSE market data in one unified experience.
          </p>
        </div>

        {/* Values */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Target, title: 'Precision', desc: 'Accurate astronomical calculations combined with verified market data for reliable analysis.' },
            { icon: Eye, title: 'Transparency', desc: 'Clear methodology, confidence scores, and disclaimers so you make informed decisions.' },
            { icon: Shield, title: 'Privacy', desc: 'Your birth details and astrological profile are securely stored and never shared.' },
            { icon: Globe, title: 'Accessibility', desc: 'Designed for everyone from beginners to experienced Vedic astrology practitioners.' },
            { icon: Users, title: 'Community', desc: 'Building a community of traders who value both data-driven and wisdom-driven approaches.' },
            { icon: Sparkles, title: 'Innovation', desc: 'Continuously evolving our AI models and astrological algorithms for better insights.' },
          ].map((v) => (
            <Card key={v.title} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="rounded-lg bg-amber-500/10 p-2.5 w-fit mb-3">
                  <v.icon className="h-5 w-5 text-amber-600" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Disclaimer */}
        <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10">
          <CardContent className="p-6">
            <h3 className="text-sm font-semibold text-foreground mb-2">Important Disclaimer</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              NEPSE Vedic Trading Platform provides astrological insights and market data for educational and informational purposes only.
              Vedic astrology is a traditional knowledge system and its application to financial markets is experimental.
              This is not financial advice. Always conduct your own research and consult a qualified financial advisor before making investment decisions.
              Past performance and astrological predictions do not guarantee future results. Trade responsibly.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
