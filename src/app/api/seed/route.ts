// ============================================
// NEPSE Vedic Astrology Trading Platform
// Seed API - Populate database with sample data
// POST /api/seed  - Seed the database (idempotent - cleans first)
// ============================================

import { db } from '@/lib/db'
import { success, error } from '@/lib/api-response'

export async function POST() {
  try {
    // ---- CLEAN DATABASE (idempotent seed) ----
    await db.marketPrediction.deleteMany()
    await db.vedicEvent.deleteMany()
    await db.stockPrice.deleteMany()
    await db.marketIndex.deleteMany()
    await db.activityLog.deleteMany()
    await db.blogPost.deleteMany()
    await db.page.deleteMany()
    await db.blogCategory.deleteMany()
    await db.siteSettings.deleteMany()
    await db.stock.deleteMany()
    await db.user.deleteMany()

    // ---- CREATE USERS ----
    const admin = await db.user.create({
      data: {
        email: 'admin@nepsevedic.com',
        name: 'Admin User',
        password: 'admin123',
        role: 'ADMIN',
      },
    })

    const editor = await db.user.create({
      data: {
        email: 'editor@nepsevedic.com',
        name: 'Priya Sharma',
        password: 'editor123',
        role: 'EDITOR',
      },
    })

    const viewer = await db.user.create({
      data: {
        email: 'viewer@nepsevedic.com',
        name: 'Raj Thapa',
        password: 'viewer123',
        role: 'VIEWER',
      },
    })

    // ---- CREATE BLOG CATEGORIES ----
    const categories = await Promise.all([
      db.blogCategory.create({ data: { name: 'Market Analysis', slug: 'market-analysis', description: 'In-depth analysis of NEPSE market trends' } }),
      db.blogCategory.create({ data: { name: 'Vedic Astrology', slug: 'vedic-astrology', description: 'Astrological predictions and insights' } }),
      db.blogCategory.create({ data: { name: 'Stock Reviews', slug: 'stock-reviews', description: 'Individual stock analysis and reviews' } }),
      db.blogCategory.create({ data: { name: 'Tutorials', slug: 'tutorials', description: 'Guides and tutorials for traders' } }),
    ])

    // ---- CREATE CMS PAGES ----
    await Promise.all([
      db.page.create({
        data: {
          slug: 'about',
          title: 'About Us',
          content: 'NEPSE Vedic Astrology Trading Platform combines ancient Vedic astrological wisdom with modern market analysis to provide unique trading insights for the Nepal Stock Exchange.',
          status: 'PUBLISHED',
          authorId: admin.id,
          metaTitle: 'About NEPSE Vedic Trading Platform',
          metaDescription: 'Learn about our platform and mission.',
        },
      }),
      db.page.create({
        data: {
          slug: 'contact',
          title: 'Contact Us',
          content: 'Get in touch with our team for support, partnerships, or inquiries.',
          status: 'PUBLISHED',
          authorId: admin.id,
        },
      }),
      db.page.create({
        data: {
          slug: 'disclaimer',
          title: 'Disclaimer',
          content: 'This platform provides astrological insights for educational purposes only. Trading in stock markets involves risk. Please consult a qualified financial advisor before making investment decisions.',
          status: 'PUBLISHED',
          authorId: admin.id,
        },
      }),
    ])

    // ---- CREATE BLOG POSTS ----
    await Promise.all([
      db.blogPost.create({
        data: {
          slug: 'saturn-retrograde-2026-impact',
          title: 'Saturn Retrograde 2026: Impact on NEPSE Markets',
          excerpt: 'Analyzing the potential impact of Saturn retrograde on Nepal Stock Exchange trends.',
          content: 'Saturn retrograde periods have historically shown correlation with market volatility. In 2026, Saturn retrogrades through Pisces, which traditionally affects banking and financial sectors with heightened volatility and potential corrections.',
          status: 'PUBLISHED',
          authorId: editor.id,
          categoryId: categories[1].id,
          viewCount: 342,
        },
      }),
      db.blogPost.create({
        data: {
          slug: 'weekly-market-forecast-may-18',
          title: 'Weekly Market Forecast: May 18-22, 2026',
          excerpt: 'Our Vedic-based forecast for the upcoming trading week.',
          content: 'Based on current planetary positions and historical patterns, we predict a bullish start to the week with potential consolidation mid-week. Jupiter in Gemini supports communication and trade sectors, while the approaching Venus-Jupiter conjunction on May 22 adds positive momentum.',
          status: 'PUBLISHED',
          authorId: editor.id,
          categoryId: categories[0].id,
          viewCount: 567,
        },
      }),
      db.blogPost.create({
        data: {
          slug: 'jupiter-gemini-2026-effects',
          title: 'Jupiter in Gemini 2026: Sector-Wise Market Effects',
          excerpt: 'How Jupiter transit to Gemini in May 2026 will impact different NEPSE sectors.',
          content: 'Jupiter entered Gemini on May 1, 2026, marking a one-year transit that will significantly influence trade, communication, and technology sectors on NEPSE. Historically, Jupiter transits through Gemini have coincided with 15-20% gains in trade-related stocks.',
          status: 'PUBLISHED',
          authorId: admin.id,
          categoryId: categories[1].id,
          viewCount: 891,
        },
      }),
      db.blogPost.create({
        data: {
          slug: 'nabl-analysis',
          title: 'Nepal Bangladesh Bank: A Vedic Perspective',
          excerpt: 'Applying astrological analysis to NABL stock performance.',
          content: 'NABL shows interesting correlation with Jupiter transits. Our analysis suggests potential growth periods aligned with favorable planetary aspects. With Saturn retrograde approaching in June, banking stocks may see short-term corrections before recovering.',
          status: 'DRAFT',
          authorId: editor.id,
          categoryId: categories[2].id,
          viewCount: 89,
        },
      }),
      db.blogPost.create({
        data: {
          slug: 'getting-started-vedic-trading',
          title: 'Getting Started with Vedic Trading Analysis',
          excerpt: 'A comprehensive guide for beginners interested in Vedic market analysis.',
          content: 'Vedic astrology has been used for centuries to predict market trends. This guide covers the basics of applying Vedic principles to stock trading, including understanding Navagraha influences, Dasha periods, and transit analysis.',
          status: 'PUBLISHED',
          authorId: admin.id,
          categoryId: categories[3].id,
          viewCount: 1205,
        },
      }),
    ])

    // ---- CREATE STOCKS ----
    const stocks = await Promise.all([
      db.stock.create({ data: { symbol: 'NABL', name: 'Nepal Bangladesh Bank Ltd.', sector: 'Commercial Banks', description: 'One of the leading commercial banks in Nepal.' } }),
      db.stock.create({ data: { symbol: 'NRB', name: 'Nepal Republic Media Ltd.', sector: 'Manufacturing', description: 'Major manufacturing company in Nepal.' } }),
      db.stock.create({ data: { symbol: 'ADBL', name: 'Agricultural Development Bank Ltd.', sector: 'Development Banks', description: 'Agricultural focused development bank.' } }),
      db.stock.create({ data: { symbol: 'NLIC', name: 'Nepal Life Insurance Co. Ltd.', sector: 'Insurance', description: 'Leading life insurance company in Nepal.' } }),
      db.stock.create({ data: { symbol: 'CHCL', name: 'Chilime Hydropower Company Ltd.', sector: 'Hydropower', description: 'Hydropower generation company.' } }),
      db.stock.create({ data: { symbol: 'NIMB', name: 'Nepal Investment Mega Bank Ltd.', sector: 'Commercial Banks', description: 'Major commercial bank in Nepal.' } }),
    ])

    // ---- CREATE STOCK PRICES (today's data) ----
    const today = new Date('2026-05-16')
    const basePrices: Record<string, number> = {
      NABL: 485, NRB: 320, ADBL: 610, NLIC: 1245, CHCL: 890, NIMB: 545,
    }

    await Promise.all(
      stocks.map((stock) => {
        const price = basePrices[stock.symbol] ?? 100
        const variance = Math.floor(price * 0.03)
        return db.stockPrice.create({
          data: {
            stockId: stock.id,
            open: price - variance,
            high: price + variance,
            low: price - variance * 2,
            close: price + Math.floor(Math.random() * variance),
            volume: Math.floor(Math.random() * 50000) + 10000,
            date: today,
          },
        })
      })
    )

    // ---- CREATE MARKET INDICES ----
    await Promise.all([
      db.marketIndex.create({
        data: {
          name: 'NEPSE',
          value: 2185.42,
          change: 12.35,
          changePercent: 0.57,
          volume: 1250000000,
          date: today,
        },
      }),
      db.marketIndex.create({
        data: {
          name: 'Sensitive',
          value: 458.76,
          change: -3.21,
          changePercent: -0.70,
          volume: 450000000,
          date: today,
        },
      }),
      db.marketIndex.create({
        data: {
          name: 'Float',
          value: 112.45,
          change: 1.89,
          changePercent: 1.71,
          volume: 780000000,
          date: today,
        },
      }),
    ])

    // ---- CREATE VEDIC EVENTS (2026 dates, mix of active and upcoming) ----
    const vedicEvents = await Promise.all([
      // ACTIVE event (started May 1, ongoing)
      db.vedicEvent.create({
        data: {
          id: 'vedic-jupiter-transit',
          name: 'Jupiter Transit to Gemini',
          eventType: 'TRANSIT',
          planet: 'Jupiter',
          startDate: new Date('2026-05-01'),
          endDate: new Date('2027-05-18'),
          description: 'Jupiter moving into Gemini signals a period of growth and expansion. Gemini rules communication, trade, and technology sectors. This transit began on May 1, 2026 and will last for approximately one year.',
          marketImpact: 'BULLISH',
          impactStrength: 'MEDIUM',
        },
      }),
      // UPCOMING event (May 22)
      db.vedicEvent.create({
        data: {
          id: 'vedic-venus-conj',
          name: 'Venus-Jupiter Conjunction in Taurus',
          eventType: 'CONJUNCTION',
          planet: 'Venus',
          startDate: new Date('2026-05-22'),
          endDate: new Date('2026-05-24'),
          description: 'A rare and favorable conjunction of Venus and Jupiter in Taurus. This aspect is considered highly beneficial for financial markets. Expect positive sentiment and increased trading activity.',
          marketImpact: 'BULLISH',
          impactStrength: 'MEDIUM',
        },
      }),
      // UPCOMING event (June 15)
      db.vedicEvent.create({
        data: {
          id: 'vedic-saturn-retro',
          name: 'Saturn Retrograde in Pisces',
          eventType: 'RETROGRADE',
          planet: 'Saturn',
          startDate: new Date('2026-06-15'),
          endDate: new Date('2026-10-28'),
          description: 'Saturn retrograde in Pisces traditionally affects banking, insurance and financial sectors. Historical data shows increased volatility and corrective phases during this period lasting over 4 months.',
          marketImpact: 'BEARISH',
          impactStrength: 'HIGH',
        },
      }),
      // UPCOMING event (July 10)
      db.vedicEvent.create({
        data: {
          id: 'vedic-mars-transit',
          name: 'Mars Transit to Leo',
          eventType: 'TRANSIT',
          planet: 'Mars',
          startDate: new Date('2026-07-10'),
          endDate: new Date('2026-08-24'),
          description: 'Mars in Leo brings aggressive energy to markets. Can cause sudden spikes in trading volume and price movements. Historically correlated with increased speculative activity.',
          marketImpact: 'NEUTRAL',
          impactStrength: 'LOW',
        },
      }),
      // UPCOMING event (Sep 18)
      db.vedicEvent.create({
        data: {
          id: 'vedic-lunar-eclipse',
          name: 'Lunar Eclipse in Pisces',
          eventType: 'ECLIPSE',
          planet: 'Moon',
          startDate: new Date('2026-09-18'),
          endDate: null,
          description: 'A total lunar eclipse in Pisces may bring sudden market movements. Pisces relates to hidden matters and emotional trading. Eclipse effects typically last 2-4 weeks.',
          marketImpact: 'BEARISH',
          impactStrength: 'HIGH',
        },
      }),
    ])

    // ---- CREATE PREDICTIONS (all future dates) ----
    await Promise.all([
      // Daily prediction for Venus-Jupiter conjunction (May 22 - upcoming)
      db.marketPrediction.create({
        data: {
          vedicEventId: vedicEvents[1].id,
          stockId: null,
          predictionType: 'DAILY',
          prediction: 'BULLISH',
          confidence: 80,
          reasoning: 'Venus-Jupiter conjunction on May 22 is highly favorable. Expect positive market sentiment, increased buying volume, and potential NEPSE index gains of 0.5-1%.',
          targetDate: new Date('2026-05-22'),
        },
      }),
      // Weekly prediction for current Jupiter transit
      db.marketPrediction.create({
        data: {
          vedicEventId: vedicEvents[0].id,
          stockId: null,
          predictionType: 'WEEKLY',
          prediction: 'BULLISH',
          confidence: 68,
          reasoning: 'Jupiter in Gemini continues to favor trade and communication sectors. The approaching Venus-Jupiter conjunction adds bullish momentum for the week of May 18-22.',
          targetDate: new Date('2026-05-22'),
        },
      }),
      // Weekly prediction for Saturn retrograde (upcoming)
      db.marketPrediction.create({
        data: {
          vedicEventId: vedicEvents[2].id,
          stockId: stocks[0].id,
          predictionType: 'WEEKLY',
          prediction: 'BEARISH',
          confidence: 72,
          reasoning: 'Saturn retrograde starting June 15 historically creates downward pressure on banking stocks. NABL may see a 3-5% correction in the first week of the retrograde.',
          targetDate: new Date('2026-06-19'),
        },
      }),
      // Monthly prediction for Jupiter transit
      db.marketPrediction.create({
        data: {
          vedicEventId: vedicEvents[0].id,
          stockId: null,
          predictionType: 'MONTHLY',
          prediction: 'BULLISH',
          confidence: 65,
          reasoning: 'Jupiter in Gemini through June 2026 favors trade and communication sectors. Overall NEPSE index may gain 2-3% this month barring any major eclipse disruptions.',
          targetDate: new Date('2026-06-15'),
        },
      }),
      // Weekly prediction for Lunar Eclipse (upcoming)
      db.marketPrediction.create({
        data: {
          vedicEventId: vedicEvents[4].id,
          stockId: null,
          predictionType: 'WEEKLY',
          prediction: 'BEARISH',
          confidence: 58,
          reasoning: 'Lunar eclipse on September 18 effects typically last 2-4 weeks. Markets may see heightened volatility and potential correction in insurance and banking sectors.',
          targetDate: new Date('2026-09-25'),
        },
      }),
      // Monthly for Mars transit
      db.marketPrediction.create({
        data: {
          vedicEventId: vedicEvents[3].id,
          stockId: null,
          predictionType: 'MONTHLY',
          prediction: 'NEUTRAL',
          confidence: 52,
          reasoning: 'Mars transit through Leo from July 10 to August 24 may cause sector rotation. Hydropower and energy stocks could see increased activity while banking consolidates.',
          targetDate: new Date('2026-08-10'),
        },
      }),
    ])

    // ---- CREATE SITE SETTINGS ----
    const settingsData = [
      { key: 'site.name', value: 'NEPSE Vedic Trading Platform', type: 'STRING', group: 'general', description: 'Platform name' },
      { key: 'site.tagline', value: 'Where Vedic Wisdom Meets Market Analysis', type: 'STRING', group: 'general', description: 'Site tagline' },
      { key: 'site.description', value: 'Platform for Vedic astrology-based market predictions', type: 'STRING', group: 'general', description: 'Site description' },
      { key: 'site.url', value: 'https://nepsevedic.com', type: 'STRING', group: 'general', description: 'Site URL' },
      { key: 'site.maintenance', value: 'false', type: 'BOOLEAN', group: 'general', description: 'Enable maintenance mode' },
      { key: 'vedic.timezone', value: 'Asia/Kathmandu', type: 'STRING', group: 'vedic', description: 'Default timezone for calculations' },
      { key: 'vedic.ayanamsa', value: 'Lahiri', type: 'STRING', group: 'vedic', description: 'Ayanamsa system to use' },
      { key: 'vedic.show_planets', value: 'true', type: 'BOOLEAN', group: 'vedic', description: 'Show planet positions on dashboard' },
      { key: 'vedic.default_chart', value: 'North Indian', type: 'STRING', group: 'vedic', description: 'Default chart style' },
      { key: 'market.currency', value: 'NPR', type: 'STRING', group: 'market', description: 'Display currency' },
      { key: 'market.refresh_interval', value: '300', type: 'NUMBER', group: 'market', description: 'Data refresh interval (seconds)' },
      { key: 'market.show_volume', value: 'true', type: 'BOOLEAN', group: 'market', description: 'Show trading volume' },
      { key: 'market.default_period', value: '1D', type: 'STRING', group: 'market', description: 'Default chart period' },
      { key: 'appearance.theme', value: 'system', type: 'STRING', group: 'appearance', description: 'Default theme (light/dark/system)' },
      { key: 'appearance.primary_color', value: '#d97706', type: 'STRING', group: 'appearance', description: 'Primary accent color' },
      { key: 'appearance.sidebar_collapsed', value: 'false', type: 'BOOLEAN', group: 'appearance', description: 'Sidebar collapsed by default' },
      { key: 'appearance.date_format', value: 'YYYY-MM-DD', type: 'STRING', group: 'appearance', description: 'Date display format' },
    ]

    await Promise.all(
      settingsData.map((s) => db.siteSettings.create({ data: s }))
    )

    // ---- CREATE ACTIVITY LOGS ----
    await Promise.all([
      db.activityLog.create({ data: { userId: admin.id, action: 'LOGIN', details: 'Admin logged in successfully', ipAddress: '192.168.1.1' } }),
      db.activityLog.create({ data: { userId: admin.id, action: 'CREATE user', details: 'Created editor account for Priya Sharma', ipAddress: '192.168.1.1' } }),
      db.activityLog.create({ data: { userId: editor.id, action: 'CREATE blog_post', details: 'Published: Saturn Retrograde 2026 Impact', ipAddress: '192.168.1.2' } }),
      db.activityLog.create({ data: { userId: editor.id, action: 'CREATE blog_post', details: 'Published: Jupiter in Gemini 2026 Effects', ipAddress: '192.168.1.2' } }),
      db.activityLog.create({ data: { userId: editor.id, action: 'CREATE vedic_event', details: 'Added: Venus-Jupiter Conjunction in Taurus', ipAddress: '192.168.1.2' } }),
      db.activityLog.create({ data: { userId: editor.id, action: 'CREATE prediction', details: 'Daily BULLISH prediction for May 22 (Venus-Jupiter conjunction)', ipAddress: '192.168.1.2' } }),
      db.activityLog.create({ data: { userId: admin.id, action: 'UPDATE settings', details: 'Updated site theme and primary color', ipAddress: '192.168.1.1' } }),
      db.activityLog.create({ data: { userId: admin.id, action: 'CREATE page', details: 'Published: About Us page', ipAddress: '192.168.1.1' } }),
      db.activityLog.create({ data: { userId: viewer.id, action: 'LOGIN', details: 'Viewer Raj Thapa logged in', ipAddress: '192.168.1.3' } }),
    ])

    return success({ message: 'Database seeded successfully with clean 2026 sample data.' })
  } catch (err) {
    console.error('Seed error:', err)
    return error('Failed to seed database', 500)
  }
}
