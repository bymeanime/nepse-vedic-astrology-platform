// ============================================
// NEPSE Vedic Astrology Trading Platform
// Seed API - Populate database with sample data
// POST /api/seed  - Seed the database
// ============================================

import { db } from '@/lib/db'
import { success, error } from '@/lib/api-response'

export async function POST() {
  try {
    // Create admin user
    const admin = await db.user.upsert({
      where: { email: 'admin@nepsevedic.com' },
      update: {},
      create: {
        email: 'admin@nepsevedic.com',
        name: 'Admin User',
        password: 'admin123',
        role: 'ADMIN',
      },
    })

    const editor = await db.user.upsert({
      where: { email: 'editor@nepsevedic.com' },
      update: {},
      create: {
        email: 'editor@nepsevedic.com',
        name: 'Priya Sharma',
        password: 'editor123',
        role: 'EDITOR',
      },
    })

    const viewer = await db.user.upsert({
      where: { email: 'viewer@nepsevedic.com' },
      update: {},
      create: {
        email: 'viewer@nepsevedic.com',
        name: 'Raj Thapa',
        password: 'viewer123',
        role: 'VIEWER',
      },
    })

    // Create blog categories
    const categories = await Promise.all([
      db.blogCategory.upsert({
        where: { slug: 'market-analysis' },
        update: {},
        create: { name: 'Market Analysis', slug: 'market-analysis', description: 'In-depth analysis of NEPSE market trends' },
      }),
      db.blogCategory.upsert({
        where: { slug: 'vedic-astrology' },
        update: {},
        create: { name: 'Vedic Astrology', slug: 'vedic-astrology', description: 'Astrological predictions and insights' },
      }),
      db.blogCategory.upsert({
        where: { slug: 'stock-reviews' },
        update: {},
        create: { name: 'Stock Reviews', slug: 'stock-reviews', description: 'Individual stock analysis and reviews' },
      }),
      db.blogCategory.upsert({
        where: { slug: 'tutorials' },
        update: {},
        create: { name: 'Tutorials', slug: 'tutorials', description: 'Guides and tutorials for traders' },
      }),
    ])

    // Create CMS pages
    await Promise.all([
      db.page.upsert({
        where: { slug: 'about' },
        update: {},
        create: {
          slug: 'about',
          title: 'About Us',
          content: 'NEPSE Vedic Astrology Trading Platform combines ancient Vedic astrological wisdom with modern market analysis to provide unique trading insights for the Nepal Stock Exchange.',
          status: 'PUBLISHED',
          authorId: admin.id,
          metaTitle: 'About NEPSE Vedic Trading Platform',
          metaDescription: 'Learn about our platform and mission.',
        },
      }),
      db.page.upsert({
        where: { slug: 'contact' },
        update: {},
        create: {
          slug: 'contact',
          title: 'Contact Us',
          content: 'Get in touch with our team for support, partnerships, or inquiries.',
          status: 'PUBLISHED',
          authorId: admin.id,
        },
      }),
      db.page.upsert({
        where: { slug: 'disclaimer' },
        update: {},
        create: {
          slug: 'disclaimer',
          title: 'Disclaimer',
          content: 'This platform provides astrological insights for educational purposes only. Trading in stock markets involves risk. Please consult a qualified financial advisor before making investment decisions.',
          status: 'PUBLISHED',
          authorId: admin.id,
        },
      }),
    ])

    // Create blog posts
    await Promise.all([
      db.blogPost.upsert({
        where: { slug: 'saturn-retrograde-2026-impact' },
        update: {},
        create: {
          slug: 'saturn-retrograde-2026-impact',
          title: 'Saturn Retrograde 2026: Impact on NEPSE Markets',
          excerpt: 'Analyzing the potential impact of Saturn retrograde on Nepal Stock Exchange trends.',
          content: 'Saturn retrograde periods have historically shown correlation with market volatility. In 2026, Saturn retrogrades through Pisces, which traditionally affects banking and financial sectors with heightened volatility and potential corrections.'},
          status: 'PUBLISHED',
          authorId: editor.id,
          categoryId: categories[1].id,
          viewCount: 342,
        },
      }),
      db.blogPost.upsert({
        where: { slug: 'weekly-market-forecast' },
        update: {},
        create: {
          slug: 'weekly-market-forecast',
          title: 'Weekly Market Forecast: May 18-22',
          excerpt: 'Our Vedic-based forecast for the upcoming trading week.',
          content: 'Based on current planetary positions and historical patterns, we predict a bullish start to the week with potential consolidation mid-week.',
          status: 'PUBLISHED',
          authorId: editor.id,
          categoryId: categories[0].id,
          viewCount: 567,
        },
      }),
      db.blogPost.upsert({
        where: { slug: 'nabl-analysis' },
        update: {},
        create: {
          slug: 'nabl-analysis',
          title: 'Nepal Bangladesh Bank: A Vedic Perspective',
          excerpt: 'Applying astrological analysis to NABL stock performance.',
          content: 'NABL shows interesting correlation with Jupiter transits. Our analysis suggests potential growth periods aligned with favorable planetary aspects.',
          status: 'DRAFT',
          authorId: editor.id,
          categoryId: categories[2].id,
          viewCount: 89,
        },
      }),
      db.blogPost.upsert({
        where: { slug: 'getting-started-vedic-trading' },
        update: {},
        create: {
          slug: 'getting-started-vedic-trading',
          title: 'Getting Started with Vedic Trading Analysis',
          excerpt: 'A comprehensive guide for beginners interested in Vedic market analysis.',
          content: 'Vedic astrology has been used for centuries to predict market trends. This guide covers the basics of applying Vedic principles to stock trading.',
          status: 'PUBLISHED',
          authorId: admin.id,
          categoryId: categories[3].id,
          viewCount: 1205,
        },
      }),
    ])

    // Create stocks
    const stocks = await Promise.all([
      db.stock.upsert({
        where: { symbol: 'NABL' },
        update: {},
        create: {
          symbol: 'NABL',
          name: 'Nepal Bangladesh Bank Ltd.',
          sector: 'Commercial Banks',
          description: 'One of the leading commercial banks in Nepal.',
        },
      }),
      db.stock.upsert({
        where: { symbol: 'NRB' },
        update: {},
        create: {
          symbol: 'NRB',
          name: 'Nepal Republic Media Ltd.',
          sector: 'Manufacturing',
          description: 'Major manufacturing company in Nepal.',
        },
      }),
      db.stock.upsert({
        where: { symbol: 'ADBL' },
        update: {},
        create: {
          symbol: 'ADBL',
          name: 'Agricultural Development Bank Ltd.',
          sector: 'Development Banks',
          description: 'Agricultural focused development bank.',
        },
      }),
      db.stock.upsert({
        where: { symbol: 'NLIC' },
        update: {},
        create: {
          symbol: 'NLIC',
          name: 'Nepal Life Insurance Co. Ltd.',
          sector: 'Insurance',
          description: 'Leading life insurance company in Nepal.',
        },
      }),
      db.stock.upsert({
        where: { symbol: 'CHCL' },
        update: {},
        create: {
          symbol: 'CHCL',
          name: 'Chilime Hydropower Company Ltd.',
          sector: 'Hydropower',
          description: 'Hydropower generation company.',
        },
      }),
      db.stock.upsert({
        where: { symbol: 'NIMB' },
        update: {},
        create: {
          symbol: 'NIMB',
          name: 'Nepal Investment Mega Bank Ltd.',
          sector: 'Commercial Banks',
          description: 'Major commercial bank in Nepal.',
        },
      }),
    ])

    // Create stock prices
    const basePrices: Record<string, number> = {
      NABL: 485,
      NRB: 320,
      ADBL: 610,
      NLIC: 1245,
      CHCL: 890,
      NIMB: 545,
    }

    await Promise.all(
      stocks.map((stock) => {
        const price = basePrices[stock.symbol] ?? 100
        const variance = Math.floor(price * 0.03)
        return db.stockPrice.upsert({
          where: {
            stockId_date: {
              stockId: stock.id,
              date: new Date(),
            },
          },
          update: {},
          create: {
            stockId: stock.id,
            open: price - variance,
            high: price + variance,
            low: price - variance * 2,
            close: price + Math.floor(Math.random() * variance),
            volume: Math.floor(Math.random() * 50000) + 10000,
            date: new Date(),
          },
        })
      })
    )

    // Create market indices
    await Promise.all([
      db.marketIndex.create({
        data: {
          name: 'NEPSE',
          value: 2185.42,
          change: 12.35,
          changePercent: 0.57,
          volume: 1250000000,
        },
      }),
      db.marketIndex.create({
        data: {
          name: 'Sensitive',
          value: 458.76,
          change: -3.21,
          changePercent: -0.70,
          volume: 450000000,
        },
      }),
      db.marketIndex.create({
        data: {
          name: 'Float',
          value: 112.45,
          change: 1.89,
          changePercent: 1.71,
          volume: 780000000,
        },
      }),
    ])

    // Create vedic events
    const vedicEvents = await Promise.all([
      db.vedicEvent.upsert({
        where: { id: 'vedic-saturn-retro' },
        update: {},
        create: {
          id: 'vedic-saturn-retro',
          name: 'Saturn Retrograde in Pisces',
          eventType: 'RETROGRADE',
          planet: 'Saturn',
          startDate: new Date('2026-06-15'),
          endDate: new Date('2026-10-28'),
          description: 'Saturn retrograde in Pisces traditionally affects banking, insurance and financial sectors. Historical data shows increased volatility and corrective phases during this period.',
          marketImpact: 'BEARISH',
          impactStrength: 'HIGH',
        },
      }),
      db.vedicEvent.upsert({
        where: { id: 'vedic-jupiter-transit' },
        update: {},
        create: {
          id: 'vedic-jupiter-transit',
          name: 'Jupiter Transit to Gemini',
          eventType: 'TRANSIT',
          planet: 'Jupiter',
          startDate: new Date('2026-05-01'),
          endDate: new Date('2027-05-18'),
          description: 'Jupiter moving into Gemini signals a period of growth and expansion. Gemini rules communication and trade sectors.',
          marketImpact: 'BULLISH',
          impactStrength: 'MEDIUM',
        },
      }),
      db.vedicEvent.upsert({
        where: { id: 'vedic-lunar-eclipse' },
        update: {},
        create: {
          id: 'vedic-lunar-eclipse',
          name: 'Lunar Eclipse in Pisces',
          eventType: 'ECLIPSE',
          planet: 'Moon',
          startDate: new Date('2026-09-18'),
          endDate: null,
          description: 'A total lunar eclipse in Pisces may bring sudden market movements. Pisces relates to hidden matters and emotional trading.',
          marketImpact: 'BEARISH',
          impactStrength: 'HIGH',
        },
      }),
      db.vedicEvent.upsert({
        where: { id: 'vedic-venus-conj' },
        update: {},
        create: {
          id: 'vedic-venus-conj',
          name: 'Venus-Jupiter Conjunction in Taurus',
          eventType: 'CONJUNCTION',
          planet: 'Venus',
          startDate: new Date('2026-05-22'),
          endDate: null,
          description: 'A rare and favorable conjunction of Venus and Jupiter in Taurus. This aspect is considered highly beneficial for financial markets.',
          marketImpact: 'BULLISH',
          impactStrength: 'MEDIUM',
        },
      }),
      db.vedicEvent.upsert({
        where: { id: 'vedic-mars-transit' },
        update: {},
        create: {
          id: 'vedic-mars-transit',
          name: 'Mars Transit to Leo',
          eventType: 'TRANSIT',
          planet: 'Mars',
          startDate: new Date('2026-07-10'),
          endDate: new Date('2026-08-24'),
          description: 'Mars in Leo brings aggressive energy to markets. Can cause sudden spikes in trading volume and price movements.',
          marketImpact: 'NEUTRAL',
          impactStrength: 'LOW',
        },
      }),
    ])

    // Create predictions
    await Promise.all([
      db.marketPrediction.create({
        data: {
          vedicEventId: vedicEvents[0].id,
          stockId: stocks[0].id,
          predictionType: 'WEEKLY',
          prediction: 'BEARISH',
          confidence: 72,
          reasoning: 'Saturn retrograde historically creates downward pressure on banking stocks. NABL may see a 3-5% correction.',
          targetDate: new Date('2026-06-20'),
        },
      }),
      db.marketPrediction.create({
        data: {
          vedicEventId: vedicEvents[1].id,
          stockId: null,
          predictionType: 'MONTHLY',
          prediction: 'BULLISH',
          confidence: 65,
          reasoning: 'Jupiter in Gemini favors trade and communication sectors. Overall NEPSE index may gain 2-3%.',
          targetDate: new Date('2026-06-15'),
        },
      }),
      db.marketPrediction.create({
        data: {
          vedicEventId: vedicEvents[3].id,
          stockId: null,
          predictionType: 'DAILY',
          prediction: 'BULLISH',
          confidence: 80,
          reasoning: 'Venus-Jupiter conjunction is highly favorable. Expect positive market sentiment and increased buying.',
          targetDate: new Date('2026-05-22'),
        },
      }),
      db.marketPrediction.create({
        data: {
          vedicEventId: vedicEvents[2].id,
          stockId: null,
          predictionType: 'WEEKLY',
          prediction: 'BEARISH',
          confidence: 58,
          reasoning: 'Lunar eclipse effects typically last 2 weeks. Markets may see heightened volatility.',
          targetDate: new Date('2026-09-25'),
        },
      }),
    ])

    // Create site settings
    const settingsData = [
      // General
      { key: 'site.name', value: 'NEPSE Vedic Trading Platform', type: 'STRING', group: 'general', description: 'Platform name' },
      { key: 'site.tagline', value: 'Where Vedic Wisdom Meets Market Analysis', type: 'STRING', group: 'general', description: 'Site tagline' },
      { key: 'site.description', value: 'Platform for Vedic astrology-based market predictions', type: 'STRING', group: 'general', description: 'Site description' },
      { key: 'site.url', value: 'https://nepsevedic.com', type: 'STRING', group: 'general', description: 'Site URL' },
      { key: 'site.maintenance', value: 'false', type: 'BOOLEAN', group: 'general', description: 'Enable maintenance mode' },
      // Vedic
      { key: 'vedic.timezone', value: 'Asia/Kathmandu', type: 'STRING', group: 'vedic', description: 'Default timezone for calculations' },
      { key: 'vedic.ayanamsa', value: 'Lahiri', type: 'STRING', group: 'vedic', description: 'Ayanamsa system to use' },
      { key: 'vedic.show_planets', value: 'true', type: 'BOOLEAN', group: 'vedic', description: 'Show planet positions on dashboard' },
      { key: 'vedic.default_chart', value: 'North Indian', type: 'STRING', group: 'vedic', description: 'Default chart style' },
      // Market
      { key: 'market.currency', value: 'NPR', type: 'STRING', group: 'market', description: 'Display currency' },
      { key: 'market.refresh_interval', value: '300', type: 'NUMBER', group: 'market', description: 'Data refresh interval (seconds)' },
      { key: 'market.show_volume', value: 'true', type: 'BOOLEAN', group: 'market', description: 'Show trading volume' },
      { key: 'market.default_period', value: '1D', type: 'STRING', group: 'market', description: 'Default chart period' },
      // Appearance
      { key: 'appearance.theme', value: 'system', type: 'STRING', group: 'appearance', description: 'Default theme (light/dark/system)' },
      { key: 'appearance.primary_color', value: '#d97706', type: 'STRING', group: 'appearance', description: 'Primary accent color' },
      { key: 'appearance.sidebar_collapsed', value: 'false', type: 'BOOLEAN', group: 'appearance', description: 'Sidebar collapsed by default' },
      { key: 'appearance.date_format', value: 'YYYY-MM-DD', type: 'STRING', group: 'appearance', description: 'Date display format' },
    ]

    await Promise.all(
      settingsData.map((s) =>
        db.siteSettings.upsert({
          where: { key: s.key },
          update: {},
          create: s,
        })
      )
    )

    // Create activity logs
    await Promise.all([
      db.activityLog.create({
        data: {
          userId: admin.id,
          action: 'LOGIN',
          details: 'Admin logged in successfully',
          ipAddress: '192.168.1.1',
        },
      }),
      db.activityLog.create({
        data: {
          userId: admin.id,
          action: 'CREATE user',
          details: 'Created editor account for Priya Sharma',
          ipAddress: '192.168.1.1',
        },
      }),
      db.activityLog.create({
        data: {
          userId: editor.id,
          action: 'CREATE blog_post',
          details: 'Published: Saturn Retrograde 2026 Impact',
          ipAddress: '192.168.1.2',
        },
      }),
      db.activityLog.create({
        data: {
          userId: editor.id,
          action: 'CREATE vedic_event',
          details: 'Added: Venus-Jupiter Conjunction in Taurus',
          ipAddress: '192.168.1.2',
        },
      }),
      db.activityLog.create({
        data: {
          userId: editor.id,
          action: 'CREATE prediction',
          details: 'New weekly prediction for NEPSE index',
          ipAddress: '192.168.1.2',
        },
      }),
      db.activityLog.create({
        data: {
          userId: admin.id,
          action: 'UPDATE settings',
          details: 'Updated site theme and primary color',
          ipAddress: '192.168.1.1',
        },
      }),
      db.activityLog.create({
        data: {
          userId: admin.id,
          action: 'CREATE page',
          details: 'Published: About Us page',
          ipAddress: '192.168.1.1',
        },
      }),
      db.activityLog.create({
        data: {
          userId: viewer.id,
          action: 'LOGIN',
          details: 'Viewer Raj Thapa logged in',
          ipAddress: '192.168.1.3',
        },
      }),
    ])

    return success({ message: 'Database seeded successfully with sample data.' })
  } catch (err) {
    console.error('Seed error:', err)
    return error('Failed to seed database', 500)
  }
}
